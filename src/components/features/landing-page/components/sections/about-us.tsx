"use client";

import { motion } from "framer-motion";
import { Text } from "@/components/common/text";
import { SectionTag } from "../common/section-tag";
import { Check } from "lucide-react";

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const ChecklistItem = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      variants={itemVariants}
      className="group flex items-start gap-3"
    >
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-500 transition-all duration-300 group-hover:bg-primary-600 group-hover:shadow-lg">
        <Check className="size-4 text-white transition-transform duration-300 group-hover:scale-110" />
      </div>
      <Text
        variant="title3"
        className="text-text-400 transition-colors duration-300 group-hover:text-text-600"
      >
        {children}
      </Text>
    </motion.div>
  );
};

export const AboutUs = () => {
  return (
    <section id="about-us" className="flex flex-col items-start py-20">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="flex w-full flex-col gap-x-8 md:flex-row"
      >
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="flex-2 flex items-center justify-center p-4"
        >
          <img
            src="/illustrations/landing-page/about-us.png"
            width={431}
            height={467.85}
            alt="About Us Illustration"
            className="h-auto max-w-full"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="flex-1 p-4 pt-20"
        >
          <SectionTag>#TentangKami</SectionTag>
          <Text variant="large1-semibold" className="text-balance text-left">
            Cari Kerja Mikro? Kerjain Aja!
          </Text>
          <motion.div
            variants={listVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="from-primary-50 mt-7 space-y-4"
          >
            <ChecklistItem>
              Semua bisa mendapatkan kesempatan yang lebih baik.
            </ChecklistItem>
            <ChecklistItem>
              Keistimewaan untuk membantu pekerja di daerah terpencil.
            </ChecklistItem>
            <ChecklistItem>
              Akses informasi lowongan mikro di seluruh Indonesia.
            </ChecklistItem>
            <ChecklistItem>
              Fitur pencarian pekerjaan berbasis lokasi.
            </ChecklistItem>
            <ChecklistItem>
              Koneksi langsung antara pekerja dan penyedia jasa.
            </ChecklistItem>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};
