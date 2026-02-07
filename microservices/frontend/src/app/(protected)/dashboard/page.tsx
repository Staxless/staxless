'use client';

import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  getUserSettings,
  type UserSettings,
} from '@/app/actions/get-user-settings';
import {
  getChangelog,
  type ChangelogEntry,
} from '@/app/actions/get-changelog';
import ChangelogFeed from '@/components/dashboard/changelog-feed';
import DashboardWelcome from '@/components/dashboard/dashboard-welcome';
import GettingStartedChecklist from '@/components/dashboard/getting-started-checklist';
import ProjectShowcase from '@/components/dashboard/project-showcase';
import PurchaseDetailsCard from '@/components/dashboard/purchase-details-card';
import QuickLinksGrid from '@/components/dashboard/quick-links-grid';
import RepoAccessCard from '@/components/dashboard/repo-access-card';
import SupportCard from '@/components/dashboard/support-card';
import ConfettiTrigger from '@/components/effects/confetti-trigger';
import Footer from '@/components/shared/footer';
import Header from '@/components/shared/header';
import { useUser } from '@/contexts/user-context';
import { BRAND_CONFIG } from '@config/brand-config';

export default function DashboardPage() {
  const { user } = useUser();
  const colors = BRAND_CONFIG.brand.colors;
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [changelog, setChangelog] = useState<ChangelogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsResult, changelogResult] = await Promise.all([
          getUserSettings(),
          getChangelog(15),
        ]);
        if (settingsResult.success) {
          setSettings(settingsResult.data);
        }
        if (changelogResult.success) {
          setChangelog(changelogResult.data);
        }
      } catch {
        // Fall back to user context data
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const subscriptionStatus =
    settings?.subscription.status || user?.subscription.status || 'none';
  const email = settings?.email || user?.email || '';
  const startDate =
    settings?.subscription.startDate ||
    (user?.subscription.startDate
      ? new Date(user.subscription.startDate).toISOString()
      : '');

  return (
    <div
      style={{
        backgroundColor: colors.background,
        minHeight: '100vh',
      }}
    >
      <ConfettiTrigger />
      <Header />
      <div className="pt-20">
        <div className="mx-auto max-w-5xl p-6">
          {/* Dashboard Header */}
          <div className="mb-8">
            <h1
              className="mb-2 font-bold text-3xl"
              style={{ color: colors.textPrimary }}
            >
              Dashboard
            </h1>
            <DashboardWelcome />
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2
                className="h-8 w-8 animate-spin"
                style={{ color: colors.primary }}
              />
            </div>
          ) : (
            <div className="space-y-6">
              <RepoAccessCard
                userEmail={email}
                subscriptionStatus={subscriptionStatus}
              />

              <GettingStartedChecklist />

              <PurchaseDetailsCard
                subscriptionStatus={subscriptionStatus}
                startDate={startDate}
                email={email}
              />

              <QuickLinksGrid />

              <ProjectShowcase />

              <ChangelogFeed entries={changelog} />

              <SupportCard />
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
