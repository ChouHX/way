"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  MapPin,
} from "lucide-react";
import type { Locale } from "@/lib/i18n";
import type { PublicCase } from "@/lib/content";
import { Badge } from "@/components/ui";
import {
  MorphingDialog,
  MorphingDialogClose,
  MorphingDialogContainer,
  MorphingDialogContent,
  MorphingDialogDescription,
  MorphingDialogImage,
  MorphingDialogTitle,
  MorphingDialogTrigger,
} from "@/components/core/morphing-dialog";

export const caseImageFallback =
  "https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1000&q=80";

export function CaseCard({
  item,
  locale,
  interactive = true,
}: {
  item: PublicCase;
  locale: Locale;
  interactive?: boolean;
}) {
  const zh = locale === "zh";
  const title = zh ? item.title_zh : item.title_en;
  const summary = zh ? item.summary_zh : item.summary_en;
  const category = zh ? item.category_name_zh : item.category_name_en;
  const type = zh ? item.type_name_zh : item.type_name_en;
  const region = zh ? item.region_name_zh : item.region_name_en;
  const guideTitle = zh ? item.guide_title_zh : item.guide_title_en;
  const guideSummary = zh ? item.guide_summary_zh : item.guide_summary_en;
  const imageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.src = caseImageFallback;
  };

  return (
    <MorphingDialog transition={{ type: "spring", bounce: 0, duration: 0.3 }}>
      <MorphingDialogTrigger
        disabled={!interactive}
        tabIndex={interactive ? undefined : -1}
        ariaHidden={!interactive}
        wrapperClassName="h-full"
        className="case-card group flex h-full w-full flex-col overflow-hidden border border-slate-200 bg-white text-left shadow-sm disabled:cursor-default"
      >
        <div className="relative shrink-0 overflow-hidden bg-slate-100">
          <MorphingDialogImage
            src={item.image_url || caseImageFallback}
            onError={imageError}
            alt={title}
            loading="lazy"
            className="case-card-image h-44 w-full object-cover"
          />
          <Badge className="absolute left-3 top-3 border-white/70 bg-white/90 text-[#0f2747] shadow-sm backdrop-blur-md">
            {category || type}
          </Badge>
        </div>
        <div className="flex flex-1 flex-col p-5">
          <h3 className="line-clamp-2 min-h-12 font-bold leading-6 text-[#0f2747]">
            {title}
          </h3>
          <div className="mt-2 flex min-h-4 flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-500">
            {type && <span>{type}</span>}
            {region && (
              <span className="inline-flex items-center gap-1">
                <MapPin size={11} />
                {region}
              </span>
            )}
          </div>
          <p className="mt-3 line-clamp-3 text-xs leading-5 text-slate-500">
            {summary}
          </p>
        </div>
      </MorphingDialogTrigger>
      {interactive && (
        <MorphingDialogContainer>
          <MorphingDialogContent className="relative max-h-[calc(100dvh-2rem)] w-full max-w-xl overflow-y-auto overflow-x-hidden bg-white shadow-2xl">
            <MorphingDialogImage
              src={item.image_url || caseImageFallback}
              onError={imageError}
              alt={title}
              className="h-56 w-full object-cover"
            />
            <div className="p-6 sm:p-7">
              <div className="flex flex-wrap gap-2">
                <Badge>{category}</Badge>
                {type && (
                  <Badge className="border-slate-200 bg-slate-50 text-slate-600">
                    {type}
                  </Badge>
                )}
              </div>
              <MorphingDialogTitle className="mt-3 text-2xl font-bold tracking-[-.03em] text-[#0f2747]">
                {title}
              </MorphingDialogTitle>
              <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500">
                {region && (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin size={13} />
                    {region}
                  </span>
                )}
                {item.case_date && (
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays size={13} />
                    {item.case_date}
                  </span>
                )}
              </div>
              <MorphingDialogDescription className="mt-5 whitespace-pre-line text-sm leading-7 text-slate-600">
                <p>
                  {zh ? item.content_zh || summary : item.content_en || summary}
                </p>
                <p className="mt-5 border-t border-slate-200 pt-4 text-xs leading-5 text-slate-500">
                  {zh
                    ? "案例信息已脱敏，仅供一般参考，不构成法律建议或结果承诺。"
                    : "Anonymized case information is for general reference only and is not legal advice or a guarantee of outcome."}
                </p>
              </MorphingDialogDescription>
              {item.guide_slug && guideTitle && (
                <Link
                  href={`/${locale}/guides/${item.guide_slug}`}
                  className="group mt-6 block border border-blue-100 bg-blue-50/70 p-4 transition hover:border-blue-200 hover:bg-blue-50"
                >
                  <div className="flex items-start gap-3">
                    <span className="grid h-8 w-8 shrink-0 place-items-center bg-white text-blue-700 shadow-sm">
                      <BookOpen size={15} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-3">
                        <b className="text-[10px] tracking-[.12em] text-blue-700">
                          {zh ? "相关知识" : "RELATED GUIDE"}
                        </b>
                        <ArrowUpRight
                          size={14}
                          className="shrink-0 text-blue-600 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        />
                      </span>
                      <strong className="mt-1.5 block text-sm leading-6 text-[#0f2747]">
                        {guideTitle}
                      </strong>
                      {guideSummary && (
                        <span className="mt-1 line-clamp-2 block text-xs leading-5 text-slate-500">
                          {guideSummary}
                        </span>
                      )}
                    </span>
                  </div>
                </Link>
              )}
            </div>
            <MorphingDialogClose />
          </MorphingDialogContent>
        </MorphingDialogContainer>
      )}
    </MorphingDialog>
  );
}
