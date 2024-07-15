'use client'
import React from 'react'
import Image from 'next/image'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import PodcastDetailPlayer from '@/components/PodcastDetailPlayer'
import LoadSpinner from '@/components/LoadSpinner'
import PodcastCard from '@/components/PodcastCard'
import EmptyState from '@/components/EmptyState'
import { useUser } from '@clerk/nextjs'

const PostcastDetails = ({ params:{podcastId}}: {params: {podcastId: Id<"podcasts">}}) => {
  const {user} = useUser();
  const podcast = useQuery(api.podcasts.getPodcastById, {podcastId: podcastId});
  const similarPodcasts = useQuery(api.podcasts.getSimilarPodcasts, {podcastId: podcastId});
  const isAuthor = user?.id === podcast?.authorId;

  // show a spinner while the page loads. If we don't yet have a list of similar podcasts or the podcast itself, then it must mean we are still loading.
  if(!podcast || !similarPodcasts) return <LoadSpinner />

  return (
    <section className = "flex w-full flex-col">
      <header className = "mt-9 flex items-center justify-between">
        <h1 className = "text-20 font-bold text-white-1">
          Currently Playing:
        </h1>
        
        <figure className = "flex gap-3 ">
          <Image 
            src = "/icons/headphone.png"
            alt="headphone"
            width={24}
            height={24}
          />
          <h1 className = "text-16 font-bold text-white-1">Listens: </h1>

          <h2 className = "text-md font-bold text-white-1">{podcast?.views}</h2>
        </figure>
      </header>

      <PodcastDetailPlayer 
        isOwner={isAuthor}
        podcastId = {podcast._id}
        {...podcast}
      />

      <p className = "text-white-2 text-16 pb-8 pt-[45px] font-medium max-md:text-center">{podcast?.podcastDescription}</p>

      <div className = "flex flex-col gap-8 pb-10 border-b border-black-6">
        <div className = "flex flex-row gap-4">
          <h1 className = "text-18 font-bold text-white-1">Voiced By: </h1>
          <p className = "capitalize text-18 font-bold text-white-1">{podcast?.voiceType}</p>
        </div>
        <div className = "flex flex-col gap-4">
          <h1 className = "text-18 font-bold text-white-1">AI Script</h1>
          <p className = "text-16 font-medium text-white-2">{podcast?.voicePrompt}</p>
        </div>
          {/* This if statement checks if the podcast's thumbnail is generated with AI. If Image prompt is empty (''), then the podcast's thumbnail must be uploaded instead of generated*/}
          {podcast?.imagePrompt !== '' ? (
            <>
              <div className = "flex flex-col gap-4">
                <h1 className = "text-18 font-bold text-white-1">Thumbnail Prompt</h1>
                <p className = "text-16 font-medium text-white-2">{podcast?.imagePrompt}</p>
              </div>
            </>
          ):(
            <>
              <h1 className = "text-18 font-bold text-white-1">This podcast used an uploaded thumbnail, not AI generated.</h1>
            </>
          )}
      </div>


      <section className = "mt-6 flex flex-col gap-5">
      <h1 className = "text-20 font-bold text-white-1">Other Podcasts By {podcast.author}</h1>
        {similarPodcasts && similarPodcasts.length > 0 ? (
          <>
            
            <div className = "podcast_grid">
              {similarPodcasts?.map(({_id, podcastTitle, podcastDescription, imageURL}) => (
                <PodcastCard 
                  key={_id}
                  imgURL={imageURL!}
                  title={podcastTitle}
                  description={podcastDescription}
                  podcastId={_id!}
                />
              ))}
            </div>
          </>
        ) : (
          <>
            <EmptyState 
              title = "Sorry, no similar podcasts found"
              buttonLink = "/discover"
              buttonText = "check out other podcasts"
            />
          </>
        )}
      </section>
    </section>
  )
}

export default PostcastDetails