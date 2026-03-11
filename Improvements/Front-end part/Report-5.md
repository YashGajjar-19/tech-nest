# Tech Nest — Frontend Design System

**Version**: 1.0  
**Last Updated**: March 9, 2026  
**Stack**: Next.js 16 · TailwindCSS v4 · TypeScript · Framer Motion · Lucide Icons  
**Design Philosophy**: Calm · Premium · Minimal · Structured · Information-focused

---

## 1. Design System Overview

### Design Intent

Tech Nest is an intelligent technology decision platform. Every pixel must serve the user's goal: **making confident technology choices**.

The interface draws inspiration from:

| Reference     | What We Take                                     |
|---------------|--------------------------------------------------|
| Apple         | Spatial harmony, typographic restraint, quietness |
| Linear        | Information density done right, monochrome power  |
| Vercel        | Dark mode excellence, surface-based depth          |
| Perplexity    | Content-first layout, reading-optimized hierarchy  |

### Design Principles

1. **Quietness over decoration** — Every element earns its presence. If it doesn't add information, it doesn't belong.
2. **Surface, not shadow** — Depth comes from layered backgrounds and subtle borders, never from heavy shadows or glows.
3. **Typography as structure** — The type scale IS the visual hierarchy. Size and weight differences do the work — not color, not icons, not decoration.
4. **Monochrome foundation** — The neutral palette does 95% of the work. Color is reserved for semantic meaning (AI, success, error).
5. **Motion as feedback** — Animation confirms user actions. It never plays for decoration.
6. **Consistency is premium** — Using the same spacing, the same radius, the same weight in every context IS what makes a product feel expensive.

### System Architecture

```
globals.css (CSS variables / design tokens)
  └─ @theme inline (TailwindCSS v4 token registration)
      └─ Component primitives (button.tsx, card.tsx, etc.)
          └─ Feature components (consume primitives, never bypass)
              └─ Page layouts (compose features into pages)
```

> [!IMPORTANT]
> Every visual decision flows from `globals.css` tokens → Tailwind classes → component primitives → feature components. No component may define its own colors, radii, shadows, or font sizes outside of this chain.

---

## 2. Spacing Scale

### The Scale

Tech Nest uses a **4px base unit** with a curated set of increments. Every spacing value in the product must come from this table.

| Token     | Value  | Tailwind   | Usage                                                   |
|-----------|--------|------------|---------------------------------------------------------|
| `space-1` | 4px    | `1`        | Inline icon gaps, tight label padding                    |
| `space-2` | 8px    | `2`        | Icon-to-text gap, badge padding, list item indent        |
| `space-3` | 12px   | `3`        | Input internal padding, button horizontal condensed      |
| `space-4` | 16px   | `4`        | Default component padding, card content gap              |
| `space-6` | 24px   | `6`        | Card padding, section header-to-content gap, grid gap    |
| `space-8` | 32px   | `8`        | Between related component groups                         |
| `space-12`| 48px   | `12`       | Section header to content body                           |
| `space-16`| 64px   | `16`       | Between major page sections (mobile)                     |
| `space-24`| 96px   | `24`       | Between major page sections (desktop)                    |
| `space-32`| 128px  | `32`       | Hero vertical padding (desktop)                          |

### Spacing Rules

#### Section Spacing (Between Major Sections on a Page)

```
Mobile:   py-16        (64px top and bottom)
Desktop:  md:py-24     (96px top and bottom)
```

**Every section** on every page uses this identical value. No exceptions. This is the single most important spacing rule in the system.

```tsx
// ✅ Correct — every section
<section className="py-16 md:py-24">

// ❌ Wrong — custom section spacing
<section className="pt-20 pb-16 md:pt-32 md:pb-24">
```

#### Section Header to Content

The gap between a section heading and its child content is always:

```
mb-12    (48px)
```

```tsx
// ✅ Correct
<div className="mb-12">
  <h2>Section Title</h2>
  <p>Section description</p>
</div>
<div className="grid ...">
  {/* content */}
</div>

// ❌ Wrong — different gaps per section
<div className="mb-8">   {/* Trending */}
<div className="mb-16">  {/* Compare */}
```

#### Component Internal Padding

| Context                    | Value           | Tailwind           |
|----------------------------|-----------------|--------------------|
| Card padding               | 24px            | `p-6`              |
| Card padding (compact)     | 16px            | `p-4`              |
| Input field padding        | 12px H / 8px V | `px-3 py-2`        |
| Button padding (default)   | 16px H / 8px V | `px-4 py-2`        |
| Button padding (large)     | 32px H / 12px V| `px-8 py-3`        |
| Modal / dialog padding     | 24px            | `p-6`              |
| Navbar horizontal padding  | 16px            | `px-4`             |

#### Grid Gaps

