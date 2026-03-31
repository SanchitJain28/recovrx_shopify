# RecovrX — Brand & Design System

## Brand Overview

| Property     | Value                                      |
|--------------|--------------------------------------------|
| Brand Name   | RecovrX                                    |
| Niche        | Sports Recovery & Performance Wellness     |
| Target       | Athletes, gym-goers, 20–40yo, performance-focused |
| Brand Voice  | Premium, clinical, no-fluff                |
| Inspiration  | Therabody.com                              |

---

## Color System

### Palette

| Role          | Name         | Hex       | Usage                                      |
|---------------|--------------|-----------|--------------------------------------------|
| Primary       | Deep Black   | `#0A0A0A` | Main backgrounds, hero sections            |
| Primary Alt   | Off Black    | `#111111` | Card backgrounds, section alternates       |
| Secondary     | Ash Gray     | `#1E1E1E` | Supporting sections, nav, footer bg        |
| Surface       | Dark Surface | `#242424` | Product cards, overlays, modals            |
| Accent        | Electric Red | `#E3000F` | Buttons, CTAs, highlights, offer badges    |
| Accent Hover  | Deep Red     | `#B8000C` | Hover state for accent elements            |
| Text Primary  | Pure White   | `#FFFFFF` | Headings, primary body text                |
| Text Muted    | Light Gray   | `#A0A0A0` | Subheadings, descriptions, meta text       |
| Text Faint    | Dim Gray     | `#5A5A5A` | Placeholders, disabled states              |
| Border        | Dark Border  | `#2A2A2A` | Card borders, dividers, input borders      |
| Success       | Clean Green  | `#22C55E` | Trust indicators, stock status             |

### Color Ratio

```
60%  →  Primary (#0A0A0A / #111111)   — Backgrounds, dominant sections
30%  →  Secondary (#1E1E1E / #242424) — Cards, supporting sections
10%  →  Accent (#E3000F)              — Buttons, CTAs, badges, highlights
```

### CSS Variables (Shopify / Liquid)

```css
:root {
  --color-primary: #0A0A0A;
  --color-primary-alt: #111111;
  --color-secondary: #1E1E1E;
  --color-surface: #242424;
  --color-accent: #E3000F;
  --color-accent-hover: #B8000C;
  --color-text-primary: #FFFFFF;
  --color-text-muted: #A0A0A0;
  --color-text-faint: #5A5A5A;
  --color-border: #2A2A2A;
  --color-success: #22C55E;
}
```

---

## Typography

### Font Stack

| Role    | Font             | Google Fonts Import Slug               | Weights Used |
|---------|------------------|----------------------------------------|--------------|
| Heading | **Bebas Neue**   | `Bebas+Neue:wght@400`                  | 400          |
| Subhead | **Barlow**       | `Barlow:wght@400;500;600`              | 400, 500, 600 |
| Body    | **Inter**        | `Inter:wght@300;400;500`               | 300, 400, 500 |

> **Rationale:**  
> Bebas Neue — bold, condensed, athletic. Used by sports/performance brands globally. Perfect for hero headlines.  
> Barlow — clean, geometric, pairs well with Bebas. Used for section headings and product titles.  
> Inter — highly legible at small sizes, used by Therabody for body/description copy.

### Google Fonts Import (in `<head>` or `theme.liquid`)

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600&family=Inter:wght@300;400;500&display=swap" rel="stylesheet">
```

### Font Scale

| Element             | Font       | Size      | Weight | Line Height |
|---------------------|------------|-----------|--------|-------------|
| Hero Headline       | Bebas Neue | 80–96px   | 400    | 1.0         |
| Section Headline    | Bebas Neue | 48–60px   | 400    | 1.1         |
| Product Title       | Barlow     | 22–28px   | 600    | 1.3         |
| Subheading          | Barlow     | 16–18px   | 500    | 1.4         |
| Body Copy           | Inter      | 15–16px   | 400    | 1.7         |
| Caption / Meta      | Inter      | 12–13px   | 300    | 1.5         |
| Button Text         | Barlow     | 14–16px   | 600    | 1.0         |
| Announcement Bar    | Barlow     | 13px      | 500    | 1.0         |

```css
:root {
  --font-heading: 'Bebas Neue', sans-serif;
  --font-subhead: 'Barlow', sans-serif;
  --font-body: 'Inter', sans-serif;
}
```

---

## Animation System (GSAP)

### Library Import

```html
<!-- In theme.liquid before </body> -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
```

### Animation Tokens

| Property         | Value         | Usage                                   |
|------------------|---------------|-----------------------------------------|
| Duration Fast    | `0.3s`        | Hover states, toggles                   |
| Duration Default | `0.6s`        | Section reveals, product cards          |
| Duration Slow    | `1.0s`        | Hero entrance, large text               |
| Easing Default   | `power2.out`  | General purpose                         |
| Easing Snap      | `power4.out`  | Heading reveals, snappy entrances       |
| Easing Smooth    | `power1.inOut`| Parallax, continuous motion             |
| Stagger          | `0.1s`        | Product grid, icon rows, list items     |

### Core Animation Patterns

#### 1. Hero Text Entrance
```js
gsap.registerPlugin(ScrollTrigger);

gsap.from('.hero__headline', {
  y: 60,
  opacity: 0,
  duration: 1.0,
  ease: 'power4.out',
  delay: 0.2
});

gsap.from('.hero__subtext', {
  y: 30,
  opacity: 0,
  duration: 0.7,
  ease: 'power2.out',
  delay: 0.5
});

