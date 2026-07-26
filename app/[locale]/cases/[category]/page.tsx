import { notFound } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import { getPublicCasesPage, getTaxonomy, type Taxonomy } from "@/lib/content";
import { getPublicCaseCategory } from "@/lib/case-categories";
import { PageHero, ConsultationCallout } from "@/components/shared";
import { CasesBrowser } from "@/components/cases-browser";

export const dynamic = "force-dynamic";

const heroCopy = {
  "traffic-ticket": {
    zh: "交通罚单案例，清晰呈现处理重点。",
    en: "Traffic ticket cases, clearly organized.",
  },
  "court-summons": {
    zh: "法庭传票案例，清晰呈现处理重点。",
    en: "Court summons cases, clearly organized.",
  },
  "tlc-ticket": {
    zh: "TLC 罚单案例，清晰呈现处理重点。",
    en: "TLC ticket cases, clearly organized.",
  },
} as const;

export default async function CategoryCasesPage({
  params,
}: {
  params: Promise<{ locale: Locale; category: string }>;
}) {
  const { locale, category: categorySlug } = await params;
  const definition = getPublicCaseCategory(categorySlug);
  if (!definition) notFound();

  const [initialPage, taxonomy] = await Promise.all([
    getPublicCasesPage({ category: definition.id }),
    getTaxonomy(),
  ]);
  const databaseCategory = taxonomy.categories.find(
    (item) => item.id === definition.id,
  );
  const category: Taxonomy = databaseCategory ?? {
    id: definition.id,
    slug: definition.slug,
    name_zh: definition.nameZh,
    name_en: definition.nameEn,
  };
  const zh = locale === "zh";

  return (
    <>
      <PageHero
        locale={locale}
        kicker="CASE RESULTS"
        title={heroCopy[definition.slug][zh ? "zh" : "en"]}
        description={
          zh
            ? `按罚单类型和地区浏览公开脱敏的${category.name_zh}案例。具体结果仍须结合个案事实、记录和管辖规则评估。`
            : `Browse anonymized ${category.name_en.toLowerCase()} matters by type and region. Every outcome depends on the facts, record, and jurisdiction.`
        }
        image="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1800&q=85"
      />
      <CasesBrowser
        key={category.id}
        locale={locale}
        category={category}
        initialPage={initialPage}
        taxonomy={{ types: taxonomy.types, regions: taxonomy.regions }}
      />
      <ConsultationCallout locale={locale} />
    </>
  );
}
