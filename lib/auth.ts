import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

const isCodespaces = process.env.CODESPACES === "true"

export async function getSession() {
  if (isCodespaces) {
    // 👇 sessão fake só para dev
    return {
      user: {
        name: "Dev User",
        email: "dev@codespaces.local",
        image: null,
      },
      expires: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    }
  }

  return getServerSession(authOptions)
}
