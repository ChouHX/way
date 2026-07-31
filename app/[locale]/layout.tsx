import { notFound } from "next/navigation";
import { SiteShell } from "@/components/site-shell";
import { locales, type Locale } from "@/lib/i18n";
import { getPublicContactSettings, getPublicServices, getPublicSiteSettings } from "@/lib/content";
import { ContactProvider } from "@/components/contact-context";

export const dynamic = "force-dynamic";
export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) { const { locale } = await params; if (!locales.includes(locale as Locale)) notFound(); const [services, contact, site] = await Promise.all([getPublicServices(), getPublicContactSettings(), getPublicSiteSettings()]); return <ContactProvider contact={contact}><SiteShell locale={locale as Locale} services={services} contact={contact} logoUrl={site.logo_url}>{children}</SiteShell></ContactProvider>; }
