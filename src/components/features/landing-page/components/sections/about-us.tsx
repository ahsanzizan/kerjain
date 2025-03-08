import { Text } from "@/components/common/text";
import { SectionTag } from "../common/section-tag";
import { Check } from "lucide-react";

const ChecklistItem = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="group flex items-start gap-3">
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-500 transition-all duration-300 group-hover:bg-primary-600 group-hover:shadow-lg">
        <Check className="size-4 text-white transition-transform duration-300 group-hover:scale-110" />
      </div>
      <Text
        variant="title3"
        className="text-text-400 transition-colors duration-300 group-hover:text-text-600"
      >
        {children}
      </Text>
    </div>
  );
};

export const AboutUs = () => {
  return (
    <section id="about-us" className="flex flex-col items-start pb-32 pt-32">
      <div className="flex w-full max-w-6xl flex-col gap-x-8 md:flex-row">
        <div className="flex-2 flex items-center justify-center p-4">
          <img
            src="/illustrations/landing-page/about-us.png"
            alt="About Us Illustration"
            className="h-auto max-w-full"
          />
        </div>
        <div className="flex-1 p-4 pt-20">
          <SectionTag>#TentangKami</SectionTag>
          <Text variant="large1-semibold" className="text-balance text-left">
            Cari Kerja Mikro? Gampang Dapat!
          </Text>
          <div className="from-primary-50 mt-7 space-y-4">
            <ChecklistItem>
              Semua bisa mendapatkan kesempatan yang lebih baik.
            </ChecklistItem>
            <ChecklistItem>
              Keistimewaan untuk membantu pekerja di daerah terpencil.
            </ChecklistItem>
            <ChecklistItem>
              Akses informasi lowongan di seluruh Indonesia.
            </ChecklistItem>
            <ChecklistItem>
              Fitur pencarian pekerjaan berbasis lokasi.
            </ChecklistItem>
            <ChecklistItem>
              Koneksi langsung antara pekerja dan penyedia jasa.
            </ChecklistItem>
          </div>
        </div>
      </div>
    </section>
  );
};
