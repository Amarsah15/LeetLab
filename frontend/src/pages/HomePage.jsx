import React from "react";
import CTABanner from "../components/homepage/CTABanner";
import FeatureShowcase from "../components/homepage/FeatureShowcase";
import Footer from "../components/homepage/Footer";
import HeroSection from "../components/homepage/HeroSection";
import TopicsSection from "../components/homepage/TopicsSection";

const HomePage = () => {
  return (
    <main className="min-h-screen max-h-max bg-black">
      <HeroSection />
      <FeatureShowcase />
      <TopicsSection />
      <CTABanner />
      <Footer />
    </main>
  );
};

export default HomePage;
