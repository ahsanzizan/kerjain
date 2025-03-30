"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CheckCircle2, Clock } from "lucide-react";
import { useState } from "react";
import { GigDetailDialog } from "./gig-detail-dialog";

interface Milestone {
  id: string;
  gigId: string;
  title: string;
  status: "PENDING" | "COMPLETED";
  completedByWorker: boolean;
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
  worker?: {
    id: string;
    name: string;
    image?: string;
  } | null;
}

// Mock data for ongoing gigs
const ongoingGigs = [
  {
    id: "gig_2",
    title: "Pengembangan Website E-commerce",
    status: "IN_PROGRESS",
    pay: 5000000,
    deadline: "2025-05-20",
    applications: 12,
    description:
      "Membuat website e-commerce dengan fitur pembayaran dan manajemen produk.",
    address: "Remote",
    categories: ["Pengembangan Web", "E-commerce"],
    worker: {
      id: "worker_1",
      name: "Andi Pratama",
      image: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: "gig_5",
    title: "Penerjemahan Dokumen",
    status: "IN_PROGRESS",
    pay: 1200000,
    deadline: "2025-04-25",
    applications: 7,
    description:
      "Menerjemahkan dokumen bisnis dari Bahasa Inggris ke Bahasa Indonesia.",
    address: "Remote",
    categories: ["Penerjemahan", "Dokumen"],
    worker: {
      id: "worker_3",
      name: "Budi Santoso",
      image: "/placeholder.svg?height=40&width=40",
    },
  },
];

// Mock data for milestones
const mockMilestones: Milestone[] = [
  {
    id: "milestone_1",
    gigId: "gig_2",
    title: "Analisis kebutuhan dan perencanaan",
    status: "COMPLETED",
    completedByWorker: true,
  },
  {
    id: "milestone_2",
    gigId: "gig_2",
    title: "Desain wireframe dan mockup",
    status: "COMPLETED",
    completedByWorker: true,
  },
  {
    id: "milestone_3",
    gigId: "gig_2",
    title: "Pengembangan frontend",
    status: "PENDING",
    completedByWorker: true,
  },
  {
    id: "milestone_4",
    gigId: "gig_2",
    title: "Pengembangan backend dan integrasi API",
    status: "PENDING",
    completedByWorker: false,
  },
  {
    id: "milestone_5",
    gigId: "gig_2",
    title: "Testing dan deployment",
    status: "PENDING",
    completedByWorker: false,
  },
  {
    id: "milestone_6",
    gigId: "gig_5",
    title: "Penerjemahan dokumen utama",
    status: "COMPLETED",
    completedByWorker: true,
  },
  {
    id: "milestone_7",
    gigId: "gig_5",
    title: "Penerjemahan lampiran",
    status: "PENDING",
    completedByWorker: true,
  },
  {
    id: "milestone_8",
    gigId: "gig_5",
    title: "Review dan finalisasi",
    status: "PENDING",
    completedByWorker: false,
  },
];

export function GigMilestones() {
  const [selectedGig, setSelectedGig] = useState<Gig | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  const handleViewDetail = (gig: Gig) => {
    setSelectedGig(gig);
    setDetailDialogOpen(true);
  };

  const getGigMilestones = (gigId: string) => {
    return mockMilestones.filter((m) => m.gigId === gigId);
  };

  const calculateProgress = (gigId: string) => {
    const milestones = getGigMilestones(gigId);
    const completed = milestones.filter((m) => m.status === "COMPLETED").length;
    return {
      completed,
      total: milestones.length,
      percentage: (completed / milestones.length) * 100,
    };
  };

  return (
    <div className="space-y-6">
      {ongoingGigs.length === 0 ? (
        <div className="text-muted-foreground py-8 text-center">
          Tidak ada gig yang sedang berlangsung
        </div>
      ) : (
        ongoingGigs.map((gig) => {
          const progress = calculateProgress(gig.id);

          return (
            <div key={gig.id} className="space-y-4 rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage
                      src={gig.worker?.image}
                      alt={gig.worker?.name}
                    />
                    <AvatarFallback>
                      {gig.worker?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{gig.title}</div>
                    <div className="text-muted-foreground text-sm">
                      Dikerjakan oleh: {gig.worker?.name}
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewDetail(gig)}
                >
                  Lihat Detail
                </Button>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Progres: {progress.completed} dari {progress.total}{" "}
                    milestone
                  </span>
                  <span className="text-sm font-medium">
                    {Math.round(progress.percentage)}%
                  </span>
                </div>
                <Progress value={progress.percentage} className="h-2" />
              </div>

              <div className="space-y-2">
                {getGigMilestones(gig.id).map((milestone, index) => (
                  <div
                    key={milestone.id}
                    className="flex items-center justify-between rounded-md border p-2"
                  >
                    <div className="flex items-center gap-2">
                      <div className="bg-muted flex h-6 w-6 items-center justify-center rounded-full text-xs">
                        {index + 1}
                      </div>
                      <span className="text-sm">{milestone.title}</span>
                    </div>
                    <div>
                      {milestone.status === "COMPLETED" ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center gap-1 text-green-600">
                                <CheckCircle2 className="h-4 w-4" />
                                <span className="text-xs">Selesai</span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Milestone ini telah selesai</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : milestone.completedByWorker ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center gap-1 text-blue-600">
                                <Clock className="h-4 w-4" />
                                <span className="text-xs">
                                  Menunggu Persetujuan
                                </span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                Pekerja telah menyelesaikan milestone ini,
                                menunggu persetujuan Anda
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center gap-1 text-amber-600">
                                <Clock className="h-4 w-4" />
                                <span className="text-xs">Dalam Proses</span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Pekerja sedang mengerjakan milestone ini</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })
      )}

      {selectedGig && (
        <GigDetailDialog
          gig={selectedGig}
          open={detailDialogOpen}
          onOpenChange={setDetailDialogOpen}
        />
      )}
    </div>
  );
}
