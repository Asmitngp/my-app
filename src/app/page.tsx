import { main } from "framer-motion/client";
import HeroSection from "@/components/HeroSection";
import FeaturedCourses from "@/components/FeaturedCourses";
import StickyScrool from "@/components/StickyScrool";
import TestimonialCards from "@/components/TestimonialCards";
import UpcomingWebinars from "@/components/UpcomingWebinars";
export default function Home() {
  return (
  <main className="min-h-screen bg-black/[0.96] antialiased bg-grid-white/[0.02]">
    <HeroSection/>
    <FeaturedCourses/>
    <StickyScrool/>
    <TestimonialCards/>
    <UpcomingWebinars/>
  </main>
  );
}
