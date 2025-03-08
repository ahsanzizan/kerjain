import { auth } from "@/server/auth";
import { getWorkerProfile } from "@/server/queries";
import { notFound } from "next/navigation";
import WorkerProfile from "../components/display/worker";

export const WorkerProfilePage = async () => {
  const session = await auth();

  if (!session || session.user.role !== "WORKER") return notFound();

  const profile = await getWorkerProfile(session.user.id);
  if (!profile) return notFound();

  return <WorkerProfile profile={profile} />;
};
