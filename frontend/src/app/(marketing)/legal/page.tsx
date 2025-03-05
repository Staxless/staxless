import { redirect } from "next/navigation"

export default function DocsIndexPage() {
  // Redirect to the introduction page
  redirect("/legal/terms")
}

