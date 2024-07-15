'use client'
import React from 'react'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import Image from 'next/image'
import Link from 'next/link'
import { sidebarLinks } from '@/data'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'


const MobileNav = () => {
  const pathname = usePathname();
  return (
    <section>
      <Sheet>
        <SheetTrigger>
          <Image 
            src = "/icons/hamburger.svg"
            alt="menu"
            width={30}
            height={30}
            className = "mt-4 cursor-pointer"
          />
        </SheetTrigger>
        <SheetContent side="left" className = "border-none bg-black-0 w-[280px]">

          <Link href= "/" className = "flex cursor-pointer items-center gap-1 pb-10 pl-4">
            <Image src = "/logo.svg" alt = "logo" width = {23} height = {27}/>
            <h1 className = "text-24 font-extrabold text-white-1">Podify</h1>
          </Link>

          <div className = "flex h-[calc(100vh-72px)] flex-col justify-between overflow-y-auto">
            <SheetClose asChild>
              <nav>
              {sidebarLinks.map(({route, label, imgURL, size}) => {
            // isActive triggers when the current page path's name matches a "route" from data/index.ts.
            // if isActive is active, then we apply a shaadow gradient border on the current sidebar link to show which page we are currently at
              const isActive = pathname === route;
              // cn stans for "classname". Its a tailwind function that allows you to pass multiple classnames
              return <SheetClose asChild key={route}><Link href={route} key={label} className={cn("flex gap-3 items-center py-4 max-lg:px-4 font-manrope text-white-1 font-semibold justify-start", {
                'bg-nav-focus border-r-4 border-yellow': isActive
              })}>
                  <Image src = {imgURL} alt={label} width={size} height={size}/>
                  <p>{label}</p>
                </Link>
              </SheetClose>
          })}
              </nav>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>

    </section>
  )
}

export default MobileNav