"use client"

import type React from "react"

import { useState } from "react"
import { CalendarIcon, Plus, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"

interface Milestone {
  id: string
  title: string
  status?: "PENDING" | "COMPLETED"
}

interface Gig {
  id: string
  title: string
  status: "OPEN" | "IN_PROGRESS" | "COMPLETED" | "CANCELED"
  pay: number
  deadline: string
  applications: number
  description?: string
  address?: string
  categories?: string[]
}

interface EditGigDialogProps {
  gig: Gig
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditGigDialog({ gig, open, onOpenChange }: EditGigDialogProps) {
  // Mock data for the full gig details
  const fullGig = {
    ...gig,
    description:
      gig.description || "Ini adalah deskripsi lengkap dari gig yang mencakup semua detail pekerjaan yang dibutuhkan.",
    address: gig.address || "Jl. Sudirman No. 123, Jakarta Pusat",
    categories: gig.categories || ["Desain", "Pengembangan Web"],
    latitude: -6.2088,
    longitude: 106.8456,
  }

  // Mock data for milestones
  const initialMilestones: Milestone[] =
    gig.status === "OPEN"
      ? [
          { id: "1", title: "Analisis kebutuhan dan perencanaan" },
          { id: "2", title: "Desain dan pengembangan" },
          { id: "3", title: "Testing dan deployment" },
        ]
      : [
          { id: "1", title: "Analisis kebutuhan dan perencanaan", status: "COMPLETED" },
          { id: "2", title: "Desain dan pengembangan", status: "PENDING" },
          { id: "3", title: "Testing dan deployment", status: "PENDING" },
        ]

  const [date, setDate] = useState<Date>(new Date(fullGig.deadline))
  const [categories, setCategories] = useState<string[]>(fullGig.categories)
  const [status, setStatus] = useState<string>(fullGig.status)
  const [milestones, setMilestones] = useState<Milestone[]>(initialMilestones)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Form submitted with milestones:", milestones)
    onOpenChange(false)
  }

  const handleAddCategory = (category: string) => {
    if (category && !categories.includes(category)) {
      setCategories([...categories, category])
    }
  }

  const handleRemoveCategory = (category: string) => {
    setCategories(categories.filter((c) => c !== category))
  }

  const handleAddMilestone = () => {
    const newId = (milestones.length + 1).toString()
    setMilestones([...milestones, { id: newId, title: "", status: "PENDING" }])
  }

  const handleRemoveMilestone = (id: string) => {
    if (milestones.length > 1) {
      setMilestones(milestones.filter((m) => m.id !== id))
    }
  }

  const handleMilestoneChange = (id: string, title: string) => {
    setMilestones(milestones.map((m) => (m.id === id ? { ...m, title } : m)))
  }

  // Check if milestones can be edited (only for OPEN gigs)
  const canEditMilestones = gig.status === "OPEN"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Gig</DialogTitle>
            <DialogDescription>Ubah detail gig yang ingin Anda perbarui. Klik simpan ketika selesai.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Judul</Label>
              <Input id="title" defaultValue={fullGig.title} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea id="description" defaultValue={fullGig.description} className="min-h-[100px]" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="pay">Bayaran (Rp)</Label>
                <Input id="pay" type="number" defaultValue={fullGig.pay} min="0" required />
              </div>
              <div className="grid gap-2">
                <Label>Deadline</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP", { locale: id }) : "Pilih tanggal"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus locale={id} />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select defaultValue={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OPEN">Terbuka</SelectItem>
                  <SelectItem value="IN_PROGRESS">Dalam Proses</SelectItem>
                  <SelectItem value="COMPLETED">Selesai</SelectItem>
                  <SelectItem value="CANCELED">Dibatalkan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address">Alamat</Label>
              <Input id="address" defaultValue={fullGig.address} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="latitude">Latitude</Label>
                <Input id="latitude" type="number" step="0.000001" defaultValue={fullGig.latitude} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="longitude">Longitude</Label>
                <Input id="longitude" type="number" step="0.000001" defaultValue={fullGig.longitude} required />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Kategori</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {categories.map((category) => (
                  <div
                    key={category}
                    className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm flex items-center"
                  >
                    {category}
                    <button
                      type="button"
                      className="ml-2 text-muted-foreground hover:text-foreground"
                      onClick={() => handleRemoveCategory(category)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <Select onValueChange={handleAddCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori untuk ditambahkan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Desain">Desain</SelectItem>
                  <SelectItem value="Pengembangan Web">Pengembangan Web</SelectItem>
                  <SelectItem value="Penulisan">Penulisan</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Administrasi">Administrasi</SelectItem>
                  <SelectItem value="Penerjemahan">Penerjemahan</SelectItem>
                  <SelectItem value="Video & Animasi">Video & Animasi</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Milestone Section */}
            <Separator className="my-2" />
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label>Milestone</Label>
                {canEditMilestones && (
                  <Button type="button" variant="outline" size="sm" onClick={handleAddMilestone}>
                    <Plus className="h-4 w-4 mr-1" /> Tambah Milestone
                  </Button>
                )}
              </div>
              <div className="text-sm text-muted-foreground mb-2">
                {canEditMilestones
                  ? "Bagi pekerjaan menjadi beberapa tahapan untuk memudahkan pelacakan progres."
                  : "Milestone tidak dapat diubah setelah gig berstatus selain 'Terbuka'."}
              </div>

              <div className="space-y-3">
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
                        {canEditMilestones ? (
                          <Input
                            value={milestone.title}
                            onChange={(e) => handleMilestoneChange(milestone.id, e.target.value)}
                            placeholder={`Milestone ${index + 1}`}
                            className="flex-1"
                            required
                          />
                        ) : (
                          <div className="flex-1 py-2 px-3 bg-muted rounded-md">
                            {milestone.title}
                            {milestone.status === "COMPLETED" && (
                              <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                                Selesai
                              </span>
                            )}
                          </div>
                        )}
                        {canEditMilestones && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-muted-foreground"
                            onClick={() => handleRemoveMilestone(milestone.id)}
                            disabled={milestones.length <= 1}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Hapus</span>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit">Simpan Perubahan</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

