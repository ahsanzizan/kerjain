import { Text } from "@/components/common/text";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export const Hero = () => {
  return (
    <section id="hero" className="flex flex-col items-center pb-32 pt-44">
      <Text variant="large1-bold" className="text-balance text-center">
        Cari Kerja Mikro? Langsung Dapat, Tanpa Ribet!
      </Text>
      <Text
        variant="title3"
        className="mt-7 w-full max-w-3xl text-center text-text-400"
      >
        Mau kerja sampingan atau butuh tenaga cepat? Di sini, semuanya serba
        simpel. Gak perlu antri, gak perlu lama, langsung dapet yang dicari.
        Yuk, coba sekarang!
      </Text>
      <div className="mt-7 flex items-center justify-center gap-x-3">
        <Link href={"#"} className={buttonVariants({ size: "lg" })}>
          Cari Kerja!
        </Link>
        <Link
          href={"#"}
          className={buttonVariants({ variant: "secondary", size: "lg" })}
        >
          Tawarin Kerja
        </Link>
      </div>
      <div className="relative mt-20">
        <img
          src="/illustrations/landing-page/hero-maps.png"
          alt="Locations of Kerjain Platform"
          className="mx-auto"
        />
      </div>
    </section>
  );
};