| Context                    | Value      | Tailwind     |
|----------------------------|------------|--------------|
| Card grid                  | 24px       | `gap-6`      |
| Compact list               | 16px       | `gap-4`      |
| Inline elements            | 8px        | `gap-2`      |
| Icon + text                | 8px        | `gap-2`      |
| Section header lines       | 12px       | `gap-3`      |

#### Vertical Rhythm

Body text and content blocks maintain a **24px vertical rhythm** (1.5rem). This means:

- Line height × font size should approximate multiples of 24px
- Margins between paragraphs: `mb-6` (24px)
- Margins between headings and body: `mb-4` (16px)
- Margins between related items in a list: `mb-2` (8px)

---

## 3. Layout Grid System

### Container

All page content flows within a single, centered container:

```
Max width:       1024px           → max-w-5xl
Horizontal pad:  16px mobile      → px-4
                 24px tablet      → sm:px-6
                 32px desktop     → lg:px-8
Centering:       mx-auto
```

```tsx
// The canonical container class string
"mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8"
```

> [!CAUTION]
> There must be ONE container width across the entire product: `max-w-5xl` (1024px). The footer, the navbar content, all sections — everything aligns to the same edge. The existing `max-w-[1200px]` in the footer container MUST be replaced.

### Column Grid

For multi-column layouts within the container:

| Columns | Breakpoint      | Tailwind                               | Usage                          |
|---------|-----------------|----------------------------------------|--------------------------------|
| 1       | Default (mobile)| `grid grid-cols-1`                     | All content stacks             |
| 2       | ≥ 640px         | `sm:grid-cols-2`                       | Card pairs, comparison         |
| 3       | ≥ 1024px        | `lg:grid-cols-3`                       | Card grids, feature grids      |
| 4       | ≥ 1024px        | `lg:grid-cols-4`                       | Dense grids (rarely used)      |

Standard gap: `gap-6`

### Responsive Breakpoints

Tech Nest uses TailwindCSS default breakpoints, with three primary responsive tiers:

| Tier     | Breakpoint | Tailwind Prefix | Layout Behavior                           |
|----------|------------|-----------------|-------------------------------------------|
| Mobile   | 0–639px    | (default)       | Single column, compact spacing             |
| Tablet   | 640–1023px | `sm:`           | Two columns, medium spacing                |
| Desktop  | 1024px+    | `lg:`           | Full layout, generous spacing              |

Only use `md:` (768px) when fine-tuning between tablet layouts. Prefer `sm:` and `lg:` as the primary breakpoints for clarity.

`xl:` and `2xl:` are reserved exclusively for full-bleed hero layouts if needed. They should never affect content width or grid structure.

### Layout Patterns

#### Full-Width Section with Contained Content

```tsx
<section className="py-16 md:py-24">
  <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
    {/* Section content */}
  </div>
</section>
```

#### Two-Column Split (Text + Visual)

```tsx
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
  <div>{/* Text content */}</div>
  <div>{/* Visual content */}</div>
</div>
```

#### Card Grid

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {items.map(item => <Card key={item.id} />)}
</div>
```

---

## 4. Typography System

### Font Stack

| Role     | Font        | Variable          | Tailwind Class  |
|----------|-------------|-------------------|-----------------|
| Sans     | Geist Sans  | `--font-sans`     | `font-sans`     |
| Heading  | Geist Sans  | `--font-heading`  | `font-heading`  |
| Mono     | Geist Mono  | `--font-mono`     | `font-mono`     |

Geist is the sole typeface. The heading variable provides a hook for future refinement without changing components.

### Type Scale

**Strictly 7 levels.** No arbitrary pixel values. No `text-[17px]`. No `text-6xl` next to `text-3xl`.

| Level         | Size      | Line Height | Letter Spacing | Weight         | Tailwind                                                 | Usage                                      |
|---------------|-----------|-------------|----------------|----------------|----------------------------------------------------------|--------------------------------------------|
| **Display**   | 3.5rem    | 1.05        | -0.025em       | `font-semibold`| `text-[3.5rem] leading-[1.05] tracking-[-0.025em]`      | Hero headline only. One per page maximum.  |
| **Title 1**   | 2rem      | 1.2         | -0.02em        | `font-semibold`| `text-[2rem] leading-[1.2] tracking-[-0.02em]`          | Section headings                            |
| **Title 2**   | 1.25rem   | 1.3         | -0.01em        | `font-semibold`| `text-[1.25rem] leading-[1.3] tracking-[-0.01em]`       | Card titles, subsection headings            |
| **Body**      | 1rem      | 1.6         | 0              | `font-normal`  | `text-base leading-relaxed`                              | Paragraphs, descriptions, default text      |
| **Body Small**| 0.875rem  | 1.5         | 0              | `font-normal`  | `text-sm leading-normal`                                 | Secondary descriptions, metadata            |
| **Caption**   | 0.75rem   | 1.4         | 0.02em         | `font-medium`  | `text-xs leading-snug tracking-wide`                     | Labels, badges, timestamps, table headers   |
| **Micro**     | 0.625rem  | 1.3         | 0.05em         | `font-medium`  | `text-[0.625rem] leading-[1.3] tracking-[0.05em]`       | Keyboard shortcuts (⌘K), legal fine print   |

### Responsive Display Sizing

The Display level is the only type that scales across breakpoints:

```
text-[2rem]           → mobile
sm:text-[2.5rem]      → tablet
lg:text-[3.5rem]      → desktop
```

All other levels remain constant across breakpoints. Content reflow handles readability.

### Font Weight Rules

| Weight         | Tailwind          | Usage                                                        |
|----------------|-------------------|--------------------------------------------------------------|
| `600`          | `font-semibold`   | All headings (Display, Title 1, Title 2). Nothing else.      |
| `500`          | `font-medium`     | Emphasized body text, button labels, nav items, captions      |
| `400`          | `font-normal`     | Body text, descriptions, secondary information                |

> [!WARNING]
> **Never use `font-bold` (700)** outside of the logo. Never use `font-light` (300) or `font-thin` (100). The perceptual difference between `font-semibold` and `font-bold` is minimal in Geist — using both creates ambiguity, not hierarchy.

### Typography CSS Variables

Register these in `globals.css` for programmatic access:

```css
:root {
  --text-display:  3.5rem;
  --text-title-1:  2rem;
  --text-title-2:  1.25rem;
  --text-body:     1rem;
  --text-body-sm:  0.875rem;
  --text-caption:  0.75rem;
  --text-micro:    0.625rem;
}
```

### Typography Examples

```tsx
{/* ✅ Hero headline — Display */}
<h1 className="text-[2rem] sm:text-[2.5rem] lg:text-[3.5rem] leading-[1.05] tracking-[-0.025em] font-semibold text-text-primary">
  Find Your Next Device
