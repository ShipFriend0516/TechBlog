import { useState, useEffect, useMemo, Dispatch, SetStateAction } from "react";
import { TagData } from "@/app/types/Tag";

interface UseTagAutocompleteOptions {
  tagInput: string;
  currentTags: string[];
}

export function useTagAutocomplete({ tagInput, currentTags }: UseTagAutocompleteOptions): {
  suggestions: TagData[];
  isOpen: boolean;
  highlightedIndex: number;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setHighlightedIndex: Dispatch<SetStateAction<number>>;
} {
  const [allTags, setAllTags] = useState<TagData[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  useEffect(() => {
    fetch("/api/tags")
      .then((res) => res.json())
      .then((data: TagData[]) => setAllTags(data))
      .catch((err) => {
        console.error(err);
        setAllTags([]);
      });
  }, []);

  const suggestions = useMemo<TagData[]>(() => {
    if (tagInput.trim() === "") return [];
    const lower = tagInput.toLowerCase().trim();
    return allTags
      .filter(
        ({ tag }) =>
          tag.toLowerCase().includes(lower) && !currentTags.includes(tag)
      )
      .slice(0, 8);
  }, [allTags, tagInput, currentTags]);

  useEffect(() => {
    setIsOpen(suggestions.length > 0);
    setHighlightedIndex(-1);
  }, [suggestions]);

  return {
    suggestions,
    isOpen,
    highlightedIndex,
    setIsOpen,
    setHighlightedIndex,
  };
}
