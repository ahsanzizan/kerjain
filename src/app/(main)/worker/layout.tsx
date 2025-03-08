import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { type ReactNode } from "react";

export default async function WorkerLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  if (session?.user.role !== "WORKER") return redirect("/");

  return <>{children}</>;
}
