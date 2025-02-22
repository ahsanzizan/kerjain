import "@/styles/globals.css";

import { type Metadata } from "next";
import { DM_Sans } from "next/font/google";

export const metadata: Metadata = {
  title: "Kerjain!",
  description: "Kerjain! is an innovative gig working solution.",
  authors: [
    { name: "Ahsan Azizan", url: "https://ahsanzizan.xyz" },
    { name: "Amelia Cahyani", url: "https://instagram.com/amelizyn" },
    { name: "Namira", url: "#" },
  ],
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const dmSans = DM_Sans({
  weight: [
    "100",
    "200",
    "300",
    "400",
    "500",
    "600",
    "700",
    "800",
    "900",
    "1000",
  ],
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${dmSans.className}`}>
      <body>{children}</body>
    </html>
  );
}
