"use client"

import { useState } from "react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

interface Application {
  id: string
  gigId: string
  workerId: string
  message: string
  status: "PENDING" | "ACCEPTED" | "REJECTED"
  createdAt: string
  worker: {
    id: string
    name: string
    image?: string
    rating: number
    completedGigs: number
  }
}

// Mock data for applications
const mockApplications: Application[] = [
  {
    id: "app_1",
    gigId: "gig_1",
    workerId: "worker_1",
    message:
      "Saya memiliki pengalaman 5 tahun dalam desain logo dan branding. Saya tertarik dengan proyek ini dan yakin dapat memberikan hasil yang memuaskan.",
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
    gigId: "gig_1",
    workerId: "worker_2",
    message:
      "Saya adalah desainer grafis dengan spesialisasi di logo perusahaan. Saya telah melihat brief Anda dan memiliki beberapa ide yang ingin saya diskusikan.",
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
    gigId: "gig_1",
    workerId: "worker_3",
    message:
      "Saya memiliki portofolio yang kuat dalam desain logo untuk berbagai industri. Saya dapat memberikan beberapa konsep awal dalam waktu 3 hari.",
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
]

interface GigApplicationsProps {
  gigId?: string
}

export function GigApplications({ gigId }: GigApplicationsProps) {
  const [applications, setApplications] = useState(mockApplications)
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)

  const filteredApplications = gigId ? applications.filter((app) => app.gigId === gigId) : applications

  const handleViewDetail = (application: Application) => {
    setSelectedApplication(application)
    setDetailDialogOpen(true)
  }

  // Update the handleAccept function to automatically reject all other applications for the same gig
  // and update the gig status to "IN_PROGRESS"

  const handleAccept = (applicationId: string) => {
    // First, update the selected application to ACCEPTED
    setApplications(
      applications.map((app) =>
        app.id === applicationId
          ? { ...app, status: "ACCEPTED" as const }
          : // Reject all other applications for the same gig
            app.id !== applicationId && app.gigId === selectedApplication?.gigId
            ? { ...app, status: "REJECTED" as const }
            : app,
      ),
    )

    // Close the dialog
    setDetailDialogOpen(false)

    // In a real app, you would also update the gig status to "IN_PROGRESS" here
    // and associate the selected worker with the gig
    console.log(`Application ${applicationId} accepted. All other applications for this gig have been rejected.`)
    console.log(`Gig ${selectedApplication?.gigId} status updated to IN_PROGRESS`)
  }

  // Add a function to check if a gig already has an accepted worker
  const gigHasAcceptedWorker = (gigId: string) => {
    return applications.some((app) => app.gigId === gigId && app.status === "ACCEPTED")
  }

  const handleReject = (applicationId: string) => {
    setApplications(
      applications.map((app) => (app.id === applicationId ? { ...app, status: "REJECTED" as const } : app)),
    )
    setDetailDialogOpen(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-amber-500 hover:bg-amber-600"
      case "ACCEPTED":
        return "bg-green-500 hover:bg-green-600"
      case "REJECTED":
        return "bg-red-500 hover:bg-red-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Tertunda"
      case "ACCEPTED":
        return "Diterima"
      case "REJECTED":
        return "Ditolak"
      default:
        return status
    }
  }

  return (
    <div className="space-y-4">
      {filteredApplications.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">Tidak ada aplikasi yang ditemukan</div>
      ) : (
        filteredApplications.map((application) => (
          <div
            key={application.id}
            className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={application.worker.image} alt={application.worker.name} />
                <AvatarFallback>{application.worker.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{application.worker.name}</div>
                <div className="text-sm text-muted-foreground">
                  Rating: {application.worker.rating} • {application.worker.completedGigs} gig selesai
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(application.status)}>{getStatusText(application.status)}</Badge>
              <Button variant="outline" size="sm" onClick={() => handleViewDetail(application)}>
                Lihat Detail
              </Button>
            </div>
          </div>
        ))
      )}

      {selectedApplication && (
        <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Detail Aplikasi</DialogTitle>
              <DialogDescription>Informasi lengkap tentang aplikasi pekerja</DialogDescription>
            </DialogHeader>

            <div className="py-4">
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={selectedApplication.worker.image} alt={selectedApplication.worker.name} />
                  <AvatarFallback>{selectedApplication.worker.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium text-lg">{selectedApplication.worker.name}</div>
                  <div className="text-sm text-muted-foreground">
                    Bergabung sejak {format(new Date("2024-01-15"), "MMMM yyyy", { locale: id })}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-sm font-medium">Rating</div>
                  <div className="text-2xl font-bold">{selectedApplication.worker.rating}</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Gig Selesai</div>
                  <div className="text-2xl font-bold">{selectedApplication.worker.completedGigs}</div>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="mb-4">
                <div className="text-sm font-medium mb-2">Pesan Aplikasi</div>
                <div className="p-3 bg-muted rounded-lg text-sm">{selectedApplication.message}</div>
              </div>

              <div className="mb-4">
                <div className="text-sm font-medium mb-2">Tanggal Aplikasi</div>
                <div className="text-sm">{format(new Date(selectedApplication.createdAt), "PPpp", { locale: id })}</div>
              </div>

              <div className="mb-4">
                <div className="text-sm font-medium mb-2">Status</div>
                <Badge className={getStatusColor(selectedApplication.status)}>
                  {getStatusText(selectedApplication.status)}
                </Badge>
              </div>
            </div>

            {gigHasAcceptedWorker(selectedApplication.gigId) && selectedApplication.status !== "ACCEPTED" && (
              <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-md mb-4">
                <p className="text-sm">
                  Gig ini sudah memiliki pekerja yang diterima. Menerima aplikasi ini akan membatalkan pekerja
                  sebelumnya.
                </p>
              </div>
            )}

            <DialogFooter>
              {selectedApplication.status === "PENDING" && (
                <>
                  <Button variant="outline" onClick={() => handleReject(selectedApplication.id)}>
                    Tolak
                  </Button>
                  <Button
                    onClick={() => handleAccept(selectedApplication.id)}
                    disabled={
                      gigHasAcceptedWorker(selectedApplication.gigId) && selectedApplication.status !== "ACCEPTED"
                    }
                  >
                    Terima
                  </Button>
                </>
              )}
              {selectedApplication.status !== "PENDING" && (
                <Button variant="outline" onClick={() => setDetailDialogOpen(false)}>
                  Tutup
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

