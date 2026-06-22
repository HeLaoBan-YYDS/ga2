import type { Metadata } from "next";
import { getMessages } from "next-intl/server";
import { HomeStickyAd } from "@/components/ads/home-sticky-ad";
import { JsonLd, WikiSidebar } from "@/components/site";
import { getAllContent, getDynamicNavigation, type ContentItem, CONTENT_TYPES } from "@/lib/content";
import { routing, type Locale } from "@/i18n/routing";
import en from "@/locales/en.json";
import HomePageClient from "./HomePageClient";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://growagarden2wiki.wiki";
const officialLinks = [
  "https://gag.gg/",
  "https://www.roblox.com/games/97598239454123/Grow-a-Garden-2",
  "https://www.roblox.com/communities/432538536/Strawberreh-Squad",
  "https://discord.gg/H8qPF3QnMF",
  "https://x.com/GrowaGardenRblx",
  "https://www.reddit.com/r/growagarden/",
  "https://www.youtube.com/watch?v=a3TCmxcT2QI",
];

type Messages = typeof en;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const messages = (await getMessages({ locale })) as Messages;
  const localePrefix = locale === "en" ? "" : `/${locale}`;
  const homeAlternates: Record<string, string> = { "x-default": siteUrl };
  for (const loc of routing.locales) {
    homeAlternates[loc] = loc === "en" ? siteUrl : `${siteUrl}/${loc}`;
  }
  return {
    title: messages.home.meta.title,
    description: messages.home.meta.description,
    alternates: { canonical: locale === "en" ? "/" : `/${locale}`, languages: homeAlternates },
    openGraph: { title: messages.home.meta.title, description: messages.home.meta.description, url: `${siteUrl}${localePrefix}`, siteName: messages.site.name, images: [`${siteUrl}/images/hero.webp`] },
    twitter: { card: "summary_large_image", title: messages.home.meta.title, description: messages.home.meta.description, images: [`${siteUrl}/images/hero.webp`] },
  };
}

export default async function LocaleHomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const loc = locale as Locale;
  const messages = (await getMessages({ locale })) as Messages;
  const navGroups = getDynamicNavigation(loc);
  const localePrefix = locale === "en" ? "" : `/${locale}`;
  const homeUrl = `${siteUrl}${localePrefix || "/"}`;
  const organizationId = `${siteUrl}/#organization`;
  const webSiteId = `${siteUrl}/#website`;
  const videoGameId = `${siteUrl}/#videogame`;
  const homeGraph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: messages.site.name,
        url: siteUrl,
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/android-chrome-512x512.png`,
        },
        image: `${siteUrl}/images/hero.webp`,
        sameAs: officialLinks,
      },
      {
        "@type": "WebSite",
        "@id": webSiteId,
        name: messages.site.name,
        url: siteUrl,
        description: messages.site.description,
        image: `${siteUrl}/images/hero.webp`,
        inLanguage: locale,
        publisher: { "@id": organizationId },
        about: { "@id": videoGameId },
        sameAs: officialLinks,
      },
      {
        "@type": "VideoGame",
        "@id": videoGameId,
        name: messages.site.shortName,
        alternateName: messages.site.name,
        description: messages.home.meta.description,
        url: homeUrl,
        image: `${siteUrl}/images/hero.webp`,
        genre: ["Farming", "Simulation", "Roblox"],
        gamePlatform: "Roblox",
        operatingSystem: "Windows, macOS, iOS, Android, Xbox",
        applicationCategory: "Game",
        publisher: { "@id": organizationId },
        sameAs: officialLinks,
      },
    ],
  };

  // 动态加载所有 content 目录下的文章
  const allArticles: ContentItem[] = [];
  for (const contentType of CONTENT_TYPES) {
    const items = await getAllContent(contentType, loc);
    allArticles.push(...items);
  }

  // 取最近更新的 8 篇文章（按 date 倒序）
  const recentArticles = [...allArticles]
    .sort((a, b) => {
      const dateA = a.metadata.lastModified || a.metadata.date;
      const dateB = b.metadata.lastModified || b.metadata.date;
      return dateB.localeCompare(dateA);
    })
    .slice(0, 8);

  return (
    <>
      <HomeStickyAd adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <JsonLd data={homeGraph} />
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
          <HomePageClient home={messages.home} locale={locale} articles={allArticles} recentArticles={recentArticles} />
          <WikiSidebar locale={locale} navGroups={navGroups} />
        </div>
      </main>
    </>
  );
}
