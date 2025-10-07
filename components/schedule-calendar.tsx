"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin } from "lucide-react"
import type { Schedule } from "@/lib/db/schema"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth } from "date-fns"
import { ko } from "date-fns/locale"
import { ScheduleAddDialog } from "./schedule-add-dialog"

interface ScheduleCalendarProps {
  schedules: Schedule[]
}

export function ScheduleCalendar({ schedules }: ScheduleCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const getSchedulesForDay = (day: Date) => {
    return schedules.filter((schedule) => isSameDay(new Date(schedule.date), day))
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "class":
        return "bg-blue-500"
      case "practice":
        return "bg-green-500"
      case "meeting":
        return "bg-purple-500"
      case "event":
        return "bg-orange-500"
      default:
        return "bg-gray-500"
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "class":
        return "수업"
      case "practice":
        return "연습"
      case "meeting":
        return "모임"
      case "event":
        return "행사"
      default:
        return type
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{format(currentDate, "yyyy년 M월", { locale: ko })}</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
              >
                이전
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                오늘
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
              >
                다음
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
              <div key={day} className="text-center font-semibold text-sm text-muted-foreground p-2">
                {day}
              </div>
            ))}

            {daysInMonth.map((day) => {
              const daySchedules = getSchedulesForDay(day)
              const isToday = isSameDay(day, new Date())

              return (
                <div
                  key={day.toString()}
                  className={`min-h-24 p-2 border rounded-lg ${
                    isToday ? "bg-primary/5 border-primary" : "border-border"
                  } ${!isSameMonth(day, currentDate) ? "opacity-50" : ""}`}
                >
                  <div className={`text-sm font-semibold mb-1 ${isToday ? "text-primary" : "text-foreground"}`}>
                    {format(day, "d")}
                  </div>
                  <div className="space-y-1">
                    {daySchedules.slice(0, 2).map((schedule) => (
                      <div
                        key={schedule.id}
                        className={`text-xs p-1 rounded ${getTypeColor(schedule.type)} text-white truncate`}
                      >
                        {schedule.title}
                      </div>
                    ))}
                    {daySchedules.length > 2 && (
                      <div className="text-xs text-muted-foreground">+{daySchedules.length - 2}개</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>다가오는 일정</CardTitle>
            <ScheduleAddDialog />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {schedules
              .filter((s) => new Date(s.date) >= new Date())
              .slice(0, 5)
              .map((schedule) => (
                <div key={schedule.id} className="flex items-start gap-4 p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getTypeColor(schedule.type)}>{getTypeLabel(schedule.type)}</Badge>
                      <h4 className="font-semibold text-foreground">{schedule.title}</h4>
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{format(new Date(schedule.date), "yyyy년 M월 d일 (E)", { locale: ko })}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{schedule.time}</span>
                      </div>
                      {schedule.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{schedule.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

            {schedules.filter((s) => new Date(s.date) >= new Date()).length === 0 && (
              <div className="text-center py-8 text-muted-foreground">예정된 일정이 없습니다.</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
