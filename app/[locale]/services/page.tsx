import Link from "next/link";
import {
  ArrowRight,
  Check,
  ClipboardCheck,
  MessageCircle,
  SearchCheck,
} from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { localizeService, serviceItems } from "@/lib/services";
import {
  ConsultationCallout,
  PageHero,
  SectionHeading,
} from "@/components/shared";
import { Card } from "@/components/ui";

export default async function Services({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const zh = locale === "zh";
  const process = [
    [
      MessageCircle,
      zh ? "初步沟通" : "Initial consultation",
      zh
        ? "说明您的情况、已有资料和重要时间节点。"
        : "Share your situation, available records, and key timing.",
    ],
    [
      SearchCheck,
      zh ? "资料评估" : "Record review",
      zh
        ? "梳理事实、文件与可能影响，确认处理重点。"
        : "Review facts, records, and implications to identify priorities.",
    ],
    [
      ClipboardCheck,
      zh ? "制定方案" : "A clear plan",
      zh
        ? "说明下一步、配合事项与后续进度安排。"
        : "Confirm next steps, needed input, and progress updates.",
    ],
  ] as const;

  return (
    <>
      <PageHero
        locale={locale}
        kicker="SERVICES"
        title={
          zh
            ? "针对关键问题，提供清晰、务实的支持。"
            : "Clear, practical support for pivotal matters."
        }
        description={
          zh
            ? "从交通罚单与移民事务，到日常财务和理赔问题，我们帮助您理解选择并稳妥推进。"
            : "From traffic and immigration matters to everyday financial and claim concerns, we help you understand your options and move forward with care."
        }
        image="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1800&q=85"
      />
      <section className="mx-auto max-w-6xl px-5 py-20">
        <SectionHeading
          kicker="WHAT WE HANDLE"
          title={zh ? "选择您需要了解的服务" : "Explore our services"}
          description={
            zh
              ? "每项服务均提供独立说明。先了解处理范围、资料重点和一般流程，再决定下一步。"
              : "Each service has a dedicated overview of its scope, record priorities, and general process."
          }
        />
        <div className="mt-10 grid gap-px border border-slate-200 bg-slate-200 lg:grid-cols-2">
          {serviceItems.map((service, index) => {
            const Icon = service.icon;
            const copy = localizeService(service, locale);
            return (
              <Card
                key={service.slug}
                className="stagger-card group overflow-hidden border-0 shadow-none"
              >
                <Link
                  href={`/${locale}/services/${service.slug}`}
                  className="grid h-full sm:grid-cols-[180px_1fr]"
                >
                  <div className="overflow-hidden bg-[#1a243f]">
                    <img
                      src={service.image}
                      alt={copy.title}
                      className="h-48 w-full object-cover opacity-90 transition duration-300 group-hover:scale-[1.02] sm:h-full"
                    />
                  </div>
                  <div className="flex min-h-[15rem] flex-col p-6">
                    <div className="flex items-start justify-between gap-3">
                      <span className="grid h-10 w-10 shrink-0 place-items-center bg-[#f4f1e8] text-[#8a7d51]">
                        <Icon size={21} />
                      </span>
                      <span className="text-xs font-bold text-slate-400">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h2 className="mt-5 text-xl font-bold leading-tight tracking-[-.02em] text-[#1a243f]">
                      {copy.title}
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {copy.intro}
                    </p>
                    <span className="mt-auto flex items-center gap-2 pt-5 text-xs font-bold text-[#8a7d51]">
                      {zh ? "查看服务详情" : "View service details"}
                      <ArrowRight
                        size={15}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </span>
                  </div>
                </Link>
              </Card>
            );
          })}
        </div>
      </section>
      <section className="border-y border-[#dedede] bg-white">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <div className="flex flex-col justify-between gap-6 md:flex-row">
            <SectionHeading
              kicker="HOW IT WORKS"
              title={
                zh ? "让流程简单、信息透明。" : "A simple, transparent process."
              }
            />
            <p className="max-w-sm text-sm leading-7 text-slate-600">
              {zh
                ? "我们会在合适的阶段解释进展与需要配合的事项，避免您在不确定中等待。"
                : "We explain progress and what we need from you at the right time, so you are never left guessing."}
            </p>
          </div>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {process.map(([Icon, title, description], index) => (
              <div key={title} className="border-l-2 border-[#8a7d51] pl-5">
                <span className="text-xs font-bold text-slate-400">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="mt-3 flex items-center gap-3">
                  <Icon className="shrink-0 text-[#1a243f]" size={24} />
                  <h3 className="font-bold text-[#1a243f]">{title}</h3>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <ConsultationCallout locale={locale} />
    </>
  );
}
