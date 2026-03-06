import { Metadata, Viewport } from "next";
import { Inter, Open_Sans } from "next/font/google";
import { StoreProvider } from "@/lib/redux/StoreProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
});

import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import { FloatingButtons } from "@/components/layout/FloatingButtons";
import SessionProvider from "@/components/providers/SessionProvider";
import { AppThemeProvider } from "@/components/providers/AppThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import SystemHealthCheck from "@/components/layout/SystemHealthCheck";

export const viewport: Viewport = {
  themeColor: "#01FF70",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://budgettravelpackages.in"),
  title: {
    default: "Book Domestic & International Tour Packages from India",
    template: "%s | Budget Travel Packages",
  },
  description:
    "Book customized domestic & international vacation plan from India. Flights, Trains, Hotels, Sightseeing & much more... Explore More, Spend Less!",
  keywords: [
    "Budget Travel Packages",
    "Customized Tour Packages",
    "Travel Agency Kolkata",
    "International Tour Packages",
    "Domestic Travel India",
    "Holiday Packages",
    "Vacation Planner",
  ],
  authors: [{ name: "Budget Travel Packages" }],
  creator: "Budget Travel Packages",
  publisher: "Budget Travel Packages",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/images/logo/logo.svg",
    shortcut: "/images/logo/logo.svg",
    apple: "/images/logo/logo.svg",
  },
  openGraph: {
    title: "Budget Travel Packages - Customized Tours",
    description:
      "Book affordable, fully customized domestic and international travel packages. Expert planned itineraries from Kolkata, Delhi, Mumbai.",
    url: "https://budgettravelpackages.in",
    siteName: "Budget Travel Packages",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/images/logo/logo.svg", // Use logo or a specific OG image if available
        width: 800,
        height: 600,
        alt: "Budget Travel Packages Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Budget Travel Packages",
    description:
      "Affordable, customized domestic and international travel packages from India.",
    images: ["/images/logo/logo.svg"], // Same here
  },
  alternates: {
    canonical: "/",
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
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: "Budget Travel Packages",
    image: "https://budgettravelpackages.in/images/logo/logo.svg",
    "@id": "https://budgettravelpackages.in",
    url: "https://budgettravelpackages.in",
    telephone: "+919242868839",
    email: "hello@budgettravelpackages.in",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Bengal Eco Intelligent Park, EM Block, Sector V",
      addressLocality: "Bidhannagar, Kolkata",
      addressRegion: "West Bengal",
      postalCode: "700091",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 22.5726, // Approx coordinates for Sector V
      longitude: 88.4374,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      opens: "09:00",
      closes: "19:00",
    },
    sameAs: [
      "https://facebook.com",
      "https://instagram.com",
      "https://youtube.com",
    ],
    priceRange: "₹500 - ₹500000",
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${openSans.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <AppThemeProvider>
          <StoreProvider>
            <SessionProvider>
              <SmoothScrollProvider>
                <SystemHealthCheck />
                {children}
                <Toaster richColors position="top-right" />
              </SmoothScrollProvider>
            </SessionProvider>
          </StoreProvider>
        </AppThemeProvider>
      </body>
    </html>
  );
}
