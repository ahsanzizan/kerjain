"use server";

import { z } from "zod";
import { db } from "../db";
import { requireRole } from "../utils/require-role";
import { validateActionInput } from "../utils/validate-action-input";

export const acceptApplication = async (input: { applicationId: string }) => {
  validateActionInput(
    input,
    z.object({
      applicationId: z.string().uuid(),
    }),
  );

  const user = await requireRole("EMPLOYER");

  const application = await db.application.findUnique({
    where: { id: input.applicationId },
    include: { gig: true },
  });
  if (!application) throw new Error("Application not found");
  if (application.gig.employerId !== user.id) throw new Error("Not your gig");

  await db.$transaction([
    db.application.update({
      where: { id: input.applicationId },
      data: { status: "ACCEPTED" },
    }),
    db.application.updateMany({
      where: { gigId: application.gigId, id: { not: input.applicationId } },
      data: { status: "REJECTED" },
    }),
    db.gig.update({
      where: { id: application.gigId },
      data: { status: "IN_PROGRESS" },
    }),
  ]);
};

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

  const gig = await db.gig.findUnique({ where: { id: input.gigId } });

  if (!gig) throw new Error("Gig not found.");

  if (gig.status !== "OPEN")
    throw new Error("This gig is not open for workers.");

  const user = await requireRole("WORKER");

  return db.application.create({
    data: {
      gigId: input.gigId,
      workerId: user.id,
      message: input.message,
    },
  });
};
