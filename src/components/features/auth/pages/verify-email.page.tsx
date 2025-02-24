import { Text } from "@/components/common/text";
import { PageContainer } from "@/components/layout/page-container";
import { buttonVariants } from "@/components/ui/button";
import { COLORS } from "@/constants/colors";
import { db } from "@/server/db";
import { ArrowRight, CheckCheck, Mail, ShieldClose } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ResendVerificationMailButton } from "../components/resend-email-button";

export const VerifyEmail = async ({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; email?: string }>;
}) => {
  const { token: tokenParam, email } = await searchParams;

  if (!tokenParam && !email) return notFound();

  if (!tokenParam && email) {
    return <EmailCheckScreen email={email} />;
  }

  const token = await db.accountVerificationToken.findUnique({
    where: { token: tokenParam },
    select: { account: { include: { user: true } }, expiry_date: true },
  });

  if (!token?.account.user) return notFound();

  const now = new Date();
  const isExpired = now >= token.expiry_date;

  if (!isExpired) {
    await db.user.update({
      where: { id: token.account.user.id },
      data: { emailVerified: now },
    });
  }

  return (
    <VerificationResultScreen
      isExpired={isExpired}
      email={token.account.user.email}
    />
  );
};

const EmailCheckScreen = ({ email }: { email: string }) => {
  return (
    <PageContainer center>
      <section className="flex flex-col items-center">
        <IconWrapper>
          <Mail size={80} color={COLORS["primary-500"]} />
        </IconWrapper>
        <div className="flex flex-col text-center text-black">
          <Text variant="large1" className="mb-3">
            Cek Email Anda
          </Text>
          <Text className="mb-[3.375rem] text-neutral-500">
            Konfirmasi email anda melalui email yang terkirim ke <br />
            <span className="font-medium text-black">{email}</span>
          </Text>
          <ResendVerificationMailButton email={email} />
        </div>
      </section>
    </PageContainer>
  );
};

function VerificationResultScreen({
  isExpired,
  email,
}: {
  isExpired: boolean;
  email: string;
}) {
  return (
    <PageContainer center>
      <section className="flex flex-col items-center text-black">
        <IconWrapper>
          {isExpired ? (
            <ShieldClose size={80} color={COLORS["danger-500"]} />
          ) : (
            <CheckCheck size={80} color={COLORS["primary-500"]} />
          )}
        </IconWrapper>
        <div className="flex flex-col items-center text-center">
          <Text variant="large1" className="mb-3">
            {isExpired ? "Token Kadaluarsa" : "Berhasil Memverifikasi"}
          </Text>
          <Text className="mb-[3.375rem] text-text-400">
            {isExpired ? (
              "Token yang anda gunakan telah kadaluarsa, mohon untuk mencoba lagi."
            ) : (
              <>
                Berhasil memverifikasi akun dengan email <br />
                <span className="font-medium text-black">{email}</span>
              </>
            )}
          </Text>
          {isExpired ? (
            <ResendVerificationMailButton email={email} />
          ) : (
            <Link
              href="/auth/login"
              className={buttonVariants({ variant: "link", size: "link" })}
            >
              Masuk Sekarang <ArrowRight />
            </Link>
          )}
        </div>
      </section>
    </PageContainer>
  );
}

function IconWrapper({ children }: { children: React.ReactNode }) {
  return <div className="mb-8 rounded-full bg-primary-100 p-8">{children}</div>;
}
