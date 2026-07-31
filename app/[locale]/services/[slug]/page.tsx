import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, FileText } from "lucide-react";
import { ConsultationCallout, PageHero } from "@/components/shared";
import type { Locale } from "@/lib/i18n";
import { getServiceIcon, localizeService } from "@/lib/services";
import { getPublicService, getPublicServices } from "@/lib/content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const service = await getPublicService(slug);
  if (!service) return {};
  const copy = localizeService(service, locale);
  return {
    title: `${copy.title} | ${locale === "zh" ? "永盛咨询中心" : "YONG SHENG CONSULTNG"}`,
    description: copy.intro,
  };
}

export default async function ServiceDetail({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const [service, services] = await Promise.all([getPublicService(slug), getPublicServices()]);
  if (!service) notFound();

  const zh = locale === "zh";
  const copy = localizeService(service, locale);
  const Icon = getServiceIcon(service.icon_key);
  const related = services.filter((item) => item.slug !== service.slug).slice(0, 3);

  return (
    <>
      <PageHero
        locale={locale}
        kicker={zh ? "服务项目" : "OUR SERVICES"}
        title={copy.title}
        description={copy.intro}
        image={service.image_url}
      />
      <main className="bg-[#f4f4f4]">
        <section className="mx-auto grid max-w-6xl gap-12 px-5 py-16 md:py-20 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,.8fr)]">
          <div>
            <Link
              href={`/${locale}/services`}
              className="inline-flex items-center gap-2 text-sm font-bold text-[#8a7d51] hover:text-[#716641]"
            >
              <ArrowLeft size={16} />
              {zh ? "返回全部服务" : "Back to all services"}
            </Link>
            {copy.showOverview && (copy.overview || copy.overviewTitle) && <>
              <p className="mt-8 text-xs font-bold tracking-[.15em] text-[#8a7d51]">
                {zh ? "服务概览" : "SERVICE OVERVIEW"}
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-[-.035em] text-[#1a243f]">
                {copy.overviewTitle}
              </h2>
              <div className="mt-6 space-y-5 text-base leading-8 text-slate-600">
                {copy.overview.split(/\n\s*\n/).filter(Boolean).map((paragraph, index) => <p key={index}>{paragraph}</p>)}
              </div>
            </>}

            {copy.showPoints && copy.points.length > 0 && <div className="mt-10 border-y border-[#d8d8d8] bg-white px-6 py-7">
              <h3 className="flex items-center gap-3 font-bold text-[#1a243f]">
                <FileText size={20} className="text-[#8a7d51]" />
                {copy.pointsTitle}
              </h3>
              <ul className="mt-5 grid gap-4">
                {copy.points.map((point, index) => {
                  const separator = point.indexOf("：") >= 0 ? "：" : ":";
                  const [label, ...details] = point.split(separator);
                  return <li key={`${point}-${index}`} className="flex gap-3 text-sm leading-6 text-slate-600">
                    <Check size={17} className="mt-1 shrink-0 text-[#8a7d51]" />
                    <span>{details.length ? <><strong className="font-bold text-[#1a243f]">{label}</strong>{separator}{details.join(separator)}</> : point}</span>
                  </li>;
                })}
              </ul>
            </div>}
          </div>

          <aside className="self-start bg-[#1a243f] p-7 text-white lg:sticky lg:top-24">
            <span className="grid h-12 w-12 place-items-center border border-[#8a7d51]/70 text-[#c5b780]">
              <Icon size={24} />
            </span>
            <p className="mt-6 text-xs font-bold tracking-[.15em] text-[#c5b780]">
              {zh ? "开始咨询" : "START A CONVERSATION"}
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-[-.025em]">
              {zh ? "告诉我们您的具体情况" : "Tell us about your situation"}
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              {zh
                ? "带上现有文件和重要时间节点，我们将帮助您确认下一步。"
                : "Bring the records you have and any important deadlines. We will help clarify the next step."}
            </p>
            <Link
              href={`/${locale}/contact`}
              className="mt-7 inline-flex items-center gap-2 bg-[#8a7d51] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#9a8c5b]"
            >
              {zh ? "预约咨询" : "Book a consultation"}
              <ArrowRight size={16} />
            </Link>
          </aside>
        </section>

        {copy.showProcess && copy.steps.length > 0 && <section className="border-y border-[#dedede] bg-white">
          <div className="mx-auto max-w-6xl px-5 py-16">
            <p className="text-xs font-bold tracking-[.15em] text-[#8a7d51]">
              {zh ? "一般流程" : "OUR PROCESS"}
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-[-.035em] text-[#1a243f]">
              {copy.processTitle}
            </h2>
            <div className="mt-10 grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(14rem, 1fr))" }}>
              {copy.steps.map((step, index) => (
                <article key={`${step.title}-${index}`} className="min-h-56 border border-[#8a7d51]/70 bg-[#202c49] p-6 transition-colors hover:border-[#c5b780] hover:bg-[#253252]">
                  <span className="text-xs font-bold text-[#c5b780]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-white">{step.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{step.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>}

        <section className="mx-auto max-w-6xl px-5 py-16">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold tracking-[.15em] text-[#8a7d51]">
                {zh ? "其他服务" : "RELATED SERVICES"}
              </p>
              <h2 className="mt-3 text-2xl font-bold text-[#1a243f]">
                {zh ? "继续了解服务范围" : "Explore more ways we can help"}
              </h2>
            </div>
            <Link
              href={`/${locale}/services`}
              className="hidden text-sm font-bold text-[#8a7d51] sm:inline-flex"
            >
              {zh ? "全部服务" : "All services"} →
            </Link>
          </div>
          <div className="mt-8 grid gap-px border border-[#dedede] bg-[#dedede] md:grid-cols-3">
            {related.map((item) => {
              const relatedCopy = localizeService(item, locale);
              const RelatedIcon = getServiceIcon(item.icon_key);
              return (
                <Link
                  key={item.slug}
                  href={`/${locale}/services/${item.slug}`}
                  className="group bg-white p-6 transition hover:bg-[#faf9f5]"
                >
                  <RelatedIcon size={22} className="text-[#8a7d51]" />
                  <h3 className="mt-5 font-bold text-[#1a243f]">{relatedCopy.title}</h3>
                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">
                    {relatedCopy.intro}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-[#8a7d51]">
                    {zh ? "了解详情" : "Learn more"}
                    <ArrowRight size={14} className="transition group-hover:translate-x-1" />
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      </main>
      <ConsultationCallout locale={locale} />
    </>
  );
}
