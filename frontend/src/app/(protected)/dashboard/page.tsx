import { headers } from "next/headers"
import {UserDashboard} from "@/components/dashboard/user-dashboard"
import Header from "@/components/shared/header"
import Footer from "@/components/shared/footer"

export const metadata = {
  title: "Dashboard",
}

export default async function Dashboard() {
  const headersList = await headers()
  const userInfoString = headersList.get("x-user-info")
  const user = userInfoString ? JSON.parse(userInfoString) : null

  return (
    <div className="flex flex-col min-h-screen justify-items-center">
      <Header user={user} />
      <UserDashboard user={user} />
      <Footer />
    </div>
  )
}

