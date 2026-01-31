'use client';

import { Loader2, User, CreditCard, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getUserSettings, type UserSettings } from '@/app/actions/get-user-settings';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { BRAND_CONFIG } from '@config/brand-config';
import { logError } from '@/lib/error-handling';

interface SettingsDialogProps {
  children: React.ReactNode;
}

type SettingsTab = 'account';

export function SettingsDialog({ children }: SettingsDialogProps) {
  const colors = BRAND_CONFIG.brand.colors;
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<SettingsTab>('account');
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<UserSettings | null>(null);

  useEffect(() => {
    if (!open) return;

    const fetchSettings = async () => {
      setIsLoading(true);
      try {
        const result = await getUserSettings();
        if (result.success) {
          setSettings(result.data);
        } else {
          logError(new Error(result.error), { action: 'fetchUserSettings' });
        }
      } catch (error) {
        logError(error, { action: 'fetchUserSettings' });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [open]);

  const handleManageAccount = () => {
    console.log('Manage account clicked');
  };

  const handleManageSubscription = () => {
    console.log('Manage subscription clicked');
  };

  const isPremium =
    settings?.subscription.status === 'active' &&
    settings?.subscription.type !== 'free';

  const getDisplayName = (): string => {
    if (!settings) return '';
    if (settings.firstname && settings.lastname) {
      return `${settings.firstname} ${settings.lastname}`;
    }
    if (settings.firstname) return settings.firstname;
    return settings.email.split('@')[0];
  };

  const getInitials = (): string => {
    if (!settings) return 'U';
    if (settings.firstname) {
      return settings.firstname.charAt(0).toUpperCase();
    }
    return settings.email.charAt(0).toUpperCase();
  };

  const getPlanDisplayName = (): string => {
    if (!settings) return 'Free';
    const type = settings.subscription.type;
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const tabs = [
    { id: 'account' as const, label: 'Account', icon: User },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl p-0 overflow-hidden">
        <div className="flex min-h-[480px]">
          {/* Sidebar */}
          <div
            className="w-48 p-4 flex-shrink-0"
            style={{ backgroundColor: colors.backgroundTertiary }}
          >
            <DialogTitle className="px-3 mb-4 text-xl font-semibold">
              Settings
            </DialogTitle>
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
                    style={{
                      backgroundColor: isActive ? colors.backgroundSecondary : 'transparent',
                      color: isActive ? colors.textPrimary : colors.textMuted,
                    }}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2
                  className="h-8 w-8 animate-spin"
                  style={{ color: colors.primary }}
                />
              </div>
            ) : settings ? (
              <div className="space-y-6">
                {activeTab === 'account' && (
                  <>
                    {/* Profile Section */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar
                          className="h-14 w-14"
                          style={{
                            backgroundColor: colors.primary,
                            color: colors.background,
                          }}
                        >
                          <AvatarImage alt={getDisplayName()} src={settings.avatar} />
                          <AvatarFallback
                            style={{
                              backgroundColor: colors.primary,
                              color: colors.background,
                            }}
                          >
                            {getInitials()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p
                            className="font-medium text-base"
                            style={{ color: colors.textPrimary }}
                          >
                            {getDisplayName()}
                          </p>
                          <p className="text-sm" style={{ color: colors.textMuted }}>
                            {settings.email}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        onClick={handleManageAccount}
                        style={{
                          borderColor: colors.border,
                          color: colors.textPrimary,
                          backgroundColor: 'transparent',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = colors.backgroundTertiary;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        Manage
                      </Button>
                    </div>

                    <Separator style={{ backgroundColor: colors.border }} />

                    {/* Subscription Section */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className="flex h-10 w-10 items-center justify-center rounded-lg"
                          style={{ backgroundColor: colors.backgroundTertiary }}
                        >
                          <CreditCard
                            className="h-5 w-5"
                            style={{ color: colors.textMuted }}
                          />
                        </div>
                        <div>
                          <p
                            className="font-medium text-base"
                            style={{ color: colors.textPrimary }}
                          >
                            {isPremium ? `${getPlanDisplayName()} Plan` : 'Get Premium'}
                          </p>
                          <p className="text-sm" style={{ color: colors.textMuted }}>
                            {isPremium
                              ? 'Active subscription'
                              : 'Unlock all features'}
                          </p>
                        </div>
                      </div>
                      {isPremium ? (
                        <Button
                          variant="outline"
                          onClick={handleManageSubscription}
                          style={{
                            borderColor: colors.border,
                            color: colors.textPrimary,
                            backgroundColor: 'transparent',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = colors.backgroundTertiary;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          Manage
                        </Button>
                      ) : (
                        <Link href="/#pricing" onClick={() => setOpen(false)}>
                          <Button
                            variant="outline"
                            style={{
                              borderColor: colors.border,
                              color: colors.textPrimary,
                              backgroundColor: 'transparent',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = colors.backgroundTertiary;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                          >
                            Upgrade
                          </Button>
                        </Link>
                      )}
                    </div>

                    {/* Upgrade Banner - Only for free users */}
                    {!isPremium && (
                      <>
                        <Separator style={{ backgroundColor: colors.border }} />
                        <div
                          className="rounded-lg p-4 flex items-center justify-between"
                          style={{
                            background: `linear-gradient(135deg, ${colors.backgroundTertiary} 0%, ${colors.background} 100%)`,
                            border: `1px solid ${colors.border}`,
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <Sparkles
                              className="h-5 w-5"
                              style={{ color: colors.primary }}
                            />
                            <div>
                              <p
                                className="font-medium text-sm"
                                style={{ color: colors.textPrimary }}
                              >
                                {BRAND_CONFIG.company.name} Premium
                              </p>
                              <p
                                className="text-xs"
                                style={{ color: colors.textMuted }}
                              >
                                Unlock all features
                              </p>
                            </div>
                          </div>
                          <Link href="/#pricing" onClick={() => setOpen(false)}>
                            <Button
                              size="sm"
                              style={{
                                backgroundColor: colors.primary,
                                color: colors.background,
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = colors.primaryHover;
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = colors.primary;
                              }}
                            >
                              Go Premium
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p style={{ color: colors.textMuted }}>Failed to load settings</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
