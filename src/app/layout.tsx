import { ProgressBarProvider } from "@/components/providers/progress-bar.provider";
import { NextAuthSessionProvider } from "@/components/providers/session.provider";
import "@/styles/globals.css";

import { type Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Kerjain! - Satu Platform, Ribuan Peluang!",
  description: "Kerjain! is an innovative gig working solution by Team Namesa.",
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
      <NextAuthSessionProvider>
        <body className="overflow-x-hidden bg-background-200 antialiased">
          <ProgressBarProvider />
          {children}
          <Toaster />
        </body>
      </NextAuthSessionProvider>
    </html>
  );
}
