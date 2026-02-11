import React, { useEffect, useMemo, useState } from 'react';
import { ProductCard } from '../components/ProductCard';
import { supabase } from '../lib/supabaseClient';
import { toast } from 'sonner';

interface ProductSectionProps {
  onRate?: (name: string) => void;
  userId?: string | null;
}
interface ProductItem {
  id: string;
  name: string;
  destination: string;
  description: string | null;
  imageUrl: string | null;
  createdAt: string | null;
  ratingAvg?: number;
  ratingCount?: number;
}

export const ProductSection: React.FC<ProductSectionProps> = ({ onRate, userId }) => {
  const [products, setProducts] = useState<ProductItem[]>([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        let query = supabase
          .from('products')
          .select('id, product_name, destination_name, description, image_url, image_urls, created_at')
          .order('created_at', { ascending: false });

        if (userId) {
          query = query.eq('user_id', userId);
        }

        let { data: productRows, error: productError } = await query;

        if (productError && userId && productError.message.toLowerCase().includes('user_id')) {
          const retry = await supabase
            .from('products')
            .select('id, product_name, destination_name, description, image_url, image_urls, created_at')
            .order('created_at', { ascending: false });
          productRows = retry.data ?? [];
          productError = retry.error ?? null;
        }

        if (productError) {
          throw productError;
        }

        const { data: ratingRows, error: ratingError } = await supabase
          .from('product_ratings')
          .select('product_id, rating');

        if (ratingError) {
          throw ratingError;
        }

        const ratingMap = new Map<string, { total: number; count: number }>();
        (ratingRows ?? []).forEach((row) => {
          const current = ratingMap.get(row.product_id) ?? { total: 0, count: 0 };
          ratingMap.set(row.product_id, {
            total: current.total + (row.rating ?? 0),
            count: current.count + 1,
          });
        });

        const mapped = (productRows ?? []).map((row) => {
          const rating = ratingMap.get(row.id);
          const ratingAvg = rating && rating.count > 0 ? rating.total / rating.count : undefined;
          const imageUrls = (row as { image_urls?: string[] }).image_urls ?? [];
          return {
            id: row.id,
            name: row.product_name,
            destination: row.destination_name,
            description: row.description ?? null,
            imageUrl: imageUrls[0] ?? row.image_url ?? null,
            createdAt: row.created_at ?? null,
            ratingAvg,
            ratingCount: rating?.count,
          } as ProductItem;
        });

        setProducts(mapped);
      } catch (error) {
        console.error('Failed to load products:', error);
        toast.error('Failed to load products.');
      }
    };

    loadProducts();
  }, [userId]);

  const visibleProducts = useMemo(() => products.filter((item) => item.imageUrl), [products]);

  return (
    <section id="products" className="mt-10">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-semibold">Products</h2>
          <p className="text-sm text-white/60">Featured items curated for travelers.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {visibleProducts.map((product) => (
          <ProductCard
            key={product.id}
            title={product.name}
            meta={`Destination: ${product.destination}`}
            description={product.description ?? ''}
            imageUrl={product.imageUrl ?? ''}
            ratingAvg={product.ratingAvg}
            ratingCount={product.ratingCount}
            onRate={onRate ? () => onRate(product.name) : undefined}
          />
        ))}
      </div>
    </section>
  );
};
