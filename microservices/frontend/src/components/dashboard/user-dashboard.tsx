'use client';

import { Database, FolderGit2, User } from 'lucide-react';
import { AccountSettings } from '@/components/dashboard/account-settings';
import { DataSettings } from '@/components/dashboard/data-settings';
import { ProjectSettings } from '@/components/dashboard/project-settings';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface UserDashboardProps {
  user: {
    name: string;
    email: string;
    avatar: string;
    language: string;
  };
}

export function UserDashboard({ user }: UserDashboardProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background pt-20">
      <main className="flex-1 p-4 md:p-6">
        <Card className="mx-auto max-w-4xl">
          <CardContent className="p-0">
            <div className="p-6 pb-0">
              <h1 className="font-bold text-2xl">Settings</h1>
            </div>
            <Tabs className="w-full" defaultValue="account">
              <div className="flex border-b">
                <TabsList className="h-auto justify-start rounded-none border-b-0 bg-transparent p-0">
                  <TabsTrigger
                    className="flex items-center gap-2 rounded-none border-transparent border-b-2 px-4 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                    value="account"
                  >
                    <User className="h-4 w-4" />
                    <span>Account</span>
                  </TabsTrigger>
                  <TabsTrigger
                    className="flex items-center gap-2 rounded-none border-transparent border-b-2 px-4 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                    value="projects"
                  >
                    <FolderGit2 className="h-4 w-4" />
                    <span>Projects</span>
                  </TabsTrigger>
                  <TabsTrigger
                    className="flex items-center gap-2 rounded-none border-transparent border-b-2 px-4 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                    value="data"
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
