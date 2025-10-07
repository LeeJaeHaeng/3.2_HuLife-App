"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search } from "lucide-react"

interface CommunityFiltersProps {
  onFilterChange: (query: string, location: string) => void
}

export function CommunityFilters({ onFilterChange }: CommunityFiltersProps) {
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const query = formData.get("query") as string
    const location = formData.get("location") as string
    onFilterChange(query, location)
  }

  return (
    <form onSubmit={handleSearch} className="mb-8 space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            name="query"
            placeholder="모임 이름이나 설명으로 검색..."
            className="pl-10 h-12"
          />
        </div>
        <Select name="location" defaultValue="all">
          <SelectTrigger className="w-full md:w-[200px] h-12">
            <SelectValue placeholder="지역 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체 지역</SelectItem>
            <SelectItem value="서울특별시">서울특별시</SelectItem>
            <SelectItem value="부산광역시">부산광역시</SelectItem>
            <SelectItem value="대구광역시">대구광역시</SelectItem>
            <SelectItem value="인천광역시">인천광역시</SelectItem>
            <SelectItem value="광주광역시">광주광역시</SelectItem>
            <SelectItem value="대전광역시">대전광역시</SelectItem>
            <SelectItem value="울산광역시">울산광역시</SelectItem>
            <SelectItem value="세종특별자치시">세종특별자치시</SelectItem>
            <SelectItem value="경기도">경기도</SelectItem>
            <SelectItem value="강원특별자치도">강원특별자치도</SelectItem>
            <SelectItem value="충청북도">충청북도</SelectItem>
            <SelectItem value="충청남도">충청남도</SelectItem>
            <SelectItem value="전북특별자치도">전북특별자치도</SelectItem>
            <SelectItem value="전라남도">전라남도</SelectItem>
            <SelectItem value="경상북도">경상북도</SelectItem>
            <SelectItem value="경상남도">경상남도</SelectItem>
            <SelectItem value="제주특별자치도">제주특별자치도</SelectItem>
          </SelectContent>
        </Select>
        <Button type="submit" size="lg" className="h-12">
          검색
        </Button>
      </div>
    </form>
  )
}
