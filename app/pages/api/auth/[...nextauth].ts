import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaClient } from "@prisma/client"

// Add this import to fix the undeclared brevity variable error.  The exact import will depend on where 'brevity' is used in your existing code.  This is a placeholder.  Replace with the correct import path.
import { Brevity } from "@/components/brevity"

const prisma = new PrismaClient()

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const user = await prisma.user.findUnique({
          where: {
            email: credentials?.email,
          },
        })

        if (!user) {
          throw new Error("Invalid email or password!")
        }

        const isCorrectPassword = await Brevity.compare(credentials?.password, user.password) // Assuming brevity is a helper function for password comparison

        if (!isCorrectPassword) {
          throw new Error("Invalid email or password!")
        }

        return user
      },
    }),
    // ...add more providers if needed
  ],
  callbacks: {
    async session({ session, user }) {
      session.user.id = user.id
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error", // Error code passed in query string as ?error=
    verifyRequest: "/auth/verify-request", // (used for check email confirmation)
  },
  database: process.env.DATABASE_URL,
})

