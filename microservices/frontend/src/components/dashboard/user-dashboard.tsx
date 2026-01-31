'use client';

import { Database, FolderGit2, User } from 'lucide-react';
import { AccountSettings } from '@/components/dashboard/account-settings';
import { DataSettings } from '@/components/dashboard/data-settings';
import { ProjectSettings } from '@/components/dashboard/project-settings';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BRAND_CONFIG } from '@config/brand-config';

interface UserDashboardProps {
  user: {
    name: string;
    email: string;
    avatar: string;
    language: string;
  };
}

export function UserDashboard({ user }: UserDashboardProps) {
  const colors = BRAND_CONFIG.brand.colors;

  return (
    <div
      className="flex min-h-screen flex-col pt-20"
      style={{ backgroundColor: colors.background }}
    >
      <main className="flex-1 p-4 md:p-6">
        <Card
          className="mx-auto max-w-4xl border"
          style={{
            backgroundColor: colors.backgroundSecondary,
            borderColor: colors.border,
          }}
        >
          <CardContent className="p-0">
            <div className="p-6 pb-0">
              <h1
                className="font-bold text-2xl"
                style={{ color: colors.textPrimary }}
              >
                Settings
              </h1>
            </div>
            <Tabs className="w-full" defaultValue="account">
              <div
                className="flex border-b"
                style={{ borderColor: colors.border }}
              >
                <TabsList
                  className="h-auto justify-start rounded-none border-b-0 p-0"
                  style={{ backgroundColor: 'transparent' }}
                >
                  <TabsTrigger
                    className="flex items-center gap-2 rounded-none border-transparent border-b-2 px-4 py-3 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                    value="account"
                    style={{ color: colors.textSecondary }}
                  >
                    <User className="h-4 w-4" />
                    <span>Account</span>
                  </TabsTrigger>
                  <TabsTrigger
                    className="flex items-center gap-2 rounded-none border-transparent border-b-2 px-4 py-3 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                    value="projects"
                    style={{ color: colors.textSecondary }}
                  >
                    <FolderGit2 className="h-4 w-4" />
                    <span>Projects</span>
                  </TabsTrigger>
                  <TabsTrigger
                    className="flex items-center gap-2 rounded-none border-transparent border-b-2 px-4 py-3 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                    value="data"
                    style={{ color: colors.textSecondary }}
                  >
                    <Database className="h-4 w-4" />
                    <span>Data</span>
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent className="p-6" value="account">
                <AccountSettings user={user} />
              </TabsContent>
              <TabsContent className="p-6" value="projects">
                <ProjectSettings />
              </TabsContent>
              <TabsContent className="p-6" value="data">
                <DataSettings />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
