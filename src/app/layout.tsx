import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { JsonLd } from "@/components/seo/json-ld";
import { isProduction, site, siteUrl } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Pages set `title`, `description` and `alternates.canonical`. Never put a canonical or openGraph.url here,
// or every page inherits the home URL. A page's `openGraph` replaces this whole object, so repeat the shared fields.
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { template: `%s | ${site.name}`, default: site.name },
  description: site.description,
  openGraph: { type: "website", siteName: site.name, locale: site.locale },
  twitter: { card: "summary_large_image" },
  robots: isProduction ? undefined : { index: false, follow: false },
};

const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  url: siteUrl,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang={site.locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {children}
        <JsonLd data={organization} />
      </body>
    </html>
  );
}
