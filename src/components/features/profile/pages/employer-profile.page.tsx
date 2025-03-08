import { auth } from "@/server/auth";
import { getEmployerProfile } from "@/server/queries";
import { notFound } from "next/navigation";
import EmployerProfile from "../components/display/employer";

export const EmployerProfilePage = async () => {
  const session = await auth();

  if (!session || session.user.role !== "EMPLOYER") return notFound();

  const profile = await getEmployerProfile(session.user.id);
  if (!profile) return notFound();

  return <EmployerProfile profile={profile} />;
};
