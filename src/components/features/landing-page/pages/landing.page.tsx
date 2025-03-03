import { PageContainer } from "@/components/layout/page-container";
import { FeaturedCategories } from "../components/sections/featured-categories";
import { Hero } from "../components/sections/hero";
import { HowItWorks } from "../components/sections/how-it-works";

export const LandingPage = () => {
  return (
    <PageContainer withNavbar withFooter>
      <Hero />
      <FeaturedCategories />
      <HowItWorks />
    </PageContainer>
  );
};
