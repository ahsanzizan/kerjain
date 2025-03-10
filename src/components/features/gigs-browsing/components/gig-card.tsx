"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { calculateDistanceInKm, formatDate, formatRupiah } from "@/lib/utils";
import { getAddressByLatLong } from "@/services/get-address-by-latlong";
import { type GigStatus } from "@prisma/client";
import { Calendar, DollarSign, LocateIcon, Tag } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { type GigCardProps } from "../types";

export const GigCard: React.FC<GigCardProps> = ({
  gig,
  onViewDetails,
  userLat,
  userLong,
}) => {
  const [address, setAddress] = useState<string | null>(null);
  const [loadingAddress, setLoadingAddress] = useState<boolean>(true);

  const distanceInKm = useMemo(
    () =>
      userLat && userLong
        ? calculateDistanceInKm(
            { lat: gig.latitude, lng: gig.longitude },
            { lat: Number(userLat), lng: Number(userLong) },
          )
        : null,
    [gig.latitude, gig.longitude, userLat, userLong],
  );

  useEffect(() => {
    async function fetchAddress() {
      if (!gig.latitude || !gig.longitude) return;
      try {
        const result = await getAddressByLatLong(gig.latitude, gig.longitude);
        setAddress(result);
      } catch (error) {
        console.error("Error fetching address:", error);
        setAddress(null);
      } finally {
        setLoadingAddress(false);
      }
    }
    fetchAddress().catch((e) => console.error(e));
  }, [gig.latitude, gig.longitude]);

  const getStatusBadgeVariant = (
    status: GigStatus,
  ): "secondary" | "outline" | "default" | "destructive" => {
    switch (status) {
      case "OPEN":
        return "default";
      case "IN_PROGRESS":
        return "secondary";
      case "COMPLETED":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getStatusLabel = (status: GigStatus) => {
    switch (status) {
      case "OPEN":
        return "Terbuka";
      case "IN_PROGRESS":
        return "Sedang Berlangsung";
      case "COMPLETED":
        return "Selesai";
      default:
        return status;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{gig.title}</CardTitle>
          <Badge
            variant={getStatusBadgeVariant(gig.status)}
            className="bg-green-500 hover:bg-green-700"
          >
            {getStatusLabel(gig.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="mb-4 text-sm text-gray-500">{gig.description}</p>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <DollarSign className="text-gray-400" size={16} />
            <span className="w-[90%] font-medium">{formatRupiah(gig.pay)}</span>
          </div>

          <div className="flex items-center justify-between">
            <Calendar className="text-gray-400" size={16} />
            <span className="w-[90%] text-sm">
              Tenggat: {formatDate(gig.deadline)}
            </span>
          </div>

          {loadingAddress ? (
            <div className="flex items-center justify-between">
              <LocateIcon className="text-gray-400" size={16} />
              <span className="w-[90%] text-sm">Mengambil alamat...</span>
            </div>
          ) : address && distanceInKm ? (
            <div className="flex items-center justify-between">
              <LocateIcon className="text-gray-400" size={16} />
              <span className="w-[90%] text-sm">
                Lokasi: {address} ({distanceInKm} KM)
              </span>
            </div>
          ) : null}

          <div className="flex items-center justify-between">
            <Tag className="text-gray-400" size={16} />
            <div className="flex w-[90%] flex-wrap gap-1">
              {/* eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */}
              {gig.categories.map((cat, index) => (
                <Badge
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                  key={index}
                  variant="outline"
                  className="bg-blue-50 text-blue-700 hover:bg-blue-100"
                >
                  {cat}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button className="w-full" onClick={() => onViewDetails(gig.id)}>
          Lihat Detail
        </Button>
      </CardFooter>
    </Card>
  );
};
