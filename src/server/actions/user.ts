"use server";

import { db } from "@/server/db";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { errorResponse, successResponse } from "../utils/action-response";
import { validateActionInput } from "../utils/validate-action-input";
import { requestVerificationMail } from "./email";

const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegisterInput = z.infer<typeof registerSchema>;

/**
 * Registers a new user.
 * @param input - Object containing name, email, and password.
 * @returns Registered user data excluding password.
 */
export const registerUser = async (input: {
  name: string;
  email: string;
  password: string;
}) => {
  try {
    const { name, email, password } = validateActionInput<RegisterInput>(
      input,
      registerSchema,
    );

    // Check if email is already in use
    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      return errorResponse("Email is already in use");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await db.user.create({
      data: {
        name,
        email,
        account: {
          create: { provider: "Credentials", password: hashedPassword },
        },
      },
    });

    const sentMail = await requestVerificationMail(newUser.email);

    if (!sentMail.success) {
      return errorResponse("Terjadi kesalahan saat mengirim email.");
    }

    return successResponse(
      {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        createdAt: newUser.createdAt,
      },
      "Berhasil mendaftarkan pengguna",
    );
  } catch (error) {
    console.error(error);
    return errorResponse("Terjadi kesalahan, silahkan coba lagi nanti.");
  }
};

export const checkVerifiedStatus = async (input: {
  email: string;
  password: string;
}) => {
  const { email, password } = input;

  try {
    const user = await db.user.findUnique({
      where: { email },
      include: { account: true },
    });
    if (!user || !user.account)
      return errorResponse("Email/password anda salah!");

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.account.password!,
    );

    if (!user.emailVerified && !isPasswordCorrect)
      return errorResponse("Email/password anda salah!");

    if (!user.emailVerified && isPasswordCorrect) return successResponse(false);

    return successResponse(true);
  } catch (error) {
    console.error(error);
    return errorResponse("Terjadi kesalahan.");
  }
};
