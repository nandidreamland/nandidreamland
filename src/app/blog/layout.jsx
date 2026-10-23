export const metadata = {
  title: {
    template: '%s | Dreamland Blog',
    default: 'Dreamland Blog - Real Estate Insights & Property Investment Tips'
  },
  description: 'Expert real estate insights, property investment tips, market trends, and buying guides from Dreamland. Stay informed with our comprehensive blog on real estate in Bangalore and beyond.',
  keywords: [
    'real estate blog',
    'property investment tips',
    'Bangalore real estate',
    'property buying guide',
    'real estate market trends',
    'property investment',
    'real estate advice',
    'property news',
    'housing market',
    'real estate experts'
  ],
  authors: [{ name: 'Dreamland Team' }],
  creator: 'Dreamland',
  publisher: 'Dreamland',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://dreamland.com'),
  alternates: {
    canonical: '/blog',
  },
  openGraph: {
    title: 'Dreamland Blog - Real Estate Insights & Investment Tips',
    description: 'Expert real estate insights, property investment tips, and market trends from Dreamland professionals.',
    url: '/blog',
    siteName: 'Dreamland',
    images: [
      {
        url: '/dreamlandlogo.jpeg',
        width: 1200,
        height: 630,
        alt: 'Dreamland Blog',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dreamland Blog - Real Estate Insights & Investment Tips',
    description: 'Expert real estate insights, property investment tips, and market trends from Dreamland professionals.',
    images: ['/dreamlandlogo.jpeg'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION_CODE,
  },
};

export default function BlogLayout({ children }) {
  return (
    <>
      {children}
      
      {/* JSON-LD Schema for Blog */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "Dreamland Blog",
            "description": "Expert real estate insights, property investment tips, and market trends from Dreamland professionals.",
            "url": `${process.env.NEXT_PUBLIC_BASE_URL || 'https://dreamland.com'}/blog`,
            "publisher": {
              "@type": "Organization",
              "name": "Dreamland",
              "logo": {
                "@type": "ImageObject",
                "url": `${process.env.NEXT_PUBLIC_BASE_URL || 'https://dreamland.com'}/dreamlandlogo.jpeg`
              }
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `${process.env.NEXT_PUBLIC_BASE_URL || 'https://dreamland.com'}/blog`
            }
          })
        }}
      />
    </>
  );
}