import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const inter = Inter({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const SITE_URL = "https://brendan-cavazos.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Brendan Cavazos | Sports & Broadcast Video Editor | Fort Worth, TX",
  description:
    "Freelance sports and broadcast video editor based in Fort Worth, TX. I edit social media content, long-form video, and podcasts for brands like PBR and Fox Sports.",
  alternates: {
    canonical: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    title: "Brendan Cavazos | Sports & Broadcast Video Editor",
    description:
      "Freelance sports and broadcast video editor based in Fort Worth, TX. PBR · Fox Sports · Social Media · Long Form · Podcast.",
    url: SITE_URL,
    siteName: "Brendan Cavazos",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Brendan Cavazos — Sports & Broadcast Video Editor",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Brendan Cavazos | Sports & Broadcast Video Editor",
    description:
      "Freelance sports and broadcast video editor. PBR · Fox Sports · Social · Long Form · Podcast.",
    images: ["/og-image.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Brendan Cavazos",
  jobTitle: "Video Editor",
  description:
    "Freelance sports and broadcast video editor based in Fort Worth, TX. Specializing in social media, long-form, and podcast editing.",
  url: SITE_URL,
  email: "brendancavazos3@gmail.com",
  telephone: "+19808750858",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Fort Worth",
    addressRegion: "TX",
    addressCountry: "US",
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "East Carolina University",
  },
  worksFor: {
    "@type": "Organization",
    name: "Professional Bull Riders",
  },
  knowsAbout: [
    "Video Editing",
    "Sports Media",
    "Broadcast Production",
    "Social Media Content",
    "Podcast Editing",
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Brendan Cavazos",
  url: SITE_URL,
  description: "Portfolio of Brendan Cavazos, sports and broadcast video editor",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bebas.variable} ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
