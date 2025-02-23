import { Text } from "@/components/common/text";
import { PageContainer } from "@/components/layout/page-container";
import Image from "next/image";
import { Carousel } from "../components/carousel";

export const LoginPage = () => {
  return (
    <PageContainer>
      <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-2 [&>section]:px-5 [&>section]:py-20">
        <section id="login-form" className="w-full">
          <div className="mb-16">
            <Text variant="title1-bold" className="text-primary-500 mb-1">
              Selamat Datang di Kerjain!
            </Text>
            <Text variant="body" className="text-text-400">
              Cari pekerjaan fleksibel atau temukan tenaga kerja andal di
              sekitar Anda!
            </Text>
          </div>
        </section>
        <section
          id="guides"
          className="bg-primary-500 flex max-w-full flex-col"
        >
          <Image
            src={"/logo-white.png"}
            width={173}
            height={55}
            className="w-44 self-end"
            alt="Logo Kerjain!"
          />
          <Carousel />
        </section>
      </div>
    </PageContainer>
  );
};
