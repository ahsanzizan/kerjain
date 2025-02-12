"use server";

import { z } from "zod";
import { db } from "../../db";
import { requireRole } from "../../utils/requireRole";
import { validateActionInput } from "../../utils/validateActionInput";

export const applyForGig = async (input: {
  gigId: string;
  message?: string;
}) => {
  validateActionInput(
    input,
    z.object({
      gigId: z.string().uuid(),
      message: z.string().optional(),
    }),
  );

  const user = await requireRole("WORKER");

  return db.application.create({
    data: {
      gigId: input.gigId,
      workerId: user.id,
      message: input.message,
    },
  });
};
