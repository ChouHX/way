export type ContactSettings = {
  phone: string;
  email: string;
  address_zh: string;
  address_en: string;
  hours_zh: string;
  hours_en: string;
  map_url: string;
};

export function phoneHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}
