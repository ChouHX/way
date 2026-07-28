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
  return {
    title: zh ? service.title_zh : service.title_en,
    shortTitle: zh ? service.short_title_zh : service.short_title_en,
    intro: zh ? service.intro_zh : service.intro_en,
    overview: zh ? service.overview_zh : service.overview_en,
    points: zh ? service.points_zh : service.points_en,
    steps: service.steps.map((step) => ({
      title: zh ? step.title_zh : step.title_en,
      description: zh ? step.description_zh : step.description_en,
    })),
  };
}
