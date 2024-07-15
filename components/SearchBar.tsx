'use client'

import React, { useEffect, useState } from 'react'
import { Input } from './ui/input'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useDebounce } from '@/lib/useDebounce'

const SearchBar = () => {
    const [search, setSearch] = useState('');
    const router = useRouter();
    const pathname = usePathname();
    const debouncedValue = useDebounce(search, 500);
    useEffect(() => {
        if(search){
            router.push(`/discover?search=${search}`)
        }else if(!search && pathname === '/discover'){
            router.push('discover')
        }
    }, [router, pathname, debouncedValue]) 
  return (
    <div className = "relative mt-8 block">
        <Input 
            className = "input_class py-6 pl-12 focus-visible:ring-offset-yellow"
            placeholder = "Search for a podcast by title, content, or author"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
        />
        <Image 
            src = "/icons/search.svg"
            alt="search"
            width={20}
            height={20}
            className = "absolute left-4 top-3.5"
        />
    </div>
  )
}

export default SearchBar