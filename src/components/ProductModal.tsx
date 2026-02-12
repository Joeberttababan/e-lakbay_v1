import React from 'react';
import { ProductCard } from './ProductCard';

interface ProductModalProps {
  open: boolean;
  onClose: () => void;
  product: {
    name: string;
    imageUrl: string;
    description?: string | null;
    ratingAvg?: number;
    ratingCount?: number;
    uploaderName?: string;
  } | null;
  onRate?: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ open, onClose, product, onRate }) => {
  if (!open || !product) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="w-[280px] sm:w-[320px] md:w-[360px]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <ProductCard
          title={product.name}
          description={product.description || 'A locally crafted product from Ilocos Sur.'}
          imageUrl={product.imageUrl}
          meta={product.uploaderName}
          ratingAvg={product.ratingAvg}
          ratingCount={product.ratingCount}
          onRate={onRate}
        />
      </div>
    </div>
  );
};
