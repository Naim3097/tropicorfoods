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

## Tracking still to wire before launch

- GA4 Measurement ID: still the `G-XXXXXXXXXX` placeholder sitewide.
- Google Ads conversion tag (`AW-`) plus a conversion action for the WhatsApp click, on `/lp/umamite`.
- The WhatsApp CTAs already emit `data-track="whatsapp_click"` with per-segment `data-track-label` values (`lp_umamite_hero`, `_b2c`, `_horeca`, `_b2b`, `_distributor`, `_sticky`, `_fab`), so segment-level conversion reporting works as soon as the IDs are live.

---

## Timing

Interception demand decays as the market settles, so Campaign 2 has a window rather than a lifespan. Campaign 1 is the one that still matters next year, which is also why the organic article was retargeted onto category terms. Review the split monthly and shift budget toward Campaign 1 as Campaign 2's conversion rate falls.
