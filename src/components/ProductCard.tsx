import React from 'react';
import { Star } from 'lucide-react';

interface ProductCardProps {
  title: string;
  description: string;
  imageUrl: string;
  meta?: string;
  ratingAvg?: number;
  ratingCount?: number;
  onRate?: () => void;
}

const formatRating = (ratingAvg?: number, ratingCount?: number) => {
  if (!ratingAvg || Number.isNaN(ratingAvg)) {
    return 'No ratings yet';
  }
  if (ratingCount && ratingCount > 0) {
    return `${ratingAvg.toFixed(1)} (${ratingCount})`;
  }
  return ratingAvg.toFixed(1);
};

export const ProductCard: React.FC<ProductCardProps> = ({
  title,
  description,
  imageUrl,
  meta,
  ratingAvg,
  ratingCount,
  onRate,
}) => {
  return (
    <article className="glass-secondary border border-white/10 rounded-xl p-2 flex flex-col h-auto text-white">
      <div className="aspect-square rounded-xl overflow-hidden border border-white/10 bg-white/10">
        <img src={imageUrl} alt={title} className="h-full w-full object-cover" />
      </div>
      <div className="flex flex-1 flex-col gap-1 min-h-0 pt-2">
        <div className="flex items-center justify-end gap-1 text-xs">
          <Star className="h-4 w-4 text-yellow-300" fill="currentColor" />
          <span>{formatRating(ratingAvg, ratingCount)}</span>
        </div>
        <div className="flex items-start">
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            {meta && <p className="text-xs mt-1">{meta}</p>}
          </div>
        </div>
        <p className="text-sm text-white/70 leading-relaxed line-clamp-2">
          {description}
        </p>
        {onRate && (
          <div className="mt-auto flex justify-end">
            <button
              type="button"
              onClick={onRate}
              className="rounded-full  bg-white/10 border border-white/20 px-4 py-2 text-sm font-semibold hover:bg-white/20 transition-colors"
            >
              Rate
            </button>
          </div>
        )}
      </div>
    </article>
  );
};
