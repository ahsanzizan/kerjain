import { getGigCategories, getPaginatedGigs } from "@/server/queries";
import { type NextPage } from "next";
import { FindGigsPage } from "../components/gigs-page-display";
import {
  type Location,
  type SortByOption,
  type SortOrderOption,
} from "../types";

interface SearchParams {
  page?: string;
  perPage?: string;
  category?: string;
  minPay?: string;
  maxPay?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
  lat?: string;
  lng?: string;
}

interface GigsPageProps {
  searchParams: Promise<SearchParams>;
}

export const GigsPage: NextPage<GigsPageProps> = async ({
  searchParams: searchParamsInput,
}) => {
  const searchParams = await searchParamsInput;

  const page = parseInt(searchParams.page ?? "1", 10);
  const perPage = parseInt(searchParams.perPage ?? "12", 10);
  const category = searchParams.category ?? undefined;
  const minPay = searchParams.minPay
    ? parseInt(searchParams.minPay, 10)
    : undefined;
  const maxPay = searchParams.maxPay
    ? parseInt(searchParams.maxPay, 10)
    : undefined;
  const search = searchParams.search ?? undefined;
  const sortBy = (searchParams.sortBy ?? "deadline") as SortByOption;
  const sortOrder = (searchParams.sortOrder ?? "asc") as SortOrderOption;

  // Extract location from search params if available
  let userLocation: Location | undefined = undefined;
  const latitude = searchParams.lat ? parseFloat(searchParams.lat) : undefined;
  const longitude = searchParams.lng ? parseFloat(searchParams.lng) : undefined;

  if (latitude !== undefined && longitude !== undefined) {
    userLocation = { latitude, longitude };
  }

  // Fetch gigs on the server
  const [result, categories] = await Promise.all([
    getPaginatedGigs({
      page,
      perPage,
      status: "OPEN",
      category,
      minPay,
      maxPay,
      search,
      sortBy,
      sortOrder,
      userLocation,
    }),
    getGigCategories(),
  ]);

  return (
    <FindGigsPage
      gigs={result.gigs}
      categories={categories}
      totalGigs={result.totalGigs}
      totalPages={result.totalPages}
      hasActiveFilters={result.totalGigs !== 0}
    />
  );
};
