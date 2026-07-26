import { getWorkerEnv } from "@/lib/cloudflare";
import { unstable_noStore as noStore } from "next/cache";

export type Taxonomy = {
  id: string;
  slug: string;
  name_zh: string;
  name_en: string;
  category_id?: string;
  category_name_zh?: string;
  category_name_en?: string;
};
export type PublicCase = {
  id: string;
  category_id?: string;
  type_id?: string;
  region_id?: string;
  guide_id?: string;
  title_zh: string;
  title_en: string;
  summary_zh: string;
  summary_en: string;
  content_zh?: string;
  content_en?: string;
  image_url?: string;
  case_date?: string;
  category_name_zh?: string;
  category_name_en?: string;
  type_name_zh?: string;
  type_name_en?: string;
  region_name_zh?: string;
  region_name_en?: string;
  guide_slug?: string;
  guide_title_zh?: string;
  guide_title_en?: string;
  guide_summary_zh?: string;
  guide_summary_en?: string;
};
export type PublicCasesPage = {
  cases: PublicCase[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};
export type Guide = {
  id: string;
  slug: string;
  category_id?: string;
  type_id?: string;
  title_zh: string;
  title_en: string;
  summary_zh: string;
  summary_en: string;
  content_zh: string;
  content_en: string;
  source_url?: string;
  category_name_zh?: string;
  category_name_en?: string;
  type_name_zh?: string;
  type_name_en?: string;
};

async function rows<T>(query: string, ...bindings: unknown[]) {
  noStore();
  try {
    const { DB } = await getWorkerEnv();
    if (!DB) return [] as T[];
    return (
      await DB.prepare(query)
        .bind(...bindings)
        .all<T>()
    ).results;
  } catch {
    return [] as T[];
  }
}
const publicCaseSelect =
  "SELECT s.*,c.name_zh category_name_zh,c.name_en category_name_en,t.name_zh type_name_zh,t.name_en type_name_en,r.name_zh region_name_zh,r.name_en region_name_en,g.slug guide_slug,g.title_zh guide_title_zh,g.title_en guide_title_en,g.summary_zh guide_summary_zh,g.summary_en guide_summary_en FROM case_studies s LEFT JOIN case_categories c ON c.id=s.category_id LEFT JOIN case_types t ON t.id=s.type_id AND NOT (LOWER(TRIM(t.name_en))='other' OR TRIM(t.name_zh)='其他') LEFT JOIN case_regions r ON r.id=s.region_id LEFT JOIN guides g ON g.id=s.guide_id AND g.published=1";

export async function getPublicCasesPage({
  page = 1,
  pageSize = 12,
  category = "",
  type = "",
  region = "",
}: {
  page?: number;
  pageSize?: number;
  category?: string;
  type?: string;
  region?: string;
} = {}): Promise<PublicCasesPage> {
  noStore();
  const safePage = Number.isFinite(page) ? Math.max(1, Math.floor(page)) : 1;
  const safePageSize = Number.isFinite(pageSize)
    ? Math.min(24, Math.max(1, Math.floor(pageSize)))
    : 12;
  const clauses = ["s.published=1"];
  const bindings: unknown[] = [];
  if (category) {
    clauses.push("s.category_id=?");
    bindings.push(category);
  }
  if (type) {
    clauses.push("s.type_id=?");
    bindings.push(type);
  }
  if (region) {
    clauses.push("s.region_id=?");
    bindings.push(region);
  }
  try {
    const { DB } = await getWorkerEnv();
    if (!DB)
      return {
        cases: [],
        page: 1,
        pageSize: safePageSize,
        total: 0,
        totalPages: 1,
      };
    const where = clauses.join(" AND ");
    const count = await DB.prepare(
      `SELECT COUNT(*) total FROM case_studies s WHERE ${where}`,
    )
      .bind(...bindings)
      .all<{ total: number }>();
    const total = Number(count.results[0]?.total ?? 0);
    const totalPages = Math.max(1, Math.ceil(total / safePageSize));
    const currentPage = Math.min(safePage, totalPages);
    const result = await DB.prepare(
      `${publicCaseSelect} WHERE ${where} ORDER BY COALESCE(s.case_date,s.created_at) DESC,s.created_at DESC LIMIT ? OFFSET ?`,
    )
      .bind(...bindings, safePageSize, (currentPage - 1) * safePageSize)
      .all<PublicCase>();
    return {
      cases: result.results,
      page: currentPage,
      pageSize: safePageSize,
      total,
      totalPages,
    };
  } catch {
    return {
      cases: [],
      page: 1,
      pageSize: safePageSize,
      total: 0,
      totalPages: 1,
    };
  }
}
export const getFeaturedPublicCases = () =>
  rows<PublicCase>(
    `${publicCaseSelect} WHERE s.published=1 ORDER BY COALESCE(s.updated_at,s.created_at) DESC,s.created_at DESC LIMIT 12`,
  );
export const getTaxonomy = async () => ({
  categories: await rows<Taxonomy>(
    "SELECT * FROM case_categories ORDER BY sort_order,name_zh",
  ),
  types: await rows<Taxonomy>(
    "SELECT t.*,c.name_zh category_name_zh,c.name_en category_name_en FROM case_types t JOIN case_categories c ON c.id=t.category_id WHERE NOT (LOWER(TRIM(t.name_en))='other' OR TRIM(t.name_zh)='其他') ORDER BY c.sort_order,t.sort_order,t.name_zh",
  ),
  regions: await rows<Taxonomy>(
    "SELECT * FROM case_regions ORDER BY sort_order,name_zh",
  ),
});
export const getGuides = () =>
  rows<Guide>(
    "SELECT g.*,c.name_zh category_name_zh,c.name_en category_name_en,t.name_zh type_name_zh,t.name_en type_name_en FROM guides g LEFT JOIN case_categories c ON c.id=g.category_id LEFT JOIN case_types t ON t.id=g.type_id WHERE g.published=1 ORDER BY g.created_at",
  );
export const getGuide = async (slug: string) =>
  (
    await rows<Guide>(
      "SELECT g.*,c.name_zh category_name_zh,c.name_en category_name_en,t.name_zh type_name_zh,t.name_en type_name_en FROM guides g LEFT JOIN case_categories c ON c.id=g.category_id LEFT JOIN case_types t ON t.id=g.type_id WHERE g.slug=? AND g.published=1 LIMIT 1",
      slug,
    )
  )[0];
export const getGuideCases = (guideId: string) =>
  rows<PublicCase>(
    `${publicCaseSelect} WHERE s.published=1 AND s.guide_id=? ORDER BY s.case_date DESC LIMIT 6`,
    guideId,
  );
