"use client";

import * as React from "react";
import { format, parse, isValid } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface DateInputProps {
  label?: string;
  value?: Date | null;
  onChange: (date: Date | null) => void;
  required?: boolean;
  placeholder?: string;
}

export function DateInput({
  label = "Date of Birth",
  value,
  onChange,
  required = false,
  placeholder = "DD/MM/YYYY",
}: DateInputProps) {
  const [inputValue, setInputValue] = React.useState("");
  const [error, setError] = React.useState("");
  const [open, setOpen] = React.useState(false);

  // Sync input value when external value changes
  React.useEffect(() => {
    if (value && isValid(value)) {
      setInputValue(format(value, "dd/MM/yyyy"));
      setError("");
    } else if (value === null) {
      setInputValue("");
      setError("");
    }
  }, [value]);

  // Format input as DD/MM/YYYY while typing
  const formatDateInput = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 8);
    const day = digits.slice(0, 2);
    const month = digits.slice(2, 4);
    const year = digits.slice(4, 8);

    let formatted = day;
    if (digits.length > 2) formatted += "/" + month;
    if (digits.length > 4) formatted += "/" + year;

    return formatted;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const formattedValue = formatDateInput(rawValue);
    setInputValue(formattedValue);
  };

  const validateAndParseDate = (val: string) => {
    if (!val.trim()) {
      setError("");
      onChange(null);
      return;
    }

    // Strict DD/MM/YYYY regex
    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = val.match(dateRegex);

    if (!match) {
      setError("Invalid date format. Use DD/MM/YYYY");
      onChange(null);
      return;
    }

    const parsedDate = parse(val, "dd/MM/yyyy", new Date());

    if (!isValid(parsedDate)) {
      setError("Invalid date");
      onChange(null);
      return;
    }

    // Normalize time to avoid timezone edge cases
    parsedDate.setHours(12, 0, 0, 0);

    const today = new Date();
    today.setHours(12, 0, 0, 0);

    if (parsedDate > today) {
      setError("Date cannot be in the future");
      onChange(null);
      return;
    }

    const minDate = new Date("1900-01-01");
    minDate.setHours(12, 0, 0, 0);

    if (parsedDate < minDate) {
      setError("Date must be after 1900");
      onChange(null);
      return;
    }

    setError("");
    onChange(parsedDate);
  };

  const handleInputBlur = () => {
    validateAndParseDate(inputValue);
  };

  const handleCalendarSelect = (date?: Date) => {
    if (!date) return;

    // Normalize and validate Date object directly
    const normalized = new Date(date);
    normalized.setHours(12, 0, 0, 0);

    const today = new Date();
    today.setHours(12, 0, 0, 0);

    const minDate = new Date("1900-01-01");
    minDate.setHours(12, 0, 0, 0);

    if (normalized > today) {
      setError("Date cannot be in the future");
      onChange(null);
      return;
    }

    if (normalized < minDate) {
      setError("Date must be after 1900");
      onChange(null);
      return;
    }

    setError("");
    setInputValue(format(normalized, "dd/MM/yyyy"));
    onChange(normalized);
    setOpen(false);
  };

  return (
    <div className="space-y-2">
      {label && (
        <Label>
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      )}

      <div className="relative flex gap-2">
        <Input
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          required={required}
          className={error ? "border-red-500" : ""}
          inputMode="numeric"
          // ✅ allow DD/MM/YYYY instead of digits-only
          pattern="^\d{2}/\d{2}/\d{4}$"
          aria-invalid={!!error}
        />

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0"
              type="button"
            >
              <CalendarIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={value ?? undefined}
              onSelect={handleCalendarSelect}
              captionLayout="dropdown-buttons"
              fromYear={1900}
              toYear={new Date().getFullYear()}
              disabled={(date) =>
                date > new Date() || date < new Date("1900-01-01")
              }
              className="rounded-md border shadow-sm"
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

// Demo component to test the DateInput
export default function DateInputDemo() {
  const [date, setDate] = React.useState<Date | null>(null);

  return (
    <div>
      <div>
        <h2 className="text-2xl font-bold mb-4">Date Input Component</h2>
        <p className="text-gray-600 mb-6">
          Try typing a date manually (DD/MM/YYYY) or click the calendar icon to select a date.
        </p>
      </div>

      <DateInput
        label="Date of Birth"
        value={date}
        onChange={setDate}
        required
      />

      <p className="mt-4 text-gray-700">
        Selected date: {date ? date.toDateString() : "None"}
      </p>
    </div>
  );
}
