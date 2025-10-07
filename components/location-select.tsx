'use client'

import { useState, useMemo } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { locationData } from "@/lib/korea-administrative-district"

// Reformat the data for easier lookup
const processedLocationData: { [key: string]: string[] } = locationData.reduce((acc, item) => {
  const [key, value] = Object.entries(item)[0]
  acc[key] = value
  return acc
}, {} as { [key: string]: string[] })

const provinces = Object.keys(processedLocationData)

export function LocationSelect() {
  const [selectedProvince, setSelectedProvince] = useState("")
  const [selectedCity, setSelectedCity] = useState("")
  const [cities, setCities] = useState<string[]>([])

  const handleProvinceChange = (province: string) => {
    setSelectedProvince(province)
    setCities(processedLocationData[province] || [])
    setSelectedCity("") // Reset city selection
  }

  const locationValue = selectedProvince && selectedCity ? `${selectedProvince} ${selectedCity}` : ""

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <input type="hidden" name="location" value={locationValue} />
      <div className="space-y-2">
        <Select onValueChange={handleProvinceChange} value={selectedProvince}>
          <SelectTrigger className="h-12 text-base">
            <SelectValue placeholder="시/도 선택" />
          </SelectTrigger>
          <SelectContent>
            {provinces.map((province) => (
              <SelectItem key={province} value={province}>
                {province}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Select onValueChange={setSelectedCity} value={selectedCity} disabled={!selectedProvince}>
          <SelectTrigger className="h-12 text-base">
            <SelectValue placeholder="시/군/구 선택" />
          </SelectTrigger>
          <SelectContent>
            {cities.map((city) => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