</h1>

{/* ✅ Section heading — Title 1 */}
<h2 className="text-[2rem] leading-[1.2] tracking-[-0.02em] font-semibold text-text-primary">
  Trending Devices
</h2>

{/* ✅ Card title — Title 2 */}
<h3 className="text-[1.25rem] leading-[1.3] tracking-[-0.01em] font-semibold text-text-primary">
  iPhone 16 Pro
</h3>

{/* ✅ Body text */}
<p className="text-base leading-relaxed text-text-secondary">
  Compare specifications side by side.
</p>

{/* ✅ Label */}
<span className="text-xs leading-snug tracking-wide font-medium text-text-secondary uppercase">
  AI SCORE
</span>
```

---

## 5. Color System

### Design Philosophy

Tech Nest uses a **monochrome-first** palette. The interface should feel like a high-end newspaper — blacks, whites, and grays do the structural work. Color is introduced only for **semantic meaning**.

### Token Architecture

All colors are defined as CSS variables in `globals.css` and registered via `@theme inline` for TailwindCSS v4.

#### Light Mode (:root)

```css
:root {
  /* ── Background Layers ── */
  --bg-primary:        #FBFBFD;    /* Page background — warm off-white */
  --bg-secondary:      #F5F5F7;    /* Recessed areas, alternating sections */

  /* ── Surfaces ── */
  --surface:           #FFFFFF;    /* Card / panel base surface */
  --surface-elevated:  #FFFFFF;    /* Elevated surfaces (depth via shadow) */
  --surface-hover:     #F9F9FB;    /* Hovered interactive surfaces */

  /* ── Borders ── */
  --border-subtle:     rgba(0, 0, 0, 0.06);    /* Default structural border */
  --border-emphasis:   rgba(0, 0, 0, 0.12);    /* Hover, focused borders */

  /* ── Typography ── */
  --text-primary:      #111111;    /* Primary text — deep near-black */
  --text-secondary:    #6E6E73;    /* Secondary text — professional gray */
  --text-tertiary:     #AEAEB2;    /* Placeholder text, disabled text */

  /* ── Interactive ── */
  --accent:            #111111;    /* Primary actions — monochrome */
  --accent-foreground: #FFFFFF;    /* Text on accent backgrounds */

  /* ── Semantic: AI ── */
  --ai:                oklch(0.65 0.15 260);    /* AI features — blue */
  --ai-subtle:         oklch(0.65 0.15 260 / 0.08);    /* AI tinted surface */
  --ai-foreground:     #FFFFFF;

  /* ── Semantic: Status ── */
  --success:           oklch(0.72 0.17 155);    /* Scores, positive states */
  --success-subtle:    oklch(0.72 0.17 155 / 0.08);
  --warning:           oklch(0.75 0.15 75);     /* Caution indicators */
  --warning-subtle:    oklch(0.75 0.15 75 / 0.08);
  --error:             oklch(0.63 0.2 25);      /* Errors, destructive actions */
  --error-subtle:      oklch(0.63 0.2 25 / 0.08);
}
```

#### Dark Mode (.dark)

```css
.dark {
  /* ── Background Layers ── */
  --bg-primary:        #000000;    /* Pure black — infinite depth */
  --bg-secondary:      #0A0A0A;    /* Subtle depth layer */

  /* ── Surfaces ── */
  --surface:           #0A0A0A;    /* Card / panel base */
  --surface-elevated:  #141414;    /* Brightness-elevated surface */
  --surface-hover:     #1A1A1A;    /* Hovered interactive surfaces */

  /* ── Borders ── */
  --border-subtle:     rgba(255, 255, 255, 0.08);    /* Frost boundaries */
  --border-emphasis:   rgba(255, 255, 255, 0.16);    /* Hover, focus */

  /* ── Typography ── */
  --text-primary:      #FAFAFA;    /* Crisp readable white */
  --text-secondary:    #A1A1AA;    /* Muted zinc */
  --text-tertiary:     #52525B;    /* Disabled, placeholder */

  /* ── Interactive ── */
  --accent:            #FFFFFF;    /* Glowing focus */
  --accent-foreground: #000000;

  /* ── Semantic: AI ── */
  --ai:                oklch(0.70 0.15 260);
  --ai-subtle:         oklch(0.70 0.15 260 / 0.10);
  --ai-foreground:     #FFFFFF;

  /* ── Semantic: Status ── */
  --success:           oklch(0.75 0.17 155);
  --success-subtle:    oklch(0.75 0.17 155 / 0.10);
  --warning:           oklch(0.78 0.15 75);
  --warning-subtle:    oklch(0.78 0.15 75 / 0.10);
  --error:             oklch(0.68 0.2 25);
  --error-subtle:      oklch(0.68 0.2 25 / 0.10);
}
```

### Color Usage Rules

> [!IMPORTANT]
> **Naming convention**: Use ONLY the `--text-primary` / `--bg-primary` / `--surface` token family. Do NOT use shadcn's `--foreground` / `--background` / `--card` aliases in component code. Map them in `globals.css` for compatibility, but components reference the Tech Nest tokens exclusively.

| Guideline | Rule |
|-----------|------|
| **Primary text** | Always `text-text-primary`. Never `text-foreground`, never `text-black`, never `text-zinc-900`. |
| **Secondary text** | Always `text-text-secondary`. Never `text-muted-foreground`, never `text-gray-500`. |
| **Page background** | Always `bg-bg-primary`. Never `bg-background`, never `bg-white`. |
| **Card surface** | Always `bg-surface`. Never `bg-card`, never `bg-white`. |
| **Borders** | Always `border-border-subtle`. Never `border-gray-200`, never `border-zinc-800`. |
| **Blue** | ONLY for AI features: AI score, AI verdict, AI badges. Use `text-ai` / `bg-ai-subtle`. Never `text-blue-400`. |
| **Green** | ONLY for positive scores and success states. Use `text-success`. Never `text-green-500`. |
| **Red** | ONLY for errors and destructive actions. Use `text-error`. Never `text-red-500`. |
| **Hardcoded colors** | **Banned.** No `text-blue-400`, `bg-zinc-800/20`, `text-indigo-400`. Every color goes through a CSS variable. |

### Opacity Rules

Only three opacity levels are permitted on text colors:

| Opacity | Tailwind  | Usage                                       |
|---------|-----------|---------------------------------------------|
| 100%    | (default) | Primary text, headings, active elements      |
| 60%     | `/60`     | Secondary text, inactive states              |
| 40%     | `/40`     | Tertiary text, placeholder, disabled         |

> [!WARNING]
> Do not use `/90`, `/80`, `/50`, `/30`, `/20`, `/10`, or `/5` on text-primary. Using 9+ opacity variants for one color is visual noise. Three levels provide sufficient hierarchy.

---

## 6. Border and Shadow System

### Border Thickness

Only ONE border width: `1px` (Tailwind `border`).

Never use `border-2`, `border-4`, or any thicker border. Premium interfaces achieve emphasis through color and background changes, not thicker lines.

### Border Radius Scale

**Four values. No exceptions.**

| Token         | Value   | Tailwind        | Usage                                               |
|---------------|---------|-----------------|-----------------------------------------------------|
| `radius-sm`   | 8px     | `rounded-lg`    | Badges, tags, inline pills, spec table cells         |
| `radius-md`   | 12px    | `rounded-xl`    | Cards, inputs, panels, dropdown menus                |
| `radius-lg`   | 16px    | `rounded-2xl`   | Modal containers, hero feature cards, dialogs        |
| `radius-full` | 9999px  | `rounded-full`  | Buttons, avatars, pill navigation items, search bar  |

```tsx
// ✅ Correct
<Card className="rounded-xl" />          // radius-md
<Button className="rounded-full" />      // radius-full
<dialog className="rounded-2xl" />       // radius-lg

