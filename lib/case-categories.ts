export const publicCaseCategories = [
  {
    id: "traffic-ticket",
    slug: "traffic-ticket",
    nameZh: "交通罚单",
    nameEn: "Traffic Tickets",
  },
  {
    id: "court-summons",
    slug: "court-summons",
    nameZh: "法庭传票",
    nameEn: "Court Summons",
  },
  {
    id: "tlc-ticket",
    slug: "tlc-ticket",
    nameZh: "TLC 罚单",
    nameEn: "TLC Tickets",
  },
] as const;

export type PublicCaseCategory = (typeof publicCaseCategories)[number];

export const getPublicCaseCategory = (slug: string) =>
  publicCaseCategories.find((category) => category.slug === slug);
