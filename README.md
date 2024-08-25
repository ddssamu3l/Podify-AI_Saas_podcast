# Podify is an AI powered podcast platform
You can generate your own podcast with ChatGPT's api by feeding a script into the app and the app will run a tex-to-speech algorithm to turn it into an audio clip!

## Live Deployment Link: https://podify-rfu3yqwfh-dd-dengs-projects.vercel.app/
## YouTube Demo Link: https://youtu.be/nqnLA2Bw16c
<img width="1440" alt="podify" src="https://github.com/user-attachments/assets/a4d1a6a6-a471-4221-9953-8cbea84f27d4">

## Technical Details
**How the podcast audio and thumbnail image is generated:** When users hit the "Generate Audio" or "Generate Thumbnail" button in the /create-podcast page, Podify sends out an API query request to OpenAI. For audio, Podify sends the voice script and the voice type to OpenAI, where OpenAI's text-to-speech-1 model will process the script and turn it into an audio file. The audio file is sent to Convex, where an "AudioStorageId" is returned to the Podify app where it can be re-listened to. A similar process is used for the thumbnail image generation. When attempting to generate the thumbnail, the text prompt used to generate the image is sent to OpenAI, where OpenAI's Dall-E 3 model will read the text prompt and generate an image based off of the prompt. The image is sent to Convex, and an "ImageStorageId" is returned to Podify, where it can be used to access the image in Convex and show a preview of the generated thumbnail.

**Live demo of audio and thumbnail generation**

https://github.com/user-attachments/assets/ec46ce47-a2ba-4af1-888c-631c745625a7


User authentication system is powered by Clerk, where a collaboration between Clerk and Convex allows easy set-up for a user authentication system. Login by GitHub and Google are implemented, and user data is automatically saved to Convex servers by Clerk.

Podcast search feature is similar to what is found in Prompt-A-Chat (My other Full-Stack project) where the search input is used to filter out related podcasts that match the search input either through content or author.

## Tech Stack
Next.js | Convex | Clerk | OpenAI API | Tailwind CSS | Shadcn/ui


Tutorial Credit - JavsScript Mastery on YouTube: https://www.youtube.com/watch?v=zfAb95tJvZQ&list=WL&index=2&t=109s
