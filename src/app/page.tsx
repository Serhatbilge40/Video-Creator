"use client";

import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { ModelShowcase } from "@/components/landing/model-showcase";
import { CTASection } from "@/components/landing/cta-section";

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <ModelShowcase />
      <CTASection />
    </>
  );
}
