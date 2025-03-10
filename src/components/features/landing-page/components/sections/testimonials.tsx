"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star } from "lucide-react";
import Image from "next/image";
import { Text } from "@/components/common/text";

const testimonials = [
  {
    name: "Maria Susanti",
    role: "Ibu Rumah Tangga",
    image: "/copyrighted-images/testimoni-1.png",
    title: "Praktis & Fleksibel!",
    rating: 5,
    text: "Sebagai ibu tunggal, saya butuh pekerjaan yang fleksibel agar tetap bisa mengurus anak-anak. Dengan Kerjain, saya bisa bekerja dari rumah di waktu senggang dan tetap punya penghasilan. Prosesnya simpel, dan bayaran juga transparan. Sangat membantu! Sekarang saya nggak perlu khawatir soal pemasukan tambahan.",
  },
  {
    name: "Andi Pratama",
    role: "Pekerja Lepas",
    image: "/copyrighted-images/testimoni-2.png",
    title: "Cocok Buat Tambahan!",
    rating: 5,
    text: "Kerjaan saya nggak menentu, jadi saya butuh pemasukan tambahan. Untungnya, Kerjain punya banyak tugas kecil yang bisa saya ambil kapan aja. Nggak ribet dan langsung dibayar! Cocok banget buat yang butuh fleksibilitas tapi tetap ingin produktif.",
  },
  {
    name: "Rizki Aditya",
    role: "Mahasiswa",
    image: "/copyrighted-images/testimoni-3.png",
    title: "Sangat Membantu Mahasiswa!",
    rating: 4,
    text: "Sebagai mahasiswa, saya butuh penghasilan tambahan tanpa mengganggu kuliah. Dengan Kerjain, saya bisa ambil pekerjaan fleksibel yang bisa dikerjakan kapan saja. Gajinya juga cepat masuk! Sekarang saya bisa lebih tenang soal biaya hidup dan tetap fokus belajar.",
  },
];

export const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="mx-auto mb-24 w-full py-16 md:px-8 lg:px-12">
      <Text variant="large1-semibold" className="text-center">
        Testimoni Pengguna
      </Text>
      <div className="mt-12 flex flex-col-reverse gap-7 md:flex-row">
        <div className="flex w-full flex-col space-y-4 md:w-1/3">
          {testimonials.map((testimonial, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`flex items-center gap-4 rounded-lg border-2 p-3 transition-all duration-300 ${
                activeIndex === index
                  ? "border-primary-300 bg-primary-100"
                  : "hover:bg-primary-100"
              }`}
            >
              <Image
                src={testimonial.image}
                alt={testimonial.name}
                width={45}
                height={45}
                className="rounded-full object-cover md:h-12 md:w-12"
              />
              <div>
                <Text variant="title3" className="text-start">
                  {testimonial.name}
                </Text>
                <Text className="text-start text-gray-500">
                  {testimonial.role}
                </Text>
              </div>
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="rounded-lg bg-white p-4 md:p-6"
            >
              <Text variant="title1-semibold" className="text-gray-900">
                {testimonials[activeIndex].title}
              </Text>
              <div className="mt-2 flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 md:h-6 md:w-6 ${
                      i < testimonials[activeIndex].rating
                        ? "text-yellow-500"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <Text className="mt-4 text-gray-700">
                {testimonials[activeIndex].text}
              </Text>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
