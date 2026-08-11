import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";
import { Providers } from "./providers";
import { SITE_URL } from "../lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Alwahab | Your Ultimate Store",
    template: "%s | Alwahab",
  },
  description: "Alwahab — Shop electronics, accessories, home & kitchen, gadgets, and lifestyle products with great deals in Pakistan.",
  keywords: ["ecommerce", "pakistan", "electronics", "gadgets", "home accessories", "alwahab"],
  authors: [{ name: "Alwahab Store" }],
  creator: "Alwahab",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: SITE_URL,
    siteName: "Alwahab Store",
    title: "Alwahab | Your Ultimate Store",
    description: "Shop the best deals on electronics, accessories, and home goods at Alwahab.",
    images: [
      {
        url: "/og-image.png", // Assuming we will have an og-image
        width: 1200,
        height: 630,
        alt: "Alwahab Store Banner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Alwahab | Your Ultimate Store",
    description: "Shop the best deals on electronics, accessories, and home goods at Alwahab.",
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
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Alwahab",
  url: SITE_URL,
  logo: `${SITE_URL}/og-image.png`,
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
    <html lang="en" className="h-full antialiased">
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
