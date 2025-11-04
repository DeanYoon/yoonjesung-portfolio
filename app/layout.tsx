import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dean Yoon - Creative Frontend Developer | Innovative Pixel Clock Portfolio",
  description: "Discover Dean Yoon's innovative portfolio featuring a revolutionary pixel clock interface where analog clocks form digital numbers. Experience creative frontend development with Next.js, TypeScript, and interactive animations.",
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
    "modern web development"
  ],
  authors: [{ name: "Dean Yoon", url: "https://github.com/DeanYoon" }],
  creator: "Dean Yoon",
  publisher: "Dean Yoon",
  category: "Technology",
  classification: "Portfolio Website",
  
  // Open Graph metadata for social media sharing
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nextjs-boilerplate-eight-sable-95.vercel.app",
    title: "Dean Yoon - Innovative Pixel Clock Portfolio",
    description: "Experience a revolutionary digital interface where analog clocks form numbers. Creative frontend development showcase.",
    siteName: "Dean Yoon Portfolio",
    images: [
      {
        url: "/og-image.png", // Note: This image needs to be created
        width: 1200,
        height: 630,
        alt: "Dean Yoon's Pixel Clock Portfolio - Innovative Digital Interface",
        type: "image/png",
      },
    ],
  },
  
  // Twitter Card metadata
  twitter: {
    card: "summary_large_image",
    site: "@DeanYoon", // Update with actual Twitter handle if available
    creator: "@DeanYoon",
    title: "Dean Yoon - Creative Frontend Developer",
    description: "Revolutionary pixel clock interface where analog clocks create digital numbers. Innovative portfolio showcase.",
    images: ["/twitter-image.png"], // Note: This image needs to be created
  },
  
  // Additional metadata
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f59e0b" },
    { media: "(prefers-color-scheme: dark)", color: "#1e293b" },
  ],
  
  colorScheme: "dark light",
  
  // Robots and indexing
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
  
  // Additional verification and canonical
  verification: {
    // google: "google-site-verification-code", // Add when available
    // yandex: "yandex-verification-code", // Add when available  
    // yahoo: "yahoo-site-verification-code", // Add when available
  },
  
  alternates: {
    canonical: "https://nextjs-boilerplate-eight-sable-95.vercel.app",
  },
  
  // App-specific metadata
  applicationName: "Dean Yoon Portfolio",
  referrer: "origin-when-cross-origin",
  
  // Format detection
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  
  // Additional structured data will be added via JSON-LD in the future
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
              description: "Creative frontend developer specializing in innovative user interfaces and interactive web applications",
              url: "https://nextjs-boilerplate-eight-sable-95.vercel.app",
              sameAs: [
                "https://github.com/DeanYoon",
                // Add other social media profiles when available
              ],
              knowsAbout: [
                "Frontend Development",
                "React",
                "Next.js",
                "TypeScript",
                "JavaScript",
                "Web Animations",
                "User Interface Design",
                "Creative Coding"
              ],
              alumniOf: {
                "@type": "EducationalOrganization",
                name: "Hanyang University"
              },
              worksFor: {
                "@type": "Organization",
                name: "NC Japan"
              }
            })
          }}
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}