import { redirect } from "next/navigation";

import { auth } from "@/server/auth";
import { CreateGigDialog } from "../../components/employer/create-gig-dialog";
import { DashboardContent } from "../../components/employer/dashboard-content";
import { DashboardHeader } from "../../components/employer/dashboard-header";
import { DashboardShell } from "../../components/employer/dashboard-shell";
import { PageContainer } from "@/components/layout/page-container";

async function getGigStats() {
  // In a real app, this would fetch actual statistics
  return {
    totalGigs: 12,
    openGigs: 5,
    inProgressGigs: 4,
    completedGigs: 3,
    totalApplications: 28,
    averageRating: 4.7,
    totalEarnings: 8500000,
  };
}

export const EmployerDashboardPage = async () => {
  const session = await auth();

  // Redirect if not an employer
  if (session?.user.role !== "EMPLOYER") {
    return redirect("/");
  }

  const stats = await getGigStats();

  return (
    <PageContainer center withFooter>
      <DashboardShell>
        <DashboardHeader
          heading={`Selamat datang, ${session?.user.name}`}
          description="Kelola gig dan lihat statistik dashboard Anda"
        >
          <CreateGigDialog />
        </DashboardHeader>
        <DashboardContent stats={stats} />
      </DashboardShell>
    </PageContainer>
  );
};
