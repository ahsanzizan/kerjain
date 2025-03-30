"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, DollarSign, Users } from "lucide-react";
import { type FC, Suspense } from "react";
import { ApplicationsChart } from "./applications-chart";
import { GigStatusChart } from "./gig-status-chart";
import { Overview } from "./overview";
import { RecentGigs } from "./recent-gigs";

interface DashboardStats {
  totalGigs: number;
  openGigs: number;
  inProgressGigs: number;
  completedGigs: number;
  totalApplications: number;
  averageRating: number;
  totalEarnings: number;
}

export const DashboardContent: FC<{ stats: DashboardStats }> = ({ stats }) => {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Gig</CardTitle>
            <CalendarDays className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalGigs}</div>
            <p className="text-muted-foreground text-xs">
              {stats.openGigs} gig masih terbuka
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Aplikasi Diterima
            </CardTitle>
            <Users className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalApplications}</div>
            <p className="text-muted-foreground text-xs">
              Dari {stats.totalGigs} gig yang diposting
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Rating Rata-rata
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="text-muted-foreground h-4 w-4"
            >
              <path d="M12 2L15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2z" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageRating}</div>
            <p className="text-muted-foreground text-xs">
              Dari pekerja yang telah menyelesaikan gig
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Pengeluaran
            </CardTitle>
            <DollarSign className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Rp {stats.totalEarnings.toLocaleString("id-ID")}
            </div>
            <p className="text-muted-foreground text-xs">
              Untuk {stats.completedGigs} gig yang telah selesai
            </p>
          </CardContent>
        </Card>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Ikhtisar</TabsTrigger>
          <TabsTrigger value="gigs">Gig Saya</TabsTrigger>
          <TabsTrigger value="analytics">Analitik</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Ikhtisar</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Status Gig</CardTitle>
                <CardDescription>
                  Distribusi gig berdasarkan status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GigStatusChart />
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Gig Terbaru</CardTitle>
                <CardDescription>
                  Daftar gig yang baru-baru ini Anda posting
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<div>Memuat gig terbaru...</div>}>
                  <RecentGigs />
                </Suspense>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Aplikasi</CardTitle>
                <CardDescription>
                  Statistik aplikasi yang diterima
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ApplicationsChart />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="gigs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Semua Gig</CardTitle>
              <CardDescription>
                Kelola semua gig yang telah Anda posting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div>Memuat daftar gig...</div>}>
                <RecentGigs showAll />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analitik</CardTitle>
              <CardDescription>
                Analisis mendalam tentang performa gig Anda
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground flex h-[300px] items-center justify-center">
                Analitik akan segera tersedia
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
};
