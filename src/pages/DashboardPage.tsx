import React, { useState } from 'react';
import type { Profile } from '../components/AuthProvider';
import { DashboardAnalyticsSection } from '../sections/dashboard_analyticssection';
import { DashboardProductSection } from '../sections/dashboard_productsection';
import { DashboardDestinationSection } from '../sections/dashboard_destinationsection';
import { DashboardSidebar } from '../components/DashboardSidebar';
import { ProductUploadModal } from '../components/ProductUploadModal';
import { DestinationUploadModal } from '../components/DestinationUploadModal';
import { useAuth } from '../components/AuthProvider';

interface DashboardPageProps {
  profile: Profile | null;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ profile }) => {
  const { user } = useAuth();
  const displayName = profile?.full_name || profile?.email || 'Traveler';
  const battleCry = profile?.battle_cry || 'Ready for the next adventure.';
  const [isProductOpen, setIsProductOpen] = useState(false);
  const [isDestinationOpen, setIsDestinationOpen] = useState(false);

  return (
    <section className="min-h-screen bg-slate-950 text-white pt-24 pb-12 px-4 sm:px-6 lg:px-10">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        <DashboardSidebar
          displayName={displayName}
          battleCry={battleCry}
          imgUrl={profile?.img_url}
          userId={user?.id ?? profile?.id ?? null}
          fullName={profile?.full_name ?? null}
          onOpenProductUpload={() => setIsProductOpen(true)}
          onOpenDestinationUpload={() => setIsDestinationOpen(true)}
        />

        <div className="flex-1">
          <DashboardAnalyticsSection displayName={displayName} />
          <DashboardProductSection userId={user?.id ?? profile?.id ?? null} />
          <DashboardDestinationSection userId={user?.id ?? profile?.id ?? null} />
        </div>
      </div>

      <ProductUploadModal open={isProductOpen} onClose={() => setIsProductOpen(false)} />
      <DestinationUploadModal open={isDestinationOpen} onClose={() => setIsDestinationOpen(false)} />

    </section>
  );
};
