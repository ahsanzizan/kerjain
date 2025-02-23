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
  children?: ReactNode;
}> = ({ withNavbar, withFooter, children }) => {
  return (
    <>
      {withNavbar && <Navbar />}
      <main className="mx-auto w-full max-w-7xl">{children}</main>
      {withFooter && <Footer />}
    </>
  );
};
