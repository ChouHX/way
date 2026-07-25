export const locales = ["zh", "en"] as const;
export type Locale = (typeof locales)[number];

export const dictionary = {
  zh: {
    name: "永盛罚单/移民咨询中心", shortName: "永盛咨询中心", nav: ["首页", "服务项目", "案例展示", "关于我们", "联系我们"],
    tagline: "专业 · 诚信 · 高效", hero: "专业处理罚单与移民相关事务，为您的合法权益保驾护航", heroSub: "以清晰的方案、及时的响应和可靠的专业支持，帮助您稳妥面对每一步。", consult: "预约免费咨询", services: "查看服务", trust: ["10+ 年专业经验", "99% 成功处理率", "数千成功案例", "双语贴心服务"],
    footer: "为每一次重要选择，提供可靠支持。", language: "English", formSent: "已收到您的咨询，我们会尽快联系您。"
  },
  en: {
    name: "Yongsheng Ticket & Immigration Consulting Center", shortName: "Yongsheng Consulting", nav: ["Home", "Services", "Case Results", "About Us", "Contact"],
    tagline: "PROFESSIONAL · TRUSTED · RESPONSIVE", hero: "Practical guidance for ticket and immigration matters, protecting what matters to you.", heroSub: "Clear strategies, prompt communication, and reliable professional support at every step.", consult: "Book a free consultation", services: "Explore services", trust: ["10+ years of experience", "99% successful outcomes", "Thousands of cases", "Bilingual support"],
    footer: "Reliable support for every important decision.", language: "中文", formSent: "We received your request and will contact you soon."
  },
} as const;

export const getDictionary = (locale: string) => dictionary[locale === "en" ? "en" : "zh"];
export const pageSlugs = ["", "services", "cases", "about", "contact"] as const;
