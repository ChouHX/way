import { notFound } from "next/navigation";
import { SiteShell } from "@/components/site-shell";
import { locales, type Locale } from "@/lib/i18n";
import { getPublicContactSettings, getPublicServices } from "@/lib/content";
import { ContactProvider } from "@/components/contact-context";

export const dynamic = "force-dynamic";
export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) { const { locale } = await params; if (!locales.includes(locale as Locale)) notFound(); const [services, contact] = await Promise.all([getPublicServices(), getPublicContactSettings()]); return <ContactProvider contact={contact}><SiteShell locale={locale as Locale} services={services} contact={contact}>{children}</SiteShell></ContactProvider>; }
