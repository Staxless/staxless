/**
 * @file app/dashboard/page.tsx
 * @description Dashboard page component that displays the main dashboard content with navigation and footer.
 */

import { headers } from "next/headers";
import DashboardContent from "@/components/dashboard/dashboard-content";
import Footer from "@/components/shared/footer";
import Navbar from "@/components/shared/navbar";

export const metadata = {
  title: 'Dashboard',
};

/**
 * Dashboard component
 * @returns {Promise<JSX.Element>} The rendered dashboard page
 */
export default async function Dashboard() {
  const headersList = await headers();
  const userInfoString = headersList.get("x-user-info");

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow bg-gray-100 p-8">
        <DashboardContent />
      </main>
      <Footer />
    </div>
  );
}
