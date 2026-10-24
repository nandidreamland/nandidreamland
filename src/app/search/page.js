import { Suspense } from "react";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import Footer from "../components/Footer";
import PropertyList from "./components/PropertyList";
import MobileStickyCTA from "../components/MobileStickyCTA";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-fraunces",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata = {
  title: "Search Properties in Bangalore — Buy, Rent & New Projects | Nandi Dreamland",
  description: "Search verified properties in Bangalore. Filter by location, price, BHK, type — apartments, villas, plots, new projects. Find your dream home with Nandi Dreamland.",
  alternates: {
    canonical: "https://www.dreamland.com/search",
  },
  openGraph: {
    title: "Search Properties in Bangalore — Nandi Dreamland",
    description: "Browse 5,000+ verified properties. Filter by apartments, villas, plots, new projects across Bangalore.",
    url: "https://www.dreamland.com/search",
    type: "website",
  },
};

function SearchFallback() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-[#F7F4EC]">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-[#1F6B4C]/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-[#1F6B4C] rounded-full animate-spin border-t-transparent"></div>
        </div>
        <p className="text-[#15241D]/50 font-medium" style={{ fontFamily: 'var(--font-jakarta)' }}>Loading search results...</p>
      </div>
    </div>
  );
}

export default function Search() {
  return (
    <div className={`${fraunces.variable} ${jakarta.variable} min-h-screen bg-[#F7F4EC] pb-20 lg:pb-0`}>
      <MobileStickyCTA />
      <Suspense fallback={<SearchFallback />}>
        <PropertyList/>
      </Suspense>
      <Footer/>
    </div>
  );
}