// ❌ Wrong — values outside the scale
<div className="rounded-3xl" />          // ← not in system
<div className="rounded-4xl" />          // ← not in system
<div className="rounded-[2rem]" />       // ← arbitrary value
```

### Shadow System

Shadows are used **sparingly**. The primary depth mechanism is **surface layering** (background color differences) combined with subtle borders.

| Token        | Value                                          | Tailwind      | Usage                                            |
|--------------|-------------------------------------------------|---------------|--------------------------------------------------|
| `shadow-sm`  | `0 1px 2px rgba(0,0,0,0.04)`                   | `shadow-sm`   | Default card resting state (light mode only)     |
| `shadow-md`  | `0 4px 12px rgba(0,0,0,0.06)`                  | `shadow-md`   | Card hover state, dropdown menus (light mode)    |
| `shadow-lg`  | `0 8px 24px rgba(0,0,0,0.08)`                  | `shadow-lg`   | Modals, command palettes, overlays               |

#### Shadow Rules

| Guideline | Rule |
|-----------|------|
| **Dark mode** | Shadows are nearly invisible on dark backgrounds. In dark mode, depth is created entirely by `surface` vs `surface-elevated` background differences. Do NOT increase shadow opacity for dark mode. |
| **Hover elevation** | Cards transition from `shadow-sm` → `shadow-md` on hover. That's the only shadow transition in the system. |
| **Modals and overlays** | Use `shadow-lg` with a backdrop overlay (`bg-black/50`). |
| **No decorative shadows** | Never use `shadow-xl` or `shadow-2xl`. Never use colored shadows. Never use `shadow-premium-md` (undefined). |
| **Flat by default** | If you're unsure whether an element needs a shadow, it doesn't. Start flat; add shadow only if the element overlays another. |

### Border Rules

| Guideline | Rule |
|-----------|------|
| **Default border** | `border border-border-subtle` (1px, 6% opacity) |
| **Hover border** | `hover:border-border-emphasis` (12% opacity) |
| **Focus border** | Use ring instead: `focus-visible:ring-2 ring-accent` |
| **Section separators** | Either use `border-t border-border-subtle` between ALL sections, or use spacing alone between ALL sections. Never mix. |
| **Card borders** | All cards have `border border-border-subtle`. No exceptions. No `border-transparent`. |

---

## 7. Component Tokens

### Buttons

All buttons in the product MUST use the `<Button>` primitive from `components/ui/button.tsx`. Zero inline `<button>` elements with custom styling.

#### Variants

| Variant     | Appearance                                    | Usage                                          |
|-------------|-----------------------------------------------|-------------------------------------------------|
| `primary`   | Solid accent bg, inverted text                | Main CTAs: "Compare Now", "Get Started"          |
| `secondary` | Muted bg, subtle border                       | Secondary actions: "Learn More", "View All"      |
| `outline`   | Transparent bg, visible border                | Tertiary actions: "Cancel", filter toggles       |
| `ghost`     | No bg, no border, hover reveals surface       | Inline actions: nav items, close buttons         |

#### Sizes

| Size      | Height | Padding     | Font Size  | Usage                               |
|-----------|--------|-------------|------------|--------------------------------------|
| `sm`      | 36px   | `px-3`      | 14px       | Inline secondary actions, table rows |
| `default` | 40px   | `px-4`      | 14px       | Standard buttons                     |
| `lg`      | 48px   | `px-8`      | 16px       | Hero CTAs, prominent actions         |
| `icon`    | 40px   | centered    | —          | Icon-only buttons (theme toggle)     |

#### Button Styling Constants

```
Shape:          rounded-full (always)
Transition:     duration-300 ease-calm
Active scale:   active:scale-95
Focus:          focus-visible:ring-2 ring-accent ring-offset-2
Loading:        Loader2 spinner icon, disabled state
```

### Cards

All card-like containers MUST use the `<Card>` primitive from `components/ui/card.tsx`.

#### Card Anatomy

```
┌─────────────────────────────────────┐  ← border border-border-subtle
│  CardHeader                    p-6  │     rounded-xl
│    CardTitle                        │     bg-surface
│    CardDescription                  │
│  CardContent                   p-6  │
│    [Card body content]              │
│  CardFooter                    p-6  │
└─────────────────────────────────────┘  ← shadow-sm (resting)
                                          shadow-md (hover)
