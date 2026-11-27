# nusukalhouda · Website und Redaktion

## Angebote bearbeiten

Öffne nach der Einrichtung `/admin/`. Unter **Reiseangebote · Séjours** öffnest du das gewünschte Angebot oder klickst auf **+**. Titel, Beschreibung und Leistungen haben je ein arabisches und ein französisches Textfeld. Preise sind gemeinsame Zahlenfelder (MAD pro Person). Öffne die passende Hotelzeile, ersetze den Preis und klicke auf **Veröffentlichen**. Cloudflare baut die Seiten für beide Sprachen neu. Mit **Lösche Beitrag** entfernst du ein Angebot. Kopiere für eine neue Reise die Informationen aus deinem Flyer in die passenden Felder.

Unter **Startseiten & FAQ** bearbeitest du die Einführung und Fragen. Unter **Kundenstimmen** stehen nur zur Veröffentlichung freigegebene Zitate. Eine leere Liste blendet den Abschnitt aus. Ratgeber und Rechtstexte lassen sich ebenfalls im Browser bearbeiten. Für zusammengehörende Ratgeber in beiden Sprachen denselben Dateinamen verwenden, damit der Sprachwechsel direkt zur Übersetzung führt.

## Lokal starten

Node.js 24 LTS mit npm. Im entpackten Projektordner:

```sh
npm ci
npm run dev
```

Ein zweites Terminal im gleichen Ordner öffnen und `npm run cms` ausführen. Website unter `http://localhost:4321/ar/` bzw. `/fr/`, Verwaltung unter `http://localhost:4321/admin/`. Der lokale CMS-Dienst schreibt in den Projektordner. Nur auf dem eigenen Rechner ausführen.

```sh
npm run build
npm run preview
```

Ein Produktionsbuild erzeugt die Website einschließlich lokal ausgelieferter CMS-Dateien in `dist/`. Für die Pages Function nach dem Build `npm run pages` verwenden. Astro dev/preview allein führt Cloudflare Functions nicht aus.

## Einrichtung für die Veröffentlichung

