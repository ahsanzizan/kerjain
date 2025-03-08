"use client";

import { buttonVariants } from "@/components/ui/button";
import { type NavItem } from "@/types/nav-item";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRef } from "react";

const NAV_ITEMS = [
  { title: "Beranda", href: "/" },
  { title: "Cari Kerja", href: "#" },
  { title: "Butuh Orang", href: "#" },
  { title: "Bantuan", href: "#" },
] as const satisfies NavItem[];

export const Navbar = () => {
  const { data: session, status } = useSession();
  const navbarToggle = useRef<HTMLInputElement>(null);

  return (
    <>
      <nav className="fixed z-[1000] w-full bg-background-200">
        <div className="mx-auto flex w-full max-w-screen-xl items-center justify-between px-6 py-4">
          <Link href={"/"} className="w-fit">
            <span className="block aspect-[16/5] w-32 bg-[url(/logo.png)] bg-contain bg-no-repeat text-transparent">
              Kerjain
            </span>
          </Link>
          <ul className="hidden lg:flex lg:items-center lg:gap-10">
            {NAV_ITEMS.map((item, index) => (
              <li key={index} className="relative">
                <Link
                  href={item.href}
                  className="group relative pb-1 text-black no-underline"
                >
                  {item.title}
                  <span className="absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 transform bg-primary-600 transition-transform duration-300 group-hover:scale-x-100"></span>
                </Link>
              </li>
            ))}

            {status === "authenticated" &&
              (session.user.role === "EMPLOYER" ||
                session.user.role === "WORKER") && (
                <Link
                  href={
                    session.user.role === "EMPLOYER" ? "/employer" : "/worker"
                  }
                  className={buttonVariants({
                    variant: "default",
                    className: "ml-6 w-full text-center",
                  })}
                >
                  Dashboard
                </Link>
              )}
            {status === "authenticated" && session.user.role === "NONE" && (
              <Link
                href={"/profile-completion"}
                className={buttonVariants({
                  variant: "default",
                  className: "ml-6 w-full text-center",
                })}
              >
                Dashboard
              </Link>
            )}
            {status === "unauthenticated" && (
              <div className="ml-6 flex items-center gap-x-2">
                <Link
                  href={"/auth/login"}
                  className={buttonVariants({
                    variant: "secondary",
                    className: "w-full text-center",
                  })}
                >
                  Masuk
                </Link>
                <Link
                  href={"/auth/register"}
                  className={buttonVariants({
                    variant: "default",
                    className: "w-full text-center",
                  })}
                >
                  Daftar
                </Link>
              </div>
            )}
          </ul>
          <div className="flex items-center gap-2 lg:hidden">
            <input
              type="checkbox"
              id="sidebar-btn"
              className="checkbox-sidebar hidden"
              ref={navbarToggle}
            />

            <label
              htmlFor="sidebar-btn"
              className="sidebar-btn flex items-center text-black"
            >
              <span className="icon-hamburger"></span>
            </label>
          </div>
        </div>
      </nav>
      {/* Mobile Sidebar */}
      <aside className="mobile-sidebar nav-shadow fixed right-0 top-0 z-[999] h-screen w-[264px] overflow-y-scroll bg-white transition-all duration-300 lg:hidden">
        <div className="flex h-full flex-col justify-between px-5 py-[42px]">
          <div className="block">
            <ul className="mb-8 mt-14 flex flex-col gap-7">
              {NAV_ITEMS.map((item, i) => (
                <li key={i} className="ml-3">
                  <Link
                    href={item.href}
                    className={buttonVariants({
                      variant: "link",
                      size: "link",
                    })}
                    onClick={() => {
                      navbarToggle.current!.checked = false;
                    }}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex w-full flex-col items-center justify-between gap-4 lg:hidden">
            {status === "authenticated" &&
              (session.user.role === "EMPLOYER" ||
                session.user.role === "WORKER") && (
                <Link
                  href={
                    session.user.role === "EMPLOYER" ? "/employer" : "/worker"
                  }
                  className={buttonVariants({
                    variant: "default",
                    className: "ml-6 w-full text-center",
                  })}
                  onClick={() => {
                    navbarToggle.current!.checked = false;
                  }}
                >
                  Dashboard
                </Link>
              )}
            {status === "authenticated" && session.user.role === "NONE" && (
              <Link
                href={"/profile-completion"}
                className={buttonVariants({
                  variant: "default",
                  className: "ml-6 w-full text-center",
                })}
                onClick={() => {
                  navbarToggle.current!.checked = false;
                }}
              >
                Dashboard
              </Link>
            )}
            {status === "unauthenticated" && (
              <div className="ml-6 flex flex-col items-center gap-x-2">
                <Link
                  href={"/auth/login"}
                  className={buttonVariants({
                    variant: "secondary",
                    className: "mb-3 w-full text-center",
                  })}
                  onClick={() => {
                    navbarToggle.current!.checked = false;
                  }}
                >
                  Masuk
                </Link>
                <Link
                  href={"/auth/register"}
                  className={buttonVariants({
                    variant: "default",
                    className: "w-full text-center",
                  })}
                  onClick={() => {
                    navbarToggle.current!.checked = false;
                  }}
                >
                  Daftar
                </Link>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
