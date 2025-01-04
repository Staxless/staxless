/**
 * @file app/auth/page.tsx
 * @description Authentication page that redirects to the login page
 */

import { redirect } from "next/navigation";

/**
 * AuthPage component
 * Automatically redirects to the login page
 */
export default function AuthPage() {
  redirect("/auth/login");
}
