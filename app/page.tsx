import { headers } from "next/headers";
import { redirect } from "next/navigation";

function preferredLocale(acceptLanguage: string) {
  const languages = acceptLanguage
    .split(",")
    .map((entry, index) => {
      const [language, ...parameters] = entry.trim().split(";");
      const quality = parameters
        .map((parameter) => parameter.trim().match(/^q=([0-9.]+)$/i)?.[1])
        .find(Boolean);
      return {
        language: language.toLowerCase(),
        quality: quality ? Number(quality) : 1,
        index,
      };
    })
    .filter((entry) => Number.isFinite(entry.quality) && entry.quality > 0)
    .sort((a, b) => b.quality - a.quality || a.index - b.index);

  for (const { language } of languages) {
    if (language === "en" || language.startsWith("en-")) return "en";
    if (language === "zh" || language.startsWith("zh-")) return "zh";
  }
  return "zh";
}

export default async function Index() {
  const acceptLanguage = (await headers()).get("accept-language") ?? "";
  redirect(`/${preferredLocale(acceptLanguage)}`);
}
