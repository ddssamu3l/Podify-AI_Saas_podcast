"use client"
import Link from 'next/link'
import Image from 'next/image'
import React from 'react'

import {sidebarLinks} from "@/data"
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

const LeftSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <section className = "left_sidebar">
        <nav className = "flex flex-col gap-6">
            
            <Link href= "/" className = "flex cursor-pointer items-center gap-1 pb-10 max-lg:justify-center">
                <Image src = "/logo.svg" alt = "logo" width = {23} height = {27}/>
                <h1 className = "text-24 font-extrabold text-white-1 max:lg-hidden">Podify</h1>
            </Link>

            {sidebarLinks.map(({route, label, imgURL}) => {
              // isActive triggers when the current page path's name matches a "route" from data/index.ts.
              // if isActive is active, then we apply a shaadow gradient border on the current sidebar link to show which page we are currently at
                const isActive = pathname === route;
                // cn stans for "classname". Its a tailwind function that allows you to pass multiple classnames
                return <Link href={route} key={label} className={cn("flex gap-3 items-center py-4 max-lg:px-4 text-white-1 justify-center lg:justify-start", {
                  'bg-nav-focus border-r-4 border-orange': isActive
                })}>
                  <Image src = {imgURL} alt={label} width={24} height={24}/>
                  <p>{label}</p>
                </Link>
            })}
                 
        </nav>
    </section>
  )
}

export default LeftSidebar