import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { type ReactNode } from "react";

export default async function EmployerLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  if (session?.user.role !== "EMPLOYER") return redirect("/");

  return <>{children}</>;
}
