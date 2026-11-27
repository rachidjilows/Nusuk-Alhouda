import { languages, offers, guides, url } from "../lib/site";
export function GET() {
  const paths = languages.flatMap((l) =>
    [
      "",
      "offers",
      "contact",
      "guides",
      "about",
      "faq",
      "privacy",
      "terms",
      "imprint",
      ...offers.map((o) => "offers/" + o.slug),
      ...guides.filter((g) => g.lang === l).map((g) => "guides/" + g.slug),
    ].map(
      (p) => "<url><loc>https://nusukalhouda.ma" + url(l, p) + "</loc></url>",
    ),
  );
  return new Response(
    '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
      paths.join("") +
      "</urlset>",
    { headers: { "Content-Type": "application/xml" } },
  );
}
