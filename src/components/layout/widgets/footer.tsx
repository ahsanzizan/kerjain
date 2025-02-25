import { Text } from "@/components/common/text";
import { buttonVariants } from "@/components/ui/button";
import { type NavItem } from "@/types/nav-item";
import Image from "next/image";
import Link from "next/link";

const FOOTER_LINKS = {
  company: [
    { title: "Karier", href: "#" },
    { title: "Kebijakan Privasi", href: "#" },
    { title: "Syarat dan Ketentuan", href: "#" },
  ],
  support: [
    { title: "Hubungi Kami", href: "#" },
    { title: "Pertanyaan Umum (FAQ)", href: "#" },
  ],
} as const satisfies {
  company: NavItem[];
  support: NavItem[];
};

export const Footer = () => {
  return (
    <footer id="footer" className="w-full bg-primary-500 pb-5 pt-20">
      <div className="mx-auto mb-36 flex w-full max-w-7xl flex-col items-start justify-between gap-y-14 px-6 lg:flex-row">
        <div className="w-full lg:w-1/3">
          <Image
            src={"/logo-white.png"}
            width={173}
            height={55}
            className="w-44 self-end"
            alt="Logo Kerjain!"
          />
          <Text variant="headline" className="mt-5 text-text-200">
            Solusi tepat untuk pekerja dan pencari jasa pekerjaan mikro di
            seluruh Indonesia.
          </Text>
        </div>
        <div className="flex flex-col items-start gap-16 sm:flex-row">
          <div>
            <Text variant="headline-bold" className="text-text-200">
              Perusahaan
            </Text>
            <ul className="mt-6 flex flex-col gap-y-[0.625rem]">
              {FOOTER_LINKS.company.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className={buttonVariants({
                    variant: "link",
                    size: "link",
                    className: "text-text-200",
                  })}
                >
                  {item.title}
                </Link>
              ))}
            </ul>
          </div>
          <div>
            <Text variant="headline-bold" className="text-text-200">
              Dukungan
            </Text>
            <ul className="mt-6 flex flex-col gap-y-[0.625rem]">
              {FOOTER_LINKS.support.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className={buttonVariants({
                    variant: "link",
                    size: "link",
                    className: "text-text-200",
                  })}
                >
                  {item.title}
                </Link>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <Text className="w-full text-center text-text-200">
        &copy; {new Date().getFullYear()} All rights reserved. Made by Namesa
        team.
      </Text>
    </footer>
  );
};
