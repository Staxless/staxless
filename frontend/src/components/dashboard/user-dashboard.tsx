"use client"

import { User, FolderGit2, Database } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AccountSettings } from "@/components/dashboard/account-settings"
import { ProjectSettings } from "@/components/dashboard/project-settings"
import { DataSettings } from "@/components/dashboard/data-settings"

interface UserDashboardProps {
  user: {
    name: string
    email: string
    avatar: string
    language: string
  }
}

export function UserDashboard({ user }: UserDashboardProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background pt-20">
      <main className="flex-1 p-4 md:p-6">
        <Card className="mx-auto max-w-4xl">
          <CardContent className="p-0">
            <div className="p-6 pb-0">
              <h1 className="text-2xl font-bold">Settings</h1>
            </div>
            <Tabs defaultValue="account" className="w-full">
              <div className="flex border-b">
                <TabsList className="h-auto justify-start rounded-none border-b-0 bg-transparent p-0">
                  <TabsTrigger
                    value="account"
                    className="flex items-center gap-2 rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                  >
                    <User className="h-4 w-4" />
                    <span>Account</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="projects"
                    className="flex items-center gap-2 rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                  >
                    <FolderGit2 className="h-4 w-4" />
                    <span>Projects</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="data"
                    className="flex items-center gap-2 rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                  >
                    <Database className="h-4 w-4" />
                    <span>Data</span>
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="account" className="p-6">
                <AccountSettings user={user} />
              </TabsContent>
              <TabsContent value="projects" className="p-6">
                <ProjectSettings />
              </TabsContent>
              <TabsContent value="data" className="p-6">
                <DataSettings />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

