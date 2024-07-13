import { EmptyStateProps } from '@/types'
import React from 'react'
import Image from "next/image"
import { Button } from './ui/button'
import Link from 'next/link'

const EmptyState = ({title, search, buttonLink, buttonText}: EmptyStateProps) => {
  return (
    <section className = "flex-center size-full flex-col gap-3">
        <Image 
            src="/icons/dissapointed.png"
            alt="empty state"
            width={200}
            height={200}
        />
        <div className = "flex-center w-full max-w-[254px] flex-col gap-3">
            <h1 className = "mt-2 text-16 text-center font-medium text-white-1">{title}</h1>
            {search && (
                <p className = "text-16 text-center font-medium text-white-2"> Try adjusting your searh to find what you are looking for</p>
            )}

            {buttonLink && (
                <Button className = "mt-2 bg-yellow">
                    <Link href = {buttonLink} className = "flex gap-1">
                        <h1 className = "text-16 font-extrabold text-white-1">{buttonText}</h1>
                        <Image 
                           src = "/icons/discover.svg" 
                           alt = "discover"
                           width={20}
                           height={20}
                        />
                    </Link>
                </Button>
            )}
        </div>
    </section>
  )
}

export default EmptyState