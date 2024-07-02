import React from 'react'

const PostcastDetails = ({ params }: {params: {podcastId: string}}) => {
  return (
    <p className = "text-white-1 ">PodcastDetails for {params.podcastId}</p>
  )
}

export default PostcastDetails