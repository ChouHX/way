import type { Locale } from "@/lib/i18n";
import { getPublicCases, getTaxonomy } from "@/lib/content";
import { PageHero, ConsultationCallout } from "@/components/shared";
import { CasesBrowser } from "@/components/cases-browser";

export const dynamic = "force-dynamic";
export default async function CasesPage({params}:{params:Promise<{locale:Locale}>}) {
  const {locale}=await params, zh=locale==="zh";
  const [cases,taxonomy]=await Promise.all([getPublicCases(),getTaxonomy()]);
  return <><PageHero locale={locale} kicker="CASE RESULTS" title={zh?"真实案例，清晰呈现处理重点。":"Real cases, clearly organized."} description={zh?"按大类、罚单类型和地区浏览公开脱敏案例。具体结果仍须结合个案事实、记录和管辖规则评估。":"Browse anonymized matters by category, ticket type, and region. Every outcome depends on the facts, record, and jurisdiction."} image="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1800&q=85"/><CasesBrowser locale={locale} cases={cases} taxonomy={taxonomy}/><ConsultationCallout locale={locale}/></>;
}
