import { Star } from 'lucide-react'

export function StarRating({ rating, reviewsCount }: { rating: number; reviewsCount?: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i + 1 <= Math.round(rating)
          return (
            <Star
              key={i}
              className={`h-4 w-4 ${filled ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`}
              aria-hidden="true"
            />
          )
        })}
      </div>
      <span className="text-sm font-semibold text-gray-900">{rating.toFixed(1)}</span>
      {reviewsCount && <span className="text-sm text-gray-500">({reviewsCount})</span>}
    </div>
  )
}
