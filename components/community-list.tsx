"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, MapPin, Calendar } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import type { Community } from "@/lib/db/schema"
import { joinCommunity } from "@/lib/actions/community"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { CommunityFilters } from "./community-filters"

interface CommunityListProps {
  communities: Community[]
}

export function CommunityList({ communities }: CommunityListProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [locationFilter, setLocationFilter] = useState("all")

  const handleFilterChange = (query: string, location: string) => {
    setSearchQuery(query)
    setLocationFilter(location)
  }

  const filteredCommunities = useMemo(() => {
    return communities.filter((community) => {
      const matchesSearch = searchQuery
        ? community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          community.description.toLowerCase().includes(searchQuery.toLowerCase())
        : true

      const matchesLocation =
        locationFilter !== "all" ? community.location.includes(locationFilter) : true

      return matchesSearch && matchesLocation
    })
  }, [communities, searchQuery, locationFilter])

  const handleJoin = async (communityId: string) => {
    const result = await joinCommunity(communityId)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("커뮤니티에 가입되었습니다!")
      router.refresh()
    }
  }

  return (
    <>
      <CommunityFilters onFilterChange={handleFilterChange} />
      {filteredCommunities.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            검색 결과가 없습니다.
          </CardContent>
        </Card>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredCommunities.map((community) => (
        <Card key={community.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="relative h-48 w-full">
            <Image src={community.imageUrl || "/placeholder.svg"} alt={community.name} fill className="object-cover" />
            <Badge className="absolute top-4 right-4 bg-primary">
              {community.memberCount}/{community.maxMembers}명
            </Badge>
          </div>

          <CardHeader>
            <h3 className="text-xl font-bold text-foreground mb-2">{community.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{community.description}</p>
          </CardHeader>

          <CardContent className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{community.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{community.schedule}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{community.memberCount}명 참여 중</span>
            </div>
          </CardContent>

          <CardFooter className="flex gap-2">
            <Button asChild className="flex-1">
              <Link href={`/community/${community.id}`}>자세히 보기</Link>
            </Button>
            <Button
              variant="outline"
              onClick={() => handleJoin(community.id)}
              disabled={community.memberCount >= community.maxMembers}
            >
              가입하기
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
    </>
  )
}
