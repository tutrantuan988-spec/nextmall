"use client";

import React, { useState } from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  onRatingChange?: (rating: number) => void;
  interactive?: boolean;
  size?: number;
}

export function StarRating({ 
  rating, 
  maxRating = 5, 
  onRatingChange, 
  interactive = false,
  size = 20
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const displayRating = interactive && hoverRating > 0 ? hoverRating : rating;

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxRating }).map((_, i) => {
        const starIdx = i + 1;
        const isFilled = starIdx <= displayRating;
        
        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => onRatingChange?.(starIdx)}
            onMouseEnter={() => interactive && setHoverRating(starIdx)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            className={`transition-all ${interactive ? "hover:scale-125 cursor-pointer active:scale-95" : "cursor-default"}`}
          >
            <Star 
              size={size} 
              className={`${isFilled ? "fill-amber-400 text-amber-400" : "text-slate-200 fill-slate-50"}`}
            />
          </button>
        );
      })}
    </div>
  );
}
