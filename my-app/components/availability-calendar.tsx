"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

interface AvailabilityCalendarProps {
  selectedDates: Date[]
  onDatesChange: (dates: Date[]) => void
}

export function AvailabilityCalendar({ selectedDates, onDatesChange }: AvailabilityCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return

    const dateString = date.toDateString()
    const isAlreadySelected = selectedDates.some(d => d.toDateString() === dateString)

    if (isAlreadySelected) {
      // Remove date
      const newDates = selectedDates.filter(d => d.toDateString() !== dateString)
      onDatesChange(newDates)
    } else {
      // Add date
      const newDates = [...selectedDates, date]
      onDatesChange(newDates)
    }
  }

  const removeDate = (dateToRemove: Date) => {
    const newDates = selectedDates.filter(d => d.toDateString() !== dateToRemove.toDateString())
    onDatesChange(newDates)
  }

  const isDateSelected = (date: Date) => {
    return selectedDates.some(d => d.toDateString() === date.toDateString())
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Select Your Available Dates</CardTitle>
        <p className="text-sm text-muted-foreground">
          Choose the dates when you're available for work. Click on dates to select/deselect them.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          <Calendar
            mode="multiple"
            selected={selectedDates}
            onSelect={(dates) => onDatesChange(Array.isArray(dates) ? dates : dates ? [dates] : [])}
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            className="rounded-md border"
            modifiers={{
              selected: selectedDates
            }}
            modifiersStyles={{
              selected: {
                backgroundColor: "hsl(var(--primary))",
                color: "hsl(var(--primary-foreground))",
                fontWeight: "bold"
              }
            }}
          />
        </div>

        {selectedDates.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Selected Dates ({selectedDates.length})</h4>
            <div className="flex flex-wrap gap-2">
              {selectedDates
                .sort((a, b) => a.getTime() - b.getTime())
                .map((date) => (
                  <Badge key={date.toISOString()} variant="secondary" className="flex items-center gap-1">
                    {date.toLocaleDateString()}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => removeDate(date)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}