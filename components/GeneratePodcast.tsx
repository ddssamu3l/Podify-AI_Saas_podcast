import React, { useState } from 'react'
import {GeneratePodcastProps} from "@/types/index"
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { Loader } from 'lucide-react'
import { useAction, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import {v4 as uuidv4} from "uuid";
import { useToast } from "@/components/ui/use-toast"

import {useUploadFiles} from "@xixixao/uploadstuff/react";

const useGeneratePodcast = ({
  setAudio, voiceType, voicePrompt, setAudioStorageId
}: GeneratePodcastProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast()

  const generateUploadUrl = useMutation(api.files.generateUploadURL);
  const { startUpload } = useUploadFiles(generateUploadUrl)

  const getPodcastAudio = useAction(api.openai.generateAudioAction)

  const getAudioUrl = useMutation(api.podcasts.getURL);

  const generatePodcast = async () => {
    setIsGenerating(true);
    setAudio('');

    if(!voicePrompt) {
      toast({
        title: "Please provide a prompt to generate a podcast",
      })
      return setIsGenerating(false);
    }

    try {
      const response = await getPodcastAudio({
        voice: voiceType,
        input: voicePrompt
      })
     

      const blob = new Blob([response], { type: 'audio/mpeg' });
      const fileName = `podcast-${uuidv4()}.mp3`;
      const file = new File([blob], fileName, { type: 'audio/mpeg' });

      const uploaded = await startUpload([file]);
      const storageId = (uploaded[0].response as any).storageId;

      setAudioStorageId(storageId);

      const audioUrl = await getAudioUrl({ storageId });
      setAudio(audioUrl!);
      setIsGenerating(false);
      toast({
        title: "Podcast audio generated successfully",
      })
    } catch (error) {
      console.error('Error generating podcast', error)
      toast({
        title: "Error generating podcast",
        variant: 'destructive',
      })
      setIsGenerating(false);
    }
    
  }

  return { isGenerating, generatePodcast }
}

const GeneratePodcast = (
  props: GeneratePodcastProps) => {
    
  const {isGenerating, generatePodcast} = useGeneratePodcast(props);
  return (
    <div>
      {/*============================= PROMPT SCRIPT ================================ */}
      <div className = "flex flex-col gap-2.5">
        <Label className = "md:text-lg text-md font-bold text-white-1">
          Enter the script for your AI podcast
        </Label>

        <Textarea 
          className = "input-class font-light focus-visible:ring-offset-yellow"
          placeholder = "Enter your script here"
          rows={4}
          value={props.voicePrompt}
          onChange={(e) => props.setVoicePrompt(e.target.value)}
        />
      </div>
      {/*==============================  AI SCRIPT  =================================== */}
      <div className = "mt-5 w-full max-w-[200px]">
        <Button 
          type = "submit"
          className = "text-md bg-yellow py-4 font-bold text-white-1 transition-all hover:bg-black-0 hover:border hover:border-yellow"
          onClick = {generatePodcast}
          >
            {isGenerating ? (
              <>
                Generating...
                <Loader size={20} className = "animate-spin ml-2"/>
              </>
            ) : (
              <>
                Generate Audio
              </>
            )}
        </Button>
      </div>

      {/* If the audio is generated, the show an audio tag and play the podcast automatically*/}
      {props.audio && (
        <audio 
          controls
          src={props.audio}
          autoPlay
          className = "mt-5"
          onLoadedMetadata={(e) => props.setAudioDuration(e.currentTarget.duration)}
        />
      )}
    </div>
  )
}

export default GeneratePodcast

function setAudio(arg0: string) {
  throw new Error('Function not implemented.')
}
