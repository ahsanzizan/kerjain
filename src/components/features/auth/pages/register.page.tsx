import { Text } from "@/components/common/text";
import { Suspense } from "react";
import { RegisterForm } from "../components/forms/register.form";

export const RegisterPage = () => {
  return (
    <Suspense>
      <div className="mb-[3.75rem]">
        <Text variant="title1-bold" className="mb-1 text-primary-500">
          Selamat Datang di Kerjain!
        </Text>
        <Text variant="body" className="text-text-400">
          Cari pekerjaan fleksibel atau temukan tenaga kerja andal di sekitar
          Anda! Daftar untuk mulai menggunakan Kerjain.
        </Text>
      </div>
      <RegisterForm />
    </Suspense>
  );
};
