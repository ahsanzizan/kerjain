import { Text } from "@/components/common/text";
import { LoginForm } from "../components/forms/login.form";

export const LoginPage = () => {
  return (
    <>
      <div className="mb-[3.75rem]">
        <Text variant="title1-bold" className="mb-1 text-primary-500">
          Selamat Datang di Kerjain!
        </Text>
        <Text variant="body" className="text-text-400">
          Cari pekerjaan fleksibel atau temukan tenaga kerja andal di sekitar
          Anda!
        </Text>
      </div>
      <LoginForm />
    </>
  );
};
