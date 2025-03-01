import { type Step } from "@/types/how-it-works-step";

export const STEPS = [
  {
    order: 1,
    title: "Buat Akun & Tentukan Peran Anda",
    points: {
      worker: [
        "Daftar menggunakan email atau akun Google untuk akses cepat.",
        "Pilih peran Anda sebagai Pekerja (mencari pekerjaan)",
        "Lengkapi profil dengan keterampilan, pengalaman, dan preferensi kerja.",
      ],
      employer: [
        "Daftar menggunakan email atau akun Google untuk akses cepat.",
        "Pilih peran Anda sebagai Pemberi Kerja (posting pekerjaan).",
        "Lengkapi profil dengan keterampilan, pengalaman, dan preferensi kerja.",
      ],
    },
  },
  {
    order: 2,
    title: "Cari atau Posting Pekerjaan",
    points: {
      worker: [
        "Jelajahi berbagai pekerjaan yang sesuai dengan keterampilan Anda.",
        "Gunakan filter kategori, lokasi, atau harga.",
        "Kirimkan penawaran jasa anda untuk pekerjaan tersebut.",
      ],
      employer: [
        "Buat postingan pekerjaan dengan deskripsi jelas.",
        "Tentukan kriteria pekerja yang dibutuhkan.",
        "Lihat daftar pelamar dan pilih yang paling sesuai.",
      ],
    },
  },
  {
    order: 3,
    title: "Selesaikan Pekerjaannya & Dapatkan Bayaran",
    points: {
      worker: ["Kerjakan tugas sesuai kesepakatan dan unggah hasil kerja."],
      employer: [
        "Tinjau hasil kerja, berikan feedback, dan konfirmasi pembayaran.",
      ],
    },
  },
] as const satisfies Step[];
