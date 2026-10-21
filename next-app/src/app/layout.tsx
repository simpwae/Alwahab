import type { Metadata } from "next";
import { Inter, Poppins, Source_Serif_4 } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { Providers } from "./providers";
import { SITE_URL } from "../lib/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
  weight: ["600", "700", "800"],
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Alwahab — Online Store Pakistan | Electronics, Home & Cosmetics",
    template: "%s | Alwahab",
  },
  description: "Alwahab is Pakistan's trusted online store. Shop electronics, home & kitchen, baby gear, and cosmetics at Alwahab — the best deals, fast delivery, and quality you can count on.",
  keywords: [
    "alwahab", "al wahab", "alwahab mart", "alwahab store", "alwahab shop", "alwahab online",
    "alwahab pakistan", "alwahab electronics", "alwahab cosmetics", "alwahab home kitchen",
    "alwahab baby gear", "alwahabmart", "alwahab deals",
    "online store pakistan", "ecommerce pakistan", "electronics pakistan",
    "home kitchen pakistan", "baby gear pakistan", "cosmetics pakistan", "skincare pakistan", "makeup pakistan",
  ],
  authors: [{ name: "Alwahab Store" }],
  creator: "Alwahab",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: SITE_URL,
    siteName: "Alwahab",
    title: "Alwahab — Online Store Pakistan | Electronics, Home & Cosmetics",
    description: "Alwahab is Pakistan's trusted online store. Shop electronics, home & kitchen, baby gear, and cosmetics at Alwahab with great deals and fast delivery.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Alwahab — Online Store Pakistan",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Alwahab — Online Store Pakistan | Electronics, Home & Cosmetics",
    description: "Alwahab is Pakistan's trusted online store. Shop electronics, home & kitchen, baby gear, and cosmetics at Alwahab with great deals and fast delivery.",
    images: ["/og-image.png"],
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
  verification: {
    google: "ANmhtQvhtNna9R9IYipII4N42Fe6GowsKPuWA2kX8SU",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Alwahab",
  alternateName: ["Al Wahab", "Alwahab Mart", "Alwahab Store", "AlWahab", "alwahabmart"],
  description: "Alwahab is Pakistan's trusted online store for electronics, home & kitchen, baby gear, and cosmetics.",
  url: SITE_URL,
  logo: `${SITE_URL}/og-image.png`,
  sameAs: [
    "https://alwahabmart.com",
    "https://alwahab.vercel.app",
  ],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Alwahab",
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/search?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full antialiased ${inter.variable} ${poppins.variable} ${sourceSerif.variable}`}>
      <body className="min-h-full flex flex-col font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <Providers>
          {children}
          <Toaster position="top-right" richColors closeButton />
        </Providers>
      </body>
    </html>
  );
}