1. Projekt einschließlich der versteckten Dateien in ein privates GitLab-Projekt übernehmen, Hauptbranch `main`. Der Redaktionsbenutzer benötigt Schreibrecht auf diesem Branch.
2. In GitLab eine OAuth-Anwendung für Decap anlegen. **Confidential** deaktivieren, Scope **api**, exakte Redirect URI `https://nusukalhouda.ma/admin/`. Bei einer Testdomain deren eigene Redirect URI ergänzen. Die Application ID wird beim Build verwendet. [Decap und GitLab PKCE](https://decapcms.org/docs/gitlab-backend/)
3. In Cloudflare **Workers & Pages → Pages** ein Git-Projekt verbinden, das GitLab-Projekt auswählen, Build-Befehl `npm run build`, Ausgabeordner `dist`, Projektwurzel als Root. Node-Version 24 einstellen. Build-Variablen `CMS_REPO` (z. B. Gruppe/Projekt), `CMS_APP_ID` und `PUBLIC_TURNSTILE_SITE_KEY` setzen. Bei Änderungen neu bauen.
4. In Cloudflare Turnstile ein Widget für die eingesetzten Hostnamen anlegen. Öffentlichen Schlüssel im Build setzen. **TURNSTILE_SECRET** als verschlüsselte Laufzeitvariable für die Pages Function speichern. Das Formular prüft Token, Aktion und Hostnamen serverseitig. [Turnstile](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/)
5. In Resend die Absenderdomain anhand der angezeigten DNS-Einträge verifizieren. Laufzeitvariablen **RESEND_API_KEY** (Secret), **MAIL_FROM** (freigegebene Absenderadresse) und **INQUIRY_TO** (nusuk.alhouda@gmail.com) setzen. Der Gmail-Empfänger ist unabhängig vom verifizierten Absender. Das Formular übergibt Agenturanfrage und Eingangsbestätigung gemeinsam an die Batch-API. Ohne öffentlichen Widgetschlüssel verweist es auf WhatsApp und E-Mail. Für lokale Integrationstests Laufzeitvariablen aus `.dev.vars.example` nach `.dev.vars` kopieren und den öffentlichen Schlüssel vor dem Build in `.env` setzen. [Resend-Batchversand](https://resend.com/docs/api-reference/emails/send-batch-emails)
6. In Pages **Custom domains → Set up a domain → nusukalhouda.ma** auswählen. Für die Hauptdomain muss die Zone bei Cloudflare liegen. Vor einem Nameserverwechsel bestehende DNS-Einträge einschließlich E-Mail-Einträge übernehmen. Für `www` ebenfalls die Domain zuordnen und eine permanente Weiterleitung auf die Hauptdomain mit Pfad und Query einrichten. Das fertige Zertifikat und beide Sprachen prüfen. [Cloudflare-Domainanleitung](https://developers.cloudflare.com/pages/configuration/custom-domains/)

## Vor dem öffentlichen Start

- [ ] Die drei Hotelvarianten und alle zwölf Zimmerpreise mit dem Originalflyer vergleichen. In Variante drei stehen **35.500 MAD für vier** und **36.000 MAD für fünf** Personen im Zimmer, jeweils pro Person. Reisezeit laut Flyer 18. Januar bis 17. Februar 2027, beworbene Dauer 30 Tage. Schreibweisen der Hotels und Social-Media-Konten bestätigen.
- [ ] Fehlende Tagespläne und ausgeschlossene Leistungen ergänzen. Die Website verweist bis dahin auf Rückfrage. Kundenstimmen nur mit Freigabe eintragen.
- [ ] Firmenbezeichnung, Rechtsform, gesetzliche Vertretung, Register-/Lizenzdaten und anwendbare Identifikationsnummern in beiden Sprachfassungen der rechtlichen Hinweise ergänzen. Datenschutzerklärung mit tatsächlicher Aufbewahrungsdauer, Empfängern, Dienstleisterstandorten, Verantwortlichem und CNDP-Referenz vervollständigen. Voraussetzungen für die Verarbeitung und mögliche Übermittlungen ins Ausland nach marokkanischem Recht klären. Vertrags- und Datenschutzhinweise vor Veröffentlichung fachlich prüfen. [CNDP zur Website-Konformität](https://www.cndp.ma/conformite-des-sites-web/)
- [ ] Redaktionslogin über GitLab testen. Ein Testangebot veröffentlichen, prüfen, löschen und beide Neubauten abwarten. Domain, HTTPS, Canonicals, hreflang, Sitemap, Metadaten und strukturierte Daten auf dem endgültigen Host prüfen.
- [ ] Mit einer eigenen Empfängeradresse eine Anfrage in beiden Sprachen testen. Programmvorwahl, Turnstile, Agenturpostfach, Kundenbestätigung und Antwortadresse kontrollieren. Fehlerfälle und Spamordner prüfen.
- [ ] Karten-Einwilligung, Ablehnen und Widerruf testen. Ohne Einwilligung lädt die Karte keine Google-Ressourcen. WhatsApp-Ziel +212600112428 und direkter Anruf +212708830960 prüfen.
- [ ] Beide Sprachrichtungen auf kleinen und großen Displays sowie per Tastatur und Screenreader testen. Fokus, Kontrast, Fehlermeldungen, Bilder und Zoom prüfen. Nach Veröffentlichung Lighthouse mobil wiederholen (Ziel >90); Werte hängen von Gerät, Netz und Diensten ab.

## Inhalt und Gestaltung

Logo und Preisflyer stammen von der Agentur. Das Titelmotiv auf der Startseite wurde mit Higgsfield als illustrative Darstellung generiert. Die Programmkarte verwendet einen Ausschnitt aus dem Flyer. Schriften und Bilder werden lokal ausgeliefert. Es gibt keine Zahlung oder verbindliche Buchung auf der Website.

## Projektstruktur

Die folgende Liste enthält die mitgelieferten Quelldateien. Abhängigkeiten, generierte Administrationsdateien und Build-Ausgabe entstehen beim Start oder Build.


```text
.dev.vars.example
.gitignore
.npmrc
README.md
astro.config.mjs
cms.json
functions/api/inquiry.ts
package-lock.json
package.json
public/_headers
public/_redirects
public/_routes.json
public/admin/index.html
public/consent.js
public/filter.js
public/inquiry.js
public/media/brand.webp
public/media/hero.webp
public/media/offer.webp
public/media/pilgrimage.webp
public/robots.txt
scripts/admin.mjs
src/components/Inquiry.astro
src/components/OfferCard.astro
src/content/guides/ar/chambre-omra.md
src/content/guides/fr/chambre-omra.md
src/content/home-ar.json
src/content/home-fr.json
src/content/offers/omra-chaabane-ramadan-1448.md
src/content/pages/ar/about.md
src/content/pages/ar/imprint.md
src/content/pages/ar/privacy.md
src/content/pages/ar/terms.md
src/content/pages/fr/about.md
src/content/pages/fr/imprint.md
src/content/pages/fr/privacy.md
src/content/pages/fr/terms.md
src/content/reviews.json
src/i18n/ar.json
src/i18n/fr.json
src/layouts/Layout.astro
src/lib/site.ts
src/pages/[lang]/[...path].astro
src/pages/[lang]/offers/[slug].astro
src/pages/index.astro
src/pages/sitemap.xml.ts
src/styles/site.css
tsconfig.json
wrangler.toml
```
