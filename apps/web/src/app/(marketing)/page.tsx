import { HeroSection } from "@/components/marketing/hero-section";
import { AboutSection } from "@/components/marketing/about-section";
import { FeaturesSection } from "@/components/marketing/features-section";
import { HowItWorksSection } from "@/components/marketing/how-it-works";
import { StatsSection } from "@/components/marketing/stats-section";
import { CtaSection } from "@/components/marketing/cta-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <FeaturesSection />
      <HowItWorksSection />
      <StatsSection />
      <CtaSection />
    </>
  );
}
