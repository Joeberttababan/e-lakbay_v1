import React from 'react';

const destinations = [
  {
    name: 'Vigan Heritage Streets',
    imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Bangui Windmills',
    imageUrl: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Patapat Viaduct',
    imageUrl: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Paoay Lake',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Cape Bojeador',
    imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Hidden Falls',
    imageUrl: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80',
  },
];

export const TopDestinationsSection: React.FC = () => {
  return (
    <section className="mt-12">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-extrabold">Top Destinations</h2>
        <p className="mt-3 text-sm text-white/70">
          "Discover the heart of Ilocos Sur — where culture, nature, and history meet."
        </p>
      </div>

      <div className="mt-8">
        <div className="overflow-x-auto hide-scrollbar">
          <div className="flex gap-5 pr-[12.5%] pl-[12.5%] -ml-[12.5%]">
            {destinations.map((destination) => (
              <div
                key={destination.name}
                className="relative min-w-[60%] sm:min-w-[40%] lg:min-w-[35%] aspect-square overflow-hidden border border-white/10 bg-white/5"
              >
                <img
                  src={destination.imageUrl}
                  alt={destination.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-4">
                  <p className="text-base font-semibold text-white">{destination.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-6 flex flex-col items-center gap-1 text-sm md:text-base text-white/80">
          <p>Want to see more destinations?
            <span href="#destinations" className="text-white underline underline-offset-4 hover:text-white/90">
                click here to view more
            </span>
          </p>
        </div>
      </div>
    </section>
  );
};
