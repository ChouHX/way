import { getWorkerEnv } from "@/lib/cloudflare";
import { unstable_noStore as noStore } from "next/cache";

export type Taxonomy = { id:string; slug:string; name_zh:string; name_en:string; category_id?:string; category_name_zh?:string; category_name_en?:string };
export type PublicCase = { id:string; category_id?:string; type_id?:string; region_id?:string; guide_id?:string; title_zh:string; title_en:string; summary_zh:string; summary_en:string; content_zh?:string; content_en?:string; image_url?:string; case_date?:string; category_name_zh?:string; category_name_en?:string; type_name_zh?:string; type_name_en?:string; region_name_zh?:string; region_name_en?:string };
export type Guide = { id:string; slug:string; category_id?:string; type_id?:string; title_zh:string; title_en:string; summary_zh:string; summary_en:string; content_zh:string; content_en:string; source_url?:string; category_name_zh?:string; category_name_en?:string; type_name_zh?:string; type_name_en?:string };

async function rows<T>(query:string,...bindings:unknown[]) {
  noStore();
  try { const {DB}=await getWorkerEnv(); if(!DB) return [] as T[]; return (await DB.prepare(query).bind(...bindings).all<T>()).results; } catch { return [] as T[]; }
}
export const getPublicCases = () => rows<PublicCase>("SELECT s.*,c.name_zh category_name_zh,c.name_en category_name_en,t.name_zh type_name_zh,t.name_en type_name_en,r.name_zh region_name_zh,r.name_en region_name_en FROM case_studies s LEFT JOIN case_categories c ON c.id=s.category_id LEFT JOIN case_types t ON t.id=s.type_id LEFT JOIN case_regions r ON r.id=s.region_id WHERE s.published=1 ORDER BY COALESCE(s.case_date,s.created_at) DESC");
export const getTaxonomy = async () => ({
  categories: await rows<Taxonomy>("SELECT * FROM case_categories ORDER BY sort_order,name_zh"),
  types: await rows<Taxonomy>("SELECT t.*,c.name_zh category_name_zh,c.name_en category_name_en FROM case_types t JOIN case_categories c ON c.id=t.category_id ORDER BY c.sort_order,t.sort_order,t.name_zh"),
  regions: await rows<Taxonomy>("SELECT * FROM case_regions ORDER BY sort_order,name_zh")
});
export const getGuides = () => rows<Guide>("SELECT g.*,c.name_zh category_name_zh,c.name_en category_name_en,t.name_zh type_name_zh,t.name_en type_name_en FROM guides g LEFT JOIN case_categories c ON c.id=g.category_id LEFT JOIN case_types t ON t.id=g.type_id WHERE g.published=1 ORDER BY g.created_at");
export const getGuide = async (slug:string) => (await rows<Guide>("SELECT g.*,c.name_zh category_name_zh,c.name_en category_name_en,t.name_zh type_name_zh,t.name_en type_name_en FROM guides g LEFT JOIN case_categories c ON c.id=g.category_id LEFT JOIN case_types t ON t.id=g.type_id WHERE g.slug=? AND g.published=1 LIMIT 1",slug))[0];
export const getGuideCases = (guideId:string) => rows<PublicCase>("SELECT s.*,c.name_zh category_name_zh,c.name_en category_name_en,t.name_zh type_name_zh,t.name_en type_name_en,r.name_zh region_name_zh,r.name_en region_name_en FROM case_studies s LEFT JOIN case_categories c ON c.id=s.category_id LEFT JOIN case_types t ON t.id=s.type_id LEFT JOIN case_regions r ON r.id=s.region_id WHERE s.published=1 AND s.guide_id=? ORDER BY s.case_date DESC LIMIT 6",guideId);
