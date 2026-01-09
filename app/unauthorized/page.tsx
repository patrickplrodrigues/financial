import Link from "next/link"
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
            Se achares que isto é um erro, entra em contacto com o administrador
            ou tenta iniciar sessão com outra conta Google.
          </p>

          <div className="flex flex-col gap-2">
            <Button asChild>
              <Link href="/api/auth/signin">
                Entrar com outra conta
              </Link>
            </Button>

            <Button variant="ghost" asChild>
              <Link href="/login">Voltar ao login</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
