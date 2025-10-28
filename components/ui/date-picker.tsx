"use client";

import * as React from "react";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Input } from "./input";

interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  label?: string;
}

export function DatePicker({ value, onChange, placeholder = "Pick a date", label }: DatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(value);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;
    if (dateValue) {
      const date = new Date(dateValue);
      setSelectedDate(date);
      onChange?.(date);
    } else {
      setSelectedDate(undefined);
      onChange?.(undefined);
    }
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return "";
    return date.toISOString().split("T")[0];
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      {label && (
        <label className="text-sm font-medium text-foreground px-1">
          {label}
        </label>
      )}
      <div className="relative w-full">
        <div className="relative flex items-center">
          <Calendar className="absolute left-3 h-4 w-4 text-foreground z-10 pointer-events-none" />
          <input
            type="date"
            value={formatDate(selectedDate)}
            onChange={handleDateChange}
            className={cn(
              "flex h-9 w-full rounded-md border border-input bg-background",
              "px-3 py-2 pl-9 text-sm font-medium text-foreground",
              "ring-offset-background placeholder:text-muted-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "cursor-pointer"
            )}
            placeholder={placeholder}
          />
        </div>
      </div>
    </div>
  );
}

