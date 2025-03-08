import { PageContainer } from "@/components/layout/page-container";
import { FeaturedCategories } from "../components/sections/featured-categories";
import { Hero } from "../components/sections/hero";
import { HowItWorks } from "../components/sections/how-it-works";
import { AboutUs } from "../components/sections/about-us";
import { FloatingArrow } from "@/components/layout/widgets/floating-arrow";

export const LandingPage = () => {
  return (
    <PageContainer withNavbar withFooter>
      <Hero />
      <FeaturedCategories />
      <AboutUs/>
      <HowItWorks />
      <FloatingArrow/>
    </PageContainer>
  );
};
