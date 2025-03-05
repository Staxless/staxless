/**
 * @file app/login/page.tsx
 * @description Login page component that displays a card with a login form.
 */

import { Suspense } from "react";
import LoginForm from "./login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTheme } from "@/contexts/ThemeContext";

export const metadata = {
  title: 'Login',
};

/**
 * LoginPage component
 * @returns {JSX.Element} The rendered login page
 */

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  )
}

