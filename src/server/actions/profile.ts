"use server";

import { Role } from "@prisma/client";
import { z } from "zod";
import { auth, updateSession } from "../auth";
import { db } from "../db";
import { errorResponse, successResponse } from "../utils/action-response";
import { validateActionInput } from "../utils/validate-action-input";

type UpdateUserProfileInput = {
  name?: string;
  image?: string;
  role?: Role;
  address?: string;
  preferredRadius?: number;
  jobPreferences?: string[];
  latitude?: number;
  longitude?: number;
};

export async function updateUserProfile(input: UpdateUserProfileInput) {
  try {
    validateActionInput<UpdateUserProfileInput>(
      input,
      z.object({
        name: z.string().optional(),
        image: z.string().url().optional(),
        role: z.nativeEnum(Role).optional(),
        address: z.string().optional(),
        preferredRadius: z.number().min(1).max(100).optional(),
        jobPreferences: z.array(z.string()).optional(),
        latitude: z.number().optional(),
        longitude: z.number().optional(),
      }),
    );

    const session = await auth();
    if (!session) return errorResponse("Unauthorized");

    const user = await db.user.findUnique({ where: { id: session.user.id } });
    if (!user) return errorResponse("User not found.");

    const updatedUser = await db.user.update({
      where: { id: session.user.id },
      data: {
        ...input,
      },
    });

    await updateSession({ user: { role: input.role } });

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
