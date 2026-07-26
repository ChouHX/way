"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { LoaderCircle } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import type { PublicCasesPage, Taxonomy } from "@/lib/content";
import { Select } from "@/components/ui";
import { AnimatedGroup } from "@/components/core/animated-group";
import { CaseCard } from "@/components/case-card";

export function CasesBrowser({
  locale,
  category,
  initialPage,
  taxonomy,
}: {
  locale: Locale;
  category: Taxonomy;
  initialPage: PublicCasesPage;
  taxonomy: {
    types: Taxonomy[];
    regions: Taxonomy[];
  };
}) {
  const zh = locale === "zh";
  const [type, setType] = useState("");
  const [region, setRegion] = useState("");
  const [cases, setCases] = useState(initialPage.cases);
  const [page, setPage] = useState(initialPage.page);
  const [total, setTotal] = useState(initialPage.total);
  const [totalPages, setTotalPages] = useState(initialPage.totalPages);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showLoadMore, setShowLoadMore] = useState(false);
  const sentinel = useRef<HTMLDivElement>(null);
  const requestId = useRef(0);
  const mountedFilters = useRef(false);
  const retryRequest = useRef({ page: 1, replace: true });
  const filters = useRef({ category: category.id, type, region });
  const types = taxonomy.types.filter(
    (item) => item.category_id === category.id,
  );

  useEffect(() => {
    filters.current = { category: category.id, type, region };
  }, [category.id, type, region]);

  const fetchPage = useCallback(
    async (nextPage: number, replace = false) => {
      retryRequest.current = { page: nextPage, replace };
      const id = ++requestId.current;
      const current = filters.current;
      const params = new URLSearchParams({ page: String(nextPage) });
      if (current.category) params.set("category", current.category);
      if (current.type) params.set("type", current.type);
      if (current.region) params.set("region", current.region);
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`/api/cases?${params}`, {
          cache: "no-store",
        });
        if (!response.ok) throw new Error("Failed to load cases");
        const data = (await response.json()) as PublicCasesPage;
        if (id !== requestId.current) return;
        setCases((currentCases) =>
          replace ? data.cases : [...currentCases, ...data.cases],
        );
        setPage(data.page);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      } catch {
        if (id === requestId.current)
          setError(
            zh ? "案例加载失败，请重试。" : "Cases failed to load. Try again.",
          );
      } finally {
        if (id === requestId.current) setLoading(false);
      }
    },
    [zh],
  );

  useEffect(() => {
    filters.current = { category: category.id, type, region };
    if (!mountedFilters.current) {
      mountedFilters.current = true;
      return;
    }
    setCases([]);
    setPage(0);
    setTotal(0);
    setTotalPages(1);
    setShowLoadMore(false);
    void fetchPage(1, true);
  }, [category.id, type, region, fetchPage]);

  useEffect(() => {
    const target = sentinel.current;
    if (!target || page >= totalPages) return;
    if (!("IntersectionObserver" in window)) {
      setShowLoadMore(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) setShowLoadMore(true);
      },
      { threshold: 0.25 },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [page, totalPages]);

  return (
    <section className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-bold tracking-[.14em] text-[#8a7d51]">
            SELECTED MATTERS
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-[-.04em] text-[#1a243f]">
            {zh
              ? `${category.name_zh}案例资料库`
              : `${category.name_en} case library`}
          </h2>
          <p className="mt-2 text-sm text-slate-500" aria-live="polite">
            {zh
              ? `共 ${total} 个公开脱敏案例，已加载 ${cases.length} 个`
              : `${total} anonymized cases, ${cases.length} loaded`}
          </p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 md:w-[410px]">
          <Select
            aria-label={zh ? "罚单类型" : "Ticket type"}
            value={type}
            onChange={(event) => setType(event.target.value)}
          >
            <option value="">{zh ? "全部类型" : "All types"}</option>
            {types.map((item) => (
              <option key={item.id} value={item.id}>
                {zh ? item.name_zh : item.name_en}
              </option>
            ))}
          </Select>
          <Select
            aria-label={zh ? "地区" : "Region"}
            value={region}
            onChange={(event) => setRegion(event.target.value)}
          >
            <option value="">{zh ? "全部地区" : "All regions"}</option>
            {taxonomy.regions.map((item) => (
              <option key={item.id} value={item.id}>
                {zh ? item.name_zh : item.name_en}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <AnimatedGroup
        className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        itemKey={(child, index) =>
          typeof child === "object" && child && "key" in child
            ? String(child.key)
            : index
        }
      >
        {cases.map((item) => (
          <CaseCard key={item.id} item={item} locale={locale} />
        ))}
      </AnimatedGroup>

      {!cases.length && !loading && !error && (
        <div className="mt-8 border border-slate-200 bg-slate-50 px-6 py-12 text-center text-sm text-slate-500">
          {zh ? "暂无符合筛选条件的案例。" : "No cases match these filters."}
        </div>
      )}
      {error && (
        <div className="mt-8 text-center">
          <p className="text-sm text-red-600">{error}</p>
          <button
            type="button"
            onClick={() =>
              void fetchPage(
                retryRequest.current.page,
                retryRequest.current.replace,
              )
            }
            className="mt-3 border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-[#1a243f]"
          >
            {zh ? "重试" : "Retry"}
          </button>
        </div>
      )}
      <div
        ref={sentinel}
        className="mt-8 flex min-h-10 items-center justify-center"
      >
        {loading && (
          <span className="inline-flex items-center gap-2 text-sm text-slate-500">
            <LoaderCircle size={16} className="animate-spin text-[#8a7d51]" />
            {zh ? "正在加载更多案例…" : "Loading more cases…"}
          </span>
        )}
        {!loading &&
          !error &&
          showLoadMore &&
          cases.length > 0 &&
          page < totalPages && (
            <button
              type="button"
              onClick={() => {
                setShowLoadMore(false);
                void fetchPage(page + 1);
              }}
              className="pressable border border-[#1a243f] bg-[#1a243f] px-6 py-3 text-sm font-bold text-white hover:bg-[#273452]"
            >
              {zh ? "加载更多" : "Load more"}
            </button>
          )}
        {!loading && cases.length > 0 && page >= totalPages && (
          <span className="text-xs text-slate-400">
            {zh ? "已加载全部案例" : "All cases loaded"}
          </span>
        )}
      </div>
    </section>
  );
}
