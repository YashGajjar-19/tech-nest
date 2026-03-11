# Tech Nest — Frontend Architecture Audit & Refactor Plan

> A principal-level, evidence-based audit of every layer of the Tech Nest Next.js frontend.
> Every finding references actual files and line numbers in the codebase.

---

## 1. Frontend Architecture Summary

| Dimension | Current State |
|---|---|
| **Framework** | Next.js 16.1.6, React 19.2.3, TypeScript |
| **Styling** | TailwindCSS 4 with custom CSS variables (theming via [globals.css](file:///c:/Users/user/Documents/tech-nest/src/app/globals.css)) |
| **Animation** | Framer Motion 12 |
| **UI Primitives** | Radix UI + shadcn/ui pattern (CVA + clsx + tailwind-merge) |
| **Auth** | Supabase SSR (cookie-based, middleware guard) |
| **Data Fetching** | Raw [fetch()](file:///c:/Users/user/Documents/tech-nest/src/lib/api.ts#9-28) functions in a monolithic [lib/api.ts](file:///c:/Users/user/Documents/tech-nest/src/lib/api.ts) |
| **State Management** | React Context (Auth, Search, Scroll) — no external store |
| **Routing** | App Router with 11 route segments |
| **Search** | `cmdk`-based palette + custom surface results |

### What's working well
- Clean theme variable system in [globals.css](file:///c:/Users/user/Documents/tech-nest/src/app/globals.css) with sensible light/dark tokens
- Good use of Suspense boundaries on the device detail page
- Strong auth flow with role-based middleware protection
- `features/home/` section orchestrators keep the homepage page file thin

### What's broken at the architectural level
The codebase has **two competing organizational models** (`components/` by-domain vs. `features/` by-feature) that were never reconciled. The `features/` layer was started as a migration target but is **~60% empty stubs**, leaving real code scattered between both directories. Combined with monolithic page files, duplicate components, and every API call hard-coded to `cache: "no-store"`, the result is a codebase that is **difficult to navigate, impossible to scale, and leaves significant performance on the table**.

---

## 2. Major Problems Found

### 🔴 Critical (Must Fix)

| # | Problem | Impact | Evidence |
|---|---|---|---|
| 1 | **Half-abandoned feature-sliced migration** | Developers can't tell where code lives | [features/devices/device-grid.tsx](file:///c:/Users/user/Documents/tech-nest/src/features/devices/device-grid.tsx) = empty stub, `features/comparisons/` = stubs, `features/trending/` = stub, while real implementations live in `components/` |
| 2 | **3 duplicate [Container](file:///c:/Users/user/Documents/tech-nest/src/components/layout/Container.tsx#6-14) components** | Inconsistent max-widths across pages | [layout/Container.tsx](file:///c:/Users/user/Documents/tech-nest/src/components/layout/Container.tsx) (max-w-7xl, px-4→8), [layout/container_old.tsx](file:///c:/Users/user/Documents/tech-nest/src/components/layout/container_old.tsx) (identical copy), [ui/container.tsx](file:///c:/Users/user/Documents/tech-nest/src/components/ui/container.tsx) (max-w-[1200px], px-6) |
| 3 | **2 duplicate [ScoreBar](file:///c:/Users/user/Documents/tech-nest/src/components/device/score-bar.tsx#11-30) components** with different APIs | Visual inconsistency in score displays | [ui/ScoreBar.tsx](file:///c:/Users/user/Documents/tech-nest/src/components/ui/ScoreBar.tsx) (block-based, `score` prop) vs [device/score-bar.tsx](file:///c:/Users/user/Documents/tech-nest/src/components/device/score-bar.tsx) (bar-based, `value`/`max` props) |
| 4 | **2 duplicate [DeviceCard](file:///c:/Users/user/Documents/tech-nest/src/components/device/device-card.tsx#16-79) components** | Different visual styles for the same concept | [components/device/device-card.tsx](file:///c:/Users/user/Documents/tech-nest/src/components/device/device-card.tsx) (uses ui/card + Button) vs [features/devices/device-card.tsx](file:///c:/Users/user/Documents/tech-nest/src/features/devices/device-card.tsx) (manual styling, called [DecisionCard](file:///c:/Users/user/Documents/tech-nest/src/features/devices/device-card.tsx#19-96)) |
| 5 | **[AppReady](file:///c:/Users/user/Documents/tech-nest/src/components/providers/AppReady.tsx#5-25) blocks entire app render** | Blank frame FOUC on every page load | [AppReady.tsx](file:///c:/Users/user/Documents/tech-nest/src/components/providers/AppReady.tsx) returns `null` for the first animation frame |
| 6 | **All API calls use `cache: "no-store"`** | Zero caching, every navigation re-fetches everything | [lib/api.ts](file:///c:/Users/user/Documents/tech-nest/src/lib/api.ts) — all 11 functions |
| 7 | **Admin page is a 485-line monolith** | Unmaintainable, untestable | [admin/page.tsx](file:///c:/Users/user/Documents/tech-nest/src/app/admin/page.tsx) defines [MetricCard](file:///c:/Users/user/Documents/tech-nest/src/app/admin/page.tsx#35-97), [QuickAction](file:///c:/Users/user/Documents/tech-nest/src/app/admin/page.tsx#98-139) inline |

### 🟡 Serious (Should Fix)

| # | Problem | Evidence |
|---|---|---|
| 8 | **[ScrollProvider](file:///c:/Users/user/Documents/tech-nest/src/components/providers/ScrollProvider.tsx#8-23) re-renders entire app on scroll** | [ScrollProvider.tsx](file:///c:/Users/user/Documents/tech-nest/src/components/providers/ScrollProvider.tsx) — `useState` + `useMotionValueEvent` |
| 9 | **[compare/page.tsx](file:///c:/Users/user/Documents/tech-nest/src/app/compare/page.tsx) imports Navbar/Footer** despite [ConditionalShell](file:///c:/Users/user/Documents/tech-nest/src/components/providers/ConditionalShell.tsx#10-35) already rendering them | [compare/page.tsx:3-4](file:///c:/Users/user/Documents/tech-nest/src/app/compare/page.tsx#L3-L4) — double rendering or dead imports |
| 10 | **Conflicting type definitions** | [features/devices/device-types.ts](file:///c:/Users/user/Documents/tech-nest/src/features/devices/device-types.ts) defines `Device { id, name }` shadowing [lib/api.ts](file:///c:/Users/user/Documents/tech-nest/src/lib/api.ts)'s generated OpenAPI type |
| 11 | **Empty `hooks/`, `services/`, `styles/` directories** | Dead scaffolding that misleads developers |
| 12 | **Hardcoded mock data in production components** | [SearchPalette.tsx](file:///c:/Users/user/Documents/tech-nest/src/components/search/SearchPalette.tsx), [SearchSurfaceResults.tsx](file:///c:/Users/user/Documents/tech-nest/src/app/search/SearchSurfaceResults.tsx), [ScoreBreakdown.tsx](file:///c:/Users/user/Documents/tech-nest/src/components/device/ScoreBreakdown.tsx), [decision/page.tsx](file:///c:/Users/user/Documents/tech-nest/src/app/decision/page.tsx) |
| 13 | **[ConditionalShell](file:///c:/Users/user/Documents/tech-nest/src/components/providers/ConditionalShell.tsx#10-35) forces client rendering of all layouts** | Pathname-based branching makes Navbar/Footer client components |
| 14 | **[decision/page.tsx](file:///c:/Users/user/Documents/tech-nest/src/app/decision/page.tsx) is 233 lines of client-side wizard + hardcoded results** | No server data fetching, no separation of form logic from UI |
| 15 | **Inconsistent naming conventions** | PascalCase files ([AIInsight.tsx](file:///c:/Users/user/Documents/tech-nest/src/components/device/AIInsight.tsx)) mixed with kebab-case ([ai-insight.tsx](file:///c:/Users/user/Documents/tech-nest/src/components/decision/ai-insight.tsx)) in the same directory |

---

## 3. Folder Structure Improvements

### Current Structure (Problems)

```
src/
├── app/                    # Routes (some pages are monolithic)
├── components/             # ~93 files organized by domain
│   ├── device/             # 20 files — overlaps with features/device & features/devices
│   ├── compare/            # 7 files — overlaps with features/comparisons
│   ├── home/               # 7 files — overlaps with features/home
│   ├── layout/             # 8 files (dead container_old.tsx)
│   ├── ui/                 # 9 files (primitives)
│   ├── providers/          # 5 files (mixed: shell, auth, search, scroll, appready)
│   ├── search/             # 2 files (14KB SearchPalette)
│   └── ...                 # sections, hero, comparison, decision, analyst, etc.
├── features/               # Half-empty stubs from abandoned migration
│   ├── home/               # ✅ Real code (section orchestrators)
│   ├── device/             # ✅ Real code (detail page sections)
│   ├── devices/            # ⚠️  Mixed (1 real card, rest stubs)
│   └── comparisons/, decision-ai/, trending/  # ❌ All stubs
├── hooks/                  # ❌ Empty
├── services/               # ❌ Empty
├── styles/                 # ❌ Empty
├── lib/                    # API client, utils, Supabase setup
├── config/                 # Site config
├── types/                  # Mixed (generated API types + domain types)
└── utils/                  # 3 small utility functions
```

### Proposed Structure

```
src/
├── app/                        # Routes ONLY — thin orchestrators
│   ├── (public)/               # Route group for public pages
│   │   ├── layout.tsx          # Public shell (Navbar + Footer) — SERVER component
│   │   ├── page.tsx            # Home
│   │   ├── device/[slug]/
│   │   ├── compare/[slugs]/
│   │   ├── search/
│   │   ├── decision/
│   │   ├── (categories)/[category]/
│   │   ├── market/
│   │   ├── portfolio/
│   │   └── profile/
│   ├── admin/                  # Admin route group (own layout)
│   ├── auth/
│   ├── layout.tsx              # Root layout (fonts, providers)
│   └── globals.css
│
├── components/                 # Shared, reusable UI components ONLY
│   ├── ui/                     # Atomic primitives (Button, Card, Dialog, Sheet, etc.)
│   ├── layout/                 # Page-level layout (Container, PageSection, SectionHeader)
│   ├── data-display/           # ScoreBar, ScoreBadge, SpecsTable
│   └── feedback/               # Skeletons, empty states, error boundaries
│
├── features/                   # Domain feature modules (co-located)
│   ├── device/                 # Everything device-related
│   │   ├── components/         # DeviceCard, DeviceHero, AIInsight, Alternatives, etc.
│   │   ├── hooks/              # useDevice, useDeviceDecision
│   │   ├── api.ts              # fetchDeviceById, fetchDeviceDecision
│   │   ├── types.ts            # Device-specific types
│   │   └── index.ts            # Public barrel export
│   ├── compare/
│   │   ├── components/         # ComparisonHero, ComparisonTable, AIVerdict, etc.
│   │   ├── api.ts
│   │   └── index.ts
│   ├── search/
│   │   ├── components/         # SearchPalette, SearchResults
│   │   ├── hooks/              # useSearch
│   │   └── index.ts
│   ├── decision/
│   │   ├── components/         # DecisionWizard, RecommendationCard
│   │   └── index.ts
│   ├── home/                   # Home page sections
│   │   ├── components/         # HeroSection, TrendingSection, etc.
│   │   └── index.ts
│   └── admin/
│       ├── components/         # AdminSidebar, MetricCard, QuickAction, DeviceWizard
│       ├── api.ts              # Admin-specific API calls
│       └── index.ts
│
├── providers/                  # App-level React Context providers
│   ├── auth-provider.tsx
│   ├── search-provider.tsx
│   └── theme-provider.tsx
│
├── lib/                        # Pure utilities and infrastructure
│   ├── api-client.ts           # Typed fetch wrapper with caching config
│   ├── api-types.d.ts          # OpenAPI generated types
│   ├── supabase/
│   ├── auth/
│   └── utils.ts
│
├── config/
│   └── site.ts
│
└── types/                      # Shared TypeScript types
    └── database.ts
```

### Key Changes

1. **Eliminate the `components/` vs `features/` ambiguity** — `components/` becomes shared primitives only, `features/` owns all domain logic
2. **Use Next.js route groups** [(public)/](file:///c:/Users/user/Documents/tech-nest/src/lib/utils.ts#4-11) with a server-rendered layout instead of the client-side [ConditionalShell](file:///c:/Users/user/Documents/tech-nest/src/components/providers/ConditionalShell.tsx#10-35)
3. **Co-locate API calls, types, hooks** inside each feature module
4. **Delete empty directories** (`hooks/`, `services/`, `styles/`)
5. **Delete dead files** ([container_old.tsx](file:///c:/Users/user/Documents/tech-nest/src/components/layout/container_old.tsx), all stub files in `features/`)
6. **Move providers** to their own top-level `providers/` directory

---

## 4. Component Refactoring Strategy

### 4.1 Eliminate Duplicates

| Duplicate Set | Resolution |
|---|---|
| 3× [Container](file:///c:/Users/user/Documents/tech-nest/src/components/layout/Container.tsx#6-14) | Keep [ui/container.tsx](file:///c:/Users/user/Documents/tech-nest/src/components/ui/container.tsx) (supports [as](file:///c:/Users/user/Documents/tech-nest/src/app/admin/page.tsx#140-485) prop, `forwardRef`). Delete [layout/Container.tsx](file:///c:/Users/user/Documents/tech-nest/src/components/layout/Container.tsx) and [layout/container_old.tsx](file:///c:/Users/user/Documents/tech-nest/src/components/layout/container_old.tsx). Standardize `max-w-[1200px] px-6` across the app. |
| 2× [ScoreBar](file:///c:/Users/user/Documents/tech-nest/src/components/device/score-bar.tsx#11-30) | Merge into a single `components/data-display/score-bar.tsx` that supports both bar and block display modes via a `variant` prop. |
| 2× [DeviceCard](file:///c:/Users/user/Documents/tech-nest/src/components/device/device-card.tsx#16-79) | Merge into `features/device/components/device-card.tsx`. Use the [components/ui/card.tsx](file:///c:/Users/user/Documents/tech-nest/src/components/ui/card.tsx) primitive as the base. Support the [DecisionCard](file:///c:/Users/user/Documents/tech-nest/src/features/devices/device-card.tsx#19-96) layout via a prop variant. |
| 2× `device-card` in `components/home/` vs `features/devices/` | [components/home/TrendingDevices.tsx](file:///c:/Users/user/Documents/tech-nest/src/components/home/TrendingDevices.tsx) and [features/home/trending-section.tsx](file:///c:/Users/user/Documents/tech-nest/src/features/home/trending-section.tsx) serve the same purpose → consolidate into `features/home/`. |

### 4.2 Break Up Monolithic Components

| Component | Lines | Action |
|---|---|---|
| [Navbar.tsx](file:///c:/Users/user/Documents/tech-nest/src/components/layout/Navbar.tsx) | 366 | Extract [NavUserButton](file:///c:/Users/user/Documents/tech-nest/src/components/layout/Navbar.tsx#170-273), [MobileMenu](file:///c:/Users/user/Documents/tech-nest/src/components/layout/Navbar.tsx#274-366), `NavLinks` into separate files under `components/layout/nav/`. Extract nav link config to a `nav.config.ts`. |
| [SearchPalette.tsx](file:///c:/Users/user/Documents/tech-nest/src/components/search/SearchPalette.tsx) | 309 | Move to `features/search/components/`. Extract `CATEGORY_NAVIGATION`, `DYNAMIC_PLACEHOLDERS` into config files. Extract result rendering into sub-components. |
| [admin/page.tsx](file:///c:/Users/user/Documents/tech-nest/src/app/admin/page.tsx) | 485 | Extract [MetricCard](file:///c:/Users/user/Documents/tech-nest/src/app/admin/page.tsx#35-97) → `features/admin/components/metric-card.tsx`. Extract [QuickAction](file:///c:/Users/user/Documents/tech-nest/src/app/admin/page.tsx#98-139) → `features/admin/components/quick-action.tsx`. Make the dashboard page a thin composition of these. |
| [decision/page.tsx](file:///c:/Users/user/Documents/tech-nest/src/app/decision/page.tsx) | 233 | Extract the multi-step wizard form into `features/decision/components/decision-wizard.tsx`. Extract the results view into a separate component. |
| [SearchSurfaceResults.tsx](file:///c:/Users/user/Documents/tech-nest/src/app/search/SearchSurfaceResults.tsx) | 281 | Move to `features/search/components/`. Extract `MOCK_RESULTS` and `REFINEMENT_CHIPS` to data files. Make the result card its own component. |

### 4.3 Enforce Component Boundaries

Each component file should follow this contract:

```
Rule                         Target
─────────────────────────────────────
Max lines per file           ~150 (hard limit: 200)
Max props                    8 (beyond that, compose or use context)
One responsibility           Render OR orchestrate, never both
No inline sub-components     In the same file as a page
naming convention            kebab-case files, PascalCase exports
```

---

## 5. State Management Improvements

### Current State Architecture

```
RootLayout
  └── ThemeProvider        ← next-themes (fine)
    └── AppReady           ← ❌ Blocks rendering for 1 frame
      └── AuthProvider     ← ✅ Good auth context, but...
        └── SearchProvider ← ⚠️  Keyboard shortcut logic mixed with state
          └── ScrollProvider ← ❌ Re-renders on every scroll tick
            └── ConditionalShell ← ❌ Client component for layout branching
              └── {page content}
```

### Recommendations

#### Remove [AppReady](file:///c:/Users/user/Documents/tech-nest/src/components/providers/AppReady.tsx#5-25)
The [AppReady](file:///c:/Users/user/Documents/tech-nest/src/components/providers/AppReady.tsx#5-25) component exists solely to set `scrollRestoration = "manual"`. This can be done directly in the root layout with a tiny inline `<script>` tag, avoiding the blank-frame render entirely:

```tsx
// In layout.tsx <head>
<script dangerouslySetInnerHTML={{
  __html: `history.scrollRestoration = "manual";`
}} />
```

#### Remove [ScrollProvider](file:///c:/Users/user/Documents/tech-nest/src/components/providers/ScrollProvider.tsx#8-23)
[ScrollProvider](file:///c:/Users/user/Documents/tech-nest/src/components/providers/ScrollProvider.tsx#8-23) stores scroll progress in `useState`, causing a full re-render of its entire subtree (~every 16ms during scroll). If any component needs scroll progress, use Framer Motion's [useScroll()](file:///c:/Users/user/Documents/tech-nest/src/components/providers/ScrollProvider.tsx#24-25) directly in that component — it doesn't propagate re-renders.

**If you genuinely need shared scroll state**, use `useMotionValue` (which mutates outside React's render cycle) instead of `useState`:

```tsx
const scrollProgress = useMotionValue(0);
// Pass via context — reading it doesn't trigger re-renders
```

#### Replace [ConditionalShell](file:///c:/Users/user/Documents/tech-nest/src/components/providers/ConditionalShell.tsx#10-35) with Route Groups
Instead of client-side pathname branching, use Next.js route groups:

```
app/
  (public)/layout.tsx    → Navbar + Footer (server component)
  admin/layout.tsx       → AdminSidebar (already exists)
```

This eliminates a client component boundary from the critical render path.

#### Consolidate [SearchProvider](file:///c:/Users/user/Documents/tech-nest/src/components/providers/SearchProvider.tsx#14-62)
Move keyboard shortcut logic (`Cmd+K`) out of the provider into the [SearchPalette](file:///c:/Users/user/Documents/tech-nest/src/components/search/SearchPalette.tsx#60-309) component itself. The provider should only expose `{ isOpen, open, close }`. The body overflow lock should be a `useEffect` inside the palette, not the provider.

#### Remove [useAuth()](file:///c:/Users/user/Documents/tech-nest/src/components/providers/AuthProvider.tsx#143-146) dependency for server-fetched data
Currently [AuthProvider](file:///c:/Users/user/Documents/tech-nest/src/components/providers/AuthProvider.tsx#37-142) is a client component. For pages that need the user on the server side (like `profile/`, `portfolio/`), read the session from `lib/supabase/server.ts` directly in the server component instead of relying on the client-side provider.

---

## 6. Data Fetching Improvements

### Current Pattern (All from [lib/api.ts](file:///c:/Users/user/Documents/tech-nest/src/lib/api.ts))

Every function follows this pattern:
```ts
const res = await fetch(url, { cache: "no-store" }); // ← Always no-store
if (!res.ok) return null; // ← Silent failure
return await res.json();  // ← Untyped response
```

### Problems

1. **`cache: "no-store"` everywhere** — Device data, brands, and categories rarely change. This is throwing away Next.js's built-in request deduplication and caching.
2. **Silent error swallowing** — Every `catch` returns `null` or `[]` with no logging. API failures are invisible.
3. **No type safety on responses** — `await res.json()` returns `any` despite having OpenAPI-generated types in [api-types.d.ts](file:///c:/Users/user/Documents/tech-nest/src/lib/api-types.d.ts).
4. **No request deduplication** — The same device can be fetched multiple times in a single render tree via independent component calls.
5. **N+1 fetch on trending** — [trending-section.tsx](file:///c:/Users/user/Documents/tech-nest/src/features/home/trending-section.tsx) fetches 3 devices, then makes 3 additional calls to [fetchDeviceDecision](file:///c:/Users/user/Documents/tech-nest/src/lib/api.ts#40-53) serially.

### Proposed Approach

#### Create a typed API client

```ts
// lib/api-client.ts
async function apiGet<T>(path: string, options?: { revalidate?: number }): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    next: { revalidate: options?.revalidate ?? 300 }, // 5min default
  });
  if (!res.ok) {
    console.error(`[API] ${res.status} ${path}`);
    throw new ApiError(res.status, path);
  }
  return res.json() as T;
}
```

#### Choose caching strategy per data type

| Data Type | Strategy | Revalidation |
|---|---|---|
| Device listing | `next: { revalidate: 300 }` | 5 min |
| Device detail | `next: { revalidate: 300 }` | 5 min |
| AI decision/verdict | `next: { revalidate: 3600 }` | 1 hour |
| Comparison results | `next: { revalidate: 600 }` | 10 min |
| Search results | `cache: "no-store"` | Real-time |
| Admin metrics | `cache: "no-store"` | Real-time |

#### Co-locate API functions in feature modules

Move device-related fetchers to `features/device/api.ts`, comparison fetchers to `features/compare/api.ts`, admin fetchers to `features/admin/api.ts`. The central [lib/api.ts](file:///c:/Users/user/Documents/tech-nest/src/lib/api.ts) becomes only the base `apiGet`/`apiPost` wrapper.

#### Fix the N+1 fetch

The trending section should use a single batch endpoint or `Promise.all` with parallel fetches:

```ts
const [devices, ...decisions] = await Promise.all([
  fetchDevices(undefined, 3),
  ...deviceIds.map(id => fetchDeviceDecision(id)),
]);
```

---

## 7. Performance Optimizations

### 7.1 [AppReady](file:///c:/Users/user/Documents/tech-nest/src/components/providers/AppReady.tsx#5-25) FOUC Fix
**Impact: Critical** — Every page load renders a blank frame.
**Fix:** Remove [AppReady](file:///c:/Users/user/Documents/tech-nest/src/components/providers/AppReady.tsx#5-25) entirely. Replace with inline `<script>` for scroll restoration.

### 7.2 [ScrollProvider](file:///c:/Users/user/Documents/tech-nest/src/components/providers/ScrollProvider.tsx#8-23) Re-render Storm
**Impact: High** — Every scroll event re-renders the full component tree.
**Fix:** Remove or replace with `useMotionValue`-based context (no React re-renders). If no consumers exist, just delete it.

### 7.3 Client Component Boundary Creep
**Impact: High** — [ConditionalShell](file:///c:/Users/user/Documents/tech-nest/src/components/providers/ConditionalShell.tsx#10-35) forces all layout children to render on the client.

Components currently marked `"use client"` that could be server components:
- [compare/page.tsx](file:///c:/Users/user/Documents/tech-nest/src/app/compare/page.tsx) — only uses `"use client"` because it imports from client-side compare components, but the page itself has no interactivity
- [not-found.tsx](file:///c:/Users/user/Documents/tech-nest/src/app/not-found.tsx) — pure static HTML (already a server component ✅)
- Most `features/home/` sections only use client features for animation — these could use `Suspense` + server fetching

### 7.4 Bundle Size
| Concern | File | Size | Action |
|---|---|---|---|
| Framer Motion on admin pages | [admin/page.tsx](file:///c:/Users/user/Documents/tech-nest/src/app/admin/page.tsx) | Uses `motion`, `AnimatePresence` | Admin doesn't need complex animations — use CSS transitions |
| `ogl` dependency | [package.json](file:///c:/Users/user/Documents/tech-nest/package.json) | WebGL library | Verify this is used anywhere. If only for a hero effect, lazy-load it |
| `date-fns` | [package.json](file:///c:/Users/user/Documents/tech-nest/package.json) | Full library | Verify usage, use tree-shakeable imports: `import { format } from 'date-fns/format'` |

### 7.5 Image Optimization
The codebase uses raw `<img>` tags in many places (e.g., [device-hero.tsx:20](file:///c:/Users/user/Documents/tech-nest/src/features/device/device-hero.tsx#L20), [device-card.tsx:30](file:///c:/Users/user/Documents/tech-nest/src/components/device/device-card.tsx#L29-L33)) instead of Next.js `<Image>`. This misses:
- Automatic WebP/AVIF conversion
- Lazy loading
- Responsive `srcset`
- CLS prevention via `width`/`height`

**Fix:** Replace all `<img>` with `next/image` across the codebase, using the already-configured `images.remotePatterns` for Unsplash.

---

## 8. UI System Improvements

### 8.1 Missing Shared Abstractions

The codebase is missing several reusable components that would eliminate repeated patterns:

| Abstraction | Repeated Pattern | Occurrences |
|---|---|---|
| `PageSection` | `<section className="py-24 px-6 max-w-7xl mx-auto w-full">` | 8+ sections on home, device, compare pages |
| `SectionHeader` | Two implementations exist: [components/sections/section-header.tsx](file:///c:/Users/user/Documents/tech-nest/src/components/sections/section-header.tsx) and inline in every section. | ~15 section headings |
| `EmptyState` | Various ad-hoc "no data" fallbacks with hardcoded mock data | 5+ components |
| `ErrorBoundary` | No error boundaries exist anywhere | Every feature section |
| `ScoreBadge` | The inline pill `<span className="text-xl font-medium ... bg-text-primary text-surface px-2 py-0.5 rounded">` | Used in both device card variants |

### 8.2 Proposed Shared Components

```tsx
// components/layout/page-section.tsx
export function PageSection({ children, className, id }: Props) {
  return (
    <section id={id} className={cn("py-24 w-full", className)}>
      <Container>{children}</Container>
    </section>
  );
}

// components/data-display/score-badge.tsx
export function ScoreBadge({ score, size }: Props) { ... }

// components/feedback/empty-state.tsx
export function EmptyState({ icon, title, description, action }: Props) { ... }

// components/feedback/error-boundary.tsx
export class FeatureErrorBoundary extends React.Component { ... }
```

### 8.3 Inconsistent Design Token Usage

Some components use the custom theme tokens (`text-primary`, `bg-surface`), while others use shadcn/Tailwind defaults (`text-foreground`, `bg-secondary`):

| Token Used | Where | Should Be |
|---|---|---|
| `text-foreground` | [ScoreBreakdown.tsx](file:///c:/Users/user/Documents/tech-nest/src/components/device/ScoreBreakdown.tsx), [not-found.tsx](file:///c:/Users/user/Documents/tech-nest/src/app/not-found.tsx) | `text-text-primary` |
| `bg-secondary` | [ScoreBreakdown.tsx](file:///c:/Users/user/Documents/tech-nest/src/components/device/ScoreBreakdown.tsx) | `bg-bg-secondary` |
| `text-muted-foreground` | [ScoreBreakdown.tsx](file:///c:/Users/user/Documents/tech-nest/src/components/device/ScoreBreakdown.tsx) | `text-text-secondary` |

**Fix:** Audit every component for token usage and enforce custom tokens over generic Tailwind tokens. Consider a lint rule or eslint plugin to catch this.

---

## 9. Routing Improvements

### Current Routing Issues

1. **[compare/page.tsx](file:///c:/Users/user/Documents/tech-nest/src/app/compare/page.tsx)** is `"use client"` with no dynamic segments, yet imports Navbar/Footer (already rendered by [ConditionalShell](file:///c:/Users/user/Documents/tech-nest/src/components/providers/ConditionalShell.tsx#10-35)). This may cause double-rendering of the chrome.

2. **`compare/[slugs]`** exists as a catch-all but the main `/compare` page itself is a static demo. The relationship between these two routes is unclear.

3. **No `loading.tsx` files** — Only the device page uses `Suspense`. Other pages have no streaming/loading states, meaning route transitions appear frozen.

4. **[(categories)/[category]](file:///c:/Users/user/Documents/tech-nest/src/lib/utils.ts#4-11)** — Route group with parentheses but only one child — no benefit from the grouping.

5. **No `error.tsx` files** — There are no error boundaries at the route level. If an API call fails during SSR, the entire page crashes.

### Proposed Routing Architecture

```
app/
├── (public)/                   ← Route group with shared Navbar+Footer layout
│   ├── layout.tsx              ← Server component: Navbar + Footer
│   ├── page.tsx                ← Home (thin)
│   ├── loading.tsx             ← Home loading state
│   ├── error.tsx               ← Home error boundary
│   ├── device/
│   │   └── [slug]/
│   │       ├── page.tsx
│   │       ├── loading.tsx
│   │       └── error.tsx
│   ├── compare/
│   │   ├── page.tsx            ← Compare landing/entry
│   │   └── [slugs]/
│   │       ├── page.tsx        ← Comparison results
│   │       ├── loading.tsx
│   │       └── error.tsx
│   ├── search/
│   │   └── page.tsx
│   ├── decision/
│   │   └── page.tsx
│   ├── category/
│   │   └── [slug]/
│   │       └── page.tsx
│   ├── market/
│   ├── portfolio/
│   └── profile/
│
├── admin/
│   ├── layout.tsx              ← Existing AdminSidebar layout
│   ├── page.tsx                ← Dashboard (refactored)
│   ├── devices/
│   ├── ai/
│   └── ...
│
├── auth/
├── layout.tsx                  ← Root: fonts, theme, auth providers
├── globals.css
├── not-found.tsx
└── error.tsx                   ← Global error boundary
```

### Key Changes
1. **[(public)/layout.tsx](file:///c:/Users/user/Documents/tech-nest/src/lib/utils.ts#4-11)** replaces [ConditionalShell](file:///c:/Users/user/Documents/tech-nest/src/components/providers/ConditionalShell.tsx#10-35) — server-rendered, no client JS for layout
2. **Every dynamic route** gets `loading.tsx` and `error.tsx`
3. **Rename [(categories)/[category]](file:///c:/Users/user/Documents/tech-nest/src/lib/utils.ts#4-11)** to `category/[slug]` for clarity
4. **[compare/page.tsx](file:///c:/Users/user/Documents/tech-nest/src/app/compare/page.tsx)** drops its redundant Navbar/Footer imports

---

## 10. Long-Term Maintainability Plan

### Phase 1: Foundation Cleanup (Week 1)

> [!IMPORTANT]
> These changes are prerequisites for everything else. Do them first.

- [ ] Delete dead code: [container_old.tsx](file:///c:/Users/user/Documents/tech-nest/src/components/layout/container_old.tsx), all stub files in `features/`, empty `hooks/`, `services/`, `styles/` dirs
- [ ] Consolidate [Container](file:///c:/Users/user/Documents/tech-nest/src/components/layout/Container.tsx#6-14) → single source of truth in [components/ui/container.tsx](file:///c:/Users/user/Documents/tech-nest/src/components/ui/container.tsx)
- [ ] Consolidate [ScoreBar](file:///c:/Users/user/Documents/tech-nest/src/components/device/score-bar.tsx#11-30) → single component with `variant` prop
- [ ] Consolidate [DeviceCard](file:///c:/Users/user/Documents/tech-nest/src/components/device/device-card.tsx#16-79) → single component in `features/device/`
- [ ] Remove [AppReady](file:///c:/Users/user/Documents/tech-nest/src/components/providers/AppReady.tsx#5-25) → inline `<script>` for scroll restoration
- [ ] Remove or fix [ScrollProvider](file:///c:/Users/user/Documents/tech-nest/src/components/providers/ScrollProvider.tsx#8-23)
- [ ] Standardize file naming to kebab-case throughout

### Phase 2: Architecture Migration (Week 2-3)

- [ ] Implement [(public)](file:///c:/Users/user/Documents/tech-nest/src/lib/utils.ts#4-11) route group with server-rendered layout
- [ ] Remove [ConditionalShell](file:///c:/Users/user/Documents/tech-nest/src/components/providers/ConditionalShell.tsx#10-35)
- [ ] Create typed API client with per-route caching strategy
- [ ] Move API functions from [lib/api.ts](file:///c:/Users/user/Documents/tech-nest/src/lib/api.ts) to feature modules
- [ ] Break up [Navbar.tsx](file:///c:/Users/user/Documents/tech-nest/src/components/layout/Navbar.tsx) into sub-components
- [ ] Break up [admin/page.tsx](file:///c:/Users/user/Documents/tech-nest/src/app/admin/page.tsx) into feature components
- [ ] Replace `<img>` with `next/image` across the codebase
- [ ] Add `loading.tsx` to every route
- [ ] Add `error.tsx` to every route

### Phase 3: UI System (Week 3-4)

- [ ] Create `PageSection`, `SectionHeader`, `EmptyState`, `ErrorBoundary` shared components
- [ ] Audit and enforce consistent design token usage (no mixed `text-foreground` + `text-text-primary`)
- [ ] Remove hardcoded mock data from production components — replace with proper empty states
- [ ] Consolidate [SearchProvider](file:///c:/Users/user/Documents/tech-nest/src/components/providers/SearchProvider.tsx#14-62) (move keyboard logic to palette)

### Phase 4: Performance & Polish (Week 4)

- [ ] Audit bundle with `@next/bundle-analyzer`
- [ ] Verify `ogl` usage and lazy-load or remove
- [ ] Tree-shake `date-fns` imports
- [ ] Remove Framer Motion from admin pages
- [ ] Add barrel exports (`index.ts`) to all feature modules
- [ ] Add ESLint rules to enforce the architecture (no cross-feature imports, no `<img>` tags)

### Guiding Principles Going Forward

1. **One directory model**: Features own domain code; `components/` is for shared primitives only.
2. **Server-first**: Default to server components. Only add `"use client"` when strictly needed for interactivity.
3. **No silent failures**: API errors should be logged and surfaced to error boundaries, never swallowed.
4. **No inline sub-components**: If you define a component, it gets its own file.
5. **Type everything**: No `any` in component props or API responses.
6. **Cache aggressively**: Use `next: { revalidate }` by default, `no-store` only for real-time data.

---

## Code Quality Quick Wins

| Issue | Files | Fix |
|---|---|---|
| `any` type usage | [trending-section.tsx](file:///c:/Users/user/Documents/tech-nest/src/features/home/trending-section.tsx) (lines 17, 52), [api.ts](file:///c:/Users/user/Documents/tech-nest/src/lib/api.ts) (line 115) | Replace with proper types from [api-types.d.ts](file:///c:/Users/user/Documents/tech-nest/src/lib/api-types.d.ts) |
| Unused imports | [compare/page.tsx](file:///c:/Users/user/Documents/tech-nest/src/app/compare/page.tsx) imports Navbar/Footer | Remove |
| Hardcoded fallback slug | `device/[slug]/page.tsx` line 16: `params?.slug \|\| "iphone-16-pro"` | Remove fallback — let it 404 properly |
| Magic spacing `<div className="h-32">` | `device/[slug]/page.tsx` (3 instances) | Replace with `PageSection` component's built-in spacing |
| `suppressHydrationWarning` on `<body>` | [layout.tsx](file:///c:/Users/user/Documents/tech-nest/src/app/layout.tsx) line 72 | Only needed on `<html>` for theme — remove from body |
