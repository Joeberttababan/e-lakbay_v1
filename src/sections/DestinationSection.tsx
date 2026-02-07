import React from 'react';
import { DestinationCard } from '../components/DestinationCard';

interface DestinationSectionProps {
  onRate?: (name: string) => void;
}

const destinations = [
  {
    name: 'San Vicente Cove',
    municipality: 'San Vicente',
    description: 'A serene coastal escape with turquoise waters and golden sunsets.',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    postedBy: 'Tourism Office',
    ratingAvg: 4.8,
    ratingCount: 203,
  },
  {
    name: 'Tagudin Trail',
    municipality: 'Tagudin',
    description: 'A lush mountain trail perfect for sunrise treks and panoramic views.',
    imageUrl: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=600&q=80',
    postedBy: 'Municipal Staff',
    ratingAvg: 4.5,
    ratingCount: 156,
  },
];

export const DestinationSection: React.FC<DestinationSectionProps> = ({ onRate }) => {
  return (
    <section id="destinations" className="mt-10">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-semibold">Destinations</h2>
          <p className="text-sm text-white/60">Popular spots you can highlight for visitors.</p>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {destinations.map((destination) => (
          <DestinationCard
            key={destination.name}
            title={destination.name}
            meta={`Municipality: ${destination.municipality}`}
            description={destination.description}
            imageUrl={destination.imageUrl}
            postedBy={destination.postedBy}
            ratingAvg={destination.ratingAvg}
            ratingCount={destination.ratingCount}
            onRate={onRate ? () => onRate(destination.name) : undefined}
          />
        ))}
      </div>
    </section>
  );
};
