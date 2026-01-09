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
    ? []
    : [
        GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
      ],

  callbacks: {
    async signIn({ user }) {
      if (isCodespaces) return true
      return !!user?.email
    },

    async session({ session }) {
      if (!session.user?.email) {
        session.user.isAuthorized = false
        return session
      }

      session.user.isAuthorized =
        isCodespaces ||
        allowedEmails.includes(session.user.email.toLowerCase())

      return session
    },
  },

  pages: {
    signIn: "/login",
    error: "/unauthorized",
  },

  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
