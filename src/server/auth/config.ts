import { type DefaultSession, type NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

import { env } from "@/env";
import { db } from "@/server/db";
import { type Role } from "@prisma/client";
import * as bcrypt from "bcryptjs";
import { type DefaultJWT } from "next-auth/jwt";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: Role;
      name: string;
      image: string;
      email: string;
    } & DefaultSession["user"];
  }

  interface User {
    id?: string;
    role: Role;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT extends DefaultJWT {
    user: {
      id: string;
      role: Role;
      name: string;
      image: string;
      email: string;
    };
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  session: {
    strategy: "jwt",
  },
  secret: env.AUTH_SECRET,
  pages: { signIn: "/auth/login" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "user@mail.com",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "********",
        },
      },
      async authorize(credentials, _) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        try {
          const user = await db.user.findUnique({
            where: {
              email,
            },
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              role: true,
              account: true,
            },
          });

          if (!user?.account?.password) {
            return null;
          }

          if (user && credentials) {
            const validPassword = await bcrypt.compare(
              password,
              user.account.password,
            );

            if (validPassword) {
              return {
                id: user.id,
                name: user.name,
                role: user.role,
                email: user.email,
                image: user.image,
              };
            }
          }
        } catch (error) {
          console.log(error);
        }
        return null;
      },
    }),
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: false,
    }),
  ],
  callbacks: {
    session({ session, token }) {
      return {
        ...session,
        user: {
          id: token.user.id,
          name: token.user.name,
          email: token.user.email,
          role: token.user.role,
          image: token.user.image,
        },
      };
    },
    async redirect({ url, baseUrl }) {
      return url.startsWith("/") ? new URL(url, baseUrl).toString() : url;
    },
    async signIn({ user }) {
      if (!user.email) return false;

      const existingUser = await db.user.findUnique({
        where: { email: user.email },
      });

      // If the user does not exist, then it's a Google sign-in
      if (!existingUser) {
        try {
          await db.user.create({
            data: {
              image:
                "https://res.cloudinary.com/mokletorg/image/upload/v1710992405/user.svg",
              email: user.email,
              name: user.name ?? user.email.split("@")[0] ?? "Unnamed",
              role: "NONE",
              emailVerified: new Date(),
              account: {
                create: {
                  provider: "Google",
                },
              },
            },
          });
        } catch (error) {
          console.error("Error creating user:", error);
          return false;
        }
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        // On initial sign in, get all user data we need
        const userdb = await db.user.findUnique({ where: { id: user.id } });

        if (!userdb) return token;

        // Update last login time during JWT creation
        await db.user.update({
          where: { id: user.id },
          data: {
            image: token.image ?? undefined,
            account: { update: { last_login: new Date() } },
          },
        });

        const { id, role, name, email, image } = userdb;

        token.user = {
          id,
          name,
          role,
          email,
          image:
            image ??
            "https://res.cloudinary.com/mokletorg/image/upload/v1710992405/user.svg",
        };
      }

      return token;
    },
  },
} satisfies NextAuthConfig;
