import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { type ReactNode } from "react";

export default async function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  if (session) return redirect("/");

  return <>{children}</>;
}
