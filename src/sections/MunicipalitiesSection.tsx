import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ProfileChipSkeleton, SkeletonList } from '../components/hero-ui/Skeletons';
import { supabase } from '../lib/supabaseClient';
import { toast } from 'sonner';

interface ProfileItem {
  id: string;
  name: string;
  imageUrl: string | null;
}

interface MunicipalitiesSectionProps {
  onSelectProfile?: (profileId: string) => void;
}

export const MunicipalitiesSection: React.FC<MunicipalitiesSectionProps> = ({ onSelectProfile }) => {
  const {
    data: profiles = [],
    isPending: isProfilesPending,
    isFetching: isProfilesFetching,
  } = useQuery({
    queryKey: ['profiles', 'municipalities'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, email, img_url')
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        return (data ?? []).map((row) => ({
          id: row.id,
          name: row.full_name || row.email || 'Traveler',
          imageUrl: row.img_url ?? null,
        })) as ProfileItem[];
      } catch (fetchError) {
        console.error('Failed to load profiles:', fetchError);
        toast.error('Failed to load hosts.');
        return [] as ProfileItem[];
      }
    },
  });

  const loopProfiles = useMemo(() => {
    if (profiles.length === 0) return [];
    return [...profiles, ...profiles];
  }, [profiles]);

  const showProfileSkeletons = isProfilesPending || (isProfilesFetching && profiles.length === 0);

  if (!showProfileSkeletons && loopProfiles.length === 0) {
    return null;
  }

  return (
    <section className=" text-white -mx-4 sm:-mx-6 lg:-mx-10">
      <div className="overflow-hidden municipalities-fade">
        <div className="municipalities-marquee">
          <div className="municipalities-track px-1 sm:px-2">
            {showProfileSkeletons ? (
              <SkeletonList
                count={12}
                render={(index) => <ProfileChipSkeleton key={`profile-skeleton-${index}`} />}
              />
            ) : (
              loopProfiles.map((profile, index) => (
                <button
                  key={`${profile.id}-${index}`}
                  type="button"
                  onClick={() => onSelectProfile?.(profile.id)}
                  className="flex flex-col items-center gap-1 text-center min-w-[72px]"
                >
                  <div className="h-14 w-14 rounded-full border border-white/15 bg-white/10 overflow-hidden flex items-center justify-center text-xs font-semibold">
                    {profile.imageUrl ? (
                      <img src={profile.imageUrl} alt={profile.name} className="h-full w-full object-cover" />
                    ) : (
                      profile.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <span className="text-[10px] sm:text-xs text-white/80 leading-tight line-clamp-2">
                    {profile.name}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
