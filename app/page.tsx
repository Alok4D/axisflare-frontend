import { Navbar } from "@/components/landing_page/Navbar";
import { HeroSection } from "@/components/landing_page/HeroSection";
import { ProblemSection } from "@/components/landing_page/ProblemSection";
import { FeaturesSection } from "@/components/landing_page/FeaturesSection";
import { HowItWorksSection } from "@/components/landing_page/HowItWorksSection";
import { FooterCTA } from "@/components/landing_page/FooterCTA";
import AnalysisPreviewSection from "@/components/landing_page/AnalysisPreviewSection";
import PricingSection from "@/components/landing_page/PricingSection";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Navbar />
      <HeroSection />
      <ProblemSection />
      <FeaturesSection />
      <AnalysisPreviewSection />
      <HowItWorksSection />
      <PricingSection />
      <FooterCTA />
    </main>
  );
}
