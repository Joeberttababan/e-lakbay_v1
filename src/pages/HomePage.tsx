import React from 'react';
import { HeroSection } from '../sections/HeroSection';
import { TopDestinationsSection } from '../sections/TopDestinationsSection';

const localProducts = [
  {
    name: 'Ilocos Souvenir Bundle',
    imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Heritage Coffee Pack',
    imageUrl: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Handwoven Abel Blanket',
    imageUrl: 'https://images.unsplash.com/photo-1523381294911-8d3cead13475?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Tobacco Heritage Candle',
    imageUrl: 'https://images.unsplash.com/photo-1505577058444-a3dab90d4253?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Crispy Chichacorn Jar',
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Ilocos Empanada Kit',
    imageUrl: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Heritage Pottery Set',
    imageUrl: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Salted Caramel Spread',
    imageUrl: 'https://images.unsplash.com/photo-1464306076886-da185f6a7807?auto=format&fit=crop&w=600&q=80',
  },
];

export const HomePage: React.FC = () => {
  return (
    <>
      <HeroSection />
      <main className="bg-slate-950 text-white px-4 sm:px-6 lg:px-10 pb-12">
        <div className="max-w-7xl mx-auto">
          <TopDestinationsSection />
          <section className="mt-12">
            <div className="text-center max-w-2xl mx-auto">
              <h1 className="text-3xl font-semibold">Local Products</h1>
              <p className="mt-3 text-sm text-white/70">
                "Experience the best of Ilocos Sur'r products"
              </p>
            </div>
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {localProducts.map((product) => (
                <div key={product.name} className="flex flex-col gap-3">
                  <div className="aspect-square rounded-2xl overflow-hidden border border-white/10 bg-white/5">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <p className="text-sm font-semibold text-white/90 text-center">{product.name}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
};
