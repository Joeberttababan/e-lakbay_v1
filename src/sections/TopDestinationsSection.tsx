import React, { useEffect, useMemo, useState } from 'react';
import { DestinationCard } from '../components/DestinationCard';
import { RatingModal } from '../components/RatingModal';
import { supabase } from '../lib/supabaseClient';

interface DestinationItem {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  createdAt: string | null;
  ratingAvg?: number;
  ratingCount?: number;
}

export const TopDestinationsSection: React.FC = () => {
  const [destinations, setDestinations] = useState<DestinationItem[]>([]);
  const [activeDestination, setActiveDestination] = useState<{
    name: string;
    imageUrl: string;
    description?: string | null;
    ratingAvg?: number;
    ratingCount?: number;
  } | null>(null);
  const [ratingTarget, setRatingTarget] = useState<{ name: string } | null>(null);

  useEffect(() => {
    const loadDestinations = async () => {
      try {
        const { data: destinationRows, error: destinationError } = await supabase
          .from('destinations')
          .select('id, destination_name, description, image_url, image_urls, created_at')
          .order('created_at', { ascending: false });

        if (destinationError) {
          throw destinationError;
        }

        const { data: ratingRows, error: ratingError } = await supabase
          .from('destination_ratings')
          .select('destination_id, rating');

        if (ratingError) {
          throw ratingError;
        }

        const ratingMap = new Map<string, { total: number; count: number }>();
        (ratingRows ?? []).forEach((row) => {
          const current = ratingMap.get(row.destination_id) ?? { total: 0, count: 0 };
          ratingMap.set(row.destination_id, {
            total: current.total + (row.rating ?? 0),
            count: current.count + 1,
          });
        });

        const mapped = (destinationRows ?? []).map((row) => {
          const rating = ratingMap.get(row.id);
          const ratingAvg = rating && rating.count > 0 ? rating.total / rating.count : undefined;
          const imageUrls = (row as { image_urls?: string[] }).image_urls ?? [];
          return {
            id: row.id,
            name: row.destination_name,
            description: row.description ?? null,
            imageUrl: imageUrls[0] ?? row.image_url ?? null,
            createdAt: row.created_at ?? null,
            ratingAvg,
            ratingCount: rating?.count,
          } as DestinationItem;
        });

        const sorted = [...mapped].sort((a, b) => {
          const aRated = typeof a.ratingAvg === 'number';
          const bRated = typeof b.ratingAvg === 'number';
          if (aRated && bRated) {
            return (b.ratingAvg ?? 0) - (a.ratingAvg ?? 0);
          }
          if (aRated) return -1;
          if (bRated) return 1;
          const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return bDate - aDate;
        });

        setDestinations(sorted.slice(0, 10));
      } catch (error) {
        console.error('Failed to load destinations:', error);
      }
    };

    loadDestinations();
  }, []);

  const visibleDestinations = useMemo(() => destinations.filter((item) => item.imageUrl), [destinations]);

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
            {visibleDestinations.map((destination) => (
              <button
                key={destination.id}
                type="button"
                onClick={() =>
                  setActiveDestination({
                    name: destination.name,
                    imageUrl: destination.imageUrl ?? '',
                    description: destination.description,
                    ratingAvg: destination.ratingAvg,
                    ratingCount: destination.ratingCount,
                  })}
                className="relative min-w-[60%] sm:min-w-[40%] lg:min-w-[35%] aspect-square overflow-hidden border border-white/10 bg-white/5 focus:outline-none focus:ring-2 focus:ring-white/40"
              >
                <img
                  src={destination.imageUrl ?? ''}
                  alt={destination.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-4">
                  <p className="text-base font-semibold text-white">{destination.name}</p>
                </div>
              </button>
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

      {activeDestination && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
          role="presentation"
          onClick={() => setActiveDestination(null)}
        >
          <div
            className="max-w-5xl w-full"
            role="dialog"
            aria-modal="true"
            aria-labelledby="top-destination-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <DestinationCard
              title={activeDestination.name}
              description={activeDestination.description || 'A featured destination from Ilocos Sur.'}
              imageUrl={activeDestination.imageUrl}
              meta="Featured destination"
              postedBy="Tourism Office"
              ratingAvg={activeDestination.ratingAvg ?? 4.7}
              ratingCount={activeDestination.ratingCount ?? 128}
              onRate={() => setRatingTarget({ name: activeDestination.name })}
            />
          </div>
        </div>
      )}

      <RatingModal
        open={Boolean(ratingTarget)}
        title={ratingTarget ? `Rate Destination: ${ratingTarget.name}` : 'Rate'}
        onClose={() => setRatingTarget(null)}
        onSubmit={() => setRatingTarget(null)}
      />
    </section>
  );
};
