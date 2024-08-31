// /pages/dashboard.js
import getUser from "@/app/validateRequest";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  let user;
  try {
    user = await getUser();
    console.log("page user", user);
  } catch (error) {
    console.log(error);
  }

  if (!user) {
    console.log("no user");
    return redirect("/login");
  }

  return (
    <>
      <h1>Hello {user} </h1>
    </>
  );
}

interface ActionResult {
  error: string | null;
}
