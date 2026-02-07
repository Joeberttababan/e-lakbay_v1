import React from 'react';
import { ProductCard } from '../components/ProductCard';

interface ProductSectionProps {
  onRate?: (name: string) => void;
}

const products = [
  {
    name: 'Ilocos Souvenir Bundle',
    destination: 'Vigan Heritage',
    description: 'A curated set of woven crafts and local delicacies to remember your trip.',
    imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80',
    ratingAvg: 4.7,
    ratingCount: 128,
  },
  {
    name: 'Heritage Coffee Pack',
    destination: 'Candon Beach',
    description: 'Locally roasted beans with notes of cacao and caramel, packed fresh weekly.',
    imageUrl: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=600&q=80',
    ratingAvg: 4.4,
    ratingCount: 89,
  },
  {
    name: 'Handwoven Abel Blanket',
    destination: 'Paoay Looms',
    description: 'Soft handwoven blanket featuring classic Ilocano patterns and earthy tones.',
    imageUrl: 'https://images.unsplash.com/photo-1523381294911-8d3cead13475?auto=format&fit=crop&w=600&q=80',
    ratingAvg: 4.8,
    ratingCount: 215,
  },
  {
    name: 'Tobacco Heritage Candle',
    destination: 'Laoag City',
    description: 'Scented soy candle inspired by Ilocos’ warm tobacco and cedar aroma.',
    imageUrl: 'https://images.unsplash.com/photo-1505577058444-a3dab90d4253?auto=format&fit=crop&w=600&q=80',
    ratingAvg: 4.3,
    ratingCount: 64,
  },
  {
    name: 'Crispy Chichacorn Jar',
    destination: 'Bangui Market',
    description: 'Crunchy corn snacks made locally with garlic and chili seasoning.',
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80',
    ratingAvg: 4.6,
    ratingCount: 142,
  },
  {
    name: 'Ilocos Empanada Kit',
    destination: 'Batac Public Market',
    description: 'Bring home the iconic empanada with ready-to-cook wrappers and fillings.',
    imageUrl: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=600&q=80',
    ratingAvg: 4.5,
    ratingCount: 97,
  },
  {
    name: 'Heritage Pottery Set',
    destination: 'Sarrat Crafts',
    description: 'Handcrafted pottery set fired in traditional kilns with natural glaze.',
    imageUrl: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=600&q=80',
    ratingAvg: 4.2,
    ratingCount: 58,
  },
  {
    name: 'Ilocos Salted Caramel Spread',
    destination: 'Pagudpud Farms',
    description: 'Creamy salted caramel made with local sugarcane and sea salt.',
    imageUrl: 'https://images.unsplash.com/photo-1464306076886-da185f6a7807?auto=format&fit=crop&w=600&q=80',
    ratingAvg: 4.9,
    ratingCount: 176,
  },
];

export const ProductSection: React.FC<ProductSectionProps> = ({ onRate }) => {
  return (
    <section id="products" className="mt-10">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-semibold">Products</h2>
          <p className="text-sm text-white/60">Featured items curated for travelers.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.name}
            title={product.name}
            meta={`Destination: ${product.destination}`}
            description={product.description}
            imageUrl={product.imageUrl}
            ratingAvg={product.ratingAvg}
            ratingCount={product.ratingCount}
            onRate={onRate ? () => onRate(product.name) : undefined}
          />
        ))}
      </div>
    </section>
  );
};
