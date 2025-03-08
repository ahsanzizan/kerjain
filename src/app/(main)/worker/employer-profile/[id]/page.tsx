import EmployerProfile from "@/components/features/profile/components/display/employer";
import { auth } from "@/server/auth";
import { getEmployerProfile } from "@/server/queries";
import { notFound } from "next/navigation";

export default async function EmployerProfilePage({
  params,
}: {
  params: Promise<{ id?: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  if (!session || session.user.role !== "EMPLOYER" || !id) return notFound();

  const profile = await getEmployerProfile(id);
  if (!profile) return notFound();

  return <EmployerProfile profile={profile} />;
}
