"use server";

import { z } from "zod";
import { auth } from "../auth";
import { db } from "../db";
import { errorResponse, successResponse } from "../utils/action-response";
import { validateActionInput } from "../utils/validate-action-input";

export async function updateUserProfile(input: {
  name?: string;
  image?: string;
  address?: string;
  preferredRadius?: number;
  jobPreferences?: string[];
}) {
  try {
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
    if (!session) return errorResponse("Unauthorized");

    const updatedUser = await db.user.update({
      where: { id: session.user.id },
      data: {
        ...input,
      },
    });

    return successResponse(
      {
        user: updatedUser,
      },
      "Profile updated successfully",
    );
  } catch (error) {
    console.error(error);
    return errorResponse("Failed to update profile");
  }
}
