import type { Metadata, Viewport } from "next";
import "./globals.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ScrollToTop } from "@/components/ScrollToTop";

const BASE_URL = "https://www.lepearleducation.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default:
      "LePearl Education | NTA NET, MPPSC, UPHESC, GIC & LT Grade Coaching",
    template: "%s | LePearl Education",
  },
  description:
    "LePearl Education offers expert coaching for NTA NET English, MPPSC, UPHESC, UP GDC, GIC, LT Grade & SET exams. Join India's top online coaching centre for competitive exam success.",
  keywords: [
    "NTA NET English coaching",
    "MPPSC coaching",
    "UPHESC coaching",
    "UP GDC coaching",
    "GIC coaching",
    "LT Grade coaching",
    "SET exam coaching",
    "NET Paper 1 coaching",
    "online coaching India",
    "LePearl Education",
    "competitive exam preparation",
    "English literature coaching",
  ],
  authors: [{ name: "LePearl Education" }],
  creator: "LePearl Education",
  publisher: "LePearl Education",
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
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: BASE_URL,
    siteName: "LePearl Education",
    title:
      "LePearl Education | NTA NET, MPPSC, UPHESC, GIC & LT Grade Coaching",
    description:
      "Expert coaching for NTA NET English, MPPSC, UPHESC, UP GDC, GIC, LT Grade & SET exams. India's top online coaching centre.",
  },
  twitter: {
    card: "summary_large_image",
    title: "LePearl Education | NTA NET, MPPSC, UPHESC Coaching",
    description:
      "Expert coaching for NTA NET English, MPPSC, UPHESC, UP GDC, GIC, LT Grade & SET exams.",
  },
  verification: {
    google: "PDbE-jfEUanIyQE2ZFUNZfVsKG2EDDW1YU84ZVrr43o",
  },
  alternates: {
    canonical: BASE_URL,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <ScrollToTop />
      </body>
    </html>
  );
}