```

#### Card Styling Constants

```
Background:     bg-surface
Border:         border border-border-subtle
Radius:         rounded-xl
Shadow:         shadow-sm → hover:shadow-md
Padding:        p-6 (standard), p-4 (compact variant)
Transition:     transition-all duration-300
Hover border:   hover:border-border-emphasis
```

#### Card Variants (via className override)

| Variant       | Modification                          | Usage                           |
|---------------|---------------------------------------|---------------------------------|
| Default       | Standard card.tsx styling             | Device cards, feature cards      |
| Compact       | Override padding to `p-4`             | List items, dense grids          |
| Interactive   | Add `cursor-pointer` + scale hover    | Clickable cards with navigation  |
| Featured      | Use `rounded-2xl` (radius-lg)        | Hero feature spotlights          |

### Input Fields

#### Input Styling Constants

```
Height:         40px (h-10)
Padding:        px-3 py-2
Background:     bg-surface
Border:         border border-border-subtle
Radius:         rounded-xl
Font:           text-sm text-text-primary
Placeholder:    placeholder:text-text-tertiary
Focus:          focus:border-border-emphasis focus:ring-2 focus:ring-accent/20
Transition:     transition-colors duration-200
```

### Search Bar

The search bar is a specialized input with unique treatment:

```
Height:         48px (h-12)
Padding:        pl-12 pr-4 (accommodate search icon)
Background:     bg-bg-secondary
Border:         border border-border-subtle
Radius:         rounded-full
Font:           text-base text-text-primary
Placeholder:    placeholder:text-text-tertiary
Search icon:    Left-aligned, size-5, text-text-tertiary
Shortcut badge: Right-aligned, text-micro, font-mono
Focus:          focus:bg-surface focus:border-border-emphasis
```

### Device Cards (Domain-Specific)

Device cards extend the `<Card>` primitive:

```
Structure:
  Card (rounded-xl, p-0 overflow-hidden)
    ├── Image container (aspect-[4/3], bg-bg-secondary)
    │     └── <Image> with object-contain
    ├── CardContent (p-6)
    │     ├── Category label (Caption level, text-text-secondary, uppercase)
    │     ├── Device name (Title 2 level, text-text-primary)
    │     ├── Price (Body Small level, text-text-secondary)
    │     └── Score badge (Caption level, bg-ai-subtle, text-ai, rounded-lg, px-2 py-1)
    └── CardFooter (p-6 pt-0)
          └── Action button (Button ghost variant)
