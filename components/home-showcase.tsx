"use client";
import { useEffect, useState } from "react";
import {
  Award,
  BriefcaseBusiness,
  Car,
  Check,
  CheckCircle2,
  CreditCard,
  Languages,
  ShieldCheck,
  Ticket,
} from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n";
import {
  MorphingDialog,
  MorphingDialogClose,
  MorphingDialogContainer,
  MorphingDialogContent,
  MorphingDialogDescription,
  MorphingDialogImage,
  MorphingDialogSubtitle,
  MorphingDialogTitle,
  MorphingDialogTrigger,
} from "@/components/core/morphing-dialog";
import { InView } from "@/components/core/in-view";

function NumberTicker({
  value,
  suffix = "",
}: {
  value: number;
  suffix?: string;
}) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 900;
    let id = 0;
    const tick = (now: number) => {
      if (!start) start = now;
      const progress = Math.min((now - start) / duration, 1);
      setDisplay(Math.round(value * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [value]);
  return (
    <>
      {display.toLocaleString()}
      {suffix}
    </>
  );
}

export function HeroStats({ locale }: { locale: Locale }) {
  const zh = locale === "zh";
  const stats = [
    {
      icon: Award,
      value: 10,
      suffix: "+",
      label: zh ? "年专业经验" : "Years of experience",
      detail: zh ? "熟悉纽约本地事务流程" : "New York matters and procedures",
    },
    {
      icon: CheckCircle2,
      value: 99,
      suffix: "%",
      label: zh ? "成功处理率" : "Successful outcomes",
      detail: zh ? "以清晰方案推进每一步" : "Clear plans at every step",
    },
    {
      icon: BriefcaseBusiness,
      value: 3000,
      suffix: "+",
      label: zh ? "案例支持" : "Cases supported",
      detail: zh
        ? "覆盖多类罚单与咨询事项"
        : "Across ticket and consulting matters",
    },
    {
      icon: Languages,
      display: zh ? "中 · EN" : "中 · EN",
      label: zh ? "双语服务" : "Bilingual service",
      detail: zh ? "沟通直接，信息更准确" : "Direct, accurate communication",
    },
  ];

  return (
    <div className="hero-stats relative z-10 mx-auto w-full max-w-6xl px-5">
      <div className="overflow-hidden rounded-2xl border border-white/55 bg-white/[.84] shadow-[0_24px_65px_rgba(2,16,34,.22),inset_0_1px_0_rgba(255,255,255,.9)] backdrop-blur-2xl backdrop-saturate-150">
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className={`group relative min-w-0 px-4 py-4 sm:px-6 sm:py-5 ${index % 2 ? "border-l border-slate-200/75" : ""} ${index > 1 ? "border-t border-slate-200/75 lg:border-t-0" : ""} ${index > 0 ? "lg:border-l lg:border-slate-200/75" : ""}`}
              >
                <div className="flex items-start gap-3.5">
                  <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-blue-100/80 bg-blue-50/90 text-blue-700 shadow-[inset_0_1px_0_rgba(255,255,255,.9)]">
                    <Icon size={17} strokeWidth={1.9} />
                  </span>
                  <div className="min-w-0">
                    <b className="block whitespace-nowrap text-[1.55rem] font-bold leading-none tracking-[-.045em] text-[#0f2747] sm:text-[1.75rem]">
                      {"value" in stat && typeof stat.value === "number" ? (
                        <NumberTicker value={stat.value} suffix={stat.suffix} />
                      ) : (
                        stat.display
                      )}
                    </b>
                    <span className="mt-1.5 block text-xs font-bold leading-4 text-slate-700">
                      {stat.label}
                    </span>
                    <span className="mt-0.5 hidden truncate text-[11px] leading-4 text-slate-500 sm:block">
                      {stat.detail}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const services = [
  {
    icon: Ticket,
    image:
      "https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1000&q=85",
    zh: "行车罚单处理",
    en: "Traffic ticket resolution",
    zhIntro: "从罚单内容、扣分风险到保险影响，梳理明确的处理重点。",
    enIntro:
      "Clear support for ticket details, point risk, and insurance impact.",
    zhPoints: [
      "核对罚单与回应期限",
      "评估积分、罚金与保险影响",
      "说明资料与后续处理节点",
    ],
    enPoints: [
      "Review citation details and deadlines",
      "Assess points, fines, and insurance impact",
      "Clarify records and next steps",
    ],
  },
  {
    icon: CreditCard,
    image:
      "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1000&q=85",
    zh: "E-ZPass 豁免与管理",
    en: "E-ZPass disputes",
    zhIntro: "协助整理账户记录、通行信息和异常收费问题。",
    enIntro:
      "Support for account records, toll activity, and disputed charges.",
    zhPoints: [
      "整理账户与通知记录",
      "识别重复收费或异常项目",
      "制定申诉与后续管理步骤",
    ],
    enPoints: [
      "Organize account and notice records",
      "Identify duplicate or unusual charges",
      "Plan appeal and account-management steps",
    ],
  },
  {
    icon: Car,
    image:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1000&q=85",
    zh: "车祸理赔",
    en: "Accident claims",
    zhIntro: "协调事故资料、保险沟通与关键的后续处理节点。",
    enIntro:
      "Organize accident records, insurer communication, and key follow-up steps.",
    zhPoints: ["整理事故与保险资料", "说明保险沟通重点", "跟进处理进度"],
    enPoints: [
      "Organize accident and insurance records",
      "Clarify insurer communication",
      "Track claim milestones",
    ],
  },
  {
    icon: ShieldCheck,
    image:
      "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1000&q=85",
    zh: "信用修复",
    en: "Credit protection",
    zhIntro: "系统审阅信用报告并建立具有优先级的改善计划。",
    enIntro:
      "Review credit reports systematically and prioritize practical improvements.",
    zhPoints: ["审阅争议项目", "确定改善优先级", "建立长期保护建议"],
    enPoints: [
      "Review disputed items",
      "Prioritize improvements",
      "Build ongoing protection",
    ],
  },
];

export function HomeServiceDialogs({ locale }: { locale: Locale }) {
  const zh = locale === "zh";
  return (
    <InView
      variants={{
        hidden: { opacity: 0, transform: "translateY(10px)" },
        visible: { opacity: 1, transform: "translateY(0)" },
      }}
      viewOptions={{ margin: "0px 0px -160px 0px" }}
      transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
    >
      <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 md:grid-cols-2">
        {services.map((service) => {
          const Icon = service.icon;
          const title = zh ? service.zh : service.en;
          const intro = zh ? service.zhIntro : service.enIntro;
          const points = zh ? service.zhPoints : service.enPoints;
          return (
            <MorphingDialog
              key={service.en}
              transition={{ type: "spring", bounce: 0.05, duration: 0.25 }}
            >
              <MorphingDialogTrigger className="service-dialog-trigger group w-full bg-white p-7 text-left">
                <div className="flex items-center gap-3">
                  <Icon className="shrink-0 text-blue-600" size={27} />
                  <MorphingDialogTitle className="text-lg font-bold text-[#0f2747]">
                    {title}
                  </MorphingDialogTitle>
                </div>
                <p className="mt-4 max-w-sm text-sm leading-6 text-slate-600">
                  {intro}
                </p>
                <span className="mt-5 inline-block text-xs font-bold text-blue-600">
                  {zh ? "查看服务详情" : "View service details"} →
                </span>
              </MorphingDialogTrigger>
              <MorphingDialogContainer>
                <MorphingDialogContent className="relative max-h-[calc(100vh-2.5rem)] w-full max-w-xl overflow-y-auto bg-white shadow-2xl">
                  <MorphingDialogImage
                    src={service.image}
                    alt={title}
                    className="h-56 w-full object-cover"
                  />
                  <div className="p-7">
                    <MorphingDialogTitle className="text-2xl font-bold text-[#0f2747]">
                      {title}
                    </MorphingDialogTitle>
                    <MorphingDialogSubtitle className="mt-2 text-sm leading-6 text-slate-600">
                      {intro}
                    </MorphingDialogSubtitle>
                    <MorphingDialogDescription className="mt-6">
                      <div className="grid gap-3">
                        {points.map((point) => (
                          <p
                            key={point}
                            className="flex gap-2 text-sm leading-6 text-slate-600"
                          >
                            <Check
                              size={17}
                              className="mt-0.5 shrink-0 text-blue-600"
                            />
                            {point}
                          </p>
                        ))}
                      </div>
                    </MorphingDialogDescription>
                  </div>
                  <MorphingDialogClose />
                </MorphingDialogContent>
              </MorphingDialogContainer>
            </MorphingDialog>
          );
        })}
      </div>
    </InView>
  );
}
