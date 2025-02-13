import { db } from "@/server/db";
import { Prisma } from "@prisma/client";
import { z } from "zod";

const schema = z.object({
  page: z.number().min(1).default(1),
  perPage: z.number().min(1).max(50).default(10),
  status: z.enum(["OPEN", "IN_PROGRESS", "COMPLETED"]).optional(),
  category: z.string().optional(),
  minPay: z.number().min(0).optional(),
  maxPay: z.number().min(0).optional(),
  search: z.string().optional(),
  sortBy: z.enum(["pay", "deadline", "distance"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
  userLocation: z
    .object({
      latitude: z.number().min(-90).max(90),
      longitude: z.number().min(-180).max(180),
    })
    .optional(),
});

const buildPrismaFilters = (input: {
  status?: "OPEN" | "IN_PROGRESS" | "COMPLETED";
  category?: string;
  minPay?: number;
  maxPay?: number;
  search?: string;
}) => {
  const { status, category, minPay, maxPay, search } = input;

  return {
    ...(status && { status }),
    ...(category && { category }),
    ...(minPay || maxPay
      ? {
          pay: {
            ...(minPay !== undefined && { gte: minPay }),
            ...(maxPay !== undefined && { lte: maxPay }),
          },
        }
      : {}),
    ...(search && {
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ],
    }),
  } satisfies Prisma.GigWhereInput;
};

/**
 * Retrieves a paginated list of gigs with optional filters and sorting.
 * Supports sorting by pay, deadline, or distance (using raw SQL for geospatial sorting).
 *
 * @param {Object} input - The input parameters for fetching gigs.
 * @param {number} [input.page=1] - The current page number (1-based index).
 * @param {number} [input.perPage=10] - Number of gigs per page (max 50).
 * @param {"OPEN"|"IN_PROGRESS"|"COMPLETED"} [input.status] - Filter by gig status.
 * @param {string} [input.category] - Filter gigs by category.
 * @param {number} [input.minPay] - Minimum pay filter.
 * @param {number} [input.maxPay] - Maximum pay filter.
 * @param {string} [input.search] - Search query for gig title or description.
 * @param {"pay"|"deadline"|"distance"} [input.sortBy] - Sorting criteria.
 * @param {"asc"|"desc"} [input.sortOrder="asc"] - Sorting order (ascending or descending).
 * @param {{ latitude: number; longitude: number }} [input.userLocation] - User location for distance-based sorting.
 * @returns {Promise<{ gigs: Object[], totalGigs: number, totalPages: number, currentPage: number }>} The paginated gigs data.
 */
export const getPaginatedGigs = async (input: {
  page?: number;
  perPage?: number;
  status?: "OPEN" | "IN_PROGRESS" | "COMPLETED";
  category?: string;
  minPay?: number;
  maxPay?: number;
  search?: string;
  sortBy?: "pay" | "deadline" | "distance";
  sortOrder?: "asc" | "desc";
  userLocation?: { latitude: number; longitude: number };
}) => {
  const validated = schema.parse(input);
  const {
    page,
    perPage,
    status,
    category,
    minPay,
    maxPay,
    search,
    sortBy,
    sortOrder,
    userLocation,
  } = validated;

  // Construct Prisma filters
  const filters: Prisma.GigWhereInput = buildPrismaFilters({
    status,
    category,
    minPay,
    maxPay,
    search,
  });

  try {
    if (sortBy === "distance" && userLocation) {
      // Use raw SQL query for distance calculation
      const gigs = await db.$queryRaw<
        {
          id: string;
          title: string;
          description: string;
          pay: number;
          deadline: Date;
          latitude: number;
          longitude: number;
          distance: number;
        }[]
      >`
        SELECT *,
          (6371 * acos(
            cos(radians(${userLocation.latitude})) * 
            cos(radians(latitude)) * 
            cos(radians(longitude) - radians(${userLocation.longitude})) + 
            sin(radians(${userLocation.latitude})) * 
            sin(radians(latitude))
          )) AS distance
        FROM "Gig"
        WHERE ${Prisma.sql`${filters}`}
        ORDER BY distance ${Prisma.raw(sortOrder)}
        LIMIT ${perPage} OFFSET ${(page - 1) * perPage}
      `;

      const totalGigs = await db.gig.count({ where: filters });

      return {
        gigs,
        totalGigs,
        totalPages: Math.ceil(totalGigs / perPage),
        currentPage: page,
      };
    } else {
      // Standard Prisma sorting
      let orderBy: Prisma.GigOrderByWithRelationInput = {
        createdAt: sortOrder,
      };

      if (sortBy === "pay") {
        orderBy = { pay: sortOrder };
      } else if (sortBy === "deadline") {
        orderBy = { deadline: sortOrder };
      }

      const [gigs, totalGigs] = await Promise.all([
        db.gig.findMany({
          where: filters,
          orderBy,
          take: perPage,
          skip: (page - 1) * perPage,
        }),
        db.gig.count({ where: filters }),
      ]);

      return {
        gigs,
        totalGigs,
        totalPages: Math.ceil(totalGigs / perPage),
        currentPage: page,
      };
    }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(`Database error: ${error.message}`);
    }
    throw error;
  }
};
