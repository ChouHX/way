import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getDictionary, type Locale } from "@/lib/i18n";
import { ConsultationCallout } from "@/components/shared";
import { TextEffect } from "@/components/core/text-effect";
import { HeroStats, HomeServiceDialogs } from "@/components/home-showcase";
import { HomeTicketGuide } from "@/components/home-ticket-guide";
import { getFeaturedPublicCases } from "@/lib/content";
import { HomeCaseMarquee } from "@/components/home-case-marquee";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = getDictionary(locale);
  const zh = locale === "zh";
  const heroLines = zh
    ? "专业处理罚单与移民相关事务，\n为您的合法权益保驾护航"
    : "Practical guidance for ticket and\nimmigration matters that protect you.";
  const cases = await getFeaturedPublicCases();
  return (
    <>
      <section className="bg-[#f8fafc] px-3 py-3 sm:px-5 sm:py-5">
        <div className="relative isolate mx-auto max-w-[90rem] overflow-hidden bg-[#06182d] shadow-[0_24px_70px_rgba(2,16,34,.16)]">
          <img
            src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=2200&q=85"
            alt="New York city street"
            className="absolute inset-0 -z-20 h-full w-full scale-[1.01] object-cover object-center opacity-50"
          />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,rgba(3,16,31,.99)_2%,rgba(6,29,55,.95)_48%,rgba(7,34,64,.68)_78%,rgba(7,30,57,.5)_100%)]" />
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_78%_28%,rgba(56,189,248,.2),transparent_30%)]" />
          <div className="absolute inset-x-0 bottom-0 -z-10 h-56 bg-gradient-to-t from-[#06182d] via-[#06182d]/75 to-transparent" />
          <div className="mx-auto flex min-h-[31rem] max-w-6xl items-center px-5 pb-14 pt-14 sm:pb-16 sm:pt-16 md:min-h-[34rem] lg:py-20">
            <div className="w-full max-w-[51rem]">
              <p className="inline-flex items-center gap-2 border border-white/15 bg-white/[.08] px-3.5 py-2 text-[11px] font-bold tracking-[.15em] text-sky-200 shadow-[inset_0_1px_0_rgba(255,255,255,.1)] backdrop-blur-md">
                <span className="h-1.5 w-1.5 bg-sky-300 shadow-[0_0_0_4px_rgba(125,211,252,.12)]" />
                {t.tagline}
              </p>
              <TextEffect
                per="line"
                as="h1"
                className="mt-6 max-w-[51rem] text-[clamp(2.5rem,5.4vw,4.5rem)] font-bold leading-[1.035] tracking-[-.052em] text-white [text-shadow:0_2px_24px_rgba(0,0,0,.2)]"
                segmentWrapperClassName="block overflow-hidden"
                variants={{
                  container: {
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: { staggerChildren: 0.14 },
                    },
                  },
                  item: {
                    hidden: { opacity: 0, y: 18 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: 0.42,
                        ease: [0.23, 1, 0.32, 1],
                      },
                    },
                  },
                }}
              >
                {heroLines}
              </TextEffect>
              <p className="mt-6 max-w-[40rem] text-base font-medium leading-7 text-slate-200/90 sm:text-[1.08rem] sm:leading-8">
                {t.heroSub}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  className="pressable inline-flex min-h-12 items-center justify-center gap-2 bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-[0_10px_30px_rgba(2,16,34,.3),inset_0_1px_0_rgba(255,255,255,.2)] hover:bg-blue-500"
                  href={`/${locale}/contact`}
                >
                  {t.consult}
                  <ArrowRight size={16} />
                </Link>
                <Link
                  className="pressable inline-flex min-h-12 items-center justify-center border border-white/20 bg-white/[.09] px-6 py-3 text-sm font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,.15)] backdrop-blur-xl hover:bg-white/[.14]"
                  href={`/${locale}/services`}
                >
                  {t.services}
                </Link>
              </div>
            </div>
          </div>
          <HeroStats locale={locale} />
          <div className="h-7 sm:h-9" />
          <div className="absolute inset-x-0 bottom-0 -z-10 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-5 pb-20 pt-20 sm:pt-24">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold tracking-[.14em] text-blue-600">
              OUR SERVICES
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-[-.025em] text-[#0f2747]">
              {zh
                ? "为您争取清晰、可行的解决方案"
                : "Clear, practical paths forward"}
            </h2>
          </div>
          <Link
            href={`/${locale}/services`}
            className="hidden text-sm font-bold text-blue-600 sm:block"
          >
            {zh ? "全部服务" : "All services"} →
          </Link>
        </div>
        <HomeServiceDialogs locale={locale} />
      </section>
      <HomeTicketGuide locale={locale} />
      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold tracking-[.14em] text-blue-600">
                CASE RESULTS
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-[-.025em] text-[#0f2747]">
                {zh
                  ? "用结果，回应每一份托付。"
                  : "Results that reflect careful work."}
              </h2>
              <p className="mt-3 text-sm text-slate-600">
                {zh
                  ? "部分公开脱敏案例展示；每个案件均须独立评估。"
                  : "Selected public anonymized references; every matter requires individual assessment."}
              </p>
            </div>
            <Link
              href={`/${locale}/cases`}
              className="hidden text-sm font-bold text-blue-600 sm:block"
            >
              {zh ? "查看全部案例" : "View all cases"} →
            </Link>
          </div>
          {cases.length > 0 ? (
            <HomeCaseMarquee locale={locale} cases={cases} />
          ) : (
            <div className="mt-10 border border-slate-200 bg-slate-50 px-6 py-10 text-center text-sm text-slate-500">
              {zh ? "后台暂未发布案例。" : "No cases have been published yet."}
            </div>
          )}
        </div>
      </section>
      <section className="bg-[#f4f8fc]">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 lg:grid-cols-[.88fr_1.12fr]">
          <div>
            <p className="text-xs font-bold tracking-[.14em] text-blue-600">
              WHY YONGSHENG
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-[-.025em] text-[#0f2747]">
              {zh
                ? "把复杂问题，交给值得信赖的团队。"
                : "Bring complex matters to a team you can trust."}
            </h2>
            <p className="mt-5 leading-7 text-slate-600">
              {zh
                ? "从首次咨询到后续跟进，我们始终保持清晰沟通，尊重您的时间、隐私和每一个重要决定。"
                : "From consultation through follow-up, we communicate clearly and respect your time, privacy, and decisions."}
            </p>
            <Link
              href={`/${locale}/about`}
              className="pressable mt-7 inline-flex bg-[#0f2747] px-5 py-3 text-sm font-bold text-white hover:bg-[#173a68]"
            >
              {zh ? "认识我们的团队" : "Meet our team"}
            </Link>
          </div>
          <img
            src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1100&q=85"
            className="h-full min-h-[260px] w-full object-cover"
            alt="consulting team"
          />
        </div>
      </section>
      <ConsultationCallout locale={locale} />
    </>
  );
}
