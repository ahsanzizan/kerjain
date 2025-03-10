import { type Gig } from "@prisma/client";

export interface Location {
  latitude: number;
  longitude: number;
}

export interface GigCardProps {
  gig: Gig;
  onViewDetails: (id: string) => void;
}

export type GigStatus = "OPEN" | "IN_PROGRESS" | "COMPLETED";
export type SortByOption = "pay" | "deadline" | "distance";
export type SortOrderOption = "asc" | "desc";
