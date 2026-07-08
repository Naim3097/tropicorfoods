# Tropicor Foods — Launch & Setup Notes

Everything the site needs to go fully live. Items marked **[REPLACE]** are placeholders in the code.

---

## 1. Placeholders to replace before launch

| Placeholder | Where | Replace with |
|---|---|---|
| `G-XXXXXXXXXX` | `<head>` of every HTML page | GA4 Measurement ID (see §3) |
| `YOUR-WEB3FORMS-ACCESS-KEY` | `contact.html`, `lp/oem-supplier-malaysia.html` | Free access key from https://web3forms.com (enter the receiving email, e.g. enquiries@tropicorfoods.com) |
| Unsplash / Pexels media | Homepage hero video, FEEGOH & puree product images (marked `<!-- TODO -->`) | Real product photography & brand video |
| `https://www.tropicorfoods.com` | Canonical/OG URLs, `sitemap.xml`, `robots.txt` | Confirm this is the final production domain; adjust if different |

**To swap all GA4 IDs at once** (PowerShell, from the project root):
```powershell
Get-ChildItem -Recurse -Filter *.html | ForEach-Object {
  (Get-Content $_.FullName -Raw) -replace 'G-XXXXXXXXXX', 'G-REALID123' | Set-Content $_.FullName -NoNewline
}
```

**Open question for Tropicor:** the old site listed the Admin phone as both
+60 16-380 9660 (homepage) and +60 16-300 9660 (contact page). The new site uses
**+60 16-380 9660** everywhere — confirm and correct if needed.

---

## 2. Hosting / DNS

Static site, no build step — any static host works (Netlify, Vercel, Cloudflare Pages,
or existing cPanel hosting). Upload the project folder as-is, `index.html` at the root.
`lp/oem-supplier-malaysia.html` deploys with the site but is `noindex` and excluded in
`robots.txt` — it is reachable only via its direct URL (used for Google Ads).

---

## 3. GA4 setup (once)

1. https://analytics.google.com → Admin → Create Property → "Tropicor Foods".
2. Create a **Web** data stream for `https://www.tropicorfoods.com` → copy the **Measurement ID** (`G-…`).
3. Replace `G-XXXXXXXXXX` in all HTML files (script in §1).
4. In GA4 → Admin → Events, the site already sends these custom events automatically:
   - `whatsapp_click` — any WhatsApp link
   - `tel_click` / `email_click` — phone & email links
   - `quote_cta_click` — "Request a Quote" buttons
   - `generate_lead` — contact & landing-page form submits
5. Mark `generate_lead` and `whatsapp_click` as **Key events** (Admin → Key events).
   This is the conversion baseline.

## 4. Google Search Console (once)

1. https://search.google.com/search-console → Add property → **Domain** (`tropicorfoods.com`).
2. Verify via the DNS TXT record Google provides (added at the domain registrar).
   Alternative: URL-prefix property + HTML-tag verification (paste the meta tag into `index.html` `<head>`).
3. After verification: **Sitemaps** → submit `https://www.tropicorfoods.com/sitemap.xml`.
4. Request indexing for the homepage and the 4 `/solutions/` pages (URL Inspection → Request indexing).

## 5. Google Business Profile (once)

1. https://business.google.com → Add business → "Tropicor Foods".
2. Category: **Food products supplier** (secondary: Food manufacturer, Manufacturer).
3. Address: No.36, Lorong Sungai Puloh 1A/KU6, Taman Teknologi Gemilang,
   Kaw Perindustrian Sg. Puloh, 42100 Klang, Selangor.
4. Phone: +60 12-255 6701 · Website: https://www.tropicorfoods.com
5. Verification is usually by postcard/phone/video for this category — follow the prompt.
6. After verification: add photos (factory, products, logo), business hours,
   and the description (use the homepage meta description).
7. Add the same NAP (name–address–phone) consistently — it must match the website footer exactly.

## 6. Google Ads landing page

- URL: `https://www.tropicorfoods.com/lp/oem-supplier-malaysia.html`
- Use as the Final URL for B2B campaigns (restaurants / supermarkets / hotels / OEM).
- When the Ads account exists, add the **AW- conversion snippet** next to the GA4 tag in
  that file (marked with a comment), or import the GA4 `generate_lead` key event into Google Ads.

## 7. Content still expected from Tropicor

- Real product photos + confirmed specs for the 6 top sellers
  (specs tables are structured, marked `<!-- TODO -->` in `products/*.html` —
  regenerate quickly via the page generators if preferred).
- Brand/hero video to replace the stock Pexels clip on the homepage.
- Social media URLs (footer "sameAs" in Organization JSON-LD is empty).
- Confirmation of the Admin phone number (see §1).

## 8. Regenerating templated pages

The 6 product pages, 4 solution pages and 7 secondary pages were generated from
scripts (kept in the session scratchpad: `gen-products.js`, `gen-solutions.js`,
`gen-pages.js`). Edit data in the script and re-run with `node <script>` to re-stamp
consistently — or edit the HTML directly for one-off changes.
