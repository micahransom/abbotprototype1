"use client";

import { cn } from "@/lib/utils";
import { 
  IngredientCategory, 
  getIngredientOptions 
} from "@/lib/ingredient-data";

/**
 * Reusable ingredient dropdown component
 * 
 * Usage:
 * ```tsx
 * const [selectedBuffer, setSelectedBuffer] = useState("");
 * 
 * <IngredientSelect
 *   category="buffer"
 *   value={selectedBuffer}
 *   onValueChange={setSelectedBuffer}
 *   placeholder="Select a buffer..."
 * />
 * ```
 */
interface IngredientSelectProps {
  category: IngredientCategory;
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function IngredientSelect({
  category,
  value,
  onValueChange,
  placeholder = "Select...",
  className,
}: IngredientSelectProps) {
  const options = getIngredientOptions(category);

  return (
    <select
      value={value}
      onChange={(e) => onValueChange?.(e.target.value)}
      className={cn(
        "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.id} value={option.id}>
          {option.name}
        </option>
      ))}
    </select>
  );
}

// Also export as default
export default IngredientSelect;

