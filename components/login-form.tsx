"use client"

import { signIn, useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const isCodespaces =
  typeof window !== "undefined" &&
  window.location.hostname.includes("github.dev")

export function LoginForm() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const error = searchParams.get("error")
  const [isSigningIn, setIsSigningIn] = useState(false)

  useEffect(() => {
    if (session || isCodespaces) {
      router.push("/")
    }
  }, [session, router])

  if (isCodespaces) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background px-4">
        <p className="text-sm text-muted-foreground text-center max-w-sm">
          O login está desativado em ambiente de desenvolvimento
          (GitHub Codespaces).
        </p>
      </main>
    )
  }

  if (status === "loading") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md animate-pulse">
          <CardHeader className="space-y-2">
            <div className="h-6 bg-muted rounded-md w-2/3 mx-auto" />
            <div className="h-4 bg-muted rounded-md w-3/4 mx-auto" />
          </CardHeader>
          <CardContent>
            <div className="h-10 bg-muted rounded-md" />
          </CardContent>
        </Card>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-lg animate-in fade-in zoom-in-95 duration-300">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold tracking-tight">
            Finanças 2026
          </CardTitle>
          <CardDescription className="text-sm">
            Acede à plataforma com a tua conta Google
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          {error && (
            <div
              role="alert"
              aria-live="assertive"
              className="flex items-start gap-2 rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              <span className="mt-0.5">⚠️</span>
              <span>
                {error === "AccessDenied"
                  ? "Este email não tem permissão para aceder à aplicação."
                  : "Ocorreu um erro ao iniciar sessão. Tenta novamente."}
              </span>
            </div>
          )}

          <Button
            type="button"
            size="lg"
            className="w-full flex items-center justify-center gap-2"
            disabled={isSigningIn}
            onClick={() => {
              setIsSigningIn(true)
              signIn("google", { callbackUrl: "/" })
            }}
          >
            {isSigningIn ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                A entrar…
              </>
            ) : (
              <>
                <GoogleIcon />
                Entrar com Google
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center leading-relaxed">
            Apenas contas Google autorizadas podem aceder.
            <br />
            Se achares que isto é um erro, contacta o administrador.
          </p>
        </CardContent>
      </Card>
    </main>
  )
}

/* -------------------------------------------------------------------------- */
/*                                    Icons                                   */
/* -------------------------------------------------------------------------- */

function GoogleIcon() {
  return (
    <svg
      aria-hidden
      focusable="false"
      width="18"
      height="18"
      viewBox="0 0 48 48"
    >
      <path
        fill="#EA4335"
        d="M24 9.5c3.1 0 5.9 1.1 8.1 3l6-6C34.4 2.5 29.6 0 24 0 14.6 0 6.6 5.4 2.7 13.2l7.3 5.7C11.7 13.1 17.4 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.1 24.5c0-1.6-.1-2.8-.4-4H24v8.1h12.7c-.6 3-2.4 5.6-5.1 7.4l7.8 6c4.5-4.2 7.1-10.4 7.1-17.5z"
      />
      <path
        fill="#FBBC05"
        d="M10 28.9c-.5-1.5-.8-3.1-.8-4.9s.3-3.4.8-4.9l-7.3-5.7C1 16.4 0 20.1 0 24s1 7.6 2.7 10.6l7.3-5.7z"
      />
      <path
        fill="#34A853"
        d="M24 48c5.6 0 10.4-1.9 13.9-5.1l-7.8-6c-2.2 1.5-5 2.4-8.1 2.4-6.6 0-12.3-3.6-15-8.9l-7.3 5.7C6.6 42.6 14.6 48 24 48z"
      />
    </svg>
  )
}
