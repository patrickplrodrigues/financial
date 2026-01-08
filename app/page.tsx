import { getServerSession } from "next-auth"
import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { FinanceTracker } from "@/components/finance-tracker"
import { UserMenu } from "@/components/user-menu"

export default async function Home() {
  const session = await getSession()

if (!session) {
  redirect("/login")
}

  return (
    <main className="min-h-screen bg-background">
      <div className="fixed top-4 right-4 z-50">
        <UserMenu user={session.user} />
      </div>
      <FinanceTracker />
    </main>
  )
}
