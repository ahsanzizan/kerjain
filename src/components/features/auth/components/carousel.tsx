"use client";

import { Text } from "@/components/common/text";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";

// Change delay in MS
const CHANGE_DELAY = 5_000;

type CarouselContent = {
  title: string;
  description: string;
};

const CAROUSEL_CONTENTS = [
  {
    title: "Solusi Tepat buat Pekerja dan Pencari Jasa Cepat",
    description:
      "Platform yang menghubungkan pekerja dan pencari jasa dalam satu tempat. Temukan peluang atau tenaga kerja terbaik dengan mudah!",
  },
  {
    title: "Jelajahi Peluang Tak Terbatas",
    description:
      "Akses berbagai peluang kerja fleksibel atau temukan tenaga kerja andal untuk kebutuhan Anda, semuanya dalam satu platform.",
  },
  {
    title: "Kalau ada yang bisa, Kenapa Enggak?",
    description:
      "Dapatkan penghasilan tambahan atau cari tenaga kerja berkualitas dengan cepat dan transparan melalui Kerjain!",
  },
] satisfies CarouselContent[];

export const Carousel = () => {
  const [step, setStep] = useState(0);
  const [isManual, setIsManual] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isManual) {
        setStep((prevStep) =>
          prevStep < CAROUSEL_CONTENTS.length - 1 ? prevStep + 1 : 0,
        );
      }
    }, CHANGE_DELAY);

    return () => clearInterval(interval);
  }, [isManual]);

  return (
    <div className="mt-20 flex w-full flex-col overflow-hidden">
      <motion.div
        key={step} // Forces re-render and re-animation
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="flex flex-col"
      >
        <Image
          src={`/illustrations/login/${step + 1}.png`}
          width={620}
          height={620}
          className="mb-14 h-[27rem] w-full self-center object-contain"
          alt="Ilustrasi"
        />
        <Text variant="title3" className="text-text-200 mb-5">
          {CAROUSEL_CONTENTS[step]?.title}
        </Text>
        <Text variant="body" className="text-text-200 mb-10 text-opacity-90">
          {CAROUSEL_CONTENTS[step]?.description}
        </Text>
      </motion.div>

      <div className="grid w-full grid-cols-3 gap-x-5">
        {CAROUSEL_CONTENTS.map((_, index) => (
          <button
            key={index}
            className={cn(
              "h-2 min-w-full rounded-full transition-all duration-300",
              step === index ? "bg-white" : "bg-white/50",
            )}
            onClick={() => {
              setStep(index);
              setIsManual(true);
            }}
          ></button>
        ))}
      </div>
    </div>
  );
};
