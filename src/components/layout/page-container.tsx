import { cn } from "@/lib/utils";
import { type FC, type ReactNode } from "react";

export const Navbar = () => {
  return <></>;
};

export const Footer = () => {
  return <></>;
};

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
            ? "flex h-screen w-screen flex-col items-center justify-center"
            : "mx-auto w-full max-w-7xl",
        )}
      >
        {children}
      </main>
      {withFooter && <Footer />}
    </>
  );
};
