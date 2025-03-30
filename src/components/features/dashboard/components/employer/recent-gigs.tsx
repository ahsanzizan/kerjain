"use client"

import { useState } from "react"
import { CalendarDays, MoreHorizontal, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ViewGigDialog } from "./view-gig-dialog"
import { EditGigDialog } from "./edit-gig-dialog"
import { DeleteGigDialog } from "./delete-gig-dialog"

interface Gig {
  id: string
  title: string
  status: "OPEN" | "IN_PROGRESS" | "COMPLETED" | "CANCELED"
  pay: number
  deadline: string
  applications: number
}

// Mock data for gigs
const mockGigs: Gig[] = [
  {
    id: "gig_1",
    title: "Desain Logo Perusahaan",
    status: "OPEN",
    pay: 1500000,
    deadline: "2025-04-15",
    applications: 8,
  },
  {
    id: "gig_2",
    title: "Pengembangan Website E-commerce",
    status: "IN_PROGRESS",
    pay: 5000000,
    deadline: "2025-05-20",
    applications: 12,
  },
  {
    id: "gig_3",
    title: "Penulisan Konten Blog",
    status: "COMPLETED",
    pay: 800000,
    deadline: "2025-03-10",
    applications: 5,
  },
  {
    id: "gig_4",
    title: "Pembuatan Video Promosi",
    status: "OPEN",
    pay: 2500000,
    deadline: "2025-04-30",
    applications: 3,
  },
  {
    id: "gig_5",
    title: "Penerjemahan Dokumen",
    status: "IN_PROGRESS",
    pay: 1200000,
    deadline: "2025-04-25",
    applications: 7,
  },
]

interface RecentGigsProps {
  showAll?: boolean
}

export function RecentGigs({ showAll = false }: RecentGigsProps) {
  const [selectedGig, setSelectedGig] = useState<Gig | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const displayGigs = showAll ? mockGigs : mockGigs.slice(0, 3)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "OPEN":
        return "bg-green-500 hover:bg-green-600"
      case "IN_PROGRESS":
        return "bg-blue-500 hover:bg-blue-600"
      case "COMPLETED":
        return "bg-purple-500 hover:bg-purple-600"
      case "CANCELED":
        return "bg-red-500 hover:bg-red-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "OPEN":
        return "Terbuka"
      case "IN_PROGRESS":
        return "Dalam Proses"
      case "COMPLETED":
        return "Selesai"
      case "CANCELED":
        return "Dibatalkan"
      default:
        return status
    }
  }

  const handleView = (gig: Gig) => {
    setSelectedGig(gig)
    setViewDialogOpen(true)
  }

  const handleEdit = (gig: Gig) => {
    setSelectedGig(gig)
    setEditDialogOpen(true)
  }

  const handleDelete = (gig: Gig) => {
    setSelectedGig(gig)
    setDeleteDialogOpen(true)
  }

  return (
    <div className="space-y-4">
      {displayGigs.map((gig) => (
        <div key={gig.id} className="flex items-center justify-between p-4 border rounded-lg">
          <div className="grid gap-1">
            <div className="font-medium">{gig.title}</div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <CalendarDays className="h-3.5 w-3.5" />
                <span>Deadline: {new Date(gig.deadline).toLocaleDateString("id-ID")}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                <span>{gig.applications} aplikasi</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(gig.status)}>{getStatusText(gig.status)}</Badge>
            <div className="font-medium">Rp {gig.pay.toLocaleString("id-ID")}</div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleView(gig)}>Lihat Detail</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleEdit(gig)}>Edit</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDelete(gig)} className="text-red-600">
                  Hapus
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}

      {selectedGig && (
        <>
          <ViewGigDialog gig={selectedGig} open={viewDialogOpen} onOpenChange={setViewDialogOpen} />
          <EditGigDialog gig={selectedGig} open={editDialogOpen} onOpenChange={setEditDialogOpen} />
          <DeleteGigDialog gig={selectedGig} open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} />
        </>
      )}
    </div>
  )
}