gsap.from('.hero__cta', {
  y: 20,
  opacity: 0,
  duration: 0.5,
  ease: 'power2.out',
  delay: 0.8
});
```

#### 2. Section Reveal on Scroll
```js
gsap.utils.toArray('.section-reveal').forEach(el => {
  gsap.from(el, {
    scrollTrigger: {
      trigger: el,
      start: 'top 85%',
      toggleActions: 'play none none none'
    },
    y: 40,
    opacity: 0,
    duration: 0.6,
    ease: 'power2.out'
  });
});
```

#### 3. Product Card Stagger
```js
gsap.from('.product-card', {
  scrollTrigger: {
    trigger: '.product-grid',
    start: 'top 80%'
  },
  y: 50,
  opacity: 0,
  duration: 0.5,
  stagger: 0.1,
  ease: 'power2.out'
});
```

#### 4. Stat Counter (USP Section)
```js
gsap.utils.toArray('.stat-number').forEach(el => {
  const target = parseInt(el.getAttribute('data-target'));
  gsap.from({ val: 0 }, {
    scrollTrigger: { trigger: el, start: 'top 80%' },
    val: target,
    duration: 1.5,
    ease: 'power1.out',
    onUpdate: function () {
      el.textContent = Math.round(this.targets()[0].val).toLocaleString() + '+';
    }
  });
});
```

#### 5. Announcement Bar Marquee
```js
gsap.to('.marquee__inner', {
  x: '-50%',
  duration: 18,
  ease: 'none',
  repeat: -1
});
```

---

## Homepage Section Plan

| # | Section              | Animation                        | Notes                                        |
|---|----------------------|----------------------------------|----------------------------------------------|
| 1 | Announcement Bar     | GSAP marquee                     | "Free shipping over ₹999 • Clinically tested" |
| 2 | Sticky Nav           | Fade-in on scroll past hero      | Transparent → solid on scroll                |
| 3 | Hero Banner          | Text entrance + CTA fade-up      | Full-width dark bg, bold Bebas headline      |
| 4 | Shop by Concern      | Stagger reveal on scroll         | 3 cards: Muscle Pain / Mobility / Recovery   |
| 5 | Best-Selling Products| Product card stagger             | 3–4 cards in grid                            |
| 6 | USP / Stats Section  | Counter animation                | "50K+ Athletes • 4.9 Rating • 30-Day Returns" |
| 7 | Product Highlight    | Slide-in image + fade copy       | Single product deep-dive section             |
| 8 | Testimonials         | Fade-in stagger                  | 3 review cards, star ratings                 |
| 9 | Trust Badges         | Fade-up row                      | Icons: Certified, Fast Ship, Easy Returns    |
| 10| Newsletter Signup    | Fade-in                          | Email capture with discount offer            |
| 11| Footer               | Static                           | Policy links, social, copyright              |

---

## Product List (AliExpress Sourced)

| # | Product                  | Compare Price | Sale Price | Tag        |
|---|--------------------------|---------------|------------|------------|
| 1 | Percussion Massage Gun   | ₹6,999        | ₹3,999     | Best Seller |
| 2 | Foam Roller              | ₹1,499        | ₹799       | —          |
| 3 | Resistance Bands Set     | ₹999          | ₹599       | Bundle Pick |
| 4 | Hot & Cold Therapy Pack  | ₹1,299        | ₹699       | —          |
| 5 | Compression Knee Sleeve  | ₹899          | ₹499       | —          |

---

## Apps to Install (Day 1)

| App                        | Purpose                              |
|----------------------------|--------------------------------------|
| Judge.me Reviews           | Product reviews + star ratings       |
| Shopify Search & Discovery | Search tuning + filters              |
| Shopify Bundles            | Bundle deals (bands + roller)        |
| Labeler – Product Labels   | "Best Seller", "New" badges          |
| Shopify Subscriptions      | Optional repeat purchase             |

---

## Deliverables Checklist

- [ ] Shopify Partner account + Dev store created
- [ ] Theme: Dawn (custom Liquid sections added)
- [ ] Password set: `Test@123`
- [ ] All 5 products imported with SEO fields
- [ ] Judge.me reviews widget active
- [ ] Full homepage built (all 11 sections)
- [ ] Mobile QA passed
- [ ] Product page: sticky ATC + trust badges + reviews
- [ ] Cart → Checkout flow tested (test mode)
- [ ] Product CSV exported
- [ ] Image folders: original + background-removed
- [ ] Collaborator invite sent

## Rules

- Every section has its own `.css`, `.js` file in `assets/`
- Every `.liquid` section includes a full Shopify `{% schema %}` block
- JS uses GSAP for scroll-triggered reveals (`ScrollTrigger`) and hero animations
- No jQuery — vanilla JS only
- CSS uses custom properties (tokens above) — no hardcoded values
- All images use Shopify's `image_url` filter with `loading="lazy"`
- Forms use Shopify's native `contact` form action or custom metafield-backed logic
- Accessibility: semantic HTML, `aria-label`, keyboard nav on all interactive elements
- Performance: CSS/JS loaded per-section via `{{ 'file.css' | asset_url | stylesheet_tag }}`

---
## Naming Conventions

| Type | Pattern | Example |
|---|---|---|
| Section file | `section-[name].liquid` | `section-hero-banner.liquid` |
| CSS asset | `section-[name].css` | `section-hero-banner.css` |
| JS asset | `section-[name].js` | `section-hero-banner.js` |
| Snippet | `[component].liquid` | `product-card.liquid` |
| CSS class | `rx-[block]__[element]` | `rx-hero__title` |
| Schema id | `kebab-case` | `hero-banner` |