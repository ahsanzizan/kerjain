"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type Gig } from "@prisma/client";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  MapPin,
  PackageOpen,
  RefreshCw,
  Search,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { GigCard } from "../components/gig-card";
import { GigCardSkeleton } from "../components/gig-card-skeleton";
import { type SortByOption, type SortOrderOption } from "../types";

export const FindGigsPage: React.FC<{
  gigs: Gig[];
  categories: string[];
  totalGigs: number;
  totalPages: number;
  hasActiveFilters: boolean;
}> = ({ gigs, categories, totalGigs, totalPages, hasActiveFilters }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get values from search params with defaults
  const getParamValue = (param: string, defaultValue: string) =>
    searchParams.get(param) ?? defaultValue;

  // Local state for form inputs (before submission)
  const [searchInput, setSearchInput] = useState(getParamValue("search", ""));
  const [minPayInput, setMinPayInput] = useState(getParamValue("minPay", ""));
  const [maxPayInput, setMaxPayInput] = useState(getParamValue("maxPay", ""));
  const [categoryInput, setCategoryInput] = useState(
    getParamValue("category", ""),
  );

  // Get location values from URL if they exist
  const latitude = parseFloat(searchParams.get("lat") ?? "0") || null;
  const longitude = parseFloat(searchParams.get("lng") ?? "0") || null;

  // Local state for location management
  const [isLoadingLocation, setIsLoadingLocation] = useState<boolean>(false);
  const [locationEnabled, setLocationEnabled] = useState<boolean>(
    Boolean(latitude && longitude),
  );

  // Values from URL for display/logic
  const page = parseInt(getParamValue("page", "1"));
  const perPage = parseInt(getParamValue("perPage", "12"));
  const sortBy = getParamValue("sortBy", "deadline") as SortByOption;
  const sortOrder = getParamValue("sortOrder", "asc") as SortOrderOption;

  const updateUserLocation = (): void => {
    if (navigator.geolocation) {
      setIsLoadingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          // Update URL to include location
          createQueryString({
            lat: lat.toString(),
            lng: lng.toString(),
            page: "1", // Reset to first page when location changes
          });

          setLocationEnabled(true);
          setIsLoadingLocation(false);
        },
        () => {
          alert(
            "Tidak dapat mengakses lokasi Anda. Silakan periksa izin lokasi.",
          );
          setIsLoadingLocation(false);
        },
      );
    } else {
      alert("Geolokasi tidak didukung oleh browser ini.");
    }
  };

  const createQueryString = (params: Record<string, string>) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());

    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === "") {
        newSearchParams.delete(key);
      } else {
        newSearchParams.set(key, value);
      }
    });

    // Create the new URL with updated query params
    const queryString = newSearchParams.toString();
    router.push(`/worker/gigs${queryString ? `?${queryString}` : ""}`);
  };

  const handleSearch = (e: React.FormEvent): void => {
    e.preventDefault();

    // Update search params and navigate
    createQueryString({
      search: searchInput,
      minPay: minPayInput,
      maxPay: maxPayInput,
      category: categoryInput === "ALL" ? "" : categoryInput,
      page: "1", // Reset to first page when searching
    });
  };

  const handlePageChange = (newPage: number): void => {
    createQueryString({ page: newPage.toString() });
  };

  const handlePerPageChange = (newPerPage: string): void => {
    createQueryString({
      perPage: newPerPage,
      page: "1", // Reset to first page when changing per page
    });
  };

  const handleSortByChange = (value: string): void => {
    createQueryString({
      sortBy: value,
      page: "1",
    });
  };

  const handleSortOrderChange = (value: string): void => {
    createQueryString({
      sortOrder: value,
      page: "1",
    });
  };

  const handleViewDetails = (gigId: string): void => {
    router.push(`/gigs/${gigId}`);
  };

  const clearAllFilters = (): void => {
    setSearchInput("");
    setMinPayInput("");
    setMaxPayInput("");
    setCategoryInput("");

    // Clear all search parameters except location
    const newSearchParams = new URLSearchParams();
    if (latitude && longitude) {
      newSearchParams.set("lat", latitude.toString());
      newSearchParams.set("lng", longitude.toString());
    }

    router.push(
      `/gigs/find${newSearchParams.toString() ? `?${newSearchParams.toString()}` : ""}`,
    );
  };

  const renderNoGigsMessage = () => {
    if (totalGigs === 0) {
      // Case 1: No gigs exist in the system at all
      if (!hasActiveFilters) {
        return (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-12 text-center">
              <PackageOpen className="mb-4 h-16 w-16 text-gray-300" />
              <h3 className="mb-2 text-xl font-semibold">Belum Ada Gigs</h3>
              <p className="max-w-md text-gray-500">
                Saat ini belum ada gigs yang tersedia di platform. Silakan cek
                kembali nanti untuk menemukan pekerjaan baru.
              </p>
              <Button
                variant="ghost"
                className="mt-6"
                onClick={() => router.push("/worker")}
              >
                Kembali ke Dashboard
              </Button>
            </CardContent>
          </Card>
        );
      }

      // Case 2: No gigs match the current search filters
      return (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <Search className="mb-4 h-16 w-16 text-gray-300" />
            <h3 className="mb-2 text-xl font-semibold">Tidak Ada Hasil</h3>
            <p className="max-w-md text-gray-500">
              Tidak ada gigs yang sesuai dengan filter pencarian Anda. Coba
              kurangi kriteria filter untuk melihat lebih banyak hasil.
            </p>
            <Button
              variant="outline"
              className="mt-6"
              onClick={clearAllFilters}
            >
              Hapus Semua Filter
            </Button>
          </CardContent>
        </Card>
      );
    }

    return null;
  };

  return (
    <div className="mx-auto max-w-6xl p-4">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <Button
          variant="ghost"
          className="flex items-center gap-2"
          onClick={() => router.push("/worker")}
        >
          <ArrowLeft size={18} />
          Kembali ke Dashboard
        </Button>
        <Button
          variant={locationEnabled ? "outline" : "default"}
          className={
            locationEnabled
              ? "gap-2 bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700"
              : "gap-2"
          }
          onClick={updateUserLocation}
          disabled={isLoadingLocation}
        >
          {isLoadingLocation ? (
            <RefreshCw className="animate-spin" size={18} />
          ) : (
            <MapPin size={18} />
          )}
          {locationEnabled ? "Perbarui Lokasi" : "Dapatkan Lokasi"}
        </Button>
      </div>

      <h1 className="mb-6 text-3xl font-bold">Temukan Gigs</h1>

      {/* Filter section */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle>Filter Pencarian</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch}>
            {/* Search bar */}
            <div className="mb-6 flex gap-2">
              <div className="relative flex-grow">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <Input
                  type="text"
                  className="pl-10"
                  placeholder="Cari gigs..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </div>
              <Button type="submit">Cari</Button>
            </div>

            {/* Filters grid */}
            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* Category filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Kategori</label>
                <Select value={categoryInput} onValueChange={setCategoryInput}>
                  <SelectTrigger>
                    <SelectValue placeholder="Semua Kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Semua Kategori</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Min pay filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Gaji Minimum (Rp)</label>
                <Input
                  type="number"
                  placeholder="Contoh: 50000"
                  value={minPayInput}
                  onChange={(e) => setMinPayInput(e.target.value)}
                />
              </div>

              {/* Max pay filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Gaji Maksimum (Rp)
                </label>
                <Input
                  type="number"
                  placeholder="Contoh: 500000"
                  value={maxPayInput}
                  onChange={(e) => setMaxPayInput(e.target.value)}
                />
              </div>

              {/* Sort by filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Urutkan Berdasarkan
                </label>
                <Select value={sortBy} onValueChange={handleSortByChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pay">Gaji</SelectItem>
                    <SelectItem value="deadline">Tenggat Waktu</SelectItem>
                    {locationEnabled && (
                      <SelectItem value="distance">Jarak</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Sort order filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Urutan</label>
                <Select value={sortOrder} onValueChange={handleSortOrderChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">
                      Naik (
                      {sortBy === "pay"
                        ? "Terendah ke Tertinggi"
                        : sortBy === "deadline"
                          ? "Terdekat ke Terjauh"
                          : "Terdekat ke Terjauh"}
                      )
                    </SelectItem>
                    <SelectItem value="desc">
                      Turun (
                      {sortBy === "pay"
                        ? "Tertinggi ke Terendah"
                        : sortBy === "deadline"
                          ? "Terjauh ke Terdekat"
                          : "Terjauh ke Terdekat"}
                      )
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Per page filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Tampilkan per halaman
                </label>
                <Select
                  value={perPage.toString()}
                  onValueChange={handlePerPageChange}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12">12</SelectItem>
                    <SelectItem value="24">24</SelectItem>
                    <SelectItem value="36">36</SelectItem>
                    <SelectItem value="48">48</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-between">
              {hasActiveFilters && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={clearAllFilters}
                >
                  Hapus Semua Filter
                </Button>
              )}
              <Button
                type="submit"
                className={hasActiveFilters ? "" : "w-full sm:w-auto"}
              >
                Terapkan Filter
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="mb-6">
        <h2 className="mb-4 text-xl font-semibold">Hasil Pencarian</h2>

        {isLoadingLocation ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <GigCardSkeleton key={i} />
              ))}
          </div>
        ) : gigs.length === 0 ? (
          renderNoGigsMessage()
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {gigs.map((gig) => (
                <GigCard
                  key={gig.id}
                  gig={gig}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Menampilkan {Math.min(totalGigs, (page - 1) * perPage + 1)} -{" "}
                {Math.min(page * perPage, totalGigs)} dari {totalGigs} gigs
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => handlePageChange(page - 1)}
                >
                  <ChevronLeft size={16} className="mr-1" />
                  Sebelumnya
                </Button>
                <span className="text-sm">
                  {page} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === totalPages}
                  onClick={() => handlePageChange(page + 1)}
                >
                  Berikutnya
                  <ChevronRight size={16} className="ml-1" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
