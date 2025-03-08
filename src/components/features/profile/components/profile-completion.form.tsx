"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateUserProfile } from "@/server/actions/profile";
import { useRouter } from "@bprogress/next";
import { MapPin, Plus, User, X } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "sonner";
// Enum for roles to match the schema
enum Role {
  NONE = "NONE",
  EMPLOYER = "EMPLOYER",
  WORKER = "WORKER",
}

const PREDEFINED_JOB_CATEGORIES = [
  "Cleaning",
  "Delivery",
  "Handyman",
  "Gardening",
  "Moving",
  "Tutoring",
  "Tech Support",
  "Pet Care",
] as const;

type PredefinedJobCategory = (typeof PREDEFINED_JOB_CATEGORIES)[number];
type CustomJobCategory = string;
// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
type JobCategory = PredefinedJobCategory | CustomJobCategory;

interface ProfileFormData {
  name: string;
  role: Role;
  latitude: number | null;
  longitude: number | null;
  address: string;
  preferredRadius: number;
  jobPreferences: JobCategory[];
}

export const ProfileCompletion: React.FC = () => {
  const [formData, setFormData] = useState<ProfileFormData>({
    name: "",
    role: Role.NONE,
    latitude: null,
    longitude: null,
    address: "",
    preferredRadius: 5, // Default 5 km
    jobPreferences: [],
  });
  const router = useRouter();
  const { update } = useSession();

  const [step, setStep] = useState<number>(1);
  const [customJobCategory, setCustomJobCategory] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleChange = <K extends keyof ProfileFormData>(
    field: K,
    value: ProfileFormData[K],
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleJobPreference = (category: JobCategory) => {
    setFormData((prev) => ({
      ...prev,
      jobPreferences: prev.jobPreferences.includes(category)
        ? prev.jobPreferences.filter((pref) => pref !== category)
        : [...prev.jobPreferences, category],
    }));
  };

  const addCustomJobCategory = () => {
    const trimmedCategory = customJobCategory.trim();
    if (trimmedCategory && !formData.jobPreferences.includes(trimmedCategory)) {
      toggleJobPreference(trimmedCategory);
      setCustomJobCategory("");
    }
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

  const validateStep = (): boolean => {
    switch (step) {
      case 1:
        return formData.name.trim() !== "" && formData.role !== Role.NONE;
      case 2:
        return formData.address.trim() !== "" && formData.preferredRadius > 0;
      case 3:
        return formData.jobPreferences.length > 0;
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Informasi Pribadi</h2>
            <div className="space-y-2">
              <Label className="flex items-center">
                <User className="mr-2 h-4 w-4" /> Nama
              </Label>
              <Input
                placeholder="Nama lengkap anda"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Pilih Peran Anda</Label>
              <Select
                value={formData.role}
                onValueChange={(value: Role) => handleChange("role", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih peran" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={Role.EMPLOYER}>
                    Ngasih Kerja{" "}
                    <span className="text-primary-500">(Employer)</span>
                  </SelectItem>
                  <SelectItem value={Role.WORKER}>
                    Nyari Kerja{" "}
                    <span className="text-primary-500">(Worker)</span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end">
              <Button
                onClick={() => validateStep() && setStep(2)}
                disabled={!validateStep()}
              >
                Next
              </Button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Detail Lokasi</h2>
            <div className="space-y-2">
              <Label className="flex items-center">
                <MapPin className="mr-2 h-4 w-4" /> Alamat
              </Label>
              <Input
                placeholder="Alamat lengkap anda"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Preferensi Jarak (kilometer)</Label>
              <Input
                type="number"
                placeholder="Seberapa jauh Anda bersedia pergi?"
                value={formData.preferredRadius}
                onChange={(e) =>
                  handleChange("preferredRadius", parseFloat(e.target.value))
                }
                min={1}
                required
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
            <div className="flex justify-between">
              <Button
                variant="outline"
                type="button"
                onClick={() => setStep(1)}
              >
                Kembali
              </Button>
              <Button
                onClick={() => validateStep() && setStep(3)}
                disabled={!validateStep()}
              >
                Lanjut
              </Button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Job Preferences</h2>

            {/* Predefined Categories */}
            <div className="mb-4 grid grid-cols-2 gap-2">
              {PREDEFINED_JOB_CATEGORIES.map((category) => (
                <Button
                  key={category}
                  type="button"
                  variant={
                    formData.jobPreferences.includes(category)
                      ? "default"
                      : "outline"
                  }
                  onClick={() => toggleJobPreference(category)}
                  className="w-full"
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Custom Job Category Input */}
            <div className="space-y-2">
              <Label>Tambah Kategori Lainnya</Label>
              <div className="flex space-x-2">
                <Input
                  placeholder="Masukkan kategori lainnya"
                  value={customJobCategory}
                  onChange={(e) => setCustomJobCategory(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addCustomJobCategory();
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={addCustomJobCategory}
                  disabled={!customJobCategory.trim()}
                >
                  <Plus />
                </Button>
              </div>
            </div>

            {/* Selected Job Preferences */}
            {formData.jobPreferences.length > 0 && (
              <div className="space-y-2">
                <Label>Selected Job Preferences</Label>
                <div className="flex flex-wrap gap-2">
                  {formData.jobPreferences.map((category) => (
                    <Button
                      key={category}
                      type="button"
                      variant="secondary"
                      className="flex items-center space-x-2"
                      onClick={() => toggleJobPreference(category)}
                    >
                      <span>{category}</span>
                      <X className="h-4 w-4" />
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between">
              <Button
                variant="outline"
                type="button"
                onClick={() => setStep(2)}
              >
                Back
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button disabled={!validateStep()}>Kirim</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Konfirmasi Pengisian Profil
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Tinjau profil anda terlebih dahulu sebelum mengirim:
                    </AlertDialogDescription>
                    <ul className="mt-4 space-y-2 text-sm text-text-600 [&>li>span]:text-primary-500">
                      <li>
                        Nama: <span>{formData.name}</span>
                      </li>
                      <li>
                        Peran: <span>{formData.role}</span>
                      </li>
                      <li>
                        Alamat: <span>{formData.address}</span>
                      </li>
                      <li>
                        Preferensi Jarak:{" "}
                        <span>{formData.preferredRadius}km</span>
                      </li>
                      <li>
                        Preferensi Pekerjaan:{" "}
                        <span>{formData.jobPreferences.join(", ")}</span>
                      </li>
                    </ul>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Ubah</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={async () => {
                        setLoading(true);
                        const loadingToast = toast.loading("Loading...");

                        const registerResult = await updateUserProfile({
                          ...formData,
                          latitude: formData.latitude ?? undefined,
                          longitude: formData.longitude ?? undefined,
                        });

                        if (!registerResult.success) {
                          setLoading(false);
                          toast.error(registerResult.message, {
                            id: loadingToast,
                          });
                          return;
                        }

                        await update({
                          user: { name: formData.name, role: formData.role },
                        });

                        toast.success("Berhasil memperbarui profil!", {
                          id: loadingToast,
                        });
                        setLoading(false);
                        router.push("/");
                      }}
                      disabled={loading}
                    >
                      Kirim Profil
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-lg bg-white p-6 shadow-md">
      <Link href={"/"} className="w-fit">
        <span className="block aspect-[16/5] w-32 bg-[url(/logo.png)] bg-contain bg-no-repeat text-transparent">
          Kerjain
        </span>
      </Link>
      <div className="mb-6 flex justify-center">
        <div className="flex space-x-2">
          {[1, 2, 3].map((num) => (
            <div
              key={num}
              className={`h-2 w-2 rounded-full ${step === num ? "bg-primary" : "bg-muted"}`}
            />
          ))}
        </div>
      </div>
      {renderStep()}
    </div>
  );
};
