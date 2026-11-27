import ar from "../i18n/ar.json";
import fr from "../i18n/fr.json";
export const languages = ["ar", "fr"] as const;
export type Lang = (typeof languages)[number];
export const dict = { ar, fr };
export const streetAddress = "202 إقامة رواق عبد المومن شارع عبد المومن، 46 الطابق الثاني";
export const postalCode = "20100";
export const address = streetAddress + ", Casablanca " + postalCode + ", Maroc";
export const email = "jilowsrac@gmail.com";
export const wa = "https://wa.me/212600112428";
export const map =
  "https://maps.google.com/maps?q=" + encodeURIComponent(address);
type Local = { ar: string; fr: string };
export type Offer = {
  slug: string;
  title: string;
  name: Local;
  summary: Local;
  type: Local;
  start: string;
  end: string;
  days: number;
  photo: string;
  flyer?: string;
  hotels: {
    label: Local;
    double: number;
    triple: number;
    quad: number;
    five: number;
  }[];
  included: Local[];
  excluded?: Local[];
  hijri?: Local;
  schedule?: Local[];
};
const entries = import.meta.glob<{ frontmatter: Offer }>(
  "../content/offers/*.md",
  { eager: true },
);
export const offers = Object.values(entries).map((v) => v.frontmatter);
export const lowest = (o: Offer) =>
  Math.min(...o.hotels.flatMap((h) => [h.double, h.triple, h.quad, h.five]));
export const money = (n: number, l: Lang) =>
  new Intl.NumberFormat(l === "ar" ? "ar-MA" : "fr-MA").format(n);
export const date = (s: string, l: Lang) =>
  new Intl.DateTimeFormat(l === "ar" ? "ar-MA" : "fr-FR", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(String(s).slice(0, 10) + "T12:00:00Z"));
export const url = (l: Lang, p = "") => "/" + l + "/" + (p ? p + "/" : "");
export const guides = Object.entries(
  import.meta.glob<{
    frontmatter: { title: string; summary: string };
    Content: any;
  }>("../content/guides/*/*.md", { eager: true }),
).map(([path, entry]) => ({
  ...entry,
  lang: path.split("/").at(-2),
  slug: path.split("/").at(-1)!.replace(/\.md$/, ""),
}));
