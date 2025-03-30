"use client";

import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Clock } from "lucide-react";
import Image from "next/image";

interface Worker {
  id: string;
  name: string;
  image?: string;
  rating: number;
  completedGigs: number;
  joinedDate?: string;
  skills?: string[];
  feedback?: string;
}

interface Gig {
  id: string;
  title: string;
  status: "OPEN" | "IN_PROGRESS" | "COMPLETED" | "CANCELED";
  pay: number;
  deadline: string;
  applications: number;
  description?: string;
  address?: string;
  categories?: string[];
  worker: Worker | null;
  completedAt?: string;
  feedback?: string;
  rating?: number;
}

interface ViewGigDialogProps {
  gig: Gig;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Milestone {
  id: string;
  title: string;
  status: "PENDING" | "COMPLETED";
}

export function ViewGigDialog({ gig, open, onOpenChange }: ViewGigDialogProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "OPEN":
        return "bg-green-500 hover:bg-green-600";
      case "IN_PROGRESS":
        return "bg-blue-500 hover:bg-blue-600";
      case "COMPLETED":
        return "bg-purple-500 hover:bg-purple-600";
      case "CANCELED":
        return "bg-red-500 hover:bg-red-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "OPEN":
        return "Terbuka";
      case "IN_PROGRESS":
        return "Dalam Proses";
      case "COMPLETED":
        return "Selesai";
      case "CANCELED":
        return "Dibatalkan";
      default:
        return status;
    }
  };

  // Mock data for the full gig details
  const fullGig = {
    ...gig,
    description:
      gig.description ??
      "Ini adalah deskripsi lengkap dari gig yang mencakup semua detail pekerjaan yang dibutuhkan. Deskripsi ini memberikan informasi tentang apa yang diharapkan, keterampilan yang diperlukan, dan hasil akhir yang diinginkan.",
    address: gig.address ?? "Jl. Sudirman No. 123, Jakarta Pusat",
    categories: gig.categories ?? ["Desain", "Pengembangan Web"],
    latitude: -6.2088,
    longitude: 106.8456,
    createdAt: "2025-03-15",
    worker:
      gig.status === "COMPLETED" || gig.status === "IN_PROGRESS"
        ? {
            id: "worker_1",
            name: "Andi Pratama",
            image: "/placeholder.svg?height=80&width=80",
            rating: 4.8,
            completedGigs: 24,
            joinedDate: "2024-01-15",
            skills: ["Desain Grafis", "UI/UX", "Branding"],
            feedback:
              gig.status === "COMPLETED"
                ? "Pekerja sangat profesional dan menyelesaikan pekerjaan tepat waktu. Hasil kerjanya sangat memuaskan dan sesuai dengan ekspektasi."
                : undefined,
          }
        : undefined,
    completedAt: gig.status === "COMPLETED" ? "2025-04-05" : undefined,
    rating: gig.status === "COMPLETED" ? 5 : undefined,
    feedback:
      gig.status === "COMPLETED"
        ? "Pekerja sangat profesional dan menyelesaikan pekerjaan tepat waktu. Hasil kerjanya sangat memuaskan dan sesuai dengan ekspektasi."
        : undefined,
  };

  // Mock data for milestones
  const milestones: Milestone[] =
    gig.status === "OPEN"
      ? [
          {
            id: "1",
            title: "Analisis kebutuhan dan perencanaan",
            status: "PENDING",
          },
          { id: "2", title: "Desain dan pengembangan", status: "PENDING" },
          { id: "3", title: "Testing dan deployment", status: "PENDING" },
        ]
      : gig.status === "IN_PROGRESS"
        ? [
            {
              id: "1",
              title: "Analisis kebutuhan dan perencanaan",
              status: "COMPLETED",
            },
            { id: "2", title: "Desain dan pengembangan", status: "PENDING" },
            { id: "3", title: "Testing dan deployment", status: "PENDING" },
          ]
        : gig.status === "COMPLETED"
          ? [
              {
                id: "1",
                title: "Analisis kebutuhan dan perencanaan",
                status: "COMPLETED",
              },
              {
                id: "2",
                title: "Desain dan pengembangan",
                status: "COMPLETED",
              },
              { id: "3", title: "Testing dan deployment", status: "COMPLETED" },
            ]
          : [
              {
                id: "1",
                title: "Analisis kebutuhan dan perencanaan",
                status: "PENDING",
              },
              { id: "2", title: "Desain dan pengembangan", status: "PENDING" },
              { id: "3", title: "Testing dan deployment", status: "PENDING" },
            ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{fullGig.title}</DialogTitle>
          <DialogDescription>Detail lengkap gig</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between">
            <Badge className={getStatusColor(fullGig.status)}>
              {getStatusText(fullGig.status)}
            </Badge>
            <div className="text-lg font-medium">
              Rp {fullGig.pay.toLocaleString("id-ID")}
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="mb-1 text-sm font-medium">Deskripsi</h4>
            <p className="text-muted-foreground text-sm">
              {fullGig.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="mb-1 text-sm font-medium">Deadline</h4>
              <p className="text-muted-foreground text-sm">
                {format(new Date(fullGig.deadline), "PPP", { locale: id })}
              </p>
            </div>
            <div>
              <h4 className="mb-1 text-sm font-medium">Tanggal Dibuat</h4>
              <p className="text-muted-foreground text-sm">
                {format(new Date(fullGig.createdAt), "PPP", { locale: id })}
              </p>
            </div>
          </div>

          <div>
            <h4 className="mb-1 text-sm font-medium">Lokasi</h4>
            <p className="text-muted-foreground text-sm">{fullGig.address}</p>
            <p className="text-muted-foreground mt-1 text-xs">
              Koordinat: {fullGig.latitude}, {fullGig.longitude}
            </p>
          </div>

          <div>
            <h4 className="mb-1 text-sm font-medium">Kategori</h4>
            <div className="flex flex-wrap gap-2">
              {fullGig.categories.map((category) => (
                <div
                  key={category}
                  className="bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-xs"
                >
                  {category}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-1 text-sm font-medium">Aplikasi</h4>
            <p className="text-muted-foreground text-sm">
              {fullGig.applications} pekerja telah mengajukan aplikasi
            </p>
          </div>

          {/* Milestone Section */}
          <Separator />

          <div>
            <h4 className="mb-2 text-sm font-medium">Milestone</h4>
            <div className="space-y-2">
              {milestones.map((milestone, index) => (
                <Card key={milestone.id} className="overflow-hidden">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium ${
                          milestone.status === "COMPLETED"
                            ? "bg-green-500 text-white"
                            : "bg-primary text-primary-foreground"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div className="flex-1">{milestone.title}</div>
                      <div>
                        {milestone.status === "COMPLETED" ? (
                          <div className="flex items-center gap-1 text-green-600">
                            <CheckCircle2 className="h-4 w-4" />
                            <span className="text-xs">Selesai</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-amber-600">
                            <Clock className="h-4 w-4" />
                            <span className="text-xs">Belum Selesai</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          {/* Worker Profile Section for Completed Gigs */}
          {fullGig.status === "COMPLETED" && fullGig.worker && (
            <>
              <Separator />

              <div>
                <h4 className="mb-3 text-sm font-medium">Profil Pekerja</h4>
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="border-primary h-20 w-20 overflow-hidden rounded-full border-2">
                        <Image
                          src={
                            fullGig.worker.image ||
                            "/placeholder.svg?height=80&width=80"
                          }
                          alt={fullGig.worker.name}
                          width={300}
                          height={300}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>

                    <div className="flex-1">
                      <h3 className="text-lg font-medium">
                        {fullGig.worker.name}
                      </h3>
                      <div className="mt-1 flex items-center gap-2">
                        <div className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="h-4 w-4 text-yellow-500"
                          >
                            <path d="M12 2L15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2z" />
                          </svg>
                          <span className="ml-1 text-sm font-medium">
                            {fullGig.worker.rating}
                          </span>
                        </div>
                        <span className="text-muted-foreground text-sm">•</span>
                        <span className="text-muted-foreground text-sm">
                          {fullGig.worker.completedGigs} gig selesai
                        </span>
                      </div>

                      {fullGig.worker.skills && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {fullGig.worker.skills.map((skill) => (
                            <span
                              key={skill}
                              className="bg-secondary text-secondary-foreground rounded-full px-2 py-0.5 text-xs"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {fullGig.completedAt && (
                    <div className="border-border mt-4 border-t pt-3">
                      <div className="text-sm">
                        <span className="font-medium">Tanggal Selesai:</span>{" "}
                        <span className="text-muted-foreground">
                          {format(new Date(fullGig.completedAt), "PPP", {
                            locale: id,
                          })}
                        </span>
                      </div>
                    </div>
                  )}

                  {fullGig.rating && (
                    <div className="mt-2">
                      <div className="text-sm">
                        <span className="font-medium">
                          Rating yang Anda Berikan:
                        </span>{" "}
                        <div className="ml-1 inline-flex items-center">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <svg
                              key={i}
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill={
                                i < fullGig.rating! ? "currentColor" : "none"
                              }
                              stroke={
                                i < fullGig.rating! ? "none" : "currentColor"
                              }
                              className={`h-4 w-4 ${i < fullGig.rating! ? "text-yellow-500" : "text-muted-foreground"}`}
                            >
                              <path d="M12 2L15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {fullGig.feedback && (
                    <div className="mt-3">
                      <div className="mb-1 text-sm font-medium">
                        Ulasan Anda:
                      </div>
                      <div className="text-muted-foreground bg-background rounded-md border p-3 text-sm">
                        &quot;{fullGig.feedback}&quot;
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
