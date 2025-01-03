/**
 * @file app/dashboard/page.tsx
 * @description Dashboard page component that displays the main dashboard content with navigation and footer.
 */

import { headers } from "next/headers";
import DashboardContent from "@/components/DashboardContent";
import Footer from "@/components/Footer";
import Navbar from "@/app/Navbar";

/**
 * Dashboard component
 * @returns {JSX.Element} The rendered dashboard page
 */
export default function Dashboard() {
  const headersList = headers();
  const userInfoString = headersList.get("x-user-info");
  const user = userInfoString ? JSON.parse(userInfoString) : null;

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
