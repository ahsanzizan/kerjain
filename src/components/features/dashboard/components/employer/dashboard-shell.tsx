"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import Link from "next/link";
import type React from "react";

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="flex min-h-screen flex-col space-y-6 py-12">
      <main className="flex w-full flex-1 flex-col overflow-hidden">
        <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr] lg:grid-cols-[240px_1fr]">
          <aside className="hidden w-[200px] flex-col md:flex lg:w-[240px]">
            <nav className="grid items-start gap-2 text-sm font-medium">
              <Link
                href="/employer"
                className="text-primary hover:text-primary flex items-center gap-3 rounded-lg px-3 py-2 transition-all"
              >
                Dashboard
              </Link>
              <Link
                href="/employer/gigs"
                className="text-muted-foreground hover:text-primary flex items-center gap-3 rounded-lg px-3 py-2 transition-all"
              >
                Gig Saya
              </Link>
              <Link
                href="/employer/reviews"
                className="text-muted-foreground hover:text-primary flex items-center gap-3 rounded-lg px-3 py-2 transition-all"
              >
                Ulasan
              </Link>
              <Button
                onClick={() => signOut({ redirectTo: "/" })}
                variant={"destructive"}
              >
                Keluar
              </Button>
            </nav>
          </aside>
          <main className="flex w-full flex-1 flex-col overflow-hidden">
            {children}
          </main>
        </div>
      </main>
    </div>
  );
}
