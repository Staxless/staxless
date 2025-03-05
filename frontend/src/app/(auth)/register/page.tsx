/**
 * @file app/register/page.tsx
 * @description Registration page component that displays a card with a registration form.
 */

import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import RegisterForm from "./register-form";

export const metadata = {
  title: 'Register',
};
/**
 * RegisterPage component
 * @returns {JSX.Element} The rendered registration page
 */


export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  )
}


