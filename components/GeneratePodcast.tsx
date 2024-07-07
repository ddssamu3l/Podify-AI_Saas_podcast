import React, { useState } from 'react'
import {GeneratePodcastProps} from "@/types/index"
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { Loader } from 'lucide-react'

const useGeneratePodcast = (props: GeneratePodcastProps) => {
  // logic for podcast generation
  const [isGenerating, setIsGenerating] = useState(false)

  const generatePodcast = async () => {
    setIsGenerating(true);
    props.setAudio('');
    // just a safety check to see if the prompt is there
    if(!props.voicePrompt){
      // TODO: show error message
      return setIsGenerating(false);
    }

    try{
      /*const response = await getPodcastAudio({
        voice: props.voiceType,
        input: voicePrompt,
      })*/
    }catch (e){
      console.log('Error while generating podcast in GeneratePodcast.tsx', e);
      // TODO: show error message
      setIsGenerating(false);
    }
  }
  return{isGenerating, generatePodcast}
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
          rows={5}
          value={props.voicePrompt}
          onChange={(e) => props.setVoicePrompt(e.target.value)}
        />
      </div>
      {/*==============================  */}
      <div className = "mt-5 w-full max-w-[200px]">
        <Button 
          type = "submit"
          className = "text-md bg-yellow py-4 font-bold text-white-1 transition-all hover:bg-black-0 hover:border hover:border-yellow"
          >
            {isGenerating ? (
              <>
                Generating...
                <Loader size={20} className = "animate-spin ml-2"/>
              </>
            ) : (
              <>
                Generate Podcast
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