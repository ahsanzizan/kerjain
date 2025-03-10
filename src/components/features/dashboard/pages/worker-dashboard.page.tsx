import { PageContainer } from "@/components/layout/page-container";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { formatRupiah } from "@/lib/utils";
import { auth } from "@/server/auth";
import { getWorkerDashboard } from "@/server/queries/worker-dashboard";
import {
  Briefcase,
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  Search,
  Star,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { WorkerCharts } from "../components/worker-charts";
import { buttonVariants } from "@/components/ui/button";

export const WorkerDashboard = async () => {
  const session = await auth();

  if (!session?.user) return notFound();

  const dashboardData = await getWorkerDashboard(session.user.id);

  return (
    <PageContainer withFooter>
      <div className="p-4">
        <div className="mx-auto max-w-6xl">
          <div className="mb-4 flex items-center justify-between">
            <Link href={"/worker"} className="flex items-center gap-x-2">
              <span className="block aspect-[16/5] w-32 bg-[url(/logo.png)] bg-contain bg-no-repeat text-transparent">
                Kerjain
              </span>
              <h1 className="bg-gradient-to-r from-primary-600 to-primary-300 bg-clip-text text-2xl font-bold text-transparent">
                Worker
              </h1>
            </Link>
            <Link href={"/worker/profile"}>
              <Avatar className="size-12 ring-2 ring-primary-200">
                <AvatarImage src={session.user.image} alt={session.user.name} />
                <AvatarFallback className="bg-primary-600 text-white">
                  {session.user.name.charAt(0) || "E"}
                </AvatarFallback>
              </Avatar>
            </Link>
          </div>

          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 space-y-4 md:col-span-4">
              <Card className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
                <div className="absolute right-0 top-0 -mr-16 -mt-16 h-32 w-32 rounded-full bg-white opacity-10"></div>
                <CardContent className="p-4">
                  <h3 className="mb-2 text-lg font-bold">Ringkasan Anda</h3>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center">
                      <div className="mr-2 rounded-lg bg-white bg-opacity-20 p-1">
                        <Star className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs text-blue-100">Penilaian</p>
                        <p className="text-base font-bold">
                          {dashboardData.quickStats.averageRating
                            ? dashboardData.quickStats.averageRating.toFixed(1)
                            : "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="mr-2 rounded-lg bg-white bg-opacity-20 p-1">
                        <DollarSign className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs text-blue-100">
                          Total Pendapatan
                        </p>
                        <p className="truncate text-base font-bold">
                          {formatRupiah(
                            dashboardData.charts.earnings.completedEarnings +
                              dashboardData.charts.earnings.ongoingEarnings,
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats Cards */}
              <div className="grid grid-cols-3 gap-2 md:grid-cols-1">
                <Card className="overflow-hidden border-l-4 border-blue-500">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-500">
                          Pekerjaan Dilamar
                        </p>
                        <h3 className="text-lg font-bold text-gray-800">
                          {dashboardData.quickStats.totalJobsApplied}
                        </h3>
                      </div>
                      <div className="rounded-lg bg-blue-100 p-2">
                        <Briefcase className="h-4 w-4 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden border-l-4 border-yellow-500">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-500">Berlangsung</p>
                        <h3 className="text-lg font-bold text-gray-800">
                          {dashboardData.quickStats.jobsInProgress}
                        </h3>
                      </div>
                      <div className="rounded-lg bg-yellow-100 p-2">
                        <Clock className="h-4 w-4 text-yellow-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden border-l-4 border-green-500">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-500">Selesai</p>
                        <h3 className="text-lg font-bold text-gray-800">
                          {dashboardData.quickStats.completedJobs}
                        </h3>
                      </div>
                      <div className="rounded-lg bg-green-100 p-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Navigation Cards - Sidebar */}
              <div className="grid grid-cols-2 gap-2 md:grid-cols-1">
                <Link
                  href="/worker/gigs"
                  className={buttonVariants({ size: "sm" })}
                >
                  <div className="flex items-center p-2">
                    <Search className="mr-2 h-4 w-4" />
                    <span className="text-sm font-medium">Cari Pekerjaan</span>
                  </div>
                </Link>

                <Link
                  href="/worker/applications"
                  className={buttonVariants({
                    variant: "secondary",
                    size: "sm",
                  })}
                >
                  <div className="flex items-center p-2">
                    <FileText className="mr-2 h-4 w-4" />
                    <span className="text-sm font-medium">Kelola Lamaran</span>
                  </div>
                </Link>
              </div>
            </div>

            <WorkerCharts dashboardData={dashboardData} />
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
