"use server";

import { z } from "zod";
import { db } from "../db";
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

export const evaluateGigPay = async (input: {
  category: string;
  pay: number;
}) => {
  const { category, pay } = input;

  const similarGigs = await db.gig.findMany({
    where: { category },
    select: { pay: true },
  });

  if (similarGigs.length < 2) return "No data available";

  // Extract pay values
  const payValues = similarGigs.map((gig) => gig.pay).sort((a, b) => a - b);

  const mid = Math.floor(payValues.length / 2);
  const medianPay =
    payValues.length % 2 === 0
      ? (payValues[mid - 1]! + payValues[mid]!) / 2
      : payValues[mid]!;

  if (pay < medianPay * 0.8) return "Low"; // Less than 80% of median
  if (pay > medianPay * 1.2) return "Generous"; // More than 120% of median
  return "Fair"; // Within the 80%-120% range
};

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
  const data = createGigSchema.parse(input);

  await requireRole("EMPLOYER");

  const createdGig = await db.gig.create({
    data: {
      ...data,
      deadline: new Date(data.deadline),
    },
  });

  return createdGig;
};

export const cancelGig = async (input: { gigId: string }) => {
  const schema = z.object({
    gigId: z.string(),
  });

  const session = await requireRole("EMPLOYER");

  const { gigId } = schema.parse(input);

  const gig = await db.gig.findUnique({
    where: { id: gigId },
    include: { applications: true },
  });

  if (!gig) {
    throw new Error("Gig not found");
  }

  if (gig.employerId !== session.id) {
    throw new Error("You are not the employer of this gig");
  }

  if (gig.status !== "OPEN") {
    throw new Error("Only open gigs can be canceled");
  }

  if (
    gig.applications.find((application) => application.status !== "PENDING") !==
    undefined
  )
    throw new Error("You cannot cancel a gig that already has applications.");

  const updatedGig = await db.gig.update({
    where: { id: gigId },
    data: { status: "CANCELED" },
  });

  return updatedGig;
};
