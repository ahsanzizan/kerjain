import { PageContainer } from "@/components/layout/page-container";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Metadata } from "next";
import { Suspense } from "react";
import { CreateGigDialog } from "../../components/employer/create-gig-dialog";
import { DashboardHeader } from "../../components/employer/dashboard-header";
import { DashboardShell } from "../../components/employer/dashboard-shell";
import { GigList } from "../../components/employer/gigs/gig-list";
import { GigMilestones } from "../../components/employer/gigs/gig-milestones";

export const metadata: Metadata = {
  title: "Gig Saya | Dashboard Employer",
  description: "Kelola semua gig yang telah Anda posting",
};

export default function GigsPage() {
  return (
    <PageContainer center withFooter>
      <DashboardShell>
        <DashboardHeader
          heading="Gig Saya"
          description="Kelola semua gig yang telah Anda posting"
        >
          <CreateGigDialog />
        </DashboardHeader>

        <Tabs defaultValue="semua" className="space-y-4">
          <TabsList>
            <TabsTrigger value="semua">Semua</TabsTrigger>
            <TabsTrigger value="terbuka">Terbuka</TabsTrigger>
            <TabsTrigger value="dalam-proses">Dalam Proses</TabsTrigger>
            <TabsTrigger value="selesai">Selesai</TabsTrigger>
            <TabsTrigger value="dibatalkan">Dibatalkan</TabsTrigger>
          </TabsList>

          <TabsContent value="semua" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Semua Gig</CardTitle>
                <CardDescription>
                  Daftar semua gig yang telah Anda posting
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<div>Memuat daftar gig...</div>}>
                  <GigList filter="all" />
                </Suspense>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="terbuka" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Gig Terbuka</CardTitle>
                <CardDescription>
                  Gig yang masih terbuka untuk aplikasi
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<div>Memuat daftar gig...</div>}>
                  <GigList filter="OPEN" />
                </Suspense>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dalam-proses" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Gig Dalam Proses</CardTitle>
                <CardDescription>
                  Gig yang sedang dikerjakan oleh pekerja
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<div>Memuat daftar gig...</div>}>
                  <GigList filter="IN_PROGRESS" />
                </Suspense>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Detail Gig Dalam Proses</CardTitle>
                <CardDescription>
                  Pantau kemajuan gig yang sedang berlangsung
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<div>Memuat detail gig...</div>}>
                  <GigMilestones />
                </Suspense>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="selesai" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Gig Selesai</CardTitle>
                <CardDescription>
                  Gig yang telah selesai dikerjakan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<div>Memuat daftar gig...</div>}>
                  <GigList filter="COMPLETED" />
                </Suspense>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dibatalkan" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Gig Dibatalkan</CardTitle>
                <CardDescription>Gig yang telah dibatalkan</CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<div>Memuat daftar gig...</div>}>
                  <GigList filter="CANCELED" />
                </Suspense>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DashboardShell>
    </PageContainer>
  );
}
