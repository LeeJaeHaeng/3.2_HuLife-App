"use client"

import { useState } from "react"
import { HobbyFilters } from "./hobby-filters"
import { HobbyList } from "./hobby-list"
import type { Hobby } from "@/lib/db/schema"

interface HobbiesClientProps {
  hobbies: Hobby[]
}

export function HobbiesClient({ hobbies }: HobbiesClientProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [category, setCategory] = useState("all")

  const handleFilterChange = (query: string, cat: string) => {
    setSearchQuery(query)
    setCategory(cat)
  }

  return (
    <>
      <HobbyFilters onFilterChange={handleFilterChange} />
      <HobbyList initialHobbies={hobbies} searchQuery={searchQuery} category={category} />
    </>
  )
}
