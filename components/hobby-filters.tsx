"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

interface HobbyFiltersProps {
  onFilterChange: (query: string, category: string) => void
}

export function HobbyFilters({ onFilterChange }: HobbyFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")
  const [category, setCategory] = useState(searchParams.get("category") || "all")

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (searchQuery) params.set("q", searchQuery)
    if (category !== "all") params.set("category", category)

    router.push(`/hobbies?${params.toString()}`)
    onFilterChange(searchQuery, category)
  }

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory)
    const params = new URLSearchParams()
    if (searchQuery) params.set("q", searchQuery)
    if (newCategory !== "all") params.set("category", newCategory)

    router.push(`/hobbies?${params.toString()}`)
    onFilterChange(searchQuery, newCategory)
  }

  useEffect(() => {
    onFilterChange(searchQuery, category)
  }, [])

  return (
    <div className="mb-8 flex flex-col md:flex-row gap-4">
      <div className="flex-1 flex gap-2">
        <Input
          placeholder="취미 검색..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="flex-1"
        />
        <Button onClick={handleSearch}>
          <Search className="h-4 w-4 mr-2" />
          검색
        </Button>
      </div>

      <Select value={category} onValueChange={handleCategoryChange}>
        <SelectTrigger className="w-full md:w-48">
          <SelectValue placeholder="카테고리" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">전체</SelectItem>
          <SelectItem value="미술">미술</SelectItem>
          <SelectItem value="스포츠">스포츠</SelectItem>
          <SelectItem value="문화">문화</SelectItem>
          <SelectItem value="건강">건강</SelectItem>
          <SelectItem value="예술">예술</SelectItem>
          <SelectItem value="자연">자연</SelectItem>
          <SelectItem value="음악">음악</SelectItem>
          <SelectItem value="공예">공예</SelectItem>
          <SelectItem value="요리">요리</SelectItem>
          <SelectItem value="기술">기술</SelectItem>
          <SelectItem value="언어">언어</SelectItem>
          <SelectItem value="여가">여가</SelectItem>
          <SelectItem value="봉사">봉사</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
