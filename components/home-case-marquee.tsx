"use client";

import { useState, type CSSProperties } from "react";
import { Pause, Play } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import type { PublicCase } from "@/lib/content";
import { CaseCard } from "@/components/case-card";

export function HomeCaseMarquee({
  locale,
  cases,
}: {
  locale: Locale;
  cases: PublicCase[];
}) {
  const zh = locale === "zh";
  const [paused, setPaused] = useState(false);
  const canLoop = cases.length > 1;
  const loop = canLoop ? [...cases, ...cases] : cases;
  const duration = Math.max(52, cases.length * 5);

  return (
    <div className="mt-8">
      {canLoop && (
        <div className="mb-3 flex justify-end">
          <button
            type="button"
            onClick={() => setPaused((value) => !value)}
            aria-pressed={paused}
            aria-label={
              paused
                ? zh
                  ? "继续滚动案例"
                  : "Resume case carousel"
                : zh
                  ? "暂停滚动案例"
                  : "Pause case carousel"
            }
            title={
              paused
                ? zh
                  ? "继续滚动"
                  : "Resume scrolling"
                : zh
                  ? "暂停滚动"
                  : "Pause scrolling"
            }
            className="home-case-marquee-control pressable grid h-9 w-9 place-items-center border border-slate-200 bg-white text-slate-500 shadow-sm hover:border-blue-200 hover:text-blue-600"
          >
            {paused ? (
              <Play size={14} fill="currentColor" />
            ) : (
              <Pause size={14} />
            )}
          </button>
        </div>
      )}
      <div
        className={`home-case-marquee overflow-hidden py-1 ${paused || !canLoop ? "is-paused" : ""}`}
      >
        <div
          className="home-case-marquee-track flex w-max items-stretch gap-5"
          style={{ "--marquee-duration": `${duration}s` } as CSSProperties}
        >
          {loop.map((item, index) => {
            const clone = index >= cases.length;
            return (
              <div
                key={`${item.id}-${index}`}
                className={`w-[19rem] shrink-0 sm:w-[21rem] lg:w-[23rem] ${clone ? "home-case-marquee-clone" : ""}`}
              >
                <CaseCard
                  item={item}
                  locale={locale}
                  interactive={!clone}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
