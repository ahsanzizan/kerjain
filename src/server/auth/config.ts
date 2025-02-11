import { PrismaAdapter } from "@auth/prisma-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { env } from "@/env";
import { db } from "@/server/db";
import {
  jwtHelper,
  tokenOneDay,
  tokenOnWeek,
  type AuthUser,
} from "@/utils/jwtHelper";
import { type Role } from "@prisma/client";
import * as bcrypt from "bcryptjs";

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
    } & DefaultSession["user"];
  }

  // interface User {
  //   id?: string;
  //   role: Role;
  // }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    user: AuthUser;
    accessToken: string;
    refreshToken: string;
    accessTokenExpired: number;
    refreshTokenExpired: number;
    error?: "RefreshAccessTokenError";
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
              accounts: {
                where: {
                  provider: "credentials",
                },
                take: 1,
              },
            },
          });

          if (!user?.accounts[0]?.password) {
            return null;
          }

          if (user && credentials) {
            const validPassword = await bcrypt.compare(
              password,
              user.accounts[0].password,
            );

            if (validPassword) {
              return {
                id: user.id,
                name: user.name,
              };
            }
          }
        } catch (error) {
          console.log(error);
        }
        return null;
      },
    }),
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    //   allowDangerousEmailAccountLinking: false,
    // }),
  ],
  adapter: PrismaAdapter(db),
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
    async redirect({ url, baseUrl }) {
      return url.startsWith("/") ? new URL(url, baseUrl).toString() : url;
    },
    async signIn({ user }) {
      if (!user.email) return false;

      // const existingUser = await db.user.findUnique({
      //   where: { email: user.email },
      // });

      // // If the user does not exist, then it's a Google sign-in
      // if (!existingUser) {
      //   try {
      //     await db.user.create({
      //       data: {
      //         email: user.email,
      //         name: user.name ?? user.email.split("@")[0],
      //         role: "",
      //         is_verified: true,
      //       },
      //     });
      //   } catch (error) {
      //     console.error("Error creating user:", error);
      //     return false;
      //   }
      // }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        const authUser = { id: user.id, name: user.name } as AuthUser;

        const accessToken = await jwtHelper.createAcessToken(authUser);
        const refreshToken = await jwtHelper.createRefreshToken(authUser);
        const accessTokenExpired = Date.now() / 1000 + tokenOneDay;
        const refreshTokenExpired = Date.now() / 1000 + tokenOnWeek;

        return {
          ...token,
          accessToken,
          refreshToken,
          accessTokenExpired,
          refreshTokenExpired,
          user: authUser,
        };
      } else {
        if (token) {
          // In subsequent requests, check access token has expired, try to refresh it
          if (Date.now() / 1000 > token.accessTokenExpired) {
            const verifyToken = await jwtHelper.verifyToken(token.refreshToken);

            if (verifyToken) {
              const user = await db.user.findUnique({
                where: {
                  email: token.user.email,
                },
              });

              if (user) {
                const accessToken = await jwtHelper.createAcessToken(
                  token.user,
                );
                const accessTokenExpired = Date.now() / 1000 + tokenOneDay;

                return { ...token, accessToken, accessTokenExpired };
              }
            }

            return { ...token, error: "RefreshAccessTokenError" };
          }
        }
      }

      return token;
    },
  },
} satisfies NextAuthConfig;
