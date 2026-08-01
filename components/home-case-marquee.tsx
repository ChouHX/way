"use client";

import { useMemo, useState, type CSSProperties } from "react";
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
  const [category, setCategory] = useState("");
  const categories = useMemo(() => Array.from(new Map(cases.filter((item) => item.category_id).map((item) => [item.category_id, {
    id: item.category_id as string,
    zh: item.category_name_zh || item.category_id as string,
    en: item.category_name_en || item.category_id as string,
  }])).values()), [cases]);
  const visibleCases = category ? cases.filter((item) => item.category_id === category) : cases;
  const canLoop = visibleCases.length > 1;
  const loop = canLoop ? [...visibleCases, ...visibleCases] : visibleCases;
  const duration = Math.max(40, visibleCases.length * 5);

  return (
    <div className="mt-8">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex min-w-0 gap-1.5 overflow-x-auto pb-1" aria-label={zh ? "案例分类" : "Case categories"}>
          {[{ id: "", zh: "全部案例", en: "All cases" }, ...categories].map((item) => (
            <button key={item.id || "all"} type="button" aria-pressed={category === item.id} onClick={() => setCategory(item.id)} className={`shrink-0 rounded-full border px-3 py-1.5 text-[11px] font-bold transition-[background-color,border-color,color,transform] active:scale-[.97] ${category === item.id ? "border-[#1a243f] bg-[#1a243f] text-white" : "border-slate-200 bg-white text-slate-500 hover:border-[#c5b780] hover:text-[#716641]"}`}>{zh ? item.zh : item.en}</button>
          ))}
        </div>
        {canLoop && (
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
            className="home-case-marquee-control pressable grid h-9 w-9 place-items-center border border-slate-200 bg-white text-slate-500 shadow-sm hover:border-[#d9d1b5] hover:text-[#8a7d51]"
          >
            {paused ? (
              <Play size={14} fill="currentColor" />
            ) : (
              <Pause size={14} />
            )}
          </button>
        )}
      </div>
      <div
        className={`home-case-marquee overflow-hidden py-1 ${paused || !canLoop ? "is-paused" : ""}`}
      >
        <div
          key={category || "all"}
          className="home-case-marquee-track flex w-max items-stretch gap-5"
          style={{ "--marquee-duration": `${duration}s` } as CSSProperties}
        >
          {loop.map((item, index) => {
            const clone = index >= visibleCases.length;
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
