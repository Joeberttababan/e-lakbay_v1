import React, { useState } from 'react';
import { HeroSection } from '../sections/HeroSection';
import { ProductSection } from '../sections/ProductSection';
import { DestinationSection } from '../sections/DestinationSection';
import { RatingModal } from '../components/RatingModal';

export const HomePage: React.FC = () => {
  const [ratingTarget, setRatingTarget] = useState<{ type: 'Product' | 'Destination'; name: string } | null>(null);

  return (
    <>
      <HeroSection />
      <main className="bg-slate-950 text-white px-4 sm:px-6 lg:px-10 pb-12">
        <div className="max-w-7xl mx-auto">
          <ProductSection onRate={(name) => setRatingTarget({ type: 'Product', name })} />
          <DestinationSection onRate={(name) => setRatingTarget({ type: 'Destination', name })} />
        </div>
      </main>

      <RatingModal
        open={Boolean(ratingTarget)}
        title={ratingTarget ? `Rate ${ratingTarget.type}: ${ratingTarget.name}` : 'Rate'}
        onClose={() => setRatingTarget(null)}
        onSubmit={() => setRatingTarget(null)}
      />
    </>
  );
};
