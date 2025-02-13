import { type Prisma, Role } from "@prisma/client";
import { z } from "zod";
import { db } from "../db";

const schema = z.object({
  page: z.number().min(1).default(1),
  perPage: z.number().min(1).max(50).default(10),
  role: z.nativeEnum(Role).optional(),
  search: z.string().optional(),
  sortBy: z.enum(["createdAt", "name", "email"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

/**
 * Retrieves a paginated list of users with optional filtering and sorting.
 */
export const getPaginatedUsers = async (input: {
  page?: number;
  perPage?: number;
  role?: Role;
  search?: string;
  sortBy?: "createdAt" | "name" | "email";
  sortOrder?: "asc" | "desc";
}) => {
  const validated = schema.parse(input);
  const { page, perPage, role, search, sortBy, sortOrder } = validated;

  const filters: Prisma.UserWhereInput = {
    ...(role && { role }),
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ],
    }),
  };

  const [users, totalUsers] = await Promise.all([
    db.user.findMany({
      where: filters,
      orderBy: sortBy ? { [sortBy]: sortOrder } : undefined,
      take: perPage,
      skip: (page - 1) * perPage,
    }),
    db.user.count({ where: filters }),
  ]);

  return {
    users,
    totalUsers,
    totalPages: Math.ceil(totalUsers / perPage),
    currentPage: page,
  };
};

/**
 * Searches for users by name, email, or role.
 */
export const searchUsers = async (query: string) => {
  return db.user.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { email: { contains: query, mode: "insensitive" } },
      ],
    },
    orderBy: { name: "asc" },
  });
};
