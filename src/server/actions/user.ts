import { db } from "@/server/db";
import { Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.nativeEnum(Role),
});

/**
 * Registers a new user.
 * @param input - Object containing name, email, and password.
 * @returns Registered user data excluding password.
 */
export const registerUser = async (input: {
  name: string;
  email: string;
  password: string;
  role: Role;
}) => {
  // Validate input
  const validatedData = registerSchema.parse(input);
  const { name, email, password, role } = validatedData;

  // Check if email is already in use
  const existingUser = await db.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error("Email is already in use");
  }

  // Hash password before storing in the database
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user
  const newUser = await db.user.create({
    data: {
      name,
      email,
      role,
      account: {
        create: { provider: "Credentials", password: hashedPassword },
      },
    },
  });

  return {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    createdAt: newUser.createdAt,
  };
};
