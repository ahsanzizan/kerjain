import { type Role } from "@prisma/client";
import { auth } from "../auth";

export const requireRole = async (requiredRole: Role) => {
  const session = await auth();

  if (!session || session?.user.role !== requiredRole)
    throw new Error("Unauthorized");

  return session.user;
};
