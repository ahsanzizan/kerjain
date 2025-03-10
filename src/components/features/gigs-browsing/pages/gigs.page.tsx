import { getGigCategories, getPaginatedGigs } from "@/server/queries";
import { type Gig } from "@prisma/client";
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

  const mockGigs: Gig[] = [
    {
      id: "1",
      title: "Pengantaran Makanan",
      description:
        "Mengantar makanan ke alamat tujuan di area Jakarta Selatan. Dibutuhkan sepeda motor dan kotak pengiriman.",
      pay: 50000,
      deadline: new Date(Date.now() + 86400000),
      status: "OPEN",
      categories: ["Pengiriman"],
      createdAt: new Date(),
      updatedAt: new Date(),
      employerId: "kaoksdosk",
      latitude: -6.9237,
      longitude: 106.928726,
    },
    {
      id: "2",
      title: "Perbaikan Komputer",
      description:
        "Memperbaiki laptop yang tidak bisa menyala. Kemungkinan masalah pada motherboard.",
      pay: 200000,
      deadline: new Date(Date.now() + 172800000),
      status: "OPEN",
      categories: ["Teknologi"],
      createdAt: new Date(),
      updatedAt: new Date(),
      employerId: "kaoksdosk",
      latitude: 12,
      longitude: 12,
    },
    {
      id: "3",
      title: "Bersih-bersih Rumah",
      description:
        "Membersihkan apartemen 2 kamar termasuk dapur dan kamar mandi. Peralatan disediakan.",
      pay: 150000,
      deadline: new Date(Date.now() + 259200000),
      status: "OPEN",
      categories: ["Rumah Tangga"],
      createdAt: new Date(),
      updatedAt: new Date(),
      employerId: "kaoksdosk",
      latitude: 12,
      longitude: 12,
    },
    {
      id: "4",
      title: "Desain Logo",
      description:
        "Membuat logo untuk usaha kecil di bidang makanan. Dibutuhkan 3 konsep berbeda.",
      pay: 350000,
      deadline: new Date(Date.now() + 432000000),
      status: "OPEN",
      categories: ["Kreatif"],
      createdAt: new Date(),
      updatedAt: new Date(),
      employerId: "kaoksdosk",
      latitude: 12,
      longitude: 12,
    },
    {
      id: "5",
      title: "Les Matematika",
      description:
        "Mengajar matematika untuk anak SMP kelas 8. Durasi 2 jam per pertemuan.",
      pay: 100000,
      deadline: new Date(Date.now() + 345600000),
      status: "IN_PROGRESS",
      categories: ["Pendidikan"],
      createdAt: new Date(),
      updatedAt: new Date(),
      employerId: "kaoksdosk",
      latitude: 12,
      longitude: 12,
    },
    {
      id: "6",
      title: "Admin Media Sosial",
      description:
        "Membuat konten dan mengelola media sosial untuk toko online selama 1 minggu.",
      pay: 250000,
      deadline: new Date(Date.now() + 518400000),
      status: "OPEN",
      categories: ["Pemasaran", "Administrasi"],
      createdAt: new Date(),
      updatedAt: new Date(),
      employerId: "kaoksdosk",
      latitude: 12,
      longitude: 12,
    },
  ];

  return (
    <FindGigsPage
      gigs={[...result.gigs, ...mockGigs]}
      categories={categories}
      totalGigs={result.totalGigs}
      totalPages={result.totalPages}
      hasActiveFilters={result.totalGigs !== 0}
    />
  );
};
