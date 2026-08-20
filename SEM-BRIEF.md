# UMAMITE — Paid Search Brief
### Google Ads · landing page `/lp/umamite` · August 2026

Internal document. Excluded from the published site via `.vercelignore`.

---

## The split that makes this work

The client's trademark restriction applies to **the website**. Google Ads treats two things separately:

| | Competitor trademark allowed? |
|---|---|
| **Keyword targeting** (what you bid on) | **Yes.** Google does not restrict trademarks as keywords. |
| **Ad text** (headlines, descriptions, sitelinks, callouts, display path) | **No.** Trademark complaints get ads disapproved. Keep it out. |
| **Landing page copy** | Out by client policy, independent of Google. |

So the branded demand is captured through *bidding*, and converted through *situation-matching copy*. Nobody's mark appears in anything Tropicor publishes.

---

## Campaign structure

**Campaign 1 — Category (evergreen, the durable asset)**
Ad groups: `halal yeast extract` · `yeast extract spread` · `yeast extract supplier / bulk` · `umami spread`
These have lower volume but clean Quality Score, because the landing page matches the query language exactly. Run these continuously.

**Campaign 2 — Competitor interception (time-sensitive, runs while the gap is open)**
Phrase and exact match on the competitor brand plus modifiers: `alternative`, `substitute`, `replacement`, `where to buy`, `discontinued`, `out of stock`, `halal`, `wholesale`, `supplier`.
Keep this in its own campaign so its metrics never contaminate Campaign 1's optimisation, and so it can be paused independently when demand decays.

**Campaign 3 — Application / recipe intent (cheap, top-of-funnel)**
Brand-free cooking queries: `yeast extract chicken`, `sticky umami chicken`, `umami glaze recipe`, `what is yeast extract`.
Low intent, low CPC. Point at the article rather than the landing page, or exclude if budget is tight.

---

## Negative keywords (add before launch)

`recipe` (in Campaigns 1–2 only), `jobs`, `nutrition facts`, `calories`, `vegemite`, `singapore` (unless supplying SG), `wikipedia`, `history of`, `is marmite vegan`, `bovril`, `free`, `sample free`.
Also negative-match your own brand terms in Campaign 2 so they do not cross-serve.

---

## Ad copy rules

Write to the searcher's *situation*, never the brand:

- "Can't find your usual jar?"
- "Halal Yeast Extract Spread"
- "Local Supply, No Import Wait"
- "Deep Savoury Umami, Halal Certified"
- "Retail Jars & Bulk Supply"
- "Talk to Us on WhatsApp"

**Do not use Dynamic Keyword Insertion on Campaign 2.** DKI would pull the competitor's trademark from the query straight into your headline, which is exactly the disapproval scenario. Use fixed headlines there.

---

## Expect a Quality Score penalty on Campaign 2, and budget for it

Google scores ad relevance and landing page experience partly on whether the page reflects the query. On competitor keywords the landing page deliberately never uses the searched term, so those two components will score below average and CPC will run higher than Campaign 1.

This is the cost of the risk decision, not a fault in the setup. Mitigations that work without breaking policy:
- Lean on the "can't find your usual jar" recognition line, which lifts on-page engagement signals even when terms do not match.
- Keep Campaign 2 tightly themed with few keywords per ad group.
- Watch conversion rate rather than CPC as the health metric. Interception traffic converts well when message match is right, which offsets the click premium.

---

## Tracking: built and verified, waiting only on the IDs

The event layer is complete and tested. Every CTA on `/lp/umamite` already fires
a GA4 event through the handler in `js/site.js`. Verified on the live page: 11
CTAs, 11 events, each with its own segment label. Nothing reaches GA4 today only
because the Measurement ID is still a placeholder.

**To go live, replace `G-XXXXXXXXXX` in the page `<head>`** — it appears twice per
page, once in the `gtag/js?id=` script URL and once in the `gtag('config', ...)`
call. Do it in `lp/umamite.html` at minimum; sitewide if you want the whole site
reporting. No other change is needed: `track()` in `js/site.js` no-ops safely
while `gtag` is undefined, then starts sending the moment a real ID is present.

**Events that will appear:**

| Event | Fires on |
|---|---|
| `whatsapp_click` | every WhatsApp CTA (9 on the LP) |
| `tel_click` | Call Us buttons (header, final section) |
| `email_click` | mailto links (product pages) |
| `generate_lead` | form submit (`form[data-track-form]`, OEM LP) |

Each carries `link_text` (the segment label) and `page_path`. The LP's labels:

`lp_umamite_header` · `lp_umamite_hero` · `lp_umamite_b2c` · `lp_umamite_horeca`
· `lp_umamite_b2b` · `lp_umamite_distributor` · `lp_umamite_footer` ·
`lp_umamite_call` · `lp_umamite_sticky` · `lp_umamite_fab`

That means you can see not just *that* someone enquired, but whether they came in
as a home cook, a restaurant, a manufacturer or a distributor — which is the
number that should steer budget between the campaigns above.

**In GA4 after the ID is in:** mark `whatsapp_click` (and `tel_click` if wanted)
as a Key Event, then import it into Google Ads as a conversion. Add the `AW-`
conversion snippet to the same `<head>` if you prefer tracking conversions in Ads
directly rather than importing.

**Already automatic**, no work needed: GA4 enhanced measurement covers page
views, scroll depth and outbound clicks once the property is live. The custom
events above exist to add the segment detail that enhanced measurement cannot
infer on its own.

---

## Timing

Interception demand decays as the market settles, so Campaign 2 has a window rather than a lifespan. Campaign 1 is the one that still matters next year, which is also why the organic article was retargeted onto category terms. Review the split monthly and shift budget toward Campaign 1 as Campaign 2's conversion rate falls.
