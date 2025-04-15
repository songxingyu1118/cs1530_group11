import * as React from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ rating, reviewCount }) => {
  // Convert from 2-10 scale to 1-5 scale
  const normalizedRating = rating / 2;

  const fullStars = Math.floor(normalizedRating);
  const hasHalfStar = (normalizedRating - fullStars) >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      ))}

      {hasHalfStar && (
        <div className="relative h-4 w-4">
          <Star className="absolute h-4 w-4 text-gray-300" />
          <div className="absolute h-4 w-2 overflow-hidden">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          </div>
        </div>
      )}

      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />
      ))}

      {reviewCount !== undefined && (
        <span className="ml-1 text-sm text-gray-600">({reviewCount})</span>
      )}
    </div>
  );
};

export { StarRating };