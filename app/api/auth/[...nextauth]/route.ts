import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import type { NextAuthOptions } from "next-auth"

const allowedEmails = [
  "sofiaferreiradomingues1@gmail.com",
  "patrickplrodrigues@gmail.com",
]

const isCodespaces = process.env.CODESPACES === "true"

export const authOptions: NextAuthOptions = {
  providers: isCodespaces
    ? [] // ⛔️ desativa OAuth no Codespaces
    : [
        GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
      ],

  callbacks: {
    async signIn({ user }) {
      if (isCodespaces) return true
      if (!user?.email) return false
      return allowedEmails.includes(user.email.toLowerCase())
    },

    async session({ session }) {
      return session
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