```

### Score Display

Scores MUST have ONE consistent visual treatment across the entire product:

```
Container:      inline-flex items-center gap-1.5 rounded-lg px-2 py-1
Background:     bg-ai-subtle
Text:           text-xs font-medium text-ai
Icon:           Zap or Star, size-3.5
```

Never display scores as green text, blue badges, or black-on-white pills. One pattern everywhere.

---

## 8. Icon System

### Icon Library

Tech Nest uses **Lucide React** (`lucide-react`) as the sole icon library. No mixing with Heroicons, Phosphor, or custom SVGs unless Lucide lacks a specific icon.

### Icon Sizes

| Token     | Size   | Tailwind   | Usage                                        |
|-----------|--------|------------|----------------------------------------------|
| `icon-sm` | 16px   | `size-4`   | Inline with Body Small text, badges, tags     |
| `icon-md` | 20px   | `size-5`   | Inline with Body text, buttons, nav items     |
| `icon-lg` | 24px   | `size-6`   | Standalone icons, section headers              |
| `icon-xl` | 32px   | `size-8`   | Feature icons, empty states, category icons    |

### Icon Style Rules

| Guideline | Rule |
|-----------|------|
| **Stroke width** | Use Lucide defaults (2px). Never override `strokeWidth` unless creating a custom weight variant. |
| **Color** | Icons inherit text color via `text-current` or match their adjacent text color: `text-text-primary` for primary context, `text-text-secondary` for secondary. |
| **Alignment** | Icons always vertically center with their adjacent text via `items-center`. Use `gap-2` (8px) between icon and text. |
| **Decorative vs semantic** | Decorative icons (bullets, section ornaments): `aria-hidden="true"`. Semantic icons (action buttons without text): must have `aria-label`. |
| **Interactive icons** | Always wrapped in `<Button variant="ghost" size="icon">`. Never a naked clickable SVG. |
| **Filled vs outlined** | Use outline (stroke) style by default. Never use filled variants unless representing a "selected" state (e.g., filled heart = favorited). |

### Icon + Text Patterns

```tsx
{/* ✅ Icon beside text */}
<span className="inline-flex items-center gap-2 text-text-secondary">
  <Search className="size-4" />
  Search devices
</span>

{/* ✅ Icon button */}
<Button variant="ghost" size="icon" aria-label="Toggle theme">
  <Sun className="size-5" />
</Button>

{/* ❌ Wrong — bare SVG as clickable element */}
<Search onClick={handleClick} className="cursor-pointer" />
```

---

## 9. Motion Design System

### Design Philosophy

Motion in Tech Nest follows the principle: **confirm, don't decorate**. Every animation must answer user action or communicate state change. Ambient animations (floating, pulsing, glowing) are explicitly banned.

### Easing Curves

**Two curves. No others.**

| Token       | Value                               | CSS Variable  | Usage                                        |
|-------------|-------------------------------------|---------------|----------------------------------------------|
| `ease-out`  | `cubic-bezier(0.16, 1, 0.3, 1)`    | `--ease-out`  | Standard: hover, expand, enter, transitions   |
| `ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | `--ease-spring` | Emphasis: button press feedback, toast entry |

`ease-out` handles 95% of all animations. `ease-spring` is reserved for moments that need subtle bounce.

