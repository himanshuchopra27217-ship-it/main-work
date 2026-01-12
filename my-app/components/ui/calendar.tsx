"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface CalendarProps {
  mode?: "single" | "multiple"
  selected?: Date | Date[]
  onSelect?: (date: Date | Date[] | undefined) => void
  month?: Date
  onMonthChange?: (month: Date) => void
  className?: string
  modifiers?: Record<string, Date[]>
  modifiersStyles?: Record<string, React.CSSProperties>
}

export function Calendar({
  mode = "single",
  selected,
  onSelect,
  month: controlledMonth,
  onMonthChange,
  className = "",
  modifiers,
  modifiersStyles
}: CalendarProps) {
  const [internalMonth, setInternalMonth] = useState(new Date())
  const month = controlledMonth || internalMonth

  const handleMonthChange = (newMonth: Date) => {
    if (onMonthChange) {
      onMonthChange(newMonth)
    } else {
      setInternalMonth(newMonth)
    }
  }

  const selectedDates = Array.isArray(selected) ? selected : selected ? [selected] : []

  const isDateSelected = (date: Date) => {
    if (mode === "multiple") {
      return selectedDates.some(d => d.toDateString() === date.toDateString())
    }
    return selected && !Array.isArray(selected) && selected.toDateString() === date.toDateString()
  }

  const handleDateClick = (date: Date) => {
    if (mode === "multiple") {
      const isSelected = isDateSelected(date)
      let newSelected: Date[]

      if (isSelected) {
        newSelected = selectedDates.filter(d => d.toDateString() !== date.toDateString())
      } else {
        newSelected = [...selectedDates, date]
      }

      onSelect?.(newSelected)
    } else {
      onSelect?.(date)
    }
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }

    return days
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(month)
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1)
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1)
    }
    handleMonthChange(newMonth)
  }

  const days = getDaysInMonth(month)
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className={`p-3 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigateMonth('prev')}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <h2 className="text-lg font-semibold">
          {month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h2>

        <Button
          variant="outline"
          size="sm"
          onClick={() => navigateMonth('next')}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Week days header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => (
          <div key={index} className="aspect-square">
            {date ? (
              <Button
                variant={isDateSelected(date) ? "default" : "ghost"}
                className="w-full h-full p-0"
                onClick={() => handleDateClick(date)}
                style={isDateSelected(date) && modifiersStyles?.selected ? modifiersStyles.selected : undefined}
              >
                {date.getDate()}
              </Button>
            ) : (
              <div className="w-full h-full" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}