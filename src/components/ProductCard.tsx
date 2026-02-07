import React from 'react';

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
    <article className="glass-secondary border border-white/10 rounded-2xl p-4 sm:p-5 flex flex-col h-[420px] overflow-hidden">
      <div className="flex-[0_0_50%] min-h-[180px] rounded-xl overflow-hidden border border-white/10 bg-white/10">
        <img src={imageUrl} alt={title} className="h-full w-full object-cover" />
      </div>
      <div className="flex flex-1 flex-col gap-3 pt-4 min-h-0">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          {meta && <p className="text-xs text-white/60 mt-1">{meta}</p>}
        </div>
        <p className="text-sm text-white/70 leading-relaxed line-clamp-3">
          {description}
        </p>
        <div className="flex items-center gap-2 text-sm text-yellow-300">
          <span>★</span>
          <span className="text-white/70">{formatRating(ratingAvg, ratingCount)}</span>
        </div>
        {onRate && (
          <div className="mt-auto flex justify-end">
            <button
              type="button"
              onClick={onRate}
              className="rounded-full bg-white/10 border border-white/20 px-4 py-2 text-sm font-semibold hover:bg-white/20 transition-colors"
            >
              Rate
            </button>
          </div>
        )}
      </div>
    </article>
  );
};
