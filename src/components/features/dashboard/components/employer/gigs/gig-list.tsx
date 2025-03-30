"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { CalendarDays, MoreHorizontal, Users } from "lucide-react";
import { useState } from "react";
import { DeleteGigDialog } from "../delete-gig-dialog";
import { EditGigDialog } from "../edit-gig-dialog";
import { ViewGigDialog } from "../view-gig-dialog";
import { GigDetailDialog } from "./gig-detail-dialog";
import { WorkerSelectionDialog } from "./worker-selection-dialog";

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
  worker: {
    id: string;
    name: string;
    image?: string;
  } | null;
}

// Mock data for gigs
const mockGigs: Gig[] = [
  {
    id: "gig_1",
    title: "Pemindahan Barang-barang (Pindah Rumah)",
    status: "OPEN",
    pay: 1500000,
    deadline: "2025-04-15",
    applications: 8,
    description:
      "Memindahkan barang-barang yang ada di rumah saya yang lama ke rumah saya yang baru.",
    address: "Jakarta Selatan",
    categories: ["Desain", "Branding"],
    worker: null,
  },
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
    id: "gig_3",
    title: "Penulisan Konten Blog",
    status: "COMPLETED",
    pay: 800000,
    deadline: "2025-03-10",
    applications: 5,
    description: "Menulis 5 artikel blog tentang teknologi terbaru.",
    address: "Remote",
    categories: ["Penulisan", "Konten"],
    worker: {
      id: "worker_2",
      name: "Siti Rahma",
      image: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: "gig_4",
    title: "Pembuatan Video Promosi",
    status: "OPEN",
    pay: 2500000,
    deadline: "2025-04-30",
    applications: 3,
    description: "Membuat video promosi produk baru dengan durasi 2 menit.",
    address: "Jakarta Pusat",
    categories: ["Video", "Marketing"],
    worker: null,
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
  {
    id: "gig_6",
    title: "Desain UI/UX Aplikasi Mobile",
    status: "CANCELED",
    pay: 3000000,
    deadline: "2025-03-30",
    applications: 9,
    description: "Membuat desain UI/UX untuk aplikasi mobile fintech.",
    address: "Bandung",
    categories: ["Desain", "UI/UX", "Mobile"],
    worker: null,
  },
  {
    id: "gig_7",
    title: "Pengembangan Aplikasi Android",
    status: "COMPLETED",
    pay: 4500000,
    deadline: "2025-02-28",
    applications: 6,
    description: "Mengembangkan aplikasi Android untuk manajemen inventaris.",
    address: "Remote",
    categories: ["Pengembangan Mobile", "Android"],
    worker: {
      id: "worker_4",
      name: "Dian Kusuma",
      image: "/placeholder.svg?height=40&width=40",
    },
  },
];

interface GigListProps {
  filter: "all" | "OPEN" | "IN_PROGRESS" | "COMPLETED" | "CANCELED";
}

export function GigList({ filter }: GigListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGig, setSelectedGig] = useState<Gig | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  // Add state for worker selection dialog
  const [workerSelectionDialogOpen, setWorkerSelectionDialogOpen] =
    useState(false);

  // Filter gigs based on status and search query
  const filteredGigs = mockGigs
    .filter((gig) => filter === "all" || gig.status === filter)
    .filter(
      (gig) =>
        gig.title.toLowerCase().includes(searchQuery.toLowerCase()) ??
        gig.description?.toLowerCase().includes(searchQuery.toLowerCase()) ??
        gig.categories?.some((cat) =>
          cat.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
    );

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

  const handleView = (gig: Gig) => {
    setSelectedGig(gig);
    setViewDialogOpen(true);
  };

  const handleEdit = (gig: Gig) => {
    setSelectedGig(gig);
    setEditDialogOpen(true);
  };

  const handleDelete = (gig: Gig) => {
    setSelectedGig(gig);
    setDeleteDialogOpen(true);
  };

  const handleDetail = (gig: Gig) => {
    setSelectedGig(gig);
    setDetailDialogOpen(true);
  };

  // Add a function to handle selecting a worker for a gig
  const handleSelectWorker = (workerId: string, applicationId: string) => {
    console.log(
      `Selected worker ${workerId} for gig ${selectedGig?.id} via application ${applicationId}`,
    );
    // In a real app, you would update the gig status to "IN_PROGRESS" here
    // and associate the selected worker with the gig
    // Also update all other applications for this gig to "REJECTED"
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Cari gig berdasarkan judul, deskripsi, atau kategori..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

      {filteredGigs.length === 0 ? (
        <div className="text-muted-foreground py-8 text-center">
          Tidak ada gig yang ditemukan
        </div>
      ) : (
        <div className="space-y-4">
          {filteredGigs.map((gig) => (
            <div
              key={gig.id}
              className="hover:bg-muted/50 flex items-center justify-between rounded-lg border p-4 transition-colors"
            >
              <div className="grid gap-1">
                <div className="font-medium">{gig.title}</div>
                <div className="text-muted-foreground flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <CalendarDays className="h-3.5 w-3.5" />
                    <span>
                      Deadline:{" "}
                      {format(new Date(gig.deadline), "PPP", { locale: id })}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    <span>{gig.applications} aplikasi</span>
                  </div>
                </div>
                <div className="mt-1 flex flex-wrap gap-1">
                  {gig.categories?.map((category) => (
                    <span
                      key={category}
                      className="bg-secondary text-secondary-foreground rounded-full px-2 py-0.5 text-xs"
                    >
                      {category}
                    </span>
                  ))}
                </div>
                {gig.status === "IN_PROGRESS" && gig.worker && (
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-muted-foreground text-xs">
                      Dikerjakan oleh:
                    </span>
                    <div className="flex items-center gap-1">
                      <Avatar className="h-5 w-5">
                        <AvatarImage
                          src={gig.worker.image}
                          alt={gig.worker.name}
                        />
                        <AvatarFallback>
                          {gig.worker.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-medium">
                        {gig.worker.name}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(gig.status)}>
                  {getStatusText(gig.status)}
                </Badge>
                <div className="font-medium">
                  Rp {gig.pay.toLocaleString("id-ID")}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleView(gig)}>
                      Lihat Detail
                    </DropdownMenuItem>
                    {gig.status === "IN_PROGRESS" && (
                      <DropdownMenuItem onClick={() => handleDetail(gig)}>
                        Kelola Progres
                      </DropdownMenuItem>
                    )}
                    {gig.status === "OPEN" && (
                      <DropdownMenuItem onClick={() => handleEdit(gig)}>
                        Edit
                      </DropdownMenuItem>
                    )}
                    {gig.status === "OPEN" && (
                      <DropdownMenuItem
                        onClick={() => handleDelete(gig)}
                        className="text-red-600"
                      >
                        Hapus
                      </DropdownMenuItem>
                    )}
                    {/* Add a new action in the dropdown menu for OPEN gigs */}
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedGig(gig);
                        setWorkerSelectionDialogOpen(true);
                      }}
                      className={gig.status !== "OPEN" ? "hidden" : ""}
                    >
                      Pilih Pekerja
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedGig && (
        <>
          <ViewGigDialog
            gig={selectedGig}
            open={viewDialogOpen}
            onOpenChange={setViewDialogOpen}
          />
          <EditGigDialog
            gig={selectedGig}
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
          />
          <DeleteGigDialog
            gig={selectedGig}
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
          />
          <GigDetailDialog
            gig={selectedGig}
            open={detailDialogOpen}
            onOpenChange={setDetailDialogOpen}
          />
          {/* Add the WorkerSelectionDialog component at the end of the component, after the other dialogs */}
          <WorkerSelectionDialog
            gig={selectedGig}
            applications={[
              // Mock applications for the selected gig
              {
                id: "app_1",
                gigId: selectedGig.id,
                workerId: "worker_1",
                message:
                  "Saya memiliki pengalaman 5 tahun dalam bidang ini. Saya tertarik dengan proyek ini dan yakin dapat memberikan hasil yang memuaskan.",
                status: "PENDING",
                createdAt: "2025-03-20T10:30:00",
                worker: {
                  id: "worker_1",
                  name: "Andi Pratama",
                  image: "/placeholder.svg?height=40&width=40",
                  rating: 4.8,
                  completedGigs: 24,
                },
              },
              {
                id: "app_2",
                gigId: selectedGig.id,
                workerId: "worker_2",
                message:
                  "Saya adalah profesional dengan spesialisasi di bidang ini. Saya telah melihat brief Anda dan memiliki beberapa ide yang ingin saya diskusikan.",
                status: "PENDING",
                createdAt: "2025-03-21T14:15:00",
                worker: {
                  id: "worker_2",
                  name: "Siti Rahma",
                  image: "/placeholder.svg?height=40&width=40",
                  rating: 4.5,
                  completedGigs: 18,
                },
              },
              {
                id: "app_3",
                gigId: selectedGig.id,
                workerId: "worker_3",
                message:
                  "Saya memiliki portofolio yang kuat dalam bidang ini. Saya dapat memberikan hasil yang berkualitas sesuai dengan deadline.",
                status: "PENDING",
                createdAt: "2025-03-22T09:45:00",
                worker: {
                  id: "worker_3",
                  name: "Budi Santoso",
                  image: "/placeholder.svg?height=40&width=40",
                  rating: 4.9,
                  completedGigs: 32,
                },
              },
            ]}
            open={workerSelectionDialogOpen}
            onOpenChange={setWorkerSelectionDialogOpen}
            onWorkerSelect={handleSelectWorker}
          />
        </>
      )}
    </div>
  );
}
