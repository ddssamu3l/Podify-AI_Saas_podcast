'use client'
import { SignedIn, useUser } from '@clerk/nextjs'
import React from 'react'

const RightSidebar = () => {
  const {user} = useUser();
  return (
    <section className = "right_sidebar text-white-1">
      <SignedIn>
        <h1>{user?.firstName}</h1>
      </SignedIn>
    </section>
  )
}

export default RightSidebar