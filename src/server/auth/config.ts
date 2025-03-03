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
    maxAge: 30 * 24 * 60 * 60, // 30 days
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
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          const { email, password } = credentials as {
            email: string;
            password: string;
          };

          const user = await db.user.findUnique({
            where: { email },
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              role: true,
              account: {
                select: { password: true, provider: true },
              },
            },
          });

          if (!user?.account?.password) {
            console.log("Invalid login attempt: user not found or no password");
            return null;
          }

          const validPassword = await bcrypt.compare(
            password,
            user.account.password,
          );

          if (!validPassword) {
            console.log("Invalid login attempt: incorrect password");
            return null;
          }

          return {
            id: user.id,
            name: user.name || "",
            role: user.role,
            email: user.email,
            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
            image: user.image || "",
          };
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: false,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      // Use token data instead of querying the database
      if (token.user && session.user) {
        session.user.id = token.user.id;
        session.user.role = token.user.role;
        session.user.name = token.user.name;
        session.user.email = token.user.email;
        session.user.image = token.user.image || "";

        // Only update last_login occasionally (e.g., once per day)
        // This reduces database writes
        const lastLoginUpdate = (token.lastLoginUpdate as number) || 0;
        const oneDayInMs = 24 * 60 * 60 * 1000;

        if (Date.now() - lastLoginUpdate > oneDayInMs) {
          await db.user.update({
            where: { id: token.user.id },
            data: {
              account: { update: { last_login: new Date() } },
            },
          });
          token.lastLoginUpdate = Date.now();
        }
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      // Security check to prevent open redirects
      if (url.startsWith(baseUrl) || url.startsWith("/")) {
        return url.startsWith("/") ? new URL(url, baseUrl).toString() : url;
      }
      return baseUrl;
    },

    async signIn({ user, account }) {
      try {
        if (!user.email) return false;

        const existingUser = await db.user.findUnique({
          where: { email: user.email },
          select: {
            id: true,
            role: true,
            account: { select: { provider: true } },
          },
        });

        // If user doesn't exist, create new user (Google sign-in)
        if (!existingUser && account?.provider === "google") {
          await db.user.create({
            data: {
              image:
                // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                user.image ||
                "https://res.cloudinary.com/mokletorg/image/upload/v1710992405/user.svg",
              email: user.email,
              // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
              name: user.name || user.email.split("@")[0] || "Unnamed",
              role: "NONE",
              emailVerified: new Date(),
              account: {
                create: {
                  provider: "Google",
                  last_login: new Date(),
                },
              },
            },
          });
          return true;
        }

        // If user exists but credentials don't match provider, prevent sign-in
        if (
          existingUser &&
          account?.provider === "google" &&
          existingUser.account?.provider !== "Google" &&
          existingUser.account?.provider !== "credentials+google"
        ) {
          console.error("Account exists with different provider");
          return false;
        }

        // Update last login time
        if (existingUser) {
          await db.user.update({
            where: { id: existingUser.id },
            data: {
              account: { update: { last_login: new Date() } },
            },
          });
        }

        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      }
    },

    async jwt({ token, user }) {
      // Add user data to token when first signing in
      if (user) {
        token.user = {
          // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          id: user.id || "",
          role: user.role || "NONE",
          // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          name: user.name || "",
          // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          email: user.email || "",
          // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          image: user.image || "",
        };
        token.lastLoginUpdate = Date.now();
      }
      return token;
    },
  },
} satisfies NextAuthConfig;
