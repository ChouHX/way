"use client";

import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import type { PublicCase } from "@/lib/content";
import { Card } from "@/components/ui";

const fallback = "/logo-transparent.png";

export function HomeCaseMarquee({
  locale,
  cases,
}: {
  locale: Locale;
  cases: PublicCase[];
}) {
  const zh = locale === "zh";
  const loop = cases.length > 1 ? [...cases, ...cases] : cases;

  return (
    <div className="home-case-marquee mt-9 overflow-hidden py-1">
      <div className="home-case-marquee-track flex w-max gap-4">
        {loop.map((item, index) => {
          const title = zh ? item.title_zh : item.title_en;
          const category = zh ? item.category_name_zh : item.category_name_en;
          const type = zh ? item.type_name_zh : item.type_name_en;
          const summary = zh ? item.summary_zh : item.summary_en;
          return (
            <Link
              href={`/${locale}/cases`}
              key={`${item.id}-${index}`}
              aria-hidden={index >= cases.length || undefined}
              tabIndex={index >= cases.length ? -1 : undefined}
              className="case-card group w-[18rem] shrink-0 sm:w-[20rem] lg:w-[22rem]"
            >
              <Card className="h-full overflow-hidden rounded-2xl">
                <div className="relative overflow-hidden bg-slate-100">
                  <img
                    src={item.image_url || fallback}
                    onError={(event) => {
                      event.currentTarget.src = fallback;
                    }}
                    loading="lazy"
                    alt={title}
                    className="case-card-image h-40 w-full object-cover"
                  />
                  <span className="absolute left-3 top-3 rounded-full border border-white/60 bg-white/90 px-2.5 py-1 text-[10px] font-bold text-[#0f2747] shadow-sm backdrop-blur-md">
                    {category || type}
                  </span>
                </div>
                <div className="p-5">
                  <p className="text-[10px] font-bold tracking-[.1em] text-blue-600">
                    {type || category}
                  </p>
                  <h3 className="mt-2 line-clamp-2 min-h-12 font-bold leading-6 text-[#0f2747]">
                    {title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">
                    {summary}
                  </p>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
