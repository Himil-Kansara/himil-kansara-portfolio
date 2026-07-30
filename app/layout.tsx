import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });
const title = "Himil Kansara | Senior Full-Stack Developer";
const description = "Portfolio of Himil Kansara, a Senior Full-Stack Developer specialising in Angular, React, TypeScript, .NET Core, APIs, Azure and modern responsive web applications.";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://himilkansara.dev"),
  title,
  description,
  alternates: { canonical: "/" },
  icons: { icon: "/favicon.svg" },
  openGraph: { title, description, type: "website", locale: "en_IN", images: [{ url: "/og.png", width: 1200, height: 630, alt: "Himil Kansara — Senior Full-Stack Developer" }] },
  twitter: { card: "summary_large_image", title, description, images: ["/og.png"] },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, colorScheme: "dark light", themeColor: "#07090f" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning><body className={`${geist.variable} ${mono.variable}`}>{children}</body></html>;
}
