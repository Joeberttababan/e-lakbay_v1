import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DestinationTileSkeleton, SkeletonList } from '../components/hero-ui/Skeletons';
import { DestinationTile } from '../components/DestinationTile';
import { RatingModal } from '../components/RatingModal';
import { supabase } from '../lib/supabaseClient';
import { toast } from 'sonner';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../components/modern-ui/breadcrumb';

interface DestinationsPageProps {
  onBackHome?: () => void;
}

interface DestinationItem {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  imageUrls: string[];
  createdAt: string | null;
  ratingAvg?: number;
  ratingCount?: number;
  postedByName?: string;
  postedByImageUrl?: string | null;
}

export const DestinationsPage: React.FC<DestinationsPageProps> = ({ onBackHome }) => {
  const [ratingTarget, setRatingTarget] = useState<{ name: string } | null>(null);
  const {
    data: destinations = [],
    isPending: isDestinationsPending,
    isFetching: isDestinationsFetching,
  } = useQuery({
    queryKey: ['destinations', 'all'],
    queryFn: async () => {
      try {
        const { data: destinationRows, error: destinationError } = await supabase
          .from('destinations')
          .select('id, destination_name, description, image_url, image_urls, created_at, user_id')
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

        const userIds = Array.from(
          new Set((destinationRows ?? []).map((row) => row.user_id).filter(Boolean)),
        ) as string[];

        const profilesById = new Map<string, { full_name?: string | null; email?: string | null; img_url?: string | null }>();
        if (userIds.length > 0) {
          const { data: profileRows, error: profileError } = await supabase
            .from('profiles')
            .select('id, full_name, email, img_url')
            .in('id', userIds);

          if (profileError) {
            throw profileError;
          }

          (profileRows ?? []).forEach((profile) => {
            profilesById.set(profile.id, profile);
          });
        }

        return (destinationRows ?? []).map((row) => {
          const rating = ratingMap.get(row.id);
          const ratingAvg = rating && rating.count > 0 ? rating.total / rating.count : undefined;
          const typedRow = row as { image_urls?: string[]; user_id?: string | null };
          const imageUrls = typedRow.image_urls ?? [];
          const profile = typedRow.user_id ? profilesById.get(typedRow.user_id) : undefined;
          const postedByName = profile?.full_name || profile?.email || 'Traveler';
          return {
            id: row.id,
            name: row.destination_name,
            description: row.description ?? null,
            imageUrl: imageUrls[0] ?? row.image_url ?? null,
            imageUrls,
            createdAt: row.created_at ?? null,
            ratingAvg,
            ratingCount: rating?.count,
            postedByName,
            postedByImageUrl: profile?.img_url ?? null,
          } as DestinationItem;
        });
      } catch (error) {
        console.error('Failed to load destinations:', error);
        toast.error('Failed to load destinations.');
        return [] as DestinationItem[];
      }
    },
  });

  const visibleDestinations = useMemo(() => destinations.filter((item) => item.imageUrl), [destinations]);
  const showDestinationSkeletons =
    isDestinationsPending || (isDestinationsFetching && destinations.length === 0);

  return (
    <main className="min-h-screen bg-slate-950 text-white pt-12 md:pt-20 pb-12 px-4 sm:px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        {onBackHome && (
            <div className="flex justify-start">
              <Breadcrumb className="my-2">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href="#"
                    onClick={(event) => {
                      event.preventDefault();
                      onBackHome();
                    }}
                  >
                    Home
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Destinations</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        )}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <h1 className="mt-2 text-3xl sm:text-4xl font-semibold">Destinations</h1>
            <p className="mt-2 text-sm text-white/70">
              Explore every destination shared by the community.
            </p>
          </div>
        </div>

        <section className="mt-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {showDestinationSkeletons ? (
              <SkeletonList
                count={6}
                render={(index) => <DestinationTileSkeleton key={`destination-skeleton-${index}`} />}
              />
            ) : (
              visibleDestinations.map((destination) => (
                <DestinationTile
                  key={destination.id}
                  title={destination.name}
                  description={destination.description ?? 'A featured destination from Ilocos Sur.'}
                  imageUrl={destination.imageUrl ?? ''}
                  imageUrls={destination.imageUrls}
                  meta="Uploaded destination"
                  postedBy={destination.postedByName ?? 'Community'}
                  postedByImageUrl={destination.postedByImageUrl}
                  ratingAvg={destination.ratingAvg}
                  ratingCount={destination.ratingCount}
                  enableModal
                  onRate={() => setRatingTarget({ name: destination.name })}
                />
              ))
            )}
          </div>
        </section>
      </div>

      <RatingModal
        open={Boolean(ratingTarget)}
        title={ratingTarget ? `Rate Destination: ${ratingTarget.name}` : 'Rate'}
        onClose={() => setRatingTarget(null)}
        onSubmit={() => setRatingTarget(null)}
      />
    </main>
  );
};
