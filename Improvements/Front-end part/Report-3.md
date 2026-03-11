# Tech Nest — Complete Frontend & UI/UX Audit

> Evaluated as a Principal Product Designer, Senior Frontend Architect, and UX Research Lead.
> Benchmark standard: **Apple, Stripe, Linear, Vercel.**

---

## 1. Executive UI/UX Summary

Tech Nest has strong **design ambition** — the color tokens, typography choices (Geist family), and dark mode palette are well-considered starting points. However, the execution falls significantly short of the premium benchmark it targets. The product currently reads as a **polished prototype**, not a shippable product surface.

**Core verdict:** The interface suffers from **five systemic failures**:

1. **Placeholder-driven UI** — Pervasive grey placeholder blocks where images should be, making the product feel unfinished regardless of design quality
2. **Hardcoded mock data** — Over 70% of visible data is static JSON embedded in components, breaking trust in the "intelligent" value proposition
3. **Inconsistent spacing rhythm** — Sections oscillate between cramped and cavernous with no governing scale
4. **Component duplication** — Parallel implementations of cards, containers, and search that fragment the design system
5. **Missing interaction depth** — Keyboard navigation is advertised (⌘K, ↑↓ hints) but largely non-functional

If Apple, Linear, or Stripe shipped this, it would fail internal design review before reaching a staging environment.

---

## 2. Critical Design Issues (Must Fix)

These are showstopper problems that would prevent any discerning user from trusting the product:

### 2.1 Placeholder Image Epidemic
Every device card, comparison hero, and device detail page shows grey rectangles with text like "Image", "Hardware", or "VS View" instead of actual product imagery.

