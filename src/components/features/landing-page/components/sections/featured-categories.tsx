import { Text } from "@/components/common/text";
import {
  IconArrowWaveRightUp,
  IconBox,
  IconSignature,
  IconVacuumCleaner,
} from "@tabler/icons-react";
import { GraduationCap } from "lucide-react";
import Image from "next/image";
import { BentoGrid, BentoGridItem } from "../common/bento-grid";
import { SectionTag } from "../common/section-tag";

const items = [
  {
    title: "Pendidikan & Les",
    description:
      "Banyak orang tua mencari guru privat, banyak pelajar atau profesional ingin meningkatkan kemampuan mereka dalam bidang tertentu.",
    header: (
      <Image
        src={"/copyrighted-images/annie-spratt-ORDz1m1-q0I-unsplash.jpg"}
        alt="Image from Unsplash"
        width={130}
        height={130}
        className="flex aspect-video min-h-[7rem] w-full flex-1 rounded-lg object-cover"
      />
    ),
    icon: <GraduationCap className="size-6 text-primary-500" />,
  },
  {
    title: "Jasa Pengantaran",
    description:
      "Banyak usaha kecil dan individu yang memerlukan kurir untuk mengirim barang dengan cepat dan fleksibel tanpa harus bergantung pada layanan logistik besar.",
    header: (
      <Image
        src={"/copyrighted-images/rosebox-BFdSCxmqvYc-unsplash.jpg"}
        alt="Image from Unsplash"
        width={130}
        height={130}
        className="flex aspect-video min-h-[7rem] w-full flex-1 rounded-lg object-cover"
      />
    ),
    icon: <IconBox className="size-6 text-primary-500" />,
  },
  {
    title: "Pekerja Kreatif",
    description:
      "Di era digital, konten visual dan tulisan berkualitas tinggi sangat diperlukan oleh bisnis, individu, maupun organisasi.",
    header: (
      <Image
        src={"/copyrighted-images/inkredo-designer-OuzwaOhwAN4-unsplash.jpg"}
        alt="Image from Unsplash"
        width={130}
        height={130}
        className="flex aspect-video min-h-[7rem] w-full flex-1 rounded-lg object-cover"
      />
    ),
    icon: <IconSignature className="size-6 text-primary-500" />,
  },
  {
    title: "Jasa Rumah Tangga",
    description:
      "Banyak keluarga tidak punya waktu atau keterampilan yang cukup untuk menangani tugas mikro seperti bersih-bersih, perbaikan listrik/plumbing, dan lainnya.",
    header: (
      <Image
        src={"/copyrighted-images/no-revisions-cpIgNaazQ6w-unsplash.jpg"}
        alt="Image from Unsplash"
        width={130}
        height={130}
        className="flex aspect-video min-h-[7rem] w-full flex-1 rounded-lg object-cover"
      />
    ),
    icon: <IconVacuumCleaner className="size-6 text-primary-500" />,
  },
  {
    title: "Layanan Digital",
    description:
      "Banyak UMKM dan individu yang membutuhkan asisten untuk pekerjaan administratif seperti data entry, pengelolaan media sosial, hingga optimasi toko online.",
    header: (
      <Image
        src={"/copyrighted-images/myriam-jessier-eveI7MOcSmw-unsplash.jpg"}
        alt="Image from Unsplash"
        width={130}
        height={130}
        className="flex aspect-video min-h-[7rem] w-full flex-1 rounded-lg object-cover"
      />
    ),
    icon: <IconArrowWaveRightUp className="size-6 text-primary-500" />,
  },
] as const;

export const FeaturedCategories = () => {
  return (
    <section id="featured-categories" className="py-28">
      <div className="block">
        <SectionTag>#PekerjaanMikro</SectionTag>
        <Text variant="large1-semibold" className="text-balance">
          Kategori Pekerjaan Mikro Unggulan di Kerjain!
        </Text>
        <Text variant="title3" className="mt-7 text-text-400">
          Temukan berbagai peluang kerja dan layanan yang paling dibutuhkan!
          Dari jasa rumah tangga hingga pekerjaan digital, Kerjain mempermudah
          koneksi Anda dengan peluang terbaik sesuai keterampilan dan kebutuhan
          Anda.
        </Text>
      </div>
      <BentoGrid className="mx-auto mt-14">
        {items.map((item, i) => (
          <BentoGridItem
            key={i}
            title={item.title}
            description={item.description}
            header={item.header}
            icon={item.icon}
          />
        ))}
      </BentoGrid>
    </section>
  );
};
