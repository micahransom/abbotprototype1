"use client";

import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TagOption {
  id: string;
  label: string;
  count?: number;
}

interface TagInputProps {
  suggestions?: TagOption[];
  selectedTags?: TagOption[];
  onTagsChange?: (tags: TagOption[]) => void;
  placeholder?: string;
  className?: string;
  allowCreate?: boolean;
}

export function TagInput({
  suggestions = [],
  selectedTags = [],
  onTagsChange,
  placeholder = "Type to search...",
  className,
  allowCreate = true,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [tags, setTags] = useState<TagOption[]>(selectedTags);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Update tags when selectedTags prop changes
  useEffect(() => {
    setTags(selectedTags);
  }, [selectedTags]);

  // Filter suggestions based on input
  const filteredSuggestions = suggestions.filter(
    (suggestion) =>
      suggestion.label.toLowerCase().includes(inputValue.toLowerCase()) &&
      !tags.find((tag) => tag.id === suggestion.id)
  );

  // Handle click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const addTag = (tag: TagOption) => {
    const newTags = [...tags, tag];
    setTags(newTags);
    onTagsChange?.(newTags);
    setInputValue("");
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const removeTag = (tagId: string) => {
    const newTags = tags.filter((tag) => tag.id !== tagId);
    setTags(newTags);
    onTagsChange?.(newTags);
  };

  const handleCreateNew = () => {
    if (inputValue.trim()) {
      const newTag: TagOption = {
        id: `new-${Date.now()}`,
        label: inputValue.trim(),
      };
      addTag(newTag);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setIsOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      if (filteredSuggestions.length > 0) {
        addTag(filteredSuggestions[0]);
      } else if (allowCreate) {
        handleCreateNew();
      }
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      removeTag(tags[tags.length - 1].id);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* Inline Tags and Input Container */}
      <div 
        className="flex flex-wrap items-center gap-1.5 py-0.5 cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        {/* Tags Display - Inline */}
        {tags.map((tag) => (
          <div
            key={tag.id}
            className="bg-slate-100 border border-slate-300 rounded-md px-2 py-0.5 flex items-center gap-1 whitespace-nowrap"
          >
            <span className="text-xs font-semibold text-foreground">{tag.label}</span>
            {tag.count !== undefined && (
              <div className="bg-background border border-border rounded-full px-1 min-w-[20px] flex items-center justify-center">
                <span className="text-xs font-semibold text-foreground">{tag.count}</span>
              </div>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeTag(tag.id);
              }}
              className="ml-1 hover:bg-slate-200 rounded-sm p-0.5 shrink-0"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}

        {/* Inline Input Field */}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          placeholder={tags.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[120px] px-1 py-1 text-sm bg-transparent border-none outline-none focus:outline-none focus:ring-0"
        />
      </div>

      {/* Dropdown Menu */}
      {isOpen && (inputValue || filteredSuggestions.length > 0) && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-[224px] mt-1 bg-popover border border-border rounded-md shadow-md p-1"
        >
          {/* Create New Option */}
          {allowCreate && inputValue.trim() && (
            <>
              <button
                onClick={handleCreateNew}
                className="w-full px-2 py-1.5 text-left text-sm font-semibold text-popover-foreground hover:bg-accent rounded-sm"
              >
                Create &quot;{inputValue}&quot;
              </button>
              <div className="h-px bg-border my-1" />
            </>
          )}

          {/* Suggestions List */}
          {filteredSuggestions.length > 0 ? (
            filteredSuggestions.map((suggestion) => (
              <button
                key={suggestion.id}
                onClick={() => addTag(suggestion)}
                className="w-full px-2 py-1.5 text-left text-sm text-popover-foreground hover:bg-accent rounded-sm truncate"
              >
                {suggestion.label}
              </button>
            ))
          ) : (
            !allowCreate && inputValue && (
              <div className="px-2 py-1.5 text-sm text-muted-foreground">
                No results found
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}

