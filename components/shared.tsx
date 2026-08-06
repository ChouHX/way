import Link from "next/link";
import {
  ArrowRight,
  Check,
  FileCheck2,
  Globe2,
  Scale,
  ShieldCheck,
} from "lucide-react";
import { getDictionary, type Locale } from "@/lib/i18n";
import { InView } from "@/components/core/in-view";
import { EditableText } from "@/components/inline-editor";

export function PageHero({
  locale,
  kicker,
  title,
  description,
  image,
}: {
  locale: Locale;
  kicker: string;
  title: string;
  description: string;
  image: string;
}) {
  return (
    <section
      lang={locale === "zh" ? "zh-CN" : "en"}
      className="relative isolate min-h-[22rem] overflow-hidden bg-[#1a243f]"
    >
      <img
        src={image}
        alt=""
        className="absolute inset-0 -z-20 h-full w-full object-cover object-center opacity-40"
      />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(26,36,63,.99)_0%,rgba(26,36,63,.93)_46%,rgba(26,36,63,.58)_76%,rgba(26,36,63,.3)_100%)]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_72%_20%,rgba(197,183,128,.15),transparent_30%)]" />
      <div className="mx-auto flex min-h-[22rem] max-w-6xl items-center px-5 py-16 md:py-20">
        <div className="max-w-4xl">
          <p className="flex items-center gap-3 text-xs font-bold tracking-[.17em] text-[#c5b780]">
            <span className="h-px w-7 bg-[#c5b780]" />
            <EditableText contentKey="hero.kicker">{kicker}</EditableText>
          </p>
          <h1 className="mt-5 max-w-4xl text-[clamp(2.35rem,5vw,3.75rem)] font-bold leading-[1.06] tracking-[-.04em] text-white">
            <EditableText contentKey="hero.title">{title}</EditableText>
          </h1>
          <p className="mt-6 max-w-2xl text-[1.05rem] font-medium leading-8 text-white/75">
            <EditableText contentKey="hero.description" multiline>{description}</EditableText>
          </p>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#c5b780]/45 to-transparent" />
    </section>
  );
}

export function SectionHeading({
  kicker,
  title,
  description,
  cmsKey,
}: {
  kicker: string;
  title: string;
  description?: string;
  cmsKey?: string;
}) {
  return (
    <InView
      variants={{
        hidden: { opacity: 0, transform: "translateY(10px)" },
        visible: { opacity: 1, transform: "translateY(0)" },
      }}
      viewOptions={{ margin: "0px 0px -160px 0px" }}
      transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
    >
      <div className="max-w-2xl">
        <p className="text-xs font-bold tracking-[.14em] text-[#8a7d51]">{cmsKey ? <EditableText contentKey={`${cmsKey}.kicker`}>{kicker}</EditableText> : kicker}</p>
        <h2 className="mt-3 text-3xl font-bold leading-tight tracking-[-.025em] text-[#1a243f]">
          {cmsKey ? <EditableText contentKey={`${cmsKey}.title`}>{title}</EditableText> : title}
        </h2>
        {description && <p className="mt-4 leading-7 text-slate-600">{cmsKey ? <EditableText contentKey={`${cmsKey}.description`} multiline>{description}</EditableText> : description}</p>}
      </div>
    </InView>
  );
}

export function TrustStrip({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const icons = [Scale, ShieldCheck, FileCheck2, Globe2];
  return (
    <div className="relative z-10 -mt-10 px-5">
      <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-y divide-slate-100 border border-slate-200 bg-white shadow-lg shadow-slate-950/10 md:grid-cols-4 md:divide-y-0">
        {t.trust.map((item, index) => {
          const Icon = icons[index];
          return (
            <div key={item} className="flex items-center gap-3 px-5 py-5">
              <Icon size={19} className="text-[#8a7d51]" />
              <span className="text-sm font-semibold text-slate-700">{item}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ConsultationCallout({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  return (
    <section className="bg-[#ece9df]">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-5 py-12 md:flex-row md:items-center">
        <div>
          <p className="text-xs font-bold tracking-[.14em] text-[#8a7d51]">
            <EditableText contentKey="callout.kicker">YONG SHENG CONSULTNG</EditableText>
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-[-.025em] text-[#1a243f]">
            <EditableText contentKey="callout.title">{locale === "zh" ? "让专业建议成为您的下一步。" : "Make professional guidance your next step."}</EditableText>
          </h2>
        </div>
        <Link
          href={`/${locale}/contact`}
          className="pressable inline-flex items-center gap-2 bg-[#8a7d51] px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-[#716641]"
        >
          {t.consult}
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}

export function Checklist({ items }: { items: string[] }) {
  return (
    <ul className="mt-6 grid gap-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-sm leading-6 text-slate-600">
          <Check size={18} className="mt-0.5 shrink-0 text-[#8a7d51]" />
          {item}
        </li>
      ))}
    </ul>
  );
}
