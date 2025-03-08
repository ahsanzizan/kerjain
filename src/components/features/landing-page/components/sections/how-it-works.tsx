import { Text } from "@/components/common/text";
import { STEPS } from "@/constants/how-it-works-steps";
import { type Step } from "@/types/how-it-works-step";
import { type FC } from "react";
import { SectionTag } from "../common/section-tag";

const StepCard: FC<Step> = ({ order, title, points }) => {
  return (
    <div className="group relative w-full overflow-hidden rounded-lg border border-text-300/60 bg-text-200 p-8 text-text-600 transition-all duration-300 hover:text-text-200">
      <span className="absolute inset-0 origin-left scale-x-0 bg-primary-500 transition-transform duration-300 ease-out group-hover:scale-x-100"></span>
      <Text className="relative z-10 w-fit rounded-full bg-primary-500 px-3 py-1 text-text-200 transition-all duration-300 group-hover:bg-text-200 group-hover:text-primary-500">
        Langkah {order}
      </Text>
      <Text
        variant="title1-semibold"
        className="relative z-10 mt-3 text-balance"
      >
        {title}
      </Text>
      <div className="relative z-10 mt-10 flex flex-col gap-y-8">
        <div>
          <Text variant="headline-bold">Buat Pencari Kerja</Text>
          {points.worker.length > 0 && (
            <ul className="flex flex-col gap-y-1">
              {points.worker.map((point, index) => (
                <li key={index} className="flex items-start gap-x-2">
                  <span className="aspect-video">-</span>
                  <Text variant="body" className="text-text-400 transition-all duration-300 group-hover:text-text-200/85">
                    {point}
                  </Text>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <Text variant="headline-bold">Buat Pemberi Kerja</Text>
          {points.employer.length > 0 && (
            <ul className="flex flex-col gap-y-1">
              {points.employer.map((point, index) => (
                <li key={index} className="flex items-start gap-x-2">
                  <span className="aspect-video">-</span>
                  <Text className="text-text-400 transition-all duration-300 group-hover:text-text-200/85">
                    {point}
                  </Text>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-28">
      <SectionTag>#CaraPakai</SectionTag>
      <Text variant="large1-semibold">Bingung, ya? Gini Cara Pakainya!</Text>
      <Text variant="title3" className="mt-7 text-text-400">
        Kerjain bikin koneksi antara pekerja dan penyedia lapangan kerja lebih
        gampang dengan tiga langkah simpel.
      </Text>
      <div className="mt-14 grid w-full grid-cols-1 gap-8 lg:grid-cols-3">
        {STEPS.map((step, index) => (
          <StepCard key={index} {...step} />
        ))}
      </div>
    </section>
  );
};
