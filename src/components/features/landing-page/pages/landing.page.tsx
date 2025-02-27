import { Text } from "@/components/common/text";
import { PageContainer } from "@/components/layout/page-container";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export const LandingPage = () => {
  return (
    <PageContainer withNavbar withFooter>
      <section id="hero" className="pb-32 pt-48">
        <Text variant="xlarge-semibold" className="mb-7 text-balance">
          Temukan Pekerjaan Mikro dengan Mudah!
        </Text>
        <Text variant="title3" className="text-text-400">
          Akses pekerjaan fleksibel atau pekerja andal di sekitar Anda, tanpa
          ribet dan tanpa perantara yang merugikan.
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
    </PageContainer>
  );
};
