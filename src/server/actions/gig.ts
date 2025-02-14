"use server";

import { z } from "zod";
import { db } from "../db";
import { errorResponse, successResponse } from "../utils/action-response";
import { requireRole } from "../utils/require-role";

const createGigSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  location: z.string().min(3),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  pay: z.number().positive(),
  deadline: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
  category: z.string(),
  employerId: z.string().uuid(),
});

export const createGig = async (input: {
  title: string;
  description: string;
  location: string;
  latitude: number;
  longitude: number;
  pay: number;
  deadline: string;
  category: string;
  employerId: string;
}) => {
  try {
    const data = createGigSchema.parse(input);

    await requireRole("EMPLOYER");

    const createdGig = await db.gig.create({
      data: {
        ...data,
        deadline: new Date(data.deadline),
      },
    });

    return successResponse({ gig: createdGig }, "Gig created successfully");
  } catch (error) {
    console.error(error);
    return errorResponse("Failed to create gig");
  }
};

export const cancelGig = async (input: { gigId: string }) => {
  try {
    const schema = z.object({
      gigId: z.string().uuid(),
    });

    const session = await requireRole("EMPLOYER");

    const { gigId } = schema.parse(input);

    const gig = await db.gig.findUnique({
      where: { id: gigId },
      include: { applications: true },
    });

    if (!gig) return errorResponse("Gig not found");

    if (gig.employerId !== session.id)
      return errorResponse("You are not the employer of this gig");

    if (gig.status !== "OPEN")
      return errorResponse("Only open gigs can be canceled");

    if (
      gig.applications.some((application) => application.status !== "PENDING")
    )
      return errorResponse(
        "You cannot cancel a gig that already has applications.",
      );

    const updatedGig = await db.gig.update({
      where: { id: gigId },
      data: { status: "CANCELED" },
    });

    return successResponse({ gig: updatedGig }, "Gig canceled successfully");
  } catch (error) {
    console.error(error);
    return errorResponse("Failed to cancel gig");
  }
};
