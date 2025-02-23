"use client";

import { BottomBorderInput } from "@/components/common/border-bottom-input";
import { Text } from "@/components/common/text";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useZodForm } from "@/hooks/use-zod-form";
import { checkVerifiedStatus } from "@/server/actions/user";
import { signIn } from "next-auth/react";
import { useRouter } from "next-nprogress-bar";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

const GoogleIcon = () => {
  return (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <title>Google</title>
      <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
    </svg>
  );
};

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password tidak bisa kosong!"),
});

export const LoginForm = () => {
  const form = useZodForm({
    defaultValues: { email: "", password: "" },
    mode: "onBlur",
    schema: loginSchema,
  });
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  const { handleSubmit } = form;

  const onSubmit = handleSubmit(async (fields) => {
    setLoading(true);

    const loadingToast = toast.loading("Loading...");

    const verificationStatus = await checkVerifiedStatus({
      email: fields.email,
    });

    if (!verificationStatus.success) {
      setLoading(false);
      return toast.error(verificationStatus.message, {
        id: loadingToast,
      });
    }

    if (!verificationStatus.data) {
      setLoading(false);
      return toast.error("Verifikasi email anda terlebih dahulu", {
        id: loadingToast,
      });
    }

    const loginResult = await signIn("credentials", {
      redirect: false,
      callbackUrl: "/",
      email: fields.email,
      password: fields.password,
    });

    if (loginResult?.error) {
      setLoading(false);
      return toast.error(
        loginResult.error === "CredentialsSignin"
          ? "Email/password anda salah!"
          : "Terjadi kesalahan",
        { id: loadingToast },
      );
    }

    toast.success("Berhasil Masuk!", { id: loadingToast });
    setLoading(false);
    return router.push(searchParams.get("callbackUrl") ?? "/");
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="flex w-full flex-col">
        <Button
          variant={"outline"}
          type="button"
          className="w-full"
          onClick={async () => {
            await signIn("google", { redirectTo: "/" });
          }}
        >
          <GoogleIcon />
          Masuk dengan Google
        </Button>
        <div className="mt-8 flex items-center justify-between">
          <div className="h-[1px] w-[40%] rounded-full bg-text-400"></div>
          <Text variant="body" className="text-text-400">
            atau
          </Text>
          <div className="h-[1px] w-[40%] rounded-full bg-text-400"></div>
        </div>
        <div className="mt-12 flex flex-col gap-y-10">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex flex-col space-y-2">
                <FormLabel htmlFor="email">Email</FormLabel>
                <FormControl>
                  <BottomBorderInput
                    {...field}
                    placeholder="Masukkan alamat email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="flex flex-col space-y-2">
                <FormLabel htmlFor="password">Password</FormLabel>
                <FormControl>
                  <BottomBorderInput
                    {...field}
                    placeholder="Masukkan password"
                    type="password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          disabled={loading}
          className="mt-[3.75rem] w-full"
          type="submit"
        >
          Masuk
        </Button>
        <Text className="mt-12 text-center text-text-300">
          Belum punya akun?{" "}
          <Link
            href="/auth/register"
            className={buttonVariants({ variant: "link", size: "link" })}
          >
            Buat Akun
          </Link>
        </Text>
        <Text
          variant="callout"
          className="mt-[9.5rem] text-center text-text-300"
        >
          Dengan melanjutkan, Anda menyetujui Ketentuan Penggunaan Kerjain dan
          memastikan bahwa Anda telah membaca Kebijakan Privasi.
        </Text>
      </form>
    </Form>
  );
};
