/**
 * @file Root Layout Component
 * @description This component provides the root layout for all pages,
 * including the Navbar, Footer, and main content area.
 */

import { Inter } from "next/font/google";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

/**
 * Props interface for RootLayout
 * @property children - ReactNode representing child components
 * @property params - Key-value object for dynamic route parameters
 */
type Props = {
  children: React.ReactNode;
  params: { [key: string]: string | string[] | undefined };
};

/**
 * RootLayout component
 * @description Provides the main structure of the application,
 * wrapping content with Navbar, Footer, and main layout.
 * @param children - The page content to be rendered inside the layout
 * @param params - Optional parameters for dynamic routes
 * @returns JSX.Element for the layout structure
 */
export default function RootLayout({ children }: Props) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen bg-white">
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
