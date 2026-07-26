"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Award,
  BriefcaseBusiness,
  CheckCircle2,
  Languages,
} from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { localizeService, serviceItems } from "@/lib/services";

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
      display: "中 · EN",
      label: zh ? "双语服务" : "Bilingual service",
      detail: zh ? "沟通直接，信息更准确" : "Direct, accurate communication",
    },
  ];

  return (
    <div className="hero-stats relative z-10 mx-auto w-full max-w-6xl px-5">
      <div className="overflow-hidden border border-white/45 bg-white/[.9] shadow-[0_24px_65px_rgba(9,11,18,.22),inset_0_1px_0_rgba(255,255,255,.9)] backdrop-blur-2xl backdrop-saturate-150">
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className={`group relative min-w-0 px-4 py-4 sm:px-6 sm:py-5 ${index % 2 ? "border-l border-slate-200/75" : ""} ${index > 1 ? "border-t border-slate-200/75 lg:border-t-0" : ""} ${index > 0 ? "lg:border-l lg:border-slate-200/75" : ""}`}
              >
                <div className="flex items-start gap-3.5">
                  <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center border border-[#d9d1b5] bg-[#f4f1e8] text-[#8a7d51]">
                    <Icon size={17} strokeWidth={1.9} />
                  </span>
                  <div className="min-w-0">
                    <b className="block whitespace-nowrap text-[1.55rem] font-bold leading-none tracking-[-.045em] text-[#1a243f] sm:text-[1.75rem]">
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

export function HomeServiceDialogs({ locale }: { locale: Locale }) {
  const zh = locale === "zh";
  return (
    <div className="mt-10 grid gap-px overflow-hidden border border-[#dedede] bg-[#dedede] md:grid-cols-2 lg:grid-cols-3">
        {serviceItems.map((service) => {
          const Icon = service.icon;
          const copy = localizeService(service, locale);
          return (
            <Link
              key={service.slug}
              href={`/${locale}/services/${service.slug}`}
              className="group flex min-h-[15rem] flex-col bg-white p-7 transition-colors hover:bg-[#faf9f5]"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center bg-[#f4f1e8] text-[#8a7d51]">
                  <Icon size={22} />
                </span>
                <h3 className="text-lg font-bold text-[#1a243f]">{copy.title}</h3>
              </div>
              <p className="mt-5 text-sm leading-6 text-slate-600">{copy.intro}</p>
              <span className="mt-auto inline-flex items-center gap-2 pt-5 text-xs font-bold text-[#8a7d51]">
                {zh ? "查看服务详情" : "View service details"}
                <ArrowRight
                  size={14}
                  className="transition-transform group-hover:translate-x-1"
                />
              </span>
            </Link>
          );
        })}
    </div>
  );
}
