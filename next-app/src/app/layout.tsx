import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  metadataBase: new URL("https://alwahabmart.com"),
  title: {
    default: "Alwahab | Your Ultimate Store",
    template: "%s | Alwahab",
  },
  description: "Alwahab — Shop electronics, accessories, home & kitchen, gadgets, and lifestyle products with great deals in Pakistan.",
  keywords: ["ecommerce", "pakistan", "electronics", "gadgets", "home accessories", "alwahab"],
  authors: [{ name: "Alwahab Store" }],
  creator: "Alwahab",
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: "https://alwahabmart.com",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">
        <Providers>
          {children}
          <Toaster position="top-right" richColors closeButton />
        </Providers>
      </body>
    </html>
  );
}
