import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarClock, Scale } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { getGuide, getGuideCases } from "@/lib/content";
import { Badge, Card } from "@/components/ui";
import { ConsultationCallout } from "@/components/shared";

export const dynamic = "force-dynamic";
function Content({ text }: { text: string }) {
  return (
    <div className="guide-content">
      {text.split(/\n+/).map((line, index) => {
        if (!line.trim()) return null;
        if (/^\d+[.、]|^[-•]/.test(line))
          return (
            <p key={index} className="guide-list-item">
              {line}
            </p>
          );
        if (line.length < 28 && !/[。.!?：:]$/.test(line))
          return <h2 key={index}>{line}</h2>;
        return <p key={index}>{line}</p>;
      })}
    </div>
  );
}
export default async function GuidePage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params,
    zh = locale === "zh",
    guide = await getGuide(slug);
  if (!guide) notFound();
  const cases = await getGuideCases(guide.id);
  return (
    <>
      <main>
        <section className="border-b border-slate-200 bg-[#f4f4f4]">
          <div className="mx-auto max-w-4xl px-5 py-14 sm:py-20">
            <Link
              href={`/${locale}/cases`}
              className="inline-flex items-center gap-2 text-sm font-bold text-[#8a7d51] hover:text-[#716641]"
            >
              <ArrowLeft size={16} />
              {zh ? "返回案例资料库" : "Back to case library"}
            </Link>
            <div className="mt-8 flex flex-wrap gap-2">
              <Badge>
                {zh ? guide.category_name_zh : guide.category_name_en}
              </Badge>
              {guide.type_name_zh && (
                <Badge className="border-slate-200 bg-white text-slate-600">
                  {zh ? guide.type_name_zh : guide.type_name_en}
                </Badge>
              )}
            </div>
            <h1 className="mt-5 max-w-3xl text-3xl font-bold leading-tight tracking-[-.045em] text-[#1a243f] sm:text-5xl">
              {zh ? guide.title_zh : guide.title_en}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
              {zh ? guide.summary_zh : guide.summary_en}
            </p>
          </div>
        </section>
        <article className="mx-auto grid max-w-5xl gap-10 px-5 py-14 lg:grid-cols-[minmax(0,1fr)_240px]">
          <Content text={zh ? guide.content_zh : guide.content_en} />
          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <Card className="p-5">
              <CalendarClock size={19} className="text-[#8a7d51]" />
              <h2 className="mt-3 text-sm font-bold text-[#1a243f]">
                {zh ? "收到通知后" : "After receiving notice"}
              </h2>
              <p className="mt-2 text-xs leading-5 text-slate-500">
                {zh
                  ? "先确认具体条款、主管机构和回应截止日期，再整理资料。"
                  : "Confirm the charge, agency, and response deadline before organizing evidence."}
              </p>
            </Card>
            <Card className="p-5">
              <Scale size={19} className="text-[#8a7d51]" />
              <h2 className="mt-3 text-sm font-bold text-[#1a243f]">
                {zh ? "重要说明" : "Important"}
              </h2>
              <p className="mt-2 text-xs leading-5 text-slate-500">
                {zh
                  ? "本文仅供一般信息参考，不构成法律建议。复杂或需出庭的事项应咨询持牌律师。"
                  : "General information only, not legal advice. Consult a licensed attorney for complex or court matters."}
              </p>
            </Card>
          </aside>
        </article>
        {cases.length > 0 && (
          <section className="border-t border-slate-200 bg-slate-50">
            <div className="mx-auto max-w-5xl px-5 py-12">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs font-bold tracking-[.14em] text-[#8a7d51]">
                    RELATED CASES
                  </p>
                  <h2 className="mt-2 text-2xl font-bold tracking-[-.035em] text-[#1a243f]">
                    {zh ? "相关案例" : "Related cases"}
                  </h2>
                </div>
                <Link
                  href={`/${locale}/cases`}
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-[#8a7d51]"
                >
                  {zh ? "全部案例" : "All cases"}
                  <ArrowRight size={15} />
                </Link>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {cases.map((item) => (
                  <Link key={item.id} href={`/${locale}/cases`}>
                    <Card className="h-full p-5 transition hover:border-[#d9d1b5] hover:shadow-md">
                      <Badge>
                        {zh ? item.type_name_zh : item.type_name_en}
                      </Badge>
                      <h3 className="mt-3 font-bold leading-6 text-[#1a243f]">
                        {zh ? item.title_zh : item.title_en}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">
                        {zh ? item.summary_zh : item.summary_en}
                      </p>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <ConsultationCallout locale={locale} />
    </>
  );
}
