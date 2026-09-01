import HeroSection from "@/features/home/components/HeroSection";
import FeaturedDoctors from "@/features/doctors/components/FeaturedDoctors";
import HowItWorks from "@/features/home/components/HowItWorks";
import BookingCallToAction from "@/features/home/components/BookingCallToAction";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedDoctors />
      <HowItWorks />
      <BookingCallToAction />
    </>
  );
}
