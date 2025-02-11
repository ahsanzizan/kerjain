import { env } from "@/env";
import { type User } from "@prisma/client";
import { decode, encode } from "next-auth/jwt";

export type AuthUser = Omit<User, "Password">;

export const tokenOneDay = 24 * 60 * 60;
export const tokenOnWeek = tokenOneDay * 7;

const craeteJWT = (token: AuthUser, duration: number) =>
  encode({
    token,
    secret: env.AUTH_SECRET,
    maxAge: duration,
    salt: env.SALT.toString(),
  });

export const jwtHelper = {
  createAcessToken: (token: AuthUser) => craeteJWT(token, tokenOneDay),
  createRefreshToken: (token: AuthUser) => craeteJWT(token, tokenOnWeek),
  verifyToken: (token: string) =>
    decode({
      token,
      secret: env.AUTH_SECRET,
      salt: env.SALT.toString(),
    }),
};
