"use client";

import { buttonVariants } from "@/components/ui/button";
import { Text } from "@/components/common/text";
import Link from "next/link";
import { motion } from "framer-motion";

export const CTA = () => {
  return (
    <section className="flex items-center justify-center py-12 md:py-16">
      <div className="relative w-full max-w-full min-h-[350px] flex flex-col items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-blue-400 p-8 text-center text-white md:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <Text variant="large2-semibold" className="relative mb-4">
            Siap Bangun Jaringan Kerja Impianmu?
          </Text>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <Text variant="title3" className="relative opacity-90">
            Temukan peluang kerja atau cari tenaga ahli dalam satu platform.
            Cepat, mudah, dan tanpa perantara.
          </Text>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          viewport={{ once: true }}
          className="mt-7 flex flex-col items-center justify-center gap-3 md:flex-row md:gap-x-4"
        >
          <Link
            href={"#"}
            className={buttonVariants({ variant: "whiteDefault", size: "lg" })}
          >
            Mulai Sekarang
          </Link>
          <Link
            href={"#"}
            className={buttonVariants({
              variant: "whiteOutline",
              size: "lg",
              className: "text-white",
            })}
          >
            Hubungi Kami
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
