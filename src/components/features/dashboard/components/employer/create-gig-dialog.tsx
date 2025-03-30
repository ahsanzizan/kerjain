"use client";

import type React from "react";

import { useState } from "react";
import { CalendarIcon, MapPin, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";

interface Milestone {
  id: string;
  title: string;
}

interface FormData {
  title: string;
  description: string;
  pay: string;
  date: Date | undefined;
  address: string;
  latitude: number | null;
  longitude: number | null;
  categories: string[];
  milestones: Milestone[];
}

export function CreateGigDialog() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    pay: "",
    date: undefined,
    address: "",
    latitude: null,
    longitude: null,
    categories: [],
    milestones: [{ id: "1", title: "" }],
  });

  const handleChange = (field: keyof FormData, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted with data:", formData);
    setOpen(false);
  };

  const handleAddCategory = (category: string) => {
    if (category && !formData.categories.includes(category)) {
      handleChange("categories", [...formData.categories, category]);
    }
  };

  const handleRemoveCategory = (category: string) => {
    handleChange(
      "categories",
      formData.categories.filter((c) => c !== category),
    );
  };

  const getCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          handleChange("latitude", position.coords.latitude);
          handleChange("longitude", position.coords.longitude);
        },
        (error) => {
          console.error("Error getting location", error);
        },
      );
    }
  };

  const handleAddMilestone = () => {
    const newId = (formData.milestones.length + 1).toString();
    handleChange("milestones", [
      ...formData.milestones,
      { id: newId, title: "" },
    ]);
  };

  const handleRemoveMilestone = (id: string) => {
    if (formData.milestones.length > 1) {
      handleChange(
        "milestones",
        formData.milestones.filter((m) => m.id !== id),
      );
    }
  };

  const handleMilestoneChange = (id: string, title: string) => {
    handleChange(
      "milestones",
      formData.milestones.map((m) => (m.id === id ? { ...m, title } : m)),
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Buat Gig Baru
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Buat Gig Baru</DialogTitle>
            <DialogDescription>
              Isi detail gig yang ingin Anda posting. Klik simpan ketika
              selesai.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Judul</Label>
              <Input
                id="title"
                placeholder="Masukkan judul gig"
                required
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                placeholder="Jelaskan detail pekerjaan yang dibutuhkan"
                className="min-h-[100px]"
                required
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="pay">Bayaran (Rp)</Label>
                <Input
                  id="pay"
                  type="number"
                  placeholder="Masukkan jumlah bayaran"
                  min="0"
                  required
                  value={formData.pay}
                  onChange={(e) => handleChange("pay", e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label>Deadline</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.date && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.date
                        ? format(formData.date, "PPP", { locale: id })
                        : "Pilih tanggal"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.date}
                      onSelect={(date) => handleChange("date", date)}
                      initialFocus
                      locale={id}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address">Alamat</Label>
              <Input
                id="address"
                placeholder="Masukkan alamat lokasi pekerjaan"
                required
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Button
                variant="default"
                onClick={getCurrentLocation}
                className="w-full"
                type="button"
              >
                <MapPin className="mr-2 h-4 w-4" /> Gunakan lokasi saat ini
              </Button>
              {formData.latitude && formData.longitude && (
                <p className="text-muted-foreground text-sm">
                  Koordinat:{" "}
                  <span className="text-primary-500">
                    {formData.latitude.toFixed(4)},{" "}
                    {formData.longitude.toFixed(4)}
                  </span>
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label>Kategori</Label>
              <div className="mb-2 flex flex-wrap gap-2">
                {formData.categories.map((category) => (
                  <div
                    key={category}
                    className="bg-secondary text-secondary-foreground flex items-center rounded-full px-3 py-1 text-sm"
                  >
                    {category}
                    <button
                      type="button"
                      className="text-muted-foreground hover:text-foreground ml-2"
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
                  <SelectItem value="Pengembangan Web">
                    Pengembangan Web
                  </SelectItem>
                  <SelectItem value="Penulisan">Penulisan</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Administrasi">Administrasi</SelectItem>
                  <SelectItem value="Penerjemahan">Penerjemahan</SelectItem>
                  <SelectItem value="Video & Animasi">
                    Video & Animasi
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Milestone Section */}
            <Separator className="my-2" />
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label>Milestone</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddMilestone}
                >
                  <Plus className="mr-1 h-4 w-4" /> Tambah Milestone
                </Button>
              </div>
              <div className="text-muted-foreground mb-2 text-sm">
                Bagi pekerjaan menjadi beberapa tahapan untuk memudahkan
                pelacakan progres.
              </div>

              <div className="space-y-3">
                {formData.milestones.map((milestone, index) => (
                  <Card key={milestone.id} className="overflow-hidden">
                    <CardContent className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary text-primary-foreground flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium">
                          {index + 1}
                        </div>
                        <Input
                          value={milestone.title}
                          onChange={(e) =>
                            handleMilestoneChange(milestone.id, e.target.value)
                          }
                          placeholder={`Milestone ${index + 1}`}
                          className="flex-1"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground h-8 w-8 p-0"
                          onClick={() => handleRemoveMilestone(milestone.id)}
                          disabled={formData.milestones.length <= 1}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Hapus</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Batal
            </Button>
            <Button type="submit">Simpan</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
