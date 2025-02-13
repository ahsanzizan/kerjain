import { db } from "@/server/db";
import { ApplicationStatus, Prisma } from "@prisma/client";
import { z } from "zod";

const schema = z.object({
  page: z.number().min(1).default(1),
  perPage: z.number().min(1).max(50).default(10),
  status: z.nativeEnum(ApplicationStatus).optional(),
  search: z.string().optional(),
  sortBy: z.enum(["createdAt", "updatedAt"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

/**
 * Retrieves a paginated list of applications with optional filtering and sorting.
 *
 * @param input - The input parameters for pagination and filtering.
 * @returns A paginated list of applications.
 */
export const getPaginatedApplications = async (input: {
  page?: number;
  perPage?: number;
  status?: "PENDING" | "APPROVED" | "REJECTED";
  search?: string;
  sortBy?: "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
}) => {
  const validated = schema.parse(input);
  const { page, perPage, status, search, sortBy, sortOrder } = validated;

  // Construct Prisma filters
  const filters: Prisma.ApplicationWhereInput = {
    ...(status && { status }),
    ...(search && {
      worker: { name: { contains: search, mode: "insensitive" } },
    }),
  };

  try {
    const [applications, totalApplications] = await Promise.all([
      db.application.findMany({
        where: filters,
        orderBy: sortBy ? { [sortBy]: sortOrder } : { createdAt: sortOrder },
        take: perPage,
        skip: (page - 1) * perPage,
      }),
      db.application.count({ where: filters }),
    ]);

    return {
      applications,
      totalApplications,
      totalPages: Math.ceil(totalApplications / perPage),
      currentPage: page,
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(`Database error: ${error.message}`);
    }
    throw error;
  }
};
