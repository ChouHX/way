import { Check, Clock3, FileCheck2, Globe2, MapPin } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { getPublicAboutContent } from "@/lib/content";
import { ConsultationCallout, PageHero, SectionHeading } from "@/components/shared";

export default async function About({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const zh = locale === "zh";
  const content = await getPublicAboutContent(locale);

  return <>
    <PageHero locale={locale} kicker="ABOUT YONG SHENG" title={content.heroTitle} description={content.heroDescription} image="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1800&q=85" />

    <section className="mx-auto grid max-w-6xl gap-12 px-5 py-20 lg:grid-cols-[1.08fr_.92fr]">
      <div>
        <SectionHeading kicker="WHO WE ARE" title={zh ? "关于永盛" : "About Yong Sheng"} />
        <p className="mt-5 text-[15px] leading-8 text-slate-600">{content.intro}</p>
        <div className="mt-7 grid gap-3">
          {content.strengths.map((item) => <div key={item} className="flex gap-3 border border-slate-200 bg-white px-4 py-3.5"><span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#f4f1e8] text-[#8a7d51]"><Check size={13} strokeWidth={2.5} /></span><span className="text-sm leading-6 text-slate-700">{item}</span></div>)}
        </div>
      </div>
      <div className="grid content-start gap-3 sm:grid-cols-2">
        <img className="h-64 w-full object-cover sm:col-span-2" src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1000&q=85" alt={zh ? "永盛咨询团队" : "Yong Sheng consulting team"} />
        <div className="border-l-2 border-[#8a7d51] bg-slate-50 p-5"><b className="block text-3xl tracking-[-.05em] text-[#1a243f]">10+</b><span className="mt-1 block text-sm text-slate-600">{zh ? "年实战经验" : "years of experience"}</span></div>
        <div className="border-l-2 border-[#c5b780] bg-slate-50 p-5"><b className="block text-3xl tracking-[-.05em] text-[#1a243f]">24/7</b><span className="mt-1 block text-sm text-slate-600">{zh ? "全年在线咨询" : "year-round consultation"}</span></div>
      </div>
    </section>

    <section className="border-y border-[#dedede] bg-white">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 lg:grid-cols-[.82fr_1.18fr]">
        <div>
          <SectionHeading kicker="IMMIGRATION & DOCUMENTS" title={zh ? "移民及证件办理服务" : "Immigration and document services"} />
          <p className="mt-5 text-[15px] leading-8 text-slate-600">{content.immigrationIntro}</p>
          <div className="mt-7 flex items-center gap-3 text-sm font-bold text-[#1a243f]"><FileCheck2 size={20} className="text-[#8a7d51]" />{zh ? "专业、高效、贴心地推进每一项申请" : "Professional, efficient, attentive support"}</div>
        </div>
        <div className="grid gap-px overflow-hidden border border-[#dedede] bg-[#dedede] sm:grid-cols-2">
          {content.immigrationServices.map((item, index) => <div key={item} className="flex min-h-28 gap-3 bg-[#f8f8f7] p-5"><span className="text-xs font-bold tabular-nums text-[#8a7d51]">{String(index + 1).padStart(2, "0")}</span><p className="text-sm font-semibold leading-6 text-[#1a243f]">{item}</p></div>)}
        </div>
      </div>
    </section>

    <section className="mx-auto grid max-w-6xl gap-12 px-5 py-20 lg:grid-cols-[1fr_1fr]">
      <div>
        <SectionHeading kicker="OUR RESPONSIBILITY" title={zh ? "不只处理罚款，更关注长期影响。" : "Looking beyond the fine to longer-term effects."} />
        <p className="mt-5 text-[15px] leading-8 text-slate-600">{content.impact}</p>
        <p className="mt-5 border-l-2 border-[#8a7d51] pl-5 text-[15px] font-semibold leading-8 text-[#1a243f]">{content.mission}</p>
      </div>
      <aside className="self-start bg-[#1a243f] p-7 text-white">
        <div className="flex items-center gap-2 text-[#c5b780]"><Globe2 size={20} /><span className="text-xs font-bold tracking-[.14em]">SERVICE AREA</span></div>
        <h2 className="mt-4 text-2xl font-bold">{zh ? "服务地区" : "Where we serve"}</h2>
        <p className="mt-3 text-sm leading-6 text-white/70">{zh ? "重点服务以下州，并面向全美华人社区提供咨询与支持。" : "Priority service in the following states, with consultation and support available nationwide."}</p>
        <div className="mt-6 flex flex-wrap gap-2">{content.serviceRegions.map((region) => <span key={region} className="border border-white/15 bg-white/[.06] px-3 py-2 text-xs font-bold text-white">{region}</span>)}</div>
        <div className="mt-7 grid gap-3 border-t border-white/10 pt-6 text-sm text-white/75"><span className="flex items-center gap-2"><MapPin size={16} className="text-[#c5b780]" />{zh ? "总部位于纽约布鲁克林" : "Based in Brooklyn, New York"}</span><span className="flex items-center gap-2"><Clock3 size={16} className="text-[#c5b780]" />{zh ? "7×24 小时在线，全年无休" : "Available 24/7, year-round"}</span></div>
      </aside>
    </section>
    <ConsultationCallout locale={locale} />
  </>;
}
