import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { ThemeProvider } from "next-themes";
import { JsonLd, SiteFooter, SiteHeader } from "@/components/site";
import { routing } from "@/i18n/routing";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://growagarden2wiki.wiki";
const siteName = "Grow a Garden 2 Wiki";
const siteDescription = "Fan-made Grow a Garden 2 wiki with active codes, beginner guide, seed shop tips, stealing defense, guild rewards, pets, badges, and Roblox update notes.";
const officialLinks = [
  "https://gag.gg/",
  "https://www.roblox.com/games/97598239454123/Grow-a-Garden-2",
  "https://www.roblox.com/communities/432538536/Strawberreh-Squad",
  "https://discord.gg/H8qPF3QnMF",
  "https://x.com/GrowaGardenRblx",
  "https://www.reddit.com/r/growagarden/",
  "https://www.youtube.com/watch?v=a3TCmxcT2QI",
];

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const image = `${siteUrl}/images/hero.webp`;
  return {
    metadataBase: new URL(siteUrl),
    title: { default: siteName, template: "%s" },
    description: siteDescription,
    openGraph: {
      type: "website",
      locale,
      url: siteUrl,
      siteName,
      title: siteName,
      description: siteDescription,
      images: [{ url: image, alt: "Grow a Garden 2 Wiki gameplay preview" }],
    },
    twitter: {
      card: "summary_large_image",
      title: siteName,
      description: siteDescription,
      images: [image],
    },
  };
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const messages = await getMessages();
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    url: siteUrl,
    logo: `${siteUrl}/android-chrome-512x512.png`,
    image: `${siteUrl}/images/hero.webp`,
    sameAs: officialLinks,
  };

  return (
    <html lang={locale} className={`${inter.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <NextIntlClientProvider messages={messages}>
            <JsonLd data={organization} />
            <SiteHeader locale={locale} />
            {children}
            <SiteFooter locale={locale} />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
