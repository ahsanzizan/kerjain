import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { env } from "./env";
import { auth } from "./server/auth";

const publicPaths = ["/", "/auth/signin", "/auth/signup", "/api/auth"];

export const middleware = auth(async (req) => {
  const token = await getToken({ req, secret: env.AUTH_SECRET });
  const isAuth = !!token;
  const isPublicPath = publicPaths.some((path) =>
    req.nextUrl.pathname.startsWith(path),
  );

  if (isPublicPath) {
    return NextResponse.next();
  }

  if (!isAuth) {
    const signInUrl = new URL("/auth/signin", req.url);
    signInUrl.searchParams.set("callbackUrl", req.url);
    return NextResponse.redirect(signInUrl);
  }

  if (isAuth && req.nextUrl.pathname.startsWith("/auth")) {
    return NextResponse.redirect("/");
  }

  const response = NextResponse.next();
  response.headers.set("x-user-id", token.sub ?? "");
  response.headers.set("x-user-role", token.user.role ?? "");

  return response;
});

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * 1. _next (Next.js internals)
     * 2. static files (files in public directory)
     * 3. favicon.ico
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
