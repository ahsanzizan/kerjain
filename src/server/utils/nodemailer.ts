import { env } from "@/env";
import nodemailer, { type Transporter } from "nodemailer";

export interface EmailOptions {
  from?: string;
  to: string;
  subject: string;
  text?: string;
  replyTo?: string;
  html?: string;
}

export interface EmailServiceInterface {
  sendEmail(options: EmailOptions): Promise<void>;
}

export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  defaultFrom: string;
}

export const emailConfig: EmailConfig = {
  host: env.SMTP_HOST,
  port: Number(env.SMTP_PORT) || 587, // Use 465 for SSL
  secure: env.SMTP_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
  defaultFrom: env.EMAIL_FROM,
};

export class EmailService implements EmailServiceInterface {
  private transporter: Transporter;

  constructor() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    this.transporter = nodemailer.createTransport({
      host: emailConfig.host,
      port: emailConfig.port,
      secure: emailConfig.secure,
      auth: {
        user: emailConfig.auth.user,
        pass: emailConfig.auth.pass,
      },
    });
  }

  public async sendEmail(options: EmailOptions) {
    const mailOptions = {
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      from: options.from || emailConfig.defaultFrom,
      to: options.to,
      subject: options.subject,
      replyTo: options.replyTo,
      text: options.text,
      html: options.html,
    };

    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const sentMail = await this.transporter.sendMail(mailOptions);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return sentMail;
    } catch (error) {
      console.error(`Error sending email to ${options.to}:`, error);
      throw new Error("Failed to send email");
    }
  }
}
