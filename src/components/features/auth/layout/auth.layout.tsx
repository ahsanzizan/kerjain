import { PageContainer } from "@/components/layout/page-container";
import Image from "next/image";
import { type FC, type ReactNode } from "react";
import { Carousel } from "../components/carousel";

export const AuthLayout: FC<{ children?: ReactNode }> = ({ children }) => {
  return (
    <PageContainer>
      <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-2 [&>section]:px-14 [&>section]:py-20">
        <section id="login-form" className="w-full">
          {children}
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
