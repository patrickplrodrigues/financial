"use client"

import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function UnauthorizedPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md text-center shadow-lg">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-bold">
            Acesso não autorizado
          </CardTitle>
          <CardDescription>
            Esta conta não tem permissão para aceder à aplicação.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Podes tentar iniciar sessão com outra conta Google ou contactar
            o administrador se acreditares que isto é um erro.
          </p>

          <div className="flex flex-col gap-2">
            <Button
              onClick={() =>
                signOut({ callbackUrl: "/login" })
              }
            >
              Entrar com outra conta
            </Button>

            <Button
              variant="ghost"
              onClick={() =>
                signOut({ callbackUrl: "/login" })
              }
            >
              Voltar ao login
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
