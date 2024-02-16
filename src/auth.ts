import bcrypt from 'bcrypt'
import Credentials from 'next-auth/providers/credentials'
import GitHub from 'next-auth/providers/github'
import NextAuth from 'next-auth'
import {PrismaAdapter} from '@auth/prisma-adapter'
import {prisma} from '@/db'
import {z} from 'zod'

export const config = {
  theme: {
    logo: 'https://next-auth.js.org/img/logo/logo-sm.png',
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub,
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({
            email: z.string().email(),
            password: z.string().min(6),
          })
          .safeParse(credentials)

        if (parsedCredentials.success) {
          const {email, password} = parsedCredentials.data
          const user = await prisma.user.findUnique({where: {email}})
          const passwordsMatch = await bcrypt.compare(password, user?.password)
          if (passwordsMatch) {
            return user
          }
        }

        return null
      },
    }),
  ],
  callbacks: {
    session({session, user}) {
      session.user.roles = user.roles
      return session
    }
  },
  session: {
    strategy: 'database',
  },
  //debug: process.env.NODE_ENV === 'development',
  theme: {
    logo: '/treemap.svg',
  },
}

export const {handlers, auth, signIn, signOut} = NextAuth(config)

export const assertLoggedIn = async () => {
  const session = await auth()
  if (!session) {
    throw new Error('Must be logged in')
  }
  return session
}
