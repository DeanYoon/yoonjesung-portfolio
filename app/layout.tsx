import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dean Yoon - Creative Frontend Developer | Innovative Pixel Clock Portfolio",
  description:
    "Discover Dean Yoon's innovative portfolio featuring a revolutionary pixel clock interface where analog clocks form digital numbers. Experience creative frontend development with Next.js, TypeScript, and interactive animations.",
  keywords: [
    "frontend developer",
    "creative developer",
    "pixel clock",
    "interactive design",
    "Next.js developer",
    "TypeScript",
    "React developer",
    "innovative UI",
    "digital clock",
    "portfolio website",
    "creative coding",
    "Dean Yoon",
    "web animations",
    "modern web development",
  ],
  authors: [{ name: "Dean Yoon", url: "https://github.com/DeanYoon" }],
  creator: "Dean Yoon",
  publisher: "Dean Yoon",
  category: "Technology",
  classification: "Portfolio Website",

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nextjs-boilerplate-eight-sable-95.vercel.app",
    title: "Dean Yoon - Innovative Pixel Clock Portfolio",
    description:
      "Experience a revolutionary digital interface where analog clocks form numbers. Creative frontend development showcase.",
    siteName: "Dean Yoon Portfolio",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Dean Yoon's Pixel Clock Portfolio - Innovative Digital Interface",
        type: "image/png",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: "@DeanYoon",
    creator: "@DeanYoon",
    title: "Dean Yoon - Creative Frontend Developer",
    description:
      "Revolutionary pixel clock interface where analog clocks create digital numbers. Innovative portfolio showcase.",
    images: ["/twitter-image.png"],
  },

  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },

  // Set favicon and icons
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    other: [
      { rel: "manifest", url: "/site.webmanifest" },
      { rel: "mask-icon", url: "/logo.svg", color: "#B3B3B3" },
      { rel: "shortcut icon", url: "/favicon.ico" },
    ],
  },

  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#B3B3B3" },
    { media: "(prefers-color-scheme: dark)", color: "#1e293b" },
  ],

  colorScheme: "dark light",

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

  verification: {},

  alternates: {
    canonical: "https://nextjs-boilerplate-eight-sable-95.vercel.app",
  },

  applicationName: "Dean Yoon Portfolio",
  referrer: "origin-when-cross-origin",

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {/* Structured Data JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Dean Yoon",
              jobTitle: "Frontend Developer",
              description:
                "Creative frontend developer specializing in innovative user interfaces and interactive web applications",
              url: "https://nextjs-boilerplate-eight-sable-95.vercel.app",
              sameAs: ["https://github.com/DeanYoon"],
              knowsAbout: [
                "Frontend Development",
                "React",
                "Next.js",
                "TypeScript",
                "JavaScript",
                "Web Animations",
                "User Interface Design",
                "Creative Coding",
              ],
              alumniOf: { "@type": "EducationalOrganization", name: "Hanyang University" },
              worksFor: { "@type": "Organization", name: "NC Japan" },
            }),
          }}
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
