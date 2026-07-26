import { CircleAlert, FileSearch, Languages, Scale } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { InView } from "@/components/core/in-view";
import { FaqAccordion } from "@/components/faq-accordion";

const content = {
  zh: {
    eyebrow: "NEW YORK TICKET GUIDE",
    title: "在纽约收到交通罚单，需要先了解哪些信息？",
    intro: "如果您在纽约、法拉盛、皇后区、布鲁克林、曼哈顿或长岛收到超速罚单、闯红灯罚单、手机罚单、无证驾驶传票或 E-ZPass 罚款，及时评估案件很重要。永盛咨询中心提供中文、英文和西班牙语服务，帮助客户了解罚款、扣分、保险上涨和出庭风险，并根据案件情况说明常见流程。",
    note: "先确认回应截止日期、发单机构与罚单类型，再决定下一步。",
    cards: [
      ["纽约罚单处理", "针对纽约 DMV、TVB 法庭和各地交通法院罚单，整理罚单信息、说明扣分风险、准备材料并跟进处理进度。"],
      ["律师转介与流程说明", "对于可能需要律师判断、出庭或情况较复杂的交通案件，可帮助客户了解转介信息，并整理沟通所需材料。"],
      ["华人中文服务", "面向纽约华人司机提供中文沟通，解释罚单内容、法院通知、保险影响和可能结果，减少语言障碍造成的误判。"],
    ],
    faqTitle: "纽约罚单处理常见问题",
    faqs: [
      ["纽约交通罚单不处理会怎样？", "纽约交通罚单如果长期未回应，可能导致额外罚款、驾照暂停、保险上涨，严重情况还可能影响后续车辆注册或驾驶记录。通常需要先确认回应截止日期和对应机构。"],
      ["什么时候需要咨询交通罚单律师？", "如果案件涉及出庭、较高扣分、驾照风险、事故、酒驾或复杂事实，可能需要进一步了解法律后果。永盛可帮助整理材料并说明常见流程，但不提供法律意见。"],
      ["超速罚单一定会扣分吗？", "不一定。是否扣分取决于罚单类型、地区、案件结果和驾驶记录。不同回应方式可能带来不同后果，包括罚款、扣分、保险影响和时间投入。"],
      ["法拉盛附近可以中文咨询罚单处理吗？", "可以。永盛咨询中心位于纽约法拉盛，提供中文、英文和西班牙语咨询，可电话、微信或到店沟通。"],
    ],
  },
  en: {
    eyebrow: "NEW YORK TICKET GUIDE",
    title: "Received a traffic ticket in New York? Start with the right information.",
    intro: "If you received a speeding ticket, red-light ticket, cellphone ticket, unlicensed-operation summons, or E-ZPass penalty in New York, Flushing, Queens, Brooklyn, Manhattan, or Long Island, a timely review matters. YONG SHENG CONSULTNG provides Chinese, English, and Spanish support to help clients understand potential fines, points, insurance increases, court-related risks, and common next steps for their circumstances.",
    note: "First confirm the response deadline, issuing authority, and ticket type before choosing a next step.",
    cards: [
      ["New York ticket support", "For New York DMV, TVB, and local traffic-court tickets, we organize citation details, explain point-related risk, prepare records, and help track progress."],
      ["Attorney referrals & process guidance", "For matters that may require an attorney's assessment, a court appearance, or added attention, we can explain referral information and organize the materials needed for communication."],
      ["Chinese-language support", "We provide Chinese-language communication for New York drivers, explaining ticket details, court notices, insurance effects, and possible outcomes to reduce misunderstandings caused by language barriers."],
    ],
    faqTitle: "New York ticket FAQs",
    faqs: [
      ["What happens if I do not respond to a New York traffic ticket?", "Leaving a New York traffic ticket unanswered may lead to additional fines, license suspension, and insurance increases. In serious situations, it can also affect vehicle registration or driving records. Start by confirming the response deadline and the responsible authority."],
      ["When should I speak with a traffic-ticket attorney?", "If a matter involves court, substantial points, license risk, an accident, DUI, or complex facts, it may be important to understand the legal consequences further. YONG SHENG CONSULTNG can organize materials and explain common processes, but does not provide legal advice."],
      ["Does a speeding ticket always add points?", "Not necessarily. Points depend on the ticket type, location, case outcome, and driving history. Different responses can have different implications for fines, points, insurance, and time commitment."],
      ["Can I receive Chinese-language ticket support near Flushing?", "Yes. YONG SHENG CONSULTNG is located in Flushing, New York, and offers Chinese, English, and Spanish consultations by phone, WeChat, or in person."],
    ],
  },
} as const;

const icons = [FileSearch, Scale, Languages];

export function HomeTicketGuide({ locale }: { locale: Locale }) {
  const copy = content[locale];
  return <section className="border-y border-slate-200 bg-white">
    <div className="mx-auto max-w-6xl px-5 py-20 md:py-24">
      <InView variants={{ hidden: { opacity: 0, transform: "translateY(10px)" }, visible: { opacity: 1, transform: "translateY(0)" } }} transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(17rem,.6fr)] lg:items-end">
          <div className="max-w-3xl"><p className="text-xs font-bold tracking-[.14em] text-[#8a7d51]">{copy.eyebrow}</p><h2 className="mt-4 text-3xl font-bold leading-[1.15] tracking-[-.03em] text-[#1a243f] md:text-4xl">{copy.title}</h2><p className="mt-6 max-w-3xl text-[1rem] leading-8 text-slate-600">{copy.intro}</p></div>
          <aside className="border-l-2 border-[#8a7d51] bg-slate-50 px-5 py-5"><CircleAlert size={20} className="text-[#8a7d51]"/><p className="mt-3 text-sm font-semibold leading-6 text-[#1a243f]">{copy.note}</p></aside>
        </div>
      </InView>
      <div className="mt-12 grid border border-slate-200 md:grid-cols-3">{copy.cards.map(([title, description], index) => { const Icon = icons[index]; return <article key={title} className="border-b border-slate-200 p-6 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0"><div className="flex items-center gap-3"><Icon size={21} className="shrink-0 text-[#8a7d51]"/><h3 className="text-lg font-bold tracking-[-.015em] text-[#1a243f]">{title}</h3></div><p className="mt-4 text-sm leading-6 text-slate-600">{description}</p></article>; })}</div>
      <div className="mt-16 grid gap-8 lg:grid-cols-[minmax(14rem,.55fr)_minmax(0,1.45fr)] lg:gap-14"><div><p className="text-xs font-bold tracking-[.14em] text-[#8a7d51]">FAQ</p><h2 className="mt-3 text-3xl font-bold leading-tight tracking-[-.025em] text-[#1a243f]">{copy.faqTitle}</h2></div><FaqAccordion items={copy.faqs}/></div>
    </div>
  </section>;
}
