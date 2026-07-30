import {
  Car,
  BadgeDollarSign,
  Building2,
  CircleDollarSign,
  ClipboardCheck,
  CreditCard,
  FileText,
  Gavel,
  Handshake,
  House,
  Landmark,
  ReceiptText,
  Scale,
  ShieldCheck,
  Ticket,
  UsersRound,
  WalletCards,
  type LucideIcon,
} from "lucide-react";
import type { Locale } from "@/lib/i18n";

export type ServiceStep = {
  title_zh: string;
  title_en: string;
  description_zh: string;
  description_en: string;
};

export type ServiceContentConfig = {
  overview_title_zh: string;
  overview_title_en: string;
  points_title_zh: string;
  points_title_en: string;
  process_title_zh: string;
  process_title_en: string;
  show_overview: boolean;
  show_points: boolean;
  show_process: boolean;
};

export const defaultServiceContentConfig: ServiceContentConfig = {
  overview_title_zh: "先厘清问题，再稳妥推进。",
  overview_title_en: "Clarity first, then careful action.",
  points_title_zh: "我们可以协助的重点",
  points_title_en: "How we can help",
  process_title_zh: "处理流程",
  process_title_en: "Our process",
  show_overview: true,
  show_points: true,
  show_process: true,
};

export type ServiceItem = {
  id: string;
  slug: string;
  icon_key: string;
  title_zh: string;
  title_en: string;
  short_title_zh: string;
  short_title_en: string;
  intro_zh: string;
  intro_en: string;
  overview_zh: string;
  overview_en: string;
  points_zh: string[];
  points_en: string[];
  steps: ServiceStep[];
  content_config: ServiceContentConfig;
  image_url: string;
  sort_order: number;
  published: number;
};

const serviceIcons: Record<string, LucideIcon> = {
  ticket: Ticket,
  landmark: Landmark,
  "credit-card": CreditCard,
  car: Car,
  shield: ShieldCheck,
  scale: Scale,
  gavel: Gavel,
  "file-text": FileText,
  handshake: Handshake,
  receipt: ReceiptText,
  wallet: WalletCards,
  "circle-dollar": CircleDollarSign,
  "badge-dollar": BadgeDollarSign,
  building: Building2,
  house: House,
  users: UsersRound,
  clipboard: ClipboardCheck,
};

export function getServiceIcon(iconKey: string): LucideIcon {
  return serviceIcons[iconKey] || Ticket;
}

export const serviceIconOptions = [
  ["ticket", "罚单"], ["scale", "法律咨询"], ["gavel", "争议处理"],
  ["landmark", "移民服务"], ["building", "政府机构"], ["file-text", "资料文件"],
  ["car", "车辆事故"], ["receipt", "账单费用"], ["credit-card", "账户支付"],
  ["wallet", "财务服务"], ["circle-dollar", "款项处理"], ["badge-dollar", "理赔服务"],
  ["shield", "信用保障"], ["handshake", "专业支持"], ["house", "住房事务"],
  ["users", "客户服务"], ["clipboard", "流程管理"],
] as const;

export function localizeService(service: ServiceItem, locale: Locale) {
  const zh = locale === "zh";
  const preferred = (primary: string, secondary: string) => primary.trim() || secondary.trim();
  const normalizeMultiline = (value: string) => value.replace(/\\r\\n|\\n|\\r/g, "\n");
  const config = { ...defaultServiceContentConfig, ...service.content_config };
  const localizedSteps = service.steps
    .map((step) => ({
      title: preferred(
        zh ? step.title_zh : step.title_en,
        zh ? step.title_en : step.title_zh,
      ),
      description: preferred(
        zh ? step.description_zh : step.description_en,
        zh ? step.description_en : step.description_zh,
      ),
    }))
    .filter((step) => step.title || step.description);
  return {
    title: preferred(zh ? service.title_zh : service.title_en, zh ? service.title_en : service.title_zh),
    shortTitle: preferred(zh ? service.short_title_zh : service.short_title_en, zh ? service.short_title_en : service.short_title_zh),
    intro: preferred(zh ? service.intro_zh : service.intro_en, zh ? service.intro_en : service.intro_zh),
    overview: normalizeMultiline(preferred(zh ? service.overview_zh : service.overview_en, zh ? service.overview_en : service.overview_zh)),
    overviewTitle: preferred(zh ? config.overview_title_zh : config.overview_title_en, zh ? config.overview_title_en : config.overview_title_zh),
    pointsTitle: preferred(zh ? config.points_title_zh : config.points_title_en, zh ? config.points_title_en : config.points_title_zh),
    processTitle: preferred(zh ? config.process_title_zh : config.process_title_en, zh ? config.process_title_en : config.process_title_zh),
    points: (zh ? service.points_zh : service.points_en).length
      ? (zh ? service.points_zh : service.points_en)
      : (zh ? service.points_en : service.points_zh),
    steps: localizedSteps,
    showOverview: config.show_overview,
    showPoints: config.show_points,
    showProcess: config.show_process,
  };
}
