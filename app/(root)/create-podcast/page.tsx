"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Image from 'next/image'
import {Label} from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import GeneratePodcast from "@/components/GeneratePodcast"
import GenerateThumbnail from "@/components/GenerateThumbnail"
import { Loader } from "lucide-react"
import { Id } from "@/convex/_generated/dataModel"
import { VoiceType } from "@/types/index"

const VoiceCategories = ['alloy', "shimmer", "nova", "echo", "fable", "onyx"];

const formSchema = z.object({
  podcastTitle: z.string().min(2, {
  }),
  podcastDescription: z.string().min(2, {
  }),
})

const CreatePodcast = () => {
  const [imagePrompt, setImagePrompt] = useState('');
  const [imageStorageId, setImageStorageId] = useState<Id<"_storage"> | null>(null);
  const [imageURL, setImageURL] = useState('');

  const [audioURL, setAudioURL] = useState('');
  const [audioStorageId, setAudioStorageId] = useState<Id<"_storage"> | null>(null);
  const [audioDuration, setAudioDuration] = useState(0);

  const [voiceType, setVoiceType] = useState<string | null>(null);
  const [voicePrompt, setVoicePrompt] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
 

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      podcastTitle: "",
      podcastDescription: "",
    },
  })
 
  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }
  return (
    
    <section className = "mt-10 flex flex-col">
      <h1 className="text-24 font-bold text-white-1">Create A Podcast</h1>
       {/*=========================== PODCAST TITLE ==============================*/}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-12 flex w-full flex-col">
          <div className = "flex flex-col gap-[30px] border-b border-black-5 pb-10">
            <FormField
              control={form.control}
              name="podcastTitle"
              render={({ field }) => (
                <FormItem className = "flex flex-col gap-2.5">
                  <FormLabel className = "md:text-lg text-md font-bold text-white-1">Podcast Title</FormLabel>
                  <FormControl>
                    <Input className = "input-class focus-visible:ring-offset-yellow" placeholder="What would you like to name your podcast?" {...field} />
                  </FormControl>
                  <FormMessage className = "text-white-1"/>
                </FormItem>
              )}
            />

            {/*=========================== SELECT AI VOICE ==============================*/}
            <div className = "flex flex-col gap-2.5">
              <Label className="md:text-lg text-md font-bold text-white-1">
                Select an AI voice to voice your podcast
              </Label>
              <div className="flex items-center gap-2.5">
                <Image 
                  src="/icons/speaker.png"
                  alt="speaker"
                  width={20}
                  height={20}
                />
                <h1 className = "text-14 text-white-1">
                (Turn up volume for sound sample)
                </h1>
                <Image 
                  src="/icons/speaker.png"
                  alt="speaker"
                  width={20}
                  height={20}
                />
              </div>
              <Select onValueChange={(value) => setVoiceType(value)}>
                <SelectTrigger className={cn('capitalize md:text-lg text-md w-full border-none bg-black-0 text-white-3 focus:ring-offset-yellow')}>
                  <SelectValue className=" placeholder:text-white-3" placeholder="Select Voice" />
                </SelectTrigger>
                <SelectContent className = "md:text-lg text-md border-none bg-black-0 text-white-1 focus:ring-offset-yellow">
                  {VoiceCategories.map((category) => (
                    <SelectItem key = {category} value = {category} className = "capitalize focus:bg-yellow">
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
                {voiceType && (
                  <audio 
                    src={`/${voiceType}.mp3`}
                    autoPlay
                    className = "hidden"
                  />
                )}
              </Select>
            </div>

            {/*============================= Podcast Description ================================*/}
            <FormField
              control={form.control}
              name="podcastDescription"
              render={({ field }) => (
                <FormItem className = "flex flex-col gap-2.5">
                  <FormLabel className = "md:text-lg text-md font-bold text-white-1">Description</FormLabel>
                  <FormControl>
                    <Textarea className = "input-class focus-visible:ring-offset-yellow" placeholder="Write a short description for your AI podcast" {...field} />
                  </FormControl>
                  <FormMessage className = "text-white-1"/>
                </FormItem>
              )}
            />
          </div>

          <div className = "flex flex-col pt-10">
              <GeneratePodcast 
                setAudioStorageId={setAudioStorageId}
                setAudio={setAudioURL}
                voiceType={voiceType! as VoiceType}
                audio={audioURL}
                voicePrompt={voicePrompt}
                setVoicePrompt={setVoicePrompt}
                setAudioDuration={setAudioDuration}
              />

              <GenerateThumbnail 
                setImage={setImageURL}
                setImageStorageId={setImageStorageId}
                image={imageURL}
                imagePrompt={imagePrompt}
                setImagePrompt={setImagePrompt}
              />
              
              <div className = "mt-10 w-full">
                <Button 
                type = "submit"
                className = "md:text-lg text-md w-full bg-yellow py-4 font-bold text-white-1 transition-all duration-500 hover:bg-black-0 hover:border hover:border-yellow transition-all"
                >
                  {isSubmitting ? (
                    <>
                      Submitting...
                      <Loader size={20} className = "animate-spin ml-2"/>
                    </>
                  ) : (
                    <>
                      Submit & Publish Podcast
                    </>
                  )}
                </Button>
              </div>
          </div>
        </form>
      </Form>
      
    </section>
  )
}

export default CreatePodcast