import { Text } from "@/components/common/text";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export const Hero = () => {
  return (
    <section id="hero" className="pb-32 pt-48">
      <Text variant="xlarge-semibold" className="text-balance">
        Temukan Pekerjaan Mikro dengan Mudah!
      </Text>
      <Text variant="title3" className="mt-7 text-text-400">
        Akses pekerjaan fleksibel atau pekerja mikro andal di sekitar Anda,
        tanpa ribet dan tanpa perantara yang merugikan.
      </Text>
      <div className="mt-14 flex items-center gap-x-3">
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
      {/* Illustration */}
    </section>
  );
};
