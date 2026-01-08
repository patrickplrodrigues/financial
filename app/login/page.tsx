import { Suspense } from "react"
import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="animate-pulse text-muted-foreground">A carregar...</div>
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  )
}
