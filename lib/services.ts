import {
  Car,
  CreditCard,
  Landmark,
  ShieldCheck,
  Ticket,
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
};

export function getServiceIcon(iconKey: string): LucideIcon {
  return serviceIcons[iconKey] || Ticket;
}

export const serviceIconOptions = [
  ["ticket", "罚单"],
  ["landmark", "政府 / 移民"],
  ["credit-card", "账户 / 支付"],
  ["car", "车辆"],
  ["shield", "信用 / 保障"],
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
