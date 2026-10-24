import AboutContent from './AboutContent';

export const metadata = {
  title: "About Nandi Dreamland — RERA Registered Real Estate Agency in Bangalore",
  description: "Nandi Dreamland is a trusted, RERA-registered real estate agency in Bangalore. 5+ years of experience, 10,000+ happy families, ₹500Cr+ properties sold. Meet our team and learn our story.",
  alternates: {
    canonical: "https://www.dreamland.com/about",
  },
  openGraph: {
    title: "About Nandi Dreamland — Trusted Real Estate Agency in Bangalore",
    description: "RERA-registered real estate agency with 5+ years experience. 10,000+ happy families, ₹500Cr+ properties sold across Bangalore.",
    url: "https://www.dreamland.com/about",
    type: "website",
  },
};

export default function AboutPage() {
  return <AboutContent />;
}
