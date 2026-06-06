# React / shadcn Setup Notes

This prototype is currently a static HTML/CSS/JavaScript site. It does not yet have a React, TypeScript, Tailwind, or shadcn project structure, so the `TextRotate` React component cannot be used directly here without migrating the app.

The current build uses native JavaScript versions of the rotating text animation and race photo gallery in `index.html`, `styles.css`, and `script.js`.

## Recommended Migration

For the production web app, create a Next.js project with TypeScript and Tailwind:

```bash
npx create-next-app@latest 7k-world --typescript --tailwind --app
cd 7k-world
npx shadcn@latest init
npm install motion framer-motion lucide-react @tabler/icons-react @radix-ui/react-aspect-ratio next-themes clsx tailwind-merge
npm install gsap three firebase
```

Use shadcn's default component path:

```text
components/ui
```

That path matters because imports like this depend on it:

```tsx
import { TextRotate } from "@/components/ui/text-rotate"
```

If the project uses another alias or component folder, either create `components/ui` at the app root or update the import aliases consistently in `tsconfig.json` and every component import.

## Required Files

Create:

```text
components/ui/text-rotate.tsx
components/ui/image-gallery.tsx
components/ui/aspect-ratio.tsx
components/ui/fey-button.tsx
components/ui/clipped-video-tab.tsx
components/ui/resizable-navbar.tsx
components/ui/horizon-hero-section.tsx
lib/utils.ts
```

Install the animation and aspect-ratio dependencies:

```bash
npm install motion framer-motion lucide-react @tabler/icons-react @radix-ui/react-aspect-ratio next-themes clsx tailwind-merge gsap three firebase
```

The `lib/utils.ts` file should expose the usual shadcn `cn` helper:

```ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

If `clsx` and `tailwind-merge` are missing:

```bash
npm install clsx tailwind-merge
```

## Best Placement

Use `TextRotate` in the home hero headline for identity-driven words like:

```tsx
<TextRotate
  texts={["cultural", "race-day", "photo", "club", "story"]}
  mainClassName="bg-[#00ff00] text-black px-2 overflow-hidden"
  staggerFrom="last"
  staggerDuration={0.025}
  rotationInterval={2000}
/>
```

That keeps the animation expressive and brand-forward without turning the platform into a generic dashboard.

Use `ImageGallery` on the Race Photos page, below the race selector and search controls. In production, replace the static Unsplash URLs with photo objects returned from your race archive storage, scoped by selected race, zone, and detected bib number.

```tsx
import { ImageGallery } from "@/components/ui/image-gallery"

export default function RacePhotosPage() {
  return <ImageGallery />
}
```

Use `FeyButton` for primary app actions once the app is migrated to React. It depends on `next-themes`, so the Next.js app should wrap the root layout with a `ThemeProvider`.

```tsx
import { FeyButton } from "@/components/ui/fey-button"

export function Actions() {
  return <FeyButton>Create event</FeyButton>
}
```

Use `ClippedVideoTab` on the home page as a feature showcase for club calendar, race photos, passport, and runner identity.

```tsx
import ClippedVideoTab from "@/components/ui/clipped-video-tab"

export function HomeSystems() {
  return <ClippedVideoTab />
}
```

Use `ResizableNavbar` for the production navigation. The current static site now mimics this behavior with plain HTML/CSS/JS: a floating mono pill, centered nav items, right-side actions, scroll compression, and mobile menu toggle.

Use `HorizonHeroSection` on the production home page for the cinematic first viewport:

```tsx
import HorizonHeroSection from "@/components/ui/horizon-hero-section"

export default function HomePage() {
  return <HorizonHeroSection />
}
```

For real phone verification, use Firebase Auth or a backend SMS provider. See `PRODUCTION_AUTH_SETUP.md`.
