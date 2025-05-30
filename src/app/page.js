import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection"
import HowItWorks from "@/components/HowItWorks"
import FeatureCards from '@/components/FeatureCards'
import { TrendingPitches } from "@/components/TrendingPitches";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
    <Navbar/>
    <HeroSection/>
    <HowItWorks/>
    <FeatureCards/>
    <TrendingPitches/>  
    <WhyChooseUs/>
    <Footer/>
    </>
  );
}
