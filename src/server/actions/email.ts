"use server";

import { env } from "@/env";
import { db } from "../db";
import {
  type ActionResponse,
  errorResponse,
  successResponse,
} from "../utils/action-response";
import { verifyTemplate } from "../utils/email-template";
import { EmailService } from "../utils/nodemailer";

const EMAIL_VERIFICATION_DELAY_SECONDS = 120;
const EMAIL_VERIFICATION_EXPIRY_MS = 24 * 60 * 60 * 1000;

const generateToken = () => {
  const [MIN, MAX] = [12, 20];
  const length = Math.random() * (MAX - MIN) + MIN;
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-+=";
  let verificationCode = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    verificationCode += characters[randomIndex];
  }

  return verificationCode;
};
export const requestVerificationMail = async (
  userEmail: string,
): Promise<ActionResponse<unknown>> => {
  try {
    if (!userEmail) return errorResponse(`User email must be provided`);

    const user = await db.user.findUnique({
      where: { email: userEmail },
      include: { account: { include: { token: true } } },
    });

    if (!user) return errorResponse(`User tidak ditemukan`);

    const { name, email, emailVerified, account } = user;

    if (!account) return errorResponse("Account not found.");

    const { token: verificationToken } = account;

    if (emailVerified) return errorResponse(`User telah diverifikasi`);

    const now = new Date();

    // Check if token exist and is not expired
    if (verificationToken && now < verificationToken.expiry_date) {
      const timeSinceLastSent = verificationToken.sent
        ? (now.getTime() - new Date(verificationToken.sent).getTime()) / 1000
        : Infinity;

      if (timeSinceLastSent < EMAIL_VERIFICATION_DELAY_SECONDS) {
        return errorResponse(
          `Mohon menunggu ${EMAIL_VERIFICATION_DELAY_SECONDS - timeSinceLastSent} detik sebelum membuat permintaan lagi`,
        );
      }
    }

    const newToken = generateToken();
    const expiryDate = new Date(now.getTime() + EMAIL_VERIFICATION_EXPIRY_MS);

    const token = await db.accountVerificationToken.upsert({
      where: { token: verificationToken ? verificationToken.token : "" },
      update: {
        token: newToken,
        sent: now,
        expiry_date: expiryDate,
      },
      create: {
        token: newToken,
        sent: now,
        expiry_date: expiryDate,
        account: { connect: { id: account.id } },
      },
    });

    const mailService = new EmailService();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const sentMail = await mailService.sendEmail({
      subject: "Verifikasi email anda untuk Kerjain",
      to: email,
      html: verifyTemplate(
        name,
        `${env.NEXTAUTH_URL}/auth/verify-email?token=${token.token}`,
      ),
    });

    return successResponse(sentMail);
  } catch (error) {
    console.error(error);
    return errorResponse("Internal server error.");
  }
};
