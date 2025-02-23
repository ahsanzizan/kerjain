"use client";

import { Text } from "@/components/common/text";
import { buttonVariants } from "@/components/ui/button";
import { useRouter } from "@bprogress/next";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { AuthForm } from "../../layout/auth.form";

const registerSchema = z.object({
  name: z.string().min(1, "Nama tidak bisa kosong!"),
  email: z.string().email("Email tidak valid!"),
  password: z.string().min(1, "Password tidak bisa kosong!"),
});

export const RegisterForm = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const onSubmit = async (values: {
    name: string;
    email: string;
    password: string;
  }) => {
    setLoading(true);
    const loadingToast = toast.loading("Loading...");

    // TODO: Register the user, send email verification
    const loginResult = await signIn("credentials", {
      redirect: false,
      callbackUrl: "/",
      email: values.email,
      password: values.password,
    });

    if (loginResult?.error) {
      setLoading(false);
      // toast.error(
      //   loginResult.error === "CredentialsSignin"
      //     ? "Email/password anda salah!"
      //     : "Terjadi kesalahan",
      //   { id: loadingToast },
      // );
      return;
    }

    toast.success("Berhasil Masuk!", { id: loadingToast });
    setLoading(false);
    router.push(searchParams.get("callbackUrl") ?? "/");
  };

  return (
    <>
      <AuthForm
        schema={registerSchema}
        defaultValues={{ name: "", email: "", password: "" }}
        onSubmit={onSubmit}
        fields={[
          {
            name: "name",
            label: "Nama",
            placeholder: "Masukkan nama",
          },
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
        Sudah punya akun?{" "}
        <Link
          href="/auth/login"
          className={buttonVariants({ variant: "link", size: "link" })}
        >
          Masuk
        </Link>
      </Text>
      <Text variant="callout" className="mt-28 text-center text-text-300">
        Dengan melanjutkan, Anda menyetujui Ketentuan Penggunaan Kerjain dan
        memastikan bahwa Anda telah membaca Kebijakan Privasi.
      </Text>
    </>
  );
};
