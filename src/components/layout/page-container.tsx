import { cn } from "@/lib/utils";
import { type FC, type ReactNode } from "react";
import { Footer } from "./widgets/footer";
import { Navbar } from "./widgets/navbar";

export const PageContainer: FC<{
  withNavbar?: boolean;
  withFooter?: boolean;
  center?: boolean;
  children?: ReactNode;
}> = ({ withNavbar, withFooter, center, children }) => {
  return (
    <>
      {withNavbar && <Navbar />}
      <main
        className={cn(
          center
            ? "flex h-screen w-screen flex-col items-center justify-center px-6"
            : "mx-auto min-h-screen w-full max-w-7xl px-6",
        )}
      >
        {children}
      </main>
      {withFooter && <Footer />}
    </>
  );
};
