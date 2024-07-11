import React, { useState } from 'react'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { GenerateThumbnailProps } from '@/types'
import { Loader } from 'lucide-react'
import Image from 'next/image'

const GenerateThumbnail = ({setImage, setImageStorageId, image, imagePrompt, setImagePrompt}: GenerateThumbnailProps) => {
  const [isAiThumbnail, setIsAiThumbnail] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const generateThumbnail = async() => {
    
  }
  return (
    <>
      <Label className = "mt-8 md:text-lg text-md font-bold text-white-1">
          Create a thumbnail for your podcast
      </Label>
     
      <div className = "generate_thumbnail text-sm">
        <Button
          type = "button"
          variant = "plain"
          onClick={() => setIsAiThumbnail(true)}
          className = {cn('', {'bg-[#212121]':isAiThumbnail})}
        >
          Use AI to generate a thumbnail
          <Image 
          src="/icons/robot.png"
          alt="robot"
          width={40}
          height={40}
          />
        </Button>
       
        
        <Button
          type = "button"
          variant = "plain"
          onClick={() => setIsAiThumbnail(false)}
          className =  {cn('', {'bg-[#212121]':!isAiThumbnail})}
        >
          Upload custom image 
          <Image 
          src="/icons/paint.png"
          alt="robot"
          width={27}
          height={27}
          className = "pl-1 mt-1"
          />
        </Button>
      </div>

      
      {isAiThumbnail ? (
        <div className = "mt-3 flex flex-col gap-5">
          <div className = "flex flex-col gap-2.5">
            <Textarea 
              className = "input-class font-light focus-visible:ring-offset-yellow"
              placeholder = "Please describe the thumbnail you want the AI to generate"
              rows={3}
              value={imagePrompt}
              onChange={(e) => setImagePrompt(e.target.value)}
            />
          </div>

          <div className = "w-full max-w-[200px]">
            <Button 
              type = "submit"
              className = "text-md bg-yellow py-4 font-bold text-white-1 transition-all hover:bg-black-0 hover:border hover:border-yellow"
              onClick = {generateThumbnail}
              >
                {isGenerating ? (
                  <>
                    Generating...
                    <Loader size={20} className = "animate-spin ml-2"/>
                  </>
                ) : (
                  <>
                    Generate Thumbnail
                  </>
                )}
            </Button>
          </div>
        </div>
      ) : (
        <div>

        </div>
      )}
    </>
  )
}

export default GenerateThumbnail