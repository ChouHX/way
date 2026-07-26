import {
  Car,
  CreditCard,
  Landmark,
  ShieldCheck,
  Ticket,
  type LucideIcon,
} from "lucide-react";
import type { Locale } from "@/lib/i18n";

type LocalizedText = {
  zh: string;
  en: string;
};

type LocalizedList = {
  zh: string[];
  en: string[];
};

export type ServiceItem = {
  slug: string;
  icon: LucideIcon;
  title: LocalizedText;
  shortTitle: LocalizedText;
  intro: LocalizedText;
  overview: LocalizedText;
  points: LocalizedList;
  steps: {
    title: LocalizedText;
    description: LocalizedText;
  }[];
  image: string;
};

export const serviceItems: ServiceItem[] = [
  {
    slug: "traffic-tickets",
    icon: Ticket,
    title: {
      zh: "行车罚单处理",
      en: "Traffic ticket resolution",
    },
    shortTitle: { zh: "交通罚单", en: "Traffic tickets" },
    intro: {
      zh: "针对超速、闯红灯、违章停车及其他交通类罚单，协助您厘清记录、时限与可行处理路径。",
      en: "Support for speeding, red-light, parking, and other traffic tickets, with a clear review of records, deadlines, and practical options.",
    },
    overview: {
      zh: "交通罚单可能影响罚金、驾照积分、保险费用和驾驶资格。我们会先确认发单机构、回应期限和驾驶记录，再说明可行方案与每一步所需资料，让您在充分理解影响后作出决定。",
      en: "A traffic ticket may affect fines, license points, insurance costs, and driving privileges. We first confirm the issuing authority, response deadline, and driving record, then explain practical options and the records needed for each step.",
    },
    points: {
      zh: ["核对罚单内容与关键时间节点", "分析扣分、罚金与保险影响", "协助准备资料及后续处理安排"],
      en: ["Review citation details and key deadlines", "Assess points, fines, and insurance implications", "Prepare records and next-step arrangements"],
    },
    steps: [
      {
        title: { zh: "确认案件信息", en: "Confirm the matter" },
        description: { zh: "核对罚单、发单地区、回应期限与驾驶记录。", en: "Review the citation, jurisdiction, deadline, and driving history." },
      },
      {
        title: { zh: "评估可能影响", en: "Assess implications" },
        description: { zh: "说明罚金、积分、保险与出庭等关键考虑。", en: "Clarify possible fines, points, insurance effects, and court considerations." },
      },
      {
        title: { zh: "推进处理方案", en: "Move forward" },
        description: { zh: "按选定方案准备资料，并持续跟进重要节点。", en: "Prepare the required records and track each important milestone." },
      },
    ],
    image: "https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1800&q=85",
  },
  {
    slug: "immigration-services",
    icon: Landmark,
    title: {
      zh: "移民咨询服务",
      en: "Immigration services",
    },
    shortTitle: { zh: "移民服务", en: "Immigration" },
    intro: {
      zh: "围绕常见移民申请、身份材料与流程节点，提供清晰的资料梳理、流程说明和专业转介支持。",
      en: "Clear document review, process guidance, and professional referrals for common immigration applications and status matters.",
    },
    overview: {
      zh: "移民事务往往涉及大量资料、严格时限和不同机构。我们帮助您整理现有情况、识别缺失材料并理解一般流程；遇到需要法律判断的事项时，也可协助准备转介沟通所需的信息。",
      en: "Immigration matters often involve substantial documentation, strict timelines, and multiple agencies. We help organize your circumstances, identify missing records, and explain the general process, with referral preparation when legal assessment is needed.",
    },
    points: {
      zh: ["梳理身份背景、申请记录与通知文件", "说明常见流程、资料清单与时间节点", "为需要法律判断的事项准备专业转介"],
      en: ["Organize status history, filings, and notices", "Explain common processes, document lists, and timelines", "Prepare professional referrals when legal assessment is required"],
    },
    steps: [
      {
        title: { zh: "了解当前情况", en: "Understand your situation" },
        description: { zh: "整理身份历史、已有申请、通知和您的主要目标。", en: "Organize status history, existing filings, notices, and your primary goal." },
      },
      {
        title: { zh: "建立资料清单", en: "Build a document list" },
        description: { zh: "确认已有文件、缺失资料与需要优先处理的节点。", en: "Identify available records, missing documents, and immediate priorities." },
      },
      {
        title: { zh: "说明后续路径", en: "Clarify next steps" },
        description: { zh: "解释一般流程，并在需要时协助专业转介。", en: "Explain the general process and arrange a professional referral when appropriate." },
      },
    ],
    image: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1800&q=85",
  },
  {
    slug: "ezpass",
    icon: CreditCard,
    title: {
      zh: "E-ZPass 豁免与管理",
      en: "E-ZPass disputes & management",
    },
    shortTitle: { zh: "E-ZPass", en: "E-ZPass" },
    intro: {
      zh: "面对异常通行费、高额滞纳金或账户追缴时，协助厘清记录并建立有据可循的处理方案。",
      en: "For disputed tolls, high late fees, or collections, we help clarify account records and develop a documented response.",
    },
    overview: {
      zh: "E-ZPass 争议常同时涉及车辆、设备、账户和纸质通知。我们从完整记录入手，核对交易与费用形成过程，找出重复收费、设备匹配或地址信息等问题，并协助制定后续沟通方案。",
      en: "E-ZPass disputes can involve vehicles, tags, accounts, and mailed notices. We start with the complete record, trace how charges developed, identify duplicate fees or account mismatches, and help plan the next communication.",
    },
    points: {
      zh: ["梳理账户、通行记录与通知文件", "识别重复收费或异常项目", "协助申诉、减免与账户后续管理"],
      en: ["Organize account, toll, and notice records", "Identify duplicate charges or anomalies", "Support appeals, relief requests, and account management"],
    },
    steps: [
      {
        title: { zh: "汇总记录", en: "Collect records" },
        description: { zh: "整理账单、通知、车辆与设备信息。", en: "Gather statements, notices, vehicle details, and tag information." },
      },
      {
        title: { zh: "核对异常", en: "Identify discrepancies" },
        description: { zh: "按时间线核对通行与费用，识别争议项目。", en: "Compare toll activity and fees chronologically to identify disputed items." },
      },
      {
        title: { zh: "处理与维护", en: "Resolve and maintain" },
        description: { zh: "准备沟通资料，并改善账户后续管理。", en: "Prepare the response and strengthen ongoing account management." },
      },
    ],
    image: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1800&q=85",
  },
  {
    slug: "accident-claims",
    icon: Car,
    title: {
      zh: "车祸理赔",
      en: "Car accident claims",
    },
    shortTitle: { zh: "车祸理赔", en: "Accident claims" },
    intro: {
      zh: "发生车祸后，协助把握事故资料、保险沟通与后续权益维护的关键环节。",
      en: "After an accident, we help organize records, insurer communication, and the key steps for protecting your interests.",
    },
    overview: {
      zh: "事故发生后的信息容易分散在警方报告、照片、医疗记录和多家保险机构之间。我们帮助建立清晰时间线，整理沟通记录和待办事项，让关键资料不被遗漏。",
      en: "After an accident, information is often spread across police reports, photos, medical records, and multiple insurers. We help build a clear timeline, organize communication, and keep critical records from being overlooked.",
    },
    points: {
      zh: ["整理事故、医疗及保险相关资料", "协助理解保险流程与沟通重点", "跟进处理节点，减少信息遗漏"],
      en: ["Organize accident, medical, and insurance records", "Clarify insurer processes and communication priorities", "Track milestones and prevent missing information"],
    },
    steps: [
      {
        title: { zh: "建立事故档案", en: "Build the record" },
        description: { zh: "按时间整理报告、照片、医疗与保险资料。", en: "Organize reports, photos, medical information, and insurance records by date." },
      },
      {
        title: { zh: "梳理沟通事项", en: "Map communications" },
        description: { zh: "确认相关各方、待回复问题和材料要求。", en: "Identify involved parties, open questions, and document requests." },
      },
      {
        title: { zh: "持续跟进", en: "Track progress" },
        description: { zh: "记录进度与截止日期，避免关键环节遗漏。", en: "Monitor progress and deadlines so important steps are not missed." },
      },
    ],
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1800&q=85",
  },
  {
    slug: "credit-repair",
    icon: ShieldCheck,
    title: {
      zh: "信用修复与信用保护",
      en: "Credit repair & protection",
    },
    shortTitle: { zh: "信用修复", en: "Credit protection" },
    intro: {
      zh: "系统识别信用报告中的错误或历史问题，建立有优先级的改善步骤和长期保护习惯。",
      en: "Identify report errors or historical issues and establish prioritized improvements and long-term protection practices.",
    },
    overview: {
      zh: "信用记录会影响租房、贷款和日常财务安排。我们协助审阅报告、区分错误信息与真实历史项目，建立清晰的争议资料和改善顺序，并说明长期维护信用的基本做法。",
      en: "Credit history can affect housing, financing, and everyday planning. We help review reports, distinguish errors from valid history, organize dispute records, prioritize improvements, and explain long-term credit practices.",
    },
    points: {
      zh: ["审阅信用报告中的异常与争议项目", "制定优先级清晰的改善步骤", "建立持续的信用保护建议"],
      en: ["Review report anomalies and disputed items", "Prioritize practical improvement steps", "Establish ongoing credit-protection practices"],
    },
    steps: [
      {
        title: { zh: "审阅信用报告", en: "Review reports" },
        description: { zh: "逐项检查账户、记录日期和可能的错误信息。", en: "Examine accounts, reporting dates, and possible inaccuracies." },
      },
      {
        title: { zh: "确定处理顺序", en: "Set priorities" },
        description: { zh: "区分争议项目与改善事项，建立可执行计划。", en: "Separate disputed items from improvement opportunities and build an action plan." },
      },
      {
        title: { zh: "建立保护习惯", en: "Protect progress" },
        description: { zh: "持续监测报告，并减少未来的信用风险。", en: "Monitor reports consistently and reduce future credit risk." },
      },
    ],
    image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1800&q=85",
  },
];

export function getService(slug: string) {
  return serviceItems.find((service) => service.slug === slug);
}

export function localizeService(service: ServiceItem, locale: Locale) {
  return {
    title: service.title[locale],
    shortTitle: service.shortTitle[locale],
    intro: service.intro[locale],
    overview: service.overview[locale],
    points: service.points[locale],
    steps: service.steps.map((step) => ({
      title: step.title[locale],
      description: step.description[locale],
    })),
  };
}
