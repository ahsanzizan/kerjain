import { z } from "zod";
import { auth } from "../../auth";
import { db } from "../../db";
import { validateActionInput } from "../../utils/validateActionInput";

export async function updateUserProfile(input: {
  name?: string;
  image?: string;
  address?: string;
  preferredRadius?: number;
  jobPreferences?: string[];
}) {
  validateActionInput(
    input,
    z.object({
      name: z.string().optional(),
      image: z.string().url().optional(),
      address: z.string().optional(),
      preferredRadius: z.number().min(1).max(100).optional(),
      jobPreferences: z.array(z.string()).optional(),
    }),
  );

  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  return db.user.update({
    where: { id: session.user.id },
    data: {
      ...input,
    },
  });
}
