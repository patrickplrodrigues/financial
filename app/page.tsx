import { requireAuth } from "@/lib/require-auth"
import { FinanceTracker } from "@/components/finance-tracker"
import { UserMenu } from "@/components/user-menu"

export default async function Home() {
  const session = await requireAuth()

  return (
    <main className="min-h-screen bg-background">
      <div className="fixed top-4 right-4 z-50">
        <UserMenu user={session.user} />
      </div>
      <FinanceTracker />
    </main>
  )
}
