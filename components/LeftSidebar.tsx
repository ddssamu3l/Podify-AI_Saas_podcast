"use client"
import Link from 'next/link'
import Image from 'next/image'
import React from 'react'

import {sidebarLinks} from "@/data"
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { SignedIn, SignedOut, useClerk } from '@clerk/nextjs'
import { Button } from './ui/button'

const LeftSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const {signOut} = useClerk();
  return (
    <section className = "left_sidebar">
      <nav className = "flex flex-col gap-6">
          
          <Link href= "/" className = "flex cursor-pointer items-center gap-1 pb-10 max-lg:justify-center">
              <Image src = "/logo.svg" alt = "logo" width = {23} height = {27}/>
              <h1 className = "text-24 font-extrabold text-white-1 max:lg-hidden">Podify</h1>
          </Link>

          {sidebarLinks.map(({route, label, imgURL, size}) => {
            // isActive triggers when the current page path's name matches a "route" from data/index.ts.
            // if isActive is active, then we apply a shaadow gradient border on the current sidebar link to show which page we are currently at
              const isActive = pathname === route;
              // cn stans for "classname". Its a tailwind function that allows you to pass multiple classnames
              return <Link href={route} key={label} className={cn("flex gap-3 items-center py-4 max-lg:px-4 font-manrope text-white-1 font-semibold justify-center lg:justify-start", {
                'bg-nav-focus border-r-4 border-yellow': isActive
              })}>
                <Image src = {imgURL} alt={label} width={size} height={size}/>
                <p>{label}</p>
              </Link>
          })}
      </nav>

      <SignedOut>
        <div className = "flex-center w-full pb-14 max-lg:px-4 lg:px-8">
          <Button asChild className = "-ml-6 text-16 w-full bg-yellow font-extrabold hover:bg-black-0 hover:border hover:border-yellow">
            <Link href = "/sign-in">Sign In</Link>
          </Button>
        </div>
      </SignedOut>
      <SignedIn>
        <div className = "flex-center w-full pb-14 max-lg:px-4 lg:px-6">
          <Button 
            className = "-ml-6 text-16 w-full bg-yellow font-extrabold hover:bg-black-0 hover:border hover:border-yellow"
            onClick = {() => signOut(() => router.push('/'))}
          >
            Sign Out
          </Button>
        </div>
      </SignedIn>
    </section>
  )
}

export default LeftSidebar