```css
@utility ease-calm {
  transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
}

@utility ease-spring {
  transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

### Durations

**Three durations. No others.**

| Token           | Value  | Tailwind        | Usage                                        |
|-----------------|--------|-----------------|----------------------------------------------|
| `duration-fast` | 150ms  | `duration-150`  | Color changes, opacity, hover states          |
| `duration-base` | 250ms  | `duration-250`  | Layout shifts, expand/collapse, page transitions |
| `duration-slow` | 400ms  | `duration-400`  | Complex orchestrated animations only          |

> [!WARNING]
> **Banned durations**: `duration-500`, `duration-700`, `duration-1000`. If an animation needs more than 400ms, it's too complex — simplify the animation, not the timing.

### Standard Transitions

| Interaction          | Properties                  | Duration       | Easing       |
|----------------------|-----------------------------|----------------|--------------|
| Button hover         | `background-color, color`   | `duration-150` | `ease-calm`  |
| Button active press  | `transform` (scale-95)      | `duration-150` | `ease-spring`|
| Card hover           | `shadow, border-color`      | `duration-250` | `ease-calm`  |
| Link hover           | `color, opacity`            | `duration-150` | `ease-calm`  |
| Dropdown open        | `opacity, transform`        | `duration-250` | `ease-calm`  |
| Modal enter          | `opacity, transform`        | `duration-250` | `ease-calm`  |
| Modal exit           | `opacity`                   | `duration-150` | `ease-calm`  |
| Accordion expand     | `max-height`                | `duration-250` | `ease-calm`  |
| Page section enter   | `opacity, translateY(8px)`  | `duration-400` | `ease-calm`  |

### Framer Motion Presets

Define reusable motion variants for consistent Framer Motion usage:

```tsx
// lib/motion.ts

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
}

export const fadeInUp = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
}

export const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.08,
    },
  },
}

