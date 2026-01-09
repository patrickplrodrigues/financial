import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"

export async function requireAuth() {
  const session = await getSession()

  if (!session?.user) {
    redirect("/login")
  }

  if (!session.user.isAuthorized) {
    redirect("/unauthorized")
  }

  return session
}
