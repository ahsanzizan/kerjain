"use client";

import { Text } from "@/components/common/text";
import { buttonVariants } from "@/components/ui/button";
import { checkVerifiedStatus } from "@/server/actions/user";
import { useRouter } from "@bprogress/next";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { AuthForm } from "../../layout/auth.form";

const loginSchema = z.object({
  email: z.string().email("Email tidak valid!"),
  password: z.string().min(1, "Password tidak bisa kosong!"),
});

export const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const onSubmit = async (values: { email: string; password: string }) => {
    setLoading(true);
    const loadingToast = toast.loading("Loading...");

    const verificationStatusResult = await checkVerifiedStatus({
      email: values.email,
      password: values.password,
    });

    if (!verificationStatusResult.success) {
      setLoading(false);
      toast.error(verificationStatusResult.message, { id: loadingToast });
      return;
    }
    if (verificationStatusResult.data === false) {
      setLoading(false);
      toast.error("Verifikasi email anda terlebih dahulu", {
        id: loadingToast,
      });
      return;
    }

    const loginResult = await signIn("credentials", {
      redirect: false,
      callbackUrl: "/",
      email: values.email,
      password: values.password,
    });

    if (loginResult?.error) {
      setLoading(false);
      toast.error(
        loginResult.error === "CredentialsSignin"
          ? "Email/password anda salah!"
          : "Terjadi kesalahan",
        { id: loadingToast },
      );
      return;
    }

    toast.success("Berhasil Masuk!", { id: loadingToast });
    setLoading(false);
    router.push(searchParams.get("callbackUrl") ?? "/");
  };

  return (
    <>
      <AuthForm
        schema={loginSchema}
        defaultValues={{ email: "", password: "" }}
        onSubmit={onSubmit}
        fields={[
          {
            name: "email",
            label: "Email",
            placeholder: "Masukkan alamat email",
          },
          {
            name: "password",
            label: "Password",
            placeholder: "Masukkan password",
            type: "password",
          },
        ]}
        submitLabel="Masuk"
        loading={loading}
      />
      <Text className="mt-12 text-center text-text-300">
        Belum punya akun?{" "}
        <Link
          href="/auth/register"
          className={buttonVariants({ variant: "link", size: "link" })}
        >
          Buat Akun
        </Link>
      </Text>
      <Text variant="callout" className="mt-28 text-center text-text-300">
        Dengan melanjutkan, Anda menyetujui Ketentuan Penggunaan Kerjain dan
        memastikan bahwa Anda telah membaca Kebijakan Privasi.
      </Text>
    </>
  );
};
