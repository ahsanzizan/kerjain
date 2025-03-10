import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const formatRupiah = (n: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
};

export const calculateDistanceInKm = (
  pos1: { lat: number; lng: number },
  pos2: { lat: number; lng: number },
) => {
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

  const R = 6371;
  const dLat = toRadians(pos2.lat - pos1.lat);
  const dLon = toRadians(pos2.lng - pos1.lng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(pos1.lat)) *
      Math.cos(toRadians(pos2.lat)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
};
