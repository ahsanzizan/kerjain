"use client";

import { Text } from "@/components/common/text";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

export const Hero = () => {
  return (
    <section id="hero" className="flex flex-col items-center pb-32 pt-44">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Text variant="large1-bold" className="text-balance text-center">
          Cari Kerja Mikro? Langsung Dapat, Tanpa Ribet!
        </Text>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
      >
        <Text
          variant="title3"
          className="mt-7 w-full max-w-3xl text-center text-text-400"
        >
          Mau kerja sampingan atau butuh tenaga cepat? Di sini, semuanya serba
          simpel. Gak perlu antri, gak perlu lama, langsung dapet yang dicari.
          Yuk, coba sekarang!
        </Text>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
        className="mt-7 flex items-center justify-center gap-x-3"
      >
        <Link href={"#"} className={buttonVariants({ size: "lg" })}>
          Cari Kerja!
        </Link>
        <Link
          href={"#"}
          className={buttonVariants({ variant: "secondary", size: "lg" })}
        >
          Tawarin Kerja
        </Link>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
        className="relative mt-20"
      >
        <img
          src="/illustrations/landing-page/hero-maps.png"
          alt="Locations of Kerjain Platform"
          className="mx-auto"
        />
      </motion.div>
    </section>
  );
};
