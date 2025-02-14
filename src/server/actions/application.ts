"use server";

import { z } from "zod";
import { db } from "../db";
import { errorResponse, successResponse } from "../utils/action-response";
import { requireRole } from "../utils/require-role";
import { validateActionInput } from "../utils/validate-action-input";

export const acceptApplication = async (input: { applicationId: string }) => {
  try {
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

    if (!application) return errorResponse("Application not found");
    if (application.gig.employerId !== user.id)
      return errorResponse("Not your gig");

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

    return successResponse("Application accepted successfully");
  } catch (error) {
    console.error(error);
    return errorResponse("An unexpected error occurred");
  }
};

export const applyForGig = async (input: {
  gigId: string;
  message?: string;
}) => {
  try {
    validateActionInput(
      input,
      z.object({
        gigId: z.string().uuid(),
        message: z.string().optional(),
      }),
    );

    const gig = await db.gig.findUnique({ where: { id: input.gigId } });

    if (!gig) return errorResponse("Gig not found.");

    if (gig.status !== "OPEN")
      return errorResponse("This gig is not open for workers.");

    const user = await requireRole("WORKER");

    const application = await db.application.create({
      data: {
        gigId: input.gigId,
        workerId: user.id,
        message: input.message,
      },
    });

    return successResponse(
      {
        application,
      },
      "Application submitted successfully",
    );
  } catch (error) {
    console.error(error);
    return errorResponse("An unexpected error occurred");
  }
};