export const scalePress = {
  whileTap: { scale: 0.95 },
  transition: { duration: 0.15, ease: [0.34, 1.56, 0.64, 1] },
}
```

### Page Section Entry Choreography

Sections on the home page enter with staggered `fadeInUp`:

```tsx
<motion.section
  initial={{ opacity: 0, y: 8 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-100px" }}
  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
>
```

Stagger each section by `0.1s` delay increment.

### Loading States

| State             | Animation                                                   |
|-------------------|--------------------------------------------------------------|
| Skeleton          | `bg-bg-secondary animate-pulse rounded-xl`                  |
| Spinner           | `<Loader2 className="size-5 animate-spin" />`               |
| Content shimmer   | Linear gradient sweep from left to right, 1.5s loop          |

### Banned Animations

| Animation               | Reason                                                    |
|--------------------------|----------------------------------------------------------|
| `animate-float`          | Decorative ambient motion — web 2.0 pattern               |
| `animate-bounce`         | Distracting, never appropriate for premium interfaces     |
| Background glow pulses   | Visual noise; depth through surfaces, not color pollution |
| Parallax scrolling       | Adds complexity without information                       |
| Auto-rotating carousels  | User should control pace of content consumption          |

---

## 10. Information Density & Design Consistency Rules

### Information Density

#### Density Guidelines

| Zone           | Density Level | Approach                                              |
|----------------|---------------|-------------------------------------------------------|
| Hero           | Low           | One headline, one subtitle, one CTA. Maximum whitespace. |
| Landing sections| Medium        | 3–4 content cards per row. Clear section headers.      |
| Device detail  | High          | Dense spec tables, but organized into collapsible groups. |
| Comparison     | High          | Side-by-side data, minimally decorated.                |
| Search results | Medium-High   | List layout, scannable metadata, no heavy images.      |
| Dashboards     | High          | Dense but organized — use consistent card grids.       |

#### Density Rules

1. **No section should feel empty.** If a section has only a title and a subtitle with vast whitespace below, it lacks purpose. Either add content or remove the section.
2. **No section should feel overwhelming.** If scanning a section takes more than 3 seconds, it has too much competing information. Group related items, or break into subsections.
3. **Card content limit:** A single card should contain at most: 1 image, 1 title, 1 description line, 2 metadata items, and 1 action. Beyond that, the card needs a detail page.
4. **Grid maximum:** No more than 4 columns on desktop, 2 on tablet, 1 on mobile. Dense grids with 5+ columns become unreadable.
5. **Readable line length:** Body text should never exceed 65 characters per line. The `max-w-5xl` container with `text-base` naturally achieves this. If a text block stretches wider, constrain it with `max-w-2xl` or `max-w-prose`.

### Design Consistency Rules

#### Component Reuse

| Rule | Enforcement |
|------|-------------|
| **Every button = `<Button>`** | No inline `<button>` elements with custom classes. Period. |
| **Every card = `<Card>`** | No `<div>` with card-like styling. Use the primitive. |
| **Every container = canonical class** | `mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8` |
| **Every input = `<Input>`** | Consistent height, padding, border, radius. |
| **Every icon button = `<Button variant="ghost" size="icon">`** | No bare SVGs as interactive elements. |

#### Spacing Discipline

| Rule | Detail |
|------|--------|
| **Section spacing is invariant** | `py-16 md:py-24` — same padding for every single section on every page. |
| **Header gaps are invariant** | `mb-12` between section heading group and section content. |
| **Card padding is invariant** | `p-6` standard, `p-4` compact. No other values. |
| **Grid gaps are invariant** | `gap-6` for card grids, `gap-4` for compact lists. |

#### Typography Discipline

| Rule | Detail |
|------|--------|
| **7 sizes only** | Display, Title 1, Title 2, Body, Body Small, Caption, Micro. |
| **No arbitrary pixel sizes** | `text-[17px]`, `text-[15px]`, `text-[11px]` are banned. |
| **3 weights only** | `font-semibold` (headings), `font-medium` (emphasis), `font-normal` (body). |
| **Heading weight is always `font-semibold`** | Never `font-bold`, never `font-medium` on headings. |

#### Visual Simplicity

| Rule | Detail |
|------|--------|
| **No background glows** | No blurred circles, radial gradients as decoration. Depth = surfaces. |
| **No ambient animations** | No floating, pulsing, or auto-playing motion. |
| **3 opacity levels** | 100%, 60%, 40%. No others on any text color. |
| **4 radius values** | `rounded-lg`, `rounded-xl`, `rounded-2xl`, `rounded-full`. |
| **3 shadow levels** | `shadow-sm`, `shadow-md`, `shadow-lg`. That's it. |
| **No hardcoded colors** | Every color routes through CSS variables. No Tailwind color-\* utilities directly. |

#### Token Naming Convention

| ✅ Use These (Tech Nest tokens) | ❌ Never Use These (shadcn defaults) |
|----------------------------------|---------------------------------------|
| `text-text-primary`              | `text-foreground`                     |
| `text-text-secondary`            | `text-muted-foreground`               |
| `bg-bg-primary`                  | `bg-background`                       |
| `bg-surface`                     | `bg-card`                             |
| `border-border-subtle`           | `border-border` (generic)             |

The shadcn default aliases remain in `globals.css` for library compatibility, but **application components always use the Tech Nest semantic names**.

---

## Appendix: Quick Reference Card

### The 5-Second Checker

Before shipping any component, verify:

- [ ] **Colors**: Only `text-text-primary`, `text-text-secondary`, `text-text-tertiary`, `bg-bg-primary`, `bg-surface`, `border-border-subtle` used?
- [ ] **Typography**: Is the font size one of the 7 levels? Is the weight one of 3 values?
- [ ] **Spacing**: Is section padding `py-16 md:py-24`? Is header gap `mb-12`? Is card padding `p-6`?
- [ ] **Radius**: Is it `rounded-lg`, `rounded-xl`, `rounded-2xl`, or `rounded-full`?
- [ ] **Shadow**: Is it `shadow-sm`, `shadow-md`, or `shadow-lg`?
- [ ] **Motion**: Is the easing `ease-calm`? Is the duration 150, 250, or 400ms?
- [ ] **Component**: Is it using `<Button>`, `<Card>`, `<Input>` primitives?
- [ ] **Icon**: Is it from Lucide? Is the size `size-4`, `size-5`, `size-6`, or `size-8`?

### Tailwind Class Cheat Sheet

```
/* Section */
section:      py-16 md:py-24
container:    mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8
header-gap:   mb-12

/* Typography */
display:      text-[2rem] sm:text-[2.5rem] lg:text-[3.5rem] leading-[1.05] tracking-[-0.025em] font-semibold
title-1:      text-[2rem] leading-[1.2] tracking-[-0.02em] font-semibold
title-2:      text-[1.25rem] leading-[1.3] tracking-[-0.01em] font-semibold
body:         text-base leading-relaxed font-normal
body-small:   text-sm leading-normal font-normal
caption:      text-xs leading-snug tracking-wide font-medium
micro:        text-[0.625rem] leading-[1.3] tracking-[0.05em] font-medium

/* Colors */
text:         text-text-primary | text-text-secondary | text-text-tertiary
bg:           bg-bg-primary | bg-bg-secondary | bg-surface | bg-surface-elevated
border:       border-border-subtle | border-border-emphasis
semantic:     text-ai | bg-ai-subtle | text-success | text-error | text-warning

/* Radii */
small:        rounded-lg
medium:       rounded-xl
large:        rounded-2xl
pill:         rounded-full

/* Shadows */
resting:      shadow-sm
hover:        shadow-md
overlay:      shadow-lg

/* Motion */
fast:         duration-150 ease-calm
base:         duration-250 ease-calm
slow:         duration-400 ease-calm
press:        active:scale-95 duration-150 ease-spring

/* Grid */
cards:        grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6
list:         grid grid-cols-1 gap-4
split:        grid grid-cols-1 lg:grid-cols-2 gap-6 items-center
```
