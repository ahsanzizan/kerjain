import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { type ReactNode } from "react";

export default async function MainLayout(props: { children?: ReactNode }) {
  const session = await auth();
  if (!session) return redirect("/");

  if (session.user.role === "NONE") return redirect("/choose-role");

  return <>{props.children}</>;
}
