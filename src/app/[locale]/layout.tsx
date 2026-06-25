import type { Metadata } from "next";
import Script from "next/script";
import { Inter } from "next/font/google";
import { hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { ThemeProvider } from "next-themes";
import { AdBanner } from "@/components/ads/adsterra-banner";
import { SiteFooter, SiteHeader } from "@/components/site";
import { routing } from "@/i18n/routing";

const gaId = "G-0LH1PNF2VW";
const adsenseClient = "ca-pub-9990396895505565";
const clarityId = "x7zpwicqq8";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://growagarden2wiki.wiki";
const siteName = "Grow a Garden 2 Wiki";
const siteDescription = "Fan-made Grow a Garden 2 wiki with active codes, beginner guide, seed shop tips, stealing defense, guild rewards, pets, badges, and Roblox update notes.";

function GlobalSidebarAd({ adKey }: { adKey?: string | null }) {
  const key = adKey?.trim();

  if (!key) {
    return null;
  }

  return (
    <aside className="sticky top-20 z-20 self-start py-2">
      <div className="mx-auto max-w-4xl">
        <AdBanner type="banner-160x600" adKey={key} eager />
      </div>
    </aside>
  );
}

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
  const sidebarAdKey = process.env.NEXT_PUBLIC_AD_SIDEBAR_160X600?.trim();

  return (
    <html lang={locale} className={`${inter.variable}`} suppressHydrationWarning>
      <head>
        {/* Google Analytics */}
        <Script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}');
          `}
        </Script>
        {/* Google AdSense */}
        <meta name="google-adsense-account" content={adsenseClient} />
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
          crossOrigin="anonymous"
        />
        {/* Microsoft Clarity */}
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${clarityId}");
          `}
        </Script>
      </head>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <NextIntlClientProvider messages={messages}>
            <SiteHeader locale={locale} />
            {sidebarAdKey ? (
              <div className="grid min-w-0 grid-cols-1 xl:grid-cols-[160px_minmax(0,1fr)] xl:gap-6">
                <GlobalSidebarAd adKey={sidebarAdKey} />
                <div className="min-w-0">{children}</div>
              </div>
            ) : (
              children
            )}
            <SiteFooter locale={locale} />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
