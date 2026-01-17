# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev            # Start dev server with HMR using test dataset (http://localhost:5173)
npm run dev:production # Start dev server using production dataset
npm run build          # Production build
npm run start          # Serve production build
npm run typecheck      # Generate route types and run TypeScript check
```

## Architecture

Mobile-optimized cookbook app using React Router v7 (SPA mode), Mantine UI, and Sanity CMS.

**Static hosting:** This app uses client-side data fetching (no SSR), so it can be hosted on any static hosting platform (Netlify, Vercel, GitHub Pages, Cloudflare Pages, etc.). Build output is in `build/client/`.

**Key files:**
- `app/routes.ts` - Route configuration (source of truth for routing)
- `app/root.tsx` - Root layout with MantineProvider and ErrorBoundary
- `app/lib/sanity.ts` - Sanity client configuration
- `app/lib/queries.ts` - GROQ queries for fetching recipes
- `app/types/recipe.ts` - TypeScript types for recipe data
- `react-router.config.ts` - React Router config with `ssr: false`
- `sanity/` - Sanity Studio project (separate npm workspace)

**Path alias:** `~/*` maps to `./app/*`

## Sanity

Sanity Studio runs separately from the main app:
```bash
cd sanity && npm run dev             # Studio with test dataset (http://localhost:3333)
cd sanity && npm run dev:production  # Studio with production dataset
```

**Datasets:**
- `test` - Default dataset for development and seeding
- `production` - Production data (use `:production` suffix commands)

Note: Schema is shared across datasets. Deploying schema affects both.

**Seeding:** Always seed the `test` dataset, never production:
```bash
cd sanity && npx sanity dataset import seed-recipes.ndjson test
```

**Schemas:** `sanity/schemaTypes/`
- `recipe.ts` - Main recipe document
- `ingredientGroup.ts` - Grouped ingredients object
- `ingredient.ts` - Individual ingredient object

## React Router v7 Patterns

This app uses SPA mode (`ssr: false`) with client-side data fetching.

### Client-Side Data Fetching Pattern
```tsx
import { useState, useEffect } from "react";
import { useParams } from "react-router";

export default function Product() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct(id).then(setProduct).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader />;
  return <div>{product.name}</div>;
}
```

### Type-Safe URLs
Use `href()` for dynamic routes:
```tsx
import { Link, href } from "react-router";
<Link to={href("/products/:id", { id: product.id })}>View</Link>
```

### Layout Routes
Use `<Outlet />` from `react-router` to render child routes in layouts.

## Packages

- Use `react-router` (not `react-router-dom`)
- Use `@react-router/*` packages (not `@remix-run/*`)

## LLM Rules

Read `llm/react-router-v7.mdc` for React Router v7 patterns and best practices.

## Maintaining This File

Update CLAUDE.md when making architectural changes or significant improvements that would benefit future sessions.