**Files affected:**
- [device-card.tsx](file:///c:/Users/user/Documents/tech-nest/src/features/devices/device-card.tsx#L38-L44) — `180px` grey block with "Image" text
- [device-hero.tsx](file:///c:/Users/user/Documents/tech-nest/src/features/device/device-hero.tsx#L18-L24) — `w-56 h-72` placeholder rectangle
- [ComparisonHero.tsx](file:///c:/Users/user/Documents/tech-nest/src/components/compare/ComparisonHero.tsx#L50-L58) — Phone-shaped placeholder with text-only content
- [compare/[slugs]/page.tsx](file:///c:/Users/user/Documents/tech-nest/src/app/compare/%5Bslugs%5D/page.tsx#L40-L43) — `w-48 h-64` placeholder blocks
- [comparisons-section.tsx](file:///c:/Users/user/Documents/tech-nest/src/features/home/comparisons-section.tsx#L38-L40) — "VS View" placeholder

> [!CAUTION]
> A product selling "intelligent device decisions" that cannot show product images immediately destroys user confidence. **No premium tech product ships without imagery.** This is the single most damaging UX issue.

### 2.2 Pervasive Hardcoded Mock Data
The "intelligence engine" has no intelligence. Nearly every data point is a hardcoded string:

| Component | Hardcoded Data |
|-----------|---------------|
| [comparisons-section.tsx](file:///c:/Users/user/Documents/tech-nest/src/features/home/comparisons-section.tsx) | Device names, scores, verdicts |
| `compare/[slugs]/page.tsx` | Score values (92, 89), all spec rows, entire verdict text |
| [ComparisonHero.tsx](file:///c:/Users/user/Documents/tech-nest/src/components/compare/ComparisonHero.tsx) | Device names "iPhone 16 Pro Max" baked into JSX |
| [decision/page.tsx](file:///c:/Users/user/Documents/tech-nest/src/app/decision/page.tsx) | Fake `setTimeout` recommendation, fixed "Pixel 9 Pro" result |
| [SearchPalette.tsx](file:///c:/Users/user/Documents/tech-nest/src/components/search/SearchPalette.tsx) | Mock search results always return "Pixel 8 Pro" and "iPhone 15 Pro" |
| [device-scores.tsx](file:///c:/Users/user/Documents/tech-nest/src/features/device/device-scores.tsx) | Fallback scores with `|| 92`, `|| 94`, `|| 98` |

### 2.3 Search Palette is a Visual Lie
The search palette at [SearchPalette.tsx](file:///c:/Users/user/Documents/tech-nest/src/components/search/SearchPalette.tsx):
- Displays keyboard navigation hints (↑/↓ to navigate, ↵ to select) but **has no keyboard navigation logic**
- Shows "Jump To" results that are always the same regardless of query
- References `text-brand` and `bg-brand/10` CSS classes that **don't exist** in the theme (lines 269, 272, 273, 275)
- Advertises "Tech Nest Search Architecture" in the footer — aspirational branding over a mock

### 2.4 Decision AI Wizard is a `setTimeout`
The entire "Intelligence Engine" at [decision/page.tsx](file:///c:/Users/user/Documents/tech-nest/src/app/decision/page.tsx#L20-L26) is:
```typescript
const handleRecommend = () => {
  setLoading(true);
  setTimeout(() => {
    setStep(4);
    setLoading(false);
  }, 2500);
};
```
It always recommends the same "Pixel 9 Pro" regardless of user input. The loading spinner text "Running neural matrix..." is deceptive UX.

### 2.5 Duplicate Scroll Listeners in Navbar
[Navbar.tsx](file:///c:/Users/user/Documents/tech-nest/src/components/layout/Navbar.tsx#L36-L48) registers **two independent scroll listeners** for the same `isScrolled` state:
```typescript
// Listener 1: Raw addEventListener (threshold: 40px)
window.addEventListener("scroll", handleScroll, { passive: true });
// Listener 2: Framer Motion scrollY.on (threshold: 50px)
return scrollY.on("change", (latest) => setIsScrolled(latest > 50));
```
Different thresholds (40px vs 50px) cause a race condition where the scroll state flickers between true/false.

### 2.6 Accessibility Violation: Zoom Disabled
[layout.tsx](file:///c:/Users/user/Documents/tech-nest/src/app/layout.tsx#L57) sets `userScalable: false` and `maximumScale: 1`:
```typescript
maximumScale: 1,
userScalable: false,
```
This **violates WCAG 2.1 Success Criterion 1.4.4** (Resize text) and makes the app unusable for users with visual impairments.

---

## 3. Layout & Spacing Improvements

### 3.1 No Consistent Spacing Scale
The current spacing is arbitrary across sections:

| Location | Vertical Spacing | Pattern |
|----------|-----------------|---------|
| Hero section | `pt-[22vh] pb-[10vh]` | Viewport-based, unpredictable |
| Trending section | `py-24` | Fixed 96px |
| Categories section | `py-24` | Fixed 96px |
| Comparisons section | `py-24` | Fixed 96px |
| Trust section | `py-24` | Fixed 96px |
| Device page spacers | `<div className="h-32">` | Raw 128px empty divs |
| Footer | `mt-20`, `py-12 md:py-16` | Mixed |

**Problems:**
- The **hero uses viewport percentages** while every other section uses fixed rem — on a 4K monitor, the hero will have a massive top gap
- Device page uses `<div className="h-32"></div>` as explicit spacer divs (lines 29, 35, 41 of device page), which is an anti-pattern — spacing should be structural, not empty elements
- The `compare/[slugs]` page uses `<div className="h-24"></div>` and `<div className="h-16"></div>` — different spacing than the device page

**Recommendation:** Adopt a consistent section spacing token:
```
--section-gap-sm: 4rem    (64px)
--section-gap-md: 6rem    (96px)
--section-gap-lg: 8rem    (128px)
```
Remove all empty `<div className="h-XX">` spacer elements. Apply spacing through section `padding-block` or `gap` within flex containers.

### 3.2 Container Width Inconsistency
Different pages use different `max-w-*` constraints:

| Surface | Max Width |
|---------|-----------|
| Home sections | `max-w-7xl` (80rem) |
| Device scores | `max-w-6xl` (72rem) |
| Device AI insights | `max-w-5xl` (64rem) |
| Compare detail | `max-w-5xl` (64rem) |
| Search | `max-w-5xl` (64rem) |
| Decision wizard | `max-w-2xl` (42rem) → then `max-w-7xl` |

Premium products like Linear and Stripe use **one primary content width** (typically 1120–1200px) with occasional narrow variants for focused reading. Tech Nest oscillates between three widths without clear reasoning.

### 3.3 Card Padding Inconsistency
- [DecisionCard](file:///c:/Users/user/Documents/tech-nest/src/features/devices/device-card.tsx#19-96): `p-6` internally
- Comparison cards (home): `p-8`
- Category cards: `p-8`
- Device specs cards: `p-8 rounded-4xl`
- AI Insights card: `p-10 md:p-16`
- Device scores card: `p-8 lg:p-10`

**Recommendation:** Standardize card padding to `p-6` for compact cards and `p-8` for feature cards. Never `p-10`, never `p-16` — these create visual voids.

---

## 4. Typography Improvements

### 4.1 Heading Hierarchy is Broken
The heading system violates semantic HTML structure:

| Component | Issue |
|-----------|-------|
| [trust-section.tsx](file:///c:/Users/user/Documents/tech-nest/src/features/home/trust-section.tsx) | Uses `<h2>` for section title, `<h3>` for sub-items — correct |
| [device-ai-insights.tsx](file:///c:/Users/user/Documents/tech-nest/src/features/device/device-ai-insights.tsx) | Uses `<h3>` for main heading, `<h5>` for sub-headings — **skips h4** |
| [device-scores.tsx](file:///c:/Users/user/Documents/tech-nest/src/features/device/device-scores.tsx) | Uses `<h3>` for "Tech Nest Score", `<h4>` for "Category Breakdown" — but section has no `<h2>` |
| `compare/[slugs]/page.tsx` | Uses `<h1>` "Matchup", `<h2>` for device names, `<h3>` for both "Final Verdict" AND "Hardware Specifications" — correct nesting but redundant `<h3>` weight |
| [comparisons-section.tsx](file:///c:/Users/user/Documents/tech-nest/src/features/home/comparisons-section.tsx) | Section heading is `<h2>`, but score numbers use `<span>` — correct, scores aren't headings |
| [ComparisonHero.tsx](file:///c:/Users/user/Documents/tech-nest/src/components/compare/ComparisonHero.tsx) | Using `<h1>` and `<h2>` in a `"use client"` component embedded within a page that likely has its own `<h1>` |

**Critical:** Multiple pages may render **multiple `<h1>` elements**. The homepage [page.tsx](file:///c:/Users/user/Documents/tech-nest/src/app/page.tsx) wraps sections that each could inject headings, and the [ComparisonHero.tsx](file:///c:/Users/user/Documents/tech-nest/src/components/compare/ComparisonHero.tsx) has its own `<h1>`. Screen readers and SEO crawlers cannot determine the primary topic.

### 4.2 Font Weight Chaos
The codebase uses six different weight strategies, but they don't form a clear hierarchy:

| Weight | Usage | Problem |
|--------|-------|---------|
| `font-semibold` | Headings, labels, brand names, buttons, scores | Overused — applied to 50+ elements |
| `font-medium` | Buttons, nav links, card content, prices | Secondary weight shares meaning with `font-semibold` |
| `font-bold` | Score badges, sub-labels | Rarely used, inconsistent |
| `font-light` | Body/subtitle text | Correct for subtitles but contrast concern on light mode |
| `text-sm font-bold` | All-caps micro-labels ("USD Cap", "TRENDING") | Mixing bold weight with small type creates visual noise |
| `text-xs font-semibold uppercase tracking-widest` | Category labels | Correct usage, but repeated inline instead of being a utility class |

**The `font-semibold` epidemic**: When everything is bold, nothing is bold. Tech Nest applies `font-semibold` to headings, sub-headings, labels, chip text, and footer headers equally, destroying typographic hierarchy.

**Recommendation:** Strip `font-semibold` from all labels and secondary text. Reserve it exclusively for H1 and H2. Use `font-medium` for H3/H4 and interactive elements. Use `font-normal` for body and labels.

### 4.3 Inconsistent Text Size Scale
- Hero headline: `text-5xl md:text-7xl lg:text-[5.5rem]` — uses a custom `5.5rem`, breaking Tailwind's scale
- Decision AI result title: `text-5xl md:text-7xl`
- Section headings: all `text-3xl` except Recommendations which is `text-4xl md:text-5xl`
- Device hero H1: `text-5xl md:text-7xl`
- Compare hero H1: `text-4xl md:text-5xl lg:text-6xl`

### 4.4 Duplicate Font Definitions
[layout.tsx](file:///c:/Users/user/Documents/tech-nest/src/app/layout.tsx#L14-L22) loads Geist as both `fontSans` and `fontHeading` — **they are the same font**, just mapped to different CSS variables. Meanwhile, [package.json](file:///c:/Users/user/Documents/tech-nest/package.json) also installs `@fontsource/inter` and `@fontsource/inter-tight` which are **never used**.

---

## 5. Color System Improvements

### 5.1 Well-Structured Foundation, Poor Execution
The CSS custom properties in [globals.css](file:///c:/Users/user/Documents/tech-nest/src/app/globals.css) are thoughtfully designed with semantic naming (`--text-primary`, `--bg-secondary`, `--surface-elevated`). However:

- **`--accent`** is set to `#111111` in light mode and `#FFFFFF` in dark mode — it's just the text color. This means "accent" styling (hover states, active states, focus rings) looks identical to regular text. Premium products like Linear use a distinct **blue/purple accent** (`#5E6AD2`) to differentiate interactive elements.
- The accent system in the dark theme is **pure white** — all accent indicators, buttons, badges, and focus states blend with body text
- Some components reference `text-brand` (SearchPalette line 269, 272) and `bg-brand/10` (line 269) — **these tokens don't exist** in the theme system

### 5.2 Off-System Color Usage
Despite the careful token system, several components use raw colors directly:
- `text-amber-500` — used in Decision AI, Trust section (Zap icon), Navbar Sign In button hover
- `text-emerald-500` — used in Strengths icon (device AI insights), verdict blur
- `text-blue-400` — used for active nav indicator (Navbar line 110)
- `bg-linear-to-tr from-accent to-amber-500/50` — Decision result card gradient

These raw colors aren't defined as theme tokens, will clash with the theme in edge cases, and create visual inconsistency.

### 5.3 Contrast Concerns
- `text-text-secondary/60` — the 404 page support text uses `text-text-secondary` (which is already `#6E6E73` on light) at **60% opacity**, creating a contrast ratio of approximately **2.5:1** against `#FBFBFD` background. WCAG AA requires 4.5:1.
- `font-light` on subtitle text further reduces perceived contrast
- `opacity-50` and `opacity-60` are applied to multiple interactive elements (trending pills, category labels, weakness dots), making them appear disabled

---

## 6. Component Design Improvements

### 6.1 Duplicate Card Implementations
There are **three parallel card systems** that should be unified:

1. **[Card](file:///c:/Users/user/Documents/tech-nest/src/features/devices/device-card.tsx#19-96) component** ([card.tsx](file:///c:/Users/user/Documents/tech-nest/src/components/ui/card.tsx)) — reusable [Card](file:///c:/Users/user/Documents/tech-nest/src/features/devices/device-card.tsx#19-96)/`CardHeader`/`CardContent` with consistent styling
2. **[DecisionCard](file:///c:/Users/user/Documents/tech-nest/src/features/devices/device-card.tsx#19-96) component** ([device-card.tsx](file:///c:/Users/user/Documents/tech-nest/src/features/devices/device-card.tsx)) — completely standalone card with its own border/shadow/radius
3. **Inline card markup** — comparison cards, category cards, spec cards are each styled independently in their section files

The [Card](file:///c:/Users/user/Documents/tech-nest/src/features/devices/device-card.tsx#19-96) component is barely used. Most complex cards are built inline with bespoke Tailwind classes, defeating the purpose of a component library.

### 6.2 Duplicate Container Components
There are **three container files**:
- [src/components/layout/Container.tsx](file:///c:/Users/user/Documents/tech-nest/src/components/layout/Container.tsx) (349 bytes)
- [src/components/layout/container_old.tsx](file:///c:/Users/user/Documents/tech-nest/src/components/layout/container_old.tsx) (349 bytes)
- [src/components/ui/container.tsx](file:///c:/Users/user/Documents/tech-nest/src/components/ui/container.tsx) (516 bytes)

The Footer imports from `@/components/ui/container`, while the old file sits unused. This is a refactoring artifact that should be cleaned up.

### 6.3 Button System Gaps
The [Button](file:///c:/Users/user/Documents/tech-nest/src/components/ui/button.tsx#32-40) component offers four variants (`primary`, `secondary`, `outline`, `ghost`), which is solid. However:

- Many buttons throughout the app **don't use the [Button](file:///c:/Users/user/Documents/tech-nest/src/components/ui/button.tsx#32-40) component** at all — they're raw `<button>` elements with inline Tailwind classes
- The Decision AI page has 6 different button styles, none using the [Button](file:///c:/Users/user/Documents/tech-nest/src/components/ui/button.tsx#32-40) component
- The hero search bar uses a raw `<input>` without the shared search component
- CTAs like "Get Recommendation", "Check Prices", "Compute Requirement" all have unique inline styles

### 6.4 ScoreBar Component Issues
[ScoreBar.tsx](file:///c:/Users/user/Documents/tech-nest/src/components/ui/ScoreBar.tsx):
- Scores are `0-100` per the interface, but `Math.round(score / 10)` renders only 10 blocks — so the visual representation loses 90% of precision
- Score value `98` displays as 10 filled blocks (same as `100`), and `89` displays as 9 blocks (same as `85`)
- The component displays **raw score numbers** next to the blocks, creating redundancy — the blocks add nothing

### 6.5 Compare Page Duplicates Two Separate Data Models
The compare landing page (`/compare`) at [compare/page.tsx](file:///c:/Users/user/Documents/tech-nest/src/app/compare/page.tsx) imports [Navbar](file:///c:/Users/user/Documents/tech-nest/src/components/layout/Navbar.tsx#29-169) and [Footer](file:///c:/Users/user/Documents/tech-nest/src/components/layout/Footer.tsx#3-49) directly, **duplicating** the [ConditionalShell](file:///c:/Users/user/Documents/tech-nest/src/components/providers/ConditionalShell.tsx#10-35) that already wraps all non-admin routes. This means the compare page renders Navbar and Footer **twice**.

---

## 7. Motion & Animation Improvements

### 7.1 Appropriate Foundation
The motion system uses sensible defaults:
- Custom easing curve `cubic-bezier(0.16, 1, 0.3, 1)` (`ease-calm`) — a good professional easing
- Framer Motion `AnimatePresence` for search palette and mobile menu
- `animate-in fade-in slide-in-from-bottom` for staggered page load

### 7.2 Issues

**Excessive animation on the Logo:**
The [Logo.tsx](file:///c:/Users/user/Documents/tech-nest/src/components/ui/Logo.tsx) uses spring animations that play **on every render** (no `whileInView` trigger). This means the logo animates every time the component re-renders from scroll state changes. Linear's logo is static in the navbar.

**Inconsistent transition durations:**
| Component | Duration |
|-----------|----------|
| Navbar scroll class changes | `duration-500` |
| Navbar link hovers | `duration-200` |
| Card hovers | `duration-300` |
| Device hero image hover | `duration-700` |
| Trust section pillar hover | `duration-500` |
| AI insights glow | `duration-1000` |

Premium products standardize on 2-3 durations: fast (150ms for hovers), medium (300ms for transforms), and slow (500ms for page transitions).

**`animate-float` in globals.css** is defined but never used. Dead animation code.

**Loading spinner uses `animate-spin`** for the Sparkles icon — this is jarring. A subtle pulse or dot-loading pattern would feel more premium.

---

## 8. Navigation & UX Flow Improvements

### 8.1 Navigation Architecture Conflict
The navbar exposes 4 links: **Discover → /phones**, **Compare**, **Decision AI**, **Trending → /#trending**.

Problems:
- "Discover" goes to `/phones`, but the footer calls it "Discover" and links to `/discover` — **these are different URLs**
- "Trending" links to `/#trending` (an anchor on the homepage) — this is not a standalone page, so clicking it from any other page navigates home first
- The bottom mobile nav has different items than the desktop nav: **Home**, **Search**, **Compare**, **Profile** — no "Discover", no "Decision AI"
- The category section links to `/phones`, `/laptops`, `/wearables`, `/audio`, `/cameras` — but the [(categories)](file:///c:/Users/user/Documents/tech-nest/src/app/page.tsx#8-20) route group only has one child directory, suggesting most of these are broken routes

### 8.2 Device Hero Hardcoded Comparison Link
[device-hero.tsx line 35](file:///c:/Users/user/Documents/tech-nest/src/features/device/device-hero.tsx#L35) always links to `compare/${slug}-vs-galaxy-s24-ultra`. Viewing a Galaxy S24 Ultra would generate `/compare/galaxy-s24-ultra-vs-galaxy-s24-ultra`.

### 8.3 Decision AI Flow: No Way Back
The wizard flow has no "Previous Step" button. Users can only go forward or restart entirely. Step 3 skips to results without an explicit "Back to Step 2" option. A 3-step wizard without back navigation violates basic form UX principles.

### 8.4 Compare Page Renders with No User-Selected Devices
The `/compare` landing page always shows a hardcoded comparison of "iPhone 16 Pro Max vs Galaxy S24 Ultra". There's no device selector that works — the "CHANGE DEVICE" buttons are non-functional `<div>`s with click cursor styling but no `onClick` handler.

### 8.5 Missing "Empty State" Design
If the API returns no devices, the trending section falls back to hardcoded static cards. There's no intentional empty state for:
- No search results
- Failed API calls
- No portfolio items
- No comparison history

---

## 9. Accessibility Improvements

### 9.1 Critical Violations

| Issue | Location | WCAG |
|-------|----------|------|
| Zoom disabled via viewport meta | [layout.tsx](file:///c:/Users/user/Documents/tech-nest/src/app/layout.tsx) line 57 | **1.4.4 Resize Text** — FAIL |
| No focus styles on comparison cards | [comparisons-section.tsx](file:///c:/Users/user/Documents/tech-nest/src/features/home/comparisons-section.tsx) line 20 | **2.4.7 Focus Visible** — FAIL |
| Decorative icons lack `aria-hidden` | Across all `lucide-react` usage | **1.1.1 Non-text Content** |
| `<img>` tag without Next.js `Image` | [device-hero.tsx](file:///c:/Users/user/Documents/tech-nest/src/features/device/device-hero.tsx) line 20, [Navbar.tsx](file:///c:/Users/user/Documents/tech-nest/src/components/layout/Navbar.tsx) line 210 | Performance & a11y |
| Keyboard not trapped in search palette | [SearchPalette.tsx](file:///c:/Users/user/Documents/tech-nest/src/components/search/SearchPalette.tsx) | **2.1.2 No Keyboard Trap** — needs proper modal focus management |
| Range input has no visible label | [decision/page.tsx](file:///c:/Users/user/Documents/tech-nest/src/app/decision/page.tsx) line 100-108 | **1.3.1 Info and Relationships** — FAIL |

### 9.2 Missing ARIA Landmarks
- No `role="navigation"` on the bottom nav
- No `aria-label` distinguishing between the primary navbar and the bottom mobile nav
- The `<main>` tag is included in [ConditionalShell](file:///c:/Users/user/Documents/tech-nest/src/components/providers/ConditionalShell.tsx#10-35) but also repeated in individual page components (device page, compare page, decision page), creating nested `<main>` elements

### 9.3 Color-Only Score Indication
The [ScoreBar](file:///c:/Users/user/Documents/tech-nest/src/components/ui/ScoreBar.tsx#11-70) component communicates scores visually through filled blocks. Users who cannot distinguish the filled vs. unfilled blocks (which differ only in color/opacity) have no alternative representation. Adding the numeric label helps, but the block visualization itself is color-dependent.

---

## 10. Design System Recommendations

### 10.1 Token Gaps to Fill
The current theme system defines only 10 semantic tokens. A production design system needs:

```css
/* Missing tokens needed */
--color-success: ...;        /* For strengths, positive scores */
--color-warning: ...;        /* For weaknesses, alerts */
--color-info: ...;           /* For tips, insights */
--color-brand: ...;          /* Referenced but undefined */
--color-interactive: ...;    /* For links, active nav */
--color-surface-hover: ...;  /* Explicit hover surface */
--shadow-sm: ...;
--shadow-md: ...;
--shadow-lg: ...;
--transition-fast: 150ms;
--transition-normal: 300ms;
--transition-slow: 500ms;
```

### 10.2 Remove Dead Code
| File | Issue |
|------|-------|
| [container_old.tsx](file:///c:/Users/user/Documents/tech-nest/src/components/layout/container_old.tsx) | Exact duplicate, unused |
| [device-grid.tsx](file:///c:/Users/user/Documents/tech-nest/src/features/devices/device-grid.tsx) | 76 bytes, empty/placeholder file |
| [device-service.ts](file:///c:/Users/user/Documents/tech-nest/src/features/devices/device-service.ts) | 64 bytes, empty/placeholder file |
| [device-types.ts](file:///c:/Users/user/Documents/tech-nest/src/features/devices/device-types.ts) | 72 bytes, empty/placeholder file |
| `@fontsource/inter` and `@fontsource/inter-tight` in [package.json](file:///c:/Users/user/Documents/tech-nest/package.json) | Installed but never imported |
| `animate-float` utility in [globals.css](file:///c:/Users/user/Documents/tech-nest/src/app/globals.css) | Defined but never used |
| `ArrowLeft` import in [not-found.tsx](file:///c:/Users/user/Documents/tech-nest/src/app/not-found.tsx) | Imported but never used |

### 10.3 Critical Architecture Recommendations

1. **Create an `ImagePlaceholder` component** that renders a consistent skeleton/loader instead of grey rectangles with text
2. **Unify all cards to use the [Card](file:///c:/Users/user/Documents/tech-nest/src/features/devices/device-card.tsx#19-96) component** from [components/ui/card.tsx](file:///c:/Users/user/Documents/tech-nest/src/components/ui/card.tsx)
3. **Remove duplicate Navbar/Footer imports** from [compare/page.tsx](file:///c:/Users/user/Documents/tech-nest/src/app/compare/page.tsx) (already handled by [ConditionalShell](file:///c:/Users/user/Documents/tech-nest/src/components/providers/ConditionalShell.tsx#10-35))
4. **Create a `SectionContainer` component** that enforces consistent `max-w-*`, `px-*`, and `py-*` patterns
5. **Introduce a distinct accent color** (e.g., `#5E6AD2` like Linear, or Apple's `#0071E3`), and stop using the text color as the accent
6. **Add `aria-label` and keyboard navigation** to the search palette since it visually advertises keyboard support
7. **Remove `userScalable: false`** from the viewport configuration immediately
8. **Replace all raw `<button>` elements** in pages with the [Button](file:///c:/Users/user/Documents/tech-nest/src/components/ui/button.tsx#32-40) component to ensure focus styles, loading states, and variant consistency

### 10.4 Design Quality Score

| Area | Score (1–10) | Notes |
|------|:---:|-------|
| Color system | 6 | Good token foundation, poor accent/brand differentiation |
| Typography | 4 | Font choice is excellent, hierarchy and weight usage are broken |
| Layout & spacing | 4 | Arbitrary spacing, empty div spacers, container width chaos |
| Component consistency | 3 | Three card systems, unused primitives, inline-styled buttons |
| Imagery & media | 1 | Zero product images, placeholder blocks everywhere |
| Interaction design | 3 | Non-functional buttons, no keyboard nav, mock data |
| Motion & animation | 5 | Good easing curves, inconsistent durations, logo re-animates |
| Accessibility | 2 | Zoom disabled, missing ARIA, nested mains, color-only scores |
| Navigation | 4 | Inconsistent nav items across desktop/mobile, broken links |
| Overall premium feel | 3 | Reads as a styled prototype, not a premium product |

---

**Bottom line:** The design system foundation (tokens, typography family, dark mode) is genuinely thoughtful. The gap is in **execution discipline** — enforcing those foundations consistently across every surface, replacing every placeholder with real content, and shipping the keyboard interactions that the UI promises. Fix the imagery, unify the component library, and this product's visual potential is real.
