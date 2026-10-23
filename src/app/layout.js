import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navber from "./components/Navber";
// import ChatBot from "./components/ChatBot";
import FloatingContact from "./components/FloatingContact";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Dreamland - Premium Property Solutions",
  description: "Discover premium properties, new projects, and verified listings with Dreamland. Your trusted partner for buying, selling, and renting properties across India.",
  keywords: "real estate, property, buy property, rent property, new projects, verified listings, Dreamland, premium properties, India",
  authors: [{ name: "Dreamland" }],
  creator: "Dreamland",
  publisher: "Dreamland",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/dreamlandlogo.jpeg", type: "image/jpeg" },
      { url: "/dreamlandlogo.jpeg" },
    ],
    apple: "/dreamlandlogo.jpeg",
  },
  openGraph: {
    title: "Dreamland - Premium Property Solutions | Built on Trust",
    description: "Discover premium properties, new projects, and verified listings with Dreamland. Your trusted partner for buying, selling, and renting properties across India.",
    url: "https://dreamland.com",
    siteName: "Dreamland",
    images: [
      {
        url: "/dreamlandlogo.jpeg",
        // url: "/dreamlandlogo.jpeg",

        width: 1200,
        height: 600,
        alt: "Dreamland - Built on Trust",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dreamland - Premium Property Solutions",
    description: "Discover premium properties, new projects, and verified listings with Dreamland. Your trusted partner for buying, selling, and renting properties across India.",
    images: ["/dreamlandlogo.jpeg"],
    // images: ["/dreamlandlogo.jpeg"],

  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Google Tag Manager */}
        <Script id="gtm-script" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-5M99MMM8');
          `}
        </Script>
        {/* Google tag (gtag.js) */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=AW-17580329809"
        ></Script>
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-17580329809');
            gtag('config', 'G-3MYC2LLS31');
          `}
        </Script>
        {/* ContentSquare / Hotjar Analytics */}
        <Script
          src="https://t.contentsquare.net/uxa/78bbf96b8c928.js"
          strategy="afterInteractive"
        />
        <link rel="icon" href="/dreamlandlogo.jpeg" type="image/jpeg" />
        <link rel="apple-touch-icon" href="/dreamlandlogo.jpeg" />
        <meta name="theme-color" content="#1F6B4C" />
        <meta name="msapplication-TileColor" content="#1F6B4C" />
        <meta name="msapplication-TileImage" content="/dreamlandlogo.jpeg" />
        <meta property="og:image" content="/dreamlandlogo.jpeg" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="600" />
        <meta name="twitter:image" content="/dreamlandlogo.jpeg" />
        <link rel="shortcut icon" href="/dreamlandlogo.jpeg" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
      >
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5M99MMM8"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          ></iframe>
        </noscript>
        {/* Organization + WebSite Structured Data — helps Google & AI assistants understand Dreamland */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "RealEstateAgent",
                  "@id": "https://www.dreamland.com/#organization",
                  "name": "Dreamland",
                  "alternateName": "Dreamland",
                  "url": "https://www.dreamland.com",
                  "logo": {
                    "@type": "ImageObject",
                    "url": "https://www.dreamland.com/dreamlandlogo.jpeg",
                    "width": 200,
                    "height": 60
                  },
                  "image": "https://www.dreamland.com/dreamlandlogo.jpeg",
                  "description": "Dreamland is a premium real estate agency offering verified property listings, new residential projects, and expert guidance for buying, selling, and renting properties across India.",
                  "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "TBD",
                    "addressLocality": "TBD",
                    "addressRegion": "TBD",
                    "postalCode": "000000",
                    "addressCountry": "IN"
                  },
                  "telephone": "TBD",
                  "contactPoint": [
                    {
                      "@type": "ContactPoint",
                      "telephone": "TBD",
                      "contactType": "sales",
                      "areaServed": "IN",
                      "availableLanguage": ["English", "Hindi"]
                    }
                  ],
                  "knowsAbout": ["Real Estate", "Property Investment", "Residential Properties", "New Projects", "Apartments", "Villas", "Plots"],
                  "slogan": "Built on Trust",
                  "sameAs": [
                    "https://www.dreamland.com"
                  ]
                },
                {
                  "@type": "WebSite",
                  "@id": "https://www.dreamland.com/#website",
                  "url": "https://www.dreamland.com",
                  "name": "Dreamland",
                  "description": "Premium Property Solutions — Buy, Sell & Rent Verified Properties in India",
                  "publisher": { "@id": "https://www.dreamland.com/#organization" },
                  "inLanguage": "en-IN",
                  "potentialAction": {
                    "@type": "SearchAction",
                    "target": {
                      "@type": "EntryPoint",
                      "urlTemplate": "https://www.dreamland.com/search?q={search_term_string}"
                    },
                    "query-input": "required name=search_term_string"
                  }
                }
              ]
            })
          }}
        />
        <Navber/>
        {children}
        <Analytics />
        {/* <ChatBot/> */}
        <FloatingContact/>
      </body>
    </html>
  );
}
