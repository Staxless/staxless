/**
 * @file DashboardContent Component
 * @module DashboardContent
 * @description A React component that renders a tabbed dashboard interface with overview, projects, and tasks sections.
 */

"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, PieChart, LineChart } from "lucide-react";

/**
 * @function DashboardContent
 * @description Renders a dashboard with tabs for overview, projects, and tasks.
 * @returns {JSX.Element} The DashboardContent component
 */
export default function DashboardContent(): JSX.Element {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-8">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="projects">Projects</TabsTrigger>
        <TabsTrigger value="tasks">Tasks</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Projects
              </CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                +2 from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Tasks
              </CardTitle>
              <PieChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">-2 from last week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Completed Tasks
              </CardTitle>
              <LineChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">27</div>
              <p className="text-xs text-muted-foreground">
                +5 from last month
              </p>
            </CardContent>
          </Card>
        </div>
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>Project A updated - 2 hours ago</li>
              <li>New task added to Project B - 5 hours ago</li>
              <li>Completed Task C in Project D - 1 day ago</li>
            </ul>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="projects">
        <Card>
          <CardHeader>
            <CardTitle>Your Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>Project A - In Progress</li>
              <li>Project B - Planning</li>
              <li>Project C - Completed</li>
              <li>Project D - On Hold</li>
            </ul>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="tasks">
        <Card>
          <CardHeader>
            <CardTitle>Your Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>Task 1 - Due in 2 days</li>
              <li>Task 2 - Overdue</li>
              <li>Task 3 - In Progress</li>
              <li>Task 4 - Not Started</li>
            </ul>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
