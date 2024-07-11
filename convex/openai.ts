// this file is called an "Action" file. Actions can call third party services to process requests or perform computes.

import { action } from "./_generated/server";
import { v } from "convex/values";

import OpenAI from "openai";
import { SpeechCreateParams } from "openai/resources/audio/speech.mjs";

const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_KEY
})

export const generateAudioAction = action({
  args: { input: v.string(), voice: v.string() },
  handler: async(_, {input, voice}) => {
    // do something with `args.input` and `args.input`
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: voice as SpeechCreateParams['voice'],
      input: input,
    });
      
    const buffer = await mp3.arrayBuffer();
    return buffer;
  },
});

export const generateThumbnailAction = action({
  args: {prompt: v.string()},
  handler: async(_, {prompt}) => {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      size: '1024x1024',
      quality: 'standard',
      n: 1,
    });

    const URL = response.data[0].url;
    if(!URL)
      throw new Error('Error generating thumbnail in convex/openai.ts');

    const imageResponse = await fetch(URL);
    const buffer = await imageResponse.arrayBuffer();
    return buffer;
  },
});