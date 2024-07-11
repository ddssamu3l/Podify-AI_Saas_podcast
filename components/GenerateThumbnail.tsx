import React, { useRef, useState } from 'react'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { GenerateThumbnailProps } from '@/types'
import { Loader } from 'lucide-react'
import Image from 'next/image'
import { Input } from './ui/input'
import { useToast } from './ui/use-toast'
import { useAction, useMutation } from 'convex/react'
import { useUploadFiles } from '@xixixao/uploadstuff/react'
import { api } from '@/convex/_generated/api'
import {v4 as uuidv4} from 'uuid'

const GenerateThumbnail = ({setImage, setImageStorageId, image, imagePrompt, setImagePrompt}: GenerateThumbnailProps) => {
  const [isAiThumbnail, setIsAiThumbnail] = useState(true);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const imageRef = useRef<HTMLInputElement>(null);
  const {toast} = useToast();
  const generateUploadUrl = useMutation(api.files.generateUploadURL);
  const { startUpload } = useUploadFiles(generateUploadUrl);
  const getImageURL = useMutation(api.podcasts.getURL);
  const handleGenerateThumbnail = useAction(api.openai.generateThumbnailAction)

  const handleImage = async(blob: Blob, fileName: string) => {
    setIsImageLoading(true);
    setImage('');

    try{
      const file = new File([blob], fileName, { type: 'image/png' });

      const uploaded = await startUpload([file]);
      const storageId = (uploaded[0].response as any).storageId;

      setImageStorageId(storageId);

      const imageURL = await getImageURL({ storageId });

      setImage(imageURL!);
      setIsImageLoading(false);

      toast({title: "Thumbnail generated successfully",})
    }catch(e){
      console.log("Error while trying to handle podcast thumbnail image ", e);
      toast({title: "Error handling podcast thumbnail", variant: 'destructive'})
    }
  }
  const generateThumbnail = async() => {
    setIsImageLoading(true);
    try{
      const response = await handleGenerateThumbnail({prompt: imagePrompt});

      const blob = new Blob([response], {type: "image/png"});
      handleImage(blob, `thumbnail-${uuidv4()}.png`);

    }catch (e){
      console.log("Error generating thumbnail", e)
      toast({title: `Error generating thumbnail ${e}`, variant: 'destructive'})
    }
  }
  const uploadImage = async(e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setIsImageLoading(true);
    try{
      const files = e.target.files;

      if(!files) return;

      const file = files[0];

      const blob = await file.arrayBuffer()
      .then((ab) => new Blob([ab]));

      handleImage(blob, file.name);
      
    }catch(e){
      console.log("Error uploading image", e)
      toast({title: "Error uploading image", variant: 'destructive'})
    }
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
          onClick={() => {setIsAiThumbnail(true); setImage('');}}
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
          onClick={() => {setIsAiThumbnail(false); setImage('');}}
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
                {isImageLoading ? (
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
        <div className = "image_div"  onClick={() => imageRef?.current?.click()} >
           <Input 
            type="file"
            className="hidden"
            ref={imageRef}
            onChange={(e) => uploadImage(e)}
          />

          {!isImageLoading ? (
            <Image 
              src = "/icons/upload-image.svg"
              alt="upload"
              width={40}
              height={40}
            />
          ):(
            <div className = "text-16 flex-center font-medium text-white-1">
              Uploading...
              <Loader size={20} className = "animate-spin ml-2"/>
            </div>
          )}
          <div className = "flex flex-col items-center gap-1">
            <h2 className = "text-12 font-bold text-yellow">
              Click to upload from your computer
            </h2>
            <p className = "text-12 font-normal text-white-2">SVG, PNG, JPG or GIF (max: 1080x1080 px)</p>
          </div>
        </div>
      )}
      {image && (
        <div className = "flex-center w-full">
          <Image 
            src = {image}
            alt="thumbnail"
            width={200}
            height={200}
            className="mt-5"
          />
        </div>
      )}
    </>
  )
}

export default GenerateThumbnail