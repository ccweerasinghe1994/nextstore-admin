# Learning Next.js 16 by Building a Product Dashboard

## Final application

You will build an application called **NextStore Admin**.

It will contain:

```text
/
├── Dashboard
├── Products
│   ├── Product list
│   ├── Product details
│   └── Create product
├── Analytics
└── Login-protected admin area
```

Each lesson adds one Next.js 16 concept.

---

# Course structure

## Phase 1 — Foundation

1. Create the Next.js 16 application
2. Understand the App Router
3. Learn Server and Client Components
4. Work with async request APIs
5. Fetch and stream data

## Phase 2 — Mutations and caching

6. Create products with Server Actions
7. Enable Cache Components
8. Use `use cache`
9. Configure cache lifetime and tags
10. Revalidate cached content

## Phase 3 — Performance and tooling

11. Enable React Compiler
12. Explore Turbopack
13. Test route prefetching and navigation
14. Add Proxy-based route protection
15. Debug and analyze the application

---

# Prerequisites

You should already understand:

- JavaScript or TypeScript
- React components
- props and state
- `async` and `await`
- basic HTTP concepts

You do not need previous production experience with Next.js.

---

# Lesson 1 — Create the application

## Goal

Create a clean Next.js 16 project using TypeScript, the App Router, and Turbopack.

## Step 1: Check Node.js

Run:

```bash
node --version
npm --version
```

Use a currently supported Node.js version for your installed Next.js release.

## Step 2: Create the project

```bash
npx create-next-app@latest nextstore-admin
```

Choose:

```text
TypeScript: Yes
ESLint: Yes
Tailwind CSS: Yes
src directory: No
App Router: Yes
Turbopack: Yes, if prompted
Import alias: Yes
```

Move into the project:

```bash
cd nextstore-admin
npm run dev
```

Open:

```text
http://localhost:3000
```

## Step 3: Inspect the initial structure

```text
nextstore-admin/
├── app/
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── public/
├── next.config.ts
├── package.json
└── tsconfig.json
```

## Exercise

Replace `app/page.tsx` with:

```tsx
export default function HomePage() {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">NextStore Admin</h1>

      <p className="mt-3 text-gray-600">
        A Next.js 16 learning project.
      </p>
    </main>
  )
}
```

## Checkpoint

You should understand:

- how to start the development server
- where routes are stored
- where the root layout lives
- that Turbopack handles compilation by default

---

# Lesson 2 — Learn App Router conventions

## Goal

Create routes, nested layouts, and dynamic routes.

## Step 1: Create dashboard routes

Create:

```text
app/
├── dashboard/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── analytics/
│   │   └── page.tsx
│   └── products/
│       └── page.tsx
```

Add `app/dashboard/layout.tsx`:

```tsx
import Link from 'next/link'
import type { ReactNode } from 'react'

type DashboardLayoutProps = {
  children: ReactNode
}

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen">
      <header className="border-b p-4">
        <nav className="flex gap-4">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/dashboard/products">Products</Link>
          <Link href="/dashboard/analytics">Analytics</Link>
        </nav>
      </header>

      <main className="p-8">{children}</main>
    </div>
  )
}
```

Add `app/dashboard/page.tsx`:

```tsx
export default function DashboardPage() {
  return (
    <section>
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="mt-2">Welcome to NextStore Admin.</p>
    </section>
  )
}
```

Add `app/dashboard/products/page.tsx`:

```tsx
export default function ProductsPage() {
  return (
    <section>
      <h1 className="text-3xl font-bold">Products</h1>
    </section>
  )
}
```

Add `app/dashboard/analytics/page.tsx`:

```tsx
export default function AnalyticsPage() {
  return (
    <section>
      <h1 className="text-3xl font-bold">Analytics</h1>
    </section>
  )
}
```

Visit:

```text
/dashboard
/dashboard/products
/dashboard/analytics
```

## What you learned

Folders define URL segments:

```text
app/dashboard/products/page.tsx
```

becomes:

```text
/dashboard/products
```

A layout wraps every route below its folder.

## Exercise: Add a settings route

Create:

```text
app/dashboard/settings/page.tsx
```

Then add a Settings link to the dashboard navigation.

---

# Lesson 3 — Server and Client Components

## Goal

Understand where code runs and when `"use client"` is required.

Components in the App Router are Server Components unless you explicitly mark them as Client Components.

## Step 1: Create a Server Component

Create `app/dashboard/components/dashboard-summary.tsx`:

```tsx
async function getSummary() {
  return {
    products: 24,
    orders: 182,
    revenue: 15340,
  }
}

export async function DashboardSummary() {
  const summary = await getSummary()

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <SummaryCard label="Products" value={summary.products} />
      <SummaryCard label="Orders" value={summary.orders} />
      <SummaryCard
        label="Revenue"
        value={`$${summary.revenue.toLocaleString()}`}
      />
    </div>
  )
}

type SummaryCardProps = {
  label: string
  value: string | number
}

function SummaryCard({ label, value }: SummaryCardProps) {
  return (
    <article className="rounded-lg border p-5">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </article>
  )
}
```

Use it in `app/dashboard/page.tsx`:

```tsx
import { DashboardSummary } from './components/dashboard-summary'

export default function DashboardPage() {
  return (
    <section>
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="mt-8">
        <DashboardSummary />
      </div>
    </section>
  )
}
```

## Step 2: Create a Client Component

Create `app/dashboard/components/counter.tsx`:

```tsx
'use client'

import { useState } from 'react'

export function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div className="mt-8 rounded-lg border p-5">
      <p>Count: {count}</p>

      <button
        type="button"
        className="mt-3 rounded bg-black px-4 py-2 text-white"
        onClick={() => setCount((current) => current + 1)}
      >
        Increase
      </button>
    </div>
  )
}
```

Render it on the dashboard.

## Decision rule

Use a Server Component when the component:

- fetches data
- accesses a database
- reads server secrets
- does not need browser interactivity

Use a Client Component when the component needs:

- state
- effects
- event handlers
- browser APIs
- client-side libraries

## Exercise

Create a Client Component that toggles between light and dark card backgrounds.

---

# Lesson 4 — Async request APIs

## Goal

Learn the asynchronous request APIs required by Next.js 16.

Create a dynamic product route:

```text
app/dashboard/products/[id]/page.tsx
```

Add:

```tsx
type ProductPageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { id } = await params

  return (
    <section>
      <h1 className="text-3xl font-bold">Product details</h1>
      <p className="mt-3">Product ID: {id}</p>
    </section>
  )
}
```

Visit:

```text
/dashboard/products/100
/dashboard/products/200
```

## Add search parameters

Update the page:

```tsx
type ProductPageProps = {
  params: Promise<{
    id: string
  }>
  searchParams: Promise<{
    preview?: string
  }>
}

export default async function ProductPage({
  params,
  searchParams,
}: ProductPageProps) {
  const { id } = await params
  const { preview } = await searchParams

  return (
    <section>
      <h1 className="text-3xl font-bold">Product details</h1>

      <p className="mt-3">Product ID: {id}</p>
      <p>Preview mode: {preview === 'true' ? 'Enabled' : 'Disabled'}</p>
    </section>
  )
}
```

Visit:

```text
/dashboard/products/100?preview=true
```

## Read cookies and headers

Create `app/dashboard/request-info/page.tsx`:

```tsx
import { cookies, headers } from 'next/headers'

export default async function RequestInfoPage() {
  const cookieStore = await cookies()
  const headerStore = await headers()

  const theme = cookieStore.get('theme')?.value ?? 'not set'
  const userAgent = headerStore.get('user-agent') ?? 'unknown'

  return (
    <section>
      <h1 className="text-3xl font-bold">Request information</h1>
      <p className="mt-3">Theme: {theme}</p>
      <p className="mt-3 break-all">User agent: {userAgent}</p>
    </section>
  )
}
```

## Key lesson

In Next.js 16, request-dependent values should be awaited:

```tsx
const { id } = await params
const query = await searchParams
const cookieStore = await cookies()
const headerStore = await headers()
```

---

# Lesson 5 — Fetch and stream data

## Goal

Fetch server-side data and stream slower sections with Suspense.

## Step 1: Add data types

Create `app/lib/types.ts`:

```ts
export type Product = {
  id: number
  title: string
  price: number
  category: string
}
```

## Step 2: Create the data function

Create `app/lib/products.ts`:

```ts
import type { Product } from './types'

type ProductsResponse = {
  products: Product[]
}

export async function getProducts(): Promise<Product[]> {
  const response = await fetch('https://dummyjson.com/products?limit=12')

  if (!response.ok) {
    throw new Error('Failed to load products')
  }

  const data = (await response.json()) as ProductsResponse

  return data.products
}
```

## Step 3: Build a product list

Create `app/dashboard/products/product-list.tsx`:

```tsx
import Link from 'next/link'
import { getProducts } from '@/app/lib/products'

export async function ProductList() {
  const products = await getProducts()

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <article
          key={product.id}
          className="rounded-lg border p-5"
        >
          <h2 className="font-semibold">{product.title}</h2>
          <p className="mt-2">${product.price}</p>

          <Link
            className="mt-4 inline-block underline"
            href={`/dashboard/products/${product.id}`}
          >
            View product
          </Link>
        </article>
      ))}
    </div>
  )
}
```

## Step 4: Stream it with Suspense

Update `app/dashboard/products/page.tsx`:

```tsx
import { Suspense } from 'react'
import { ProductList } from './product-list'

function ProductListSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="h-36 animate-pulse rounded-lg bg-gray-200"
        />
      ))}
    </div>
  )
}

export default function ProductsPage() {
  return (
    <section>
      <h1 className="text-3xl font-bold">Products</h1>

      <div className="mt-8">
        <Suspense fallback={<ProductListSkeleton />}>
          <ProductList />
        </Suspense>
      </div>
    </section>
  )
}
```

## What Suspense does here

The page shell can render before the product request finishes.

The user sees:

1. the dashboard layout
2. the page heading
3. the product skeleton
4. the final product list

## Exercise

Create a separate `RevenueChart` component that waits two seconds before returning its content. Wrap it in another Suspense boundary.

---

# Lesson 6 — Server Actions

## Goal

Submit a form without creating a separate client-side API request.

## Step 1: Create an in-memory product store

For learning purposes, create `app/lib/product-store.ts`:

```ts
import type { Product } from './types'

const products: Product[] = []

export async function createProduct(product: Product) {
  products.push(product)
}

export async function getCreatedProducts() {
  return products
}
```

This store resets whenever the server process restarts. In a real application, use PostgreSQL, MySQL, DynamoDB, or another database.

## Step 2: Create a Server Action

Create `app/dashboard/products/actions.ts`:

```ts
'use server'

import { redirect } from 'next/navigation'
import { createProduct } from '@/app/lib/product-store'

export async function createProductAction(formData: FormData) {
  const title = String(formData.get('title') ?? '').trim()
  const price = Number(formData.get('price'))
  const category = String(formData.get('category') ?? '').trim()

  if (!title) {
    throw new Error('Product title is required')
  }

  if (!Number.isFinite(price) || price <= 0) {
    throw new Error('A valid price is required')
  }

  await createProduct({
    id: Date.now(),
    title,
    price,
    category,
  })

  redirect('/dashboard/products')
}
```

## Step 3: Create the form

Create `app/dashboard/products/new/page.tsx`:

```tsx
import { createProductAction } from '../actions'

export default function NewProductPage() {
  return (
    <section className="max-w-xl">
      <h1 className="text-3xl font-bold">Create product</h1>

      <form
        action={createProductAction}
        className="mt-8 space-y-5"
      >
        <label className="block">
          <span className="block text-sm font-medium">Title</span>
          <input
            name="title"
            required
            className="mt-1 w-full rounded border p-2"
          />
        </label>

        <label className="block">
          <span className="block text-sm font-medium">Price</span>
          <input
            name="price"
            type="number"
            min="0.01"
            step="0.01"
            required
            className="mt-1 w-full rounded border p-2"
          />
        </label>

        <label className="block">
          <span className="block text-sm font-medium">Category</span>
          <input
            name="category"
            required
            className="mt-1 w-full rounded border p-2"
          />
        </label>

        <button
          type="submit"
          className="rounded bg-black px-4 py-2 text-white"
        >
          Create product
        </button>
      </form>
    </section>
  )
}
```

## What you learned

The browser submits the form directly to a server function:

```tsx
<form action={createProductAction}>
```

You do not need to manually write:

```ts
fetch('/api/products', {
  method: 'POST',
})
```

for this basic workflow.

---

# Lesson 7 — Enable Cache Components

## Goal

Enable the new explicit caching model.

Update `next.config.ts`:

```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
}

export default nextConfig
```

Restart the development server:

```bash
npm run dev
```

## New mental model

With Cache Components enabled:

- request-time data remains dynamic by default
- cached behavior is explicitly selected
- dynamic content can be streamed through Suspense
- static, cached, and dynamic content can coexist on one route

Do not add `"use cache"` everywhere.

Only cache content when:

- it can safely be shared
- it does not need to change on every request
- you have an invalidation strategy
- the performance benefit is meaningful

---

# Lesson 8 — Use the `use cache` directive

## Goal

Cache a function and observe the difference between cached and uncached data.

Create `app/dashboard/cache-demo/page.tsx`:

```tsx
async function getUncachedTime() {
  return new Date().toISOString()
}

async function getCachedTime() {
  'use cache'

  return new Date().toISOString()
}

export default async function CacheDemoPage() {
  const uncachedTime = await getUncachedTime()
  const cachedTime = await getCachedTime()

  return (
    <section>
      <h1 className="text-3xl font-bold">Cache demo</h1>

      <div className="mt-8 space-y-4">
        <p>
          <strong>Uncached:</strong> {uncachedTime}
        </p>

        <p>
          <strong>Cached:</strong> {cachedTime}
        </p>
      </div>
    </section>
  )
}
```

Refresh the page several times.

The uncached timestamp should represent fresh execution, while the cached function can reuse its previous result according to its cache policy.

## Cache an entire component

```tsx
async function CachedProductSummary() {
  'use cache'

  const products = await getProducts()

  return (
    <p>
      The catalogue currently contains {products.length} loaded products.
    </p>
  )
}
```

## Cache a data function

A cleaner pattern is often:

```ts
export async function getCachedProducts() {
  'use cache'

  const response = await fetch('https://dummyjson.com/products?limit=12')

  if (!response.ok) {
    throw new Error('Failed to load products')
  }

  return response.json()
}
```

This keeps caching close to the data boundary.

---

# Lesson 9 — Configure `cacheLife` and `cacheTag`

## Goal

Control how long cached data remains valid and give it an invalidation identity.

Update the cached product function:

```ts
import { cacheLife, cacheTag } from 'next/cache'
import type { Product } from './types'

type ProductsResponse = {
  products: Product[]
}

export async function getCachedProducts(): Promise<Product[]> {
  'use cache'

  cacheLife('minutes')
  cacheTag('products')

  const response = await fetch('https://dummyjson.com/products?limit=12')

  if (!response.ok) {
    throw new Error('Failed to load products')
  }

  const data = (await response.json()) as ProductsResponse

  return data.products
}
```

## What each API means

```ts
cacheLife('minutes')
```

controls the cache timing profile.

```ts
cacheTag('products')
```

associates the cached result with the `products` tag.

The tag can later be invalidated after a product is created, updated, or deleted.

## Create a custom cache profile

In `next.config.ts`, you can define a named profile when the project needs a specific policy:

```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,

  cacheLife: {
    productCatalogue: {
      stale: 60,
      revalidate: 300,
      expire: 3600,
    },
  },
}

export default nextConfig
```

Use it:

```ts
cacheLife('productCatalogue')
```

Use named profiles to express business meaning instead of scattering arbitrary numbers throughout the codebase.

---

# Lesson 10 — Invalidate cached data

## Goal

Refresh cached product information after a mutation.

There are two important approaches:

```ts
updateTag('products')
```

and:

```ts
revalidateTag('products', 'max')
```

## Immediate consistency with `updateTag`

Update the Server Action:

```ts
'use server'

import { updateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { createProduct } from '@/app/lib/product-store'

export async function createProductAction(formData: FormData) {
  const title = String(formData.get('title') ?? '').trim()
  const price = Number(formData.get('price'))
  const category = String(formData.get('category') ?? '').trim()

  if (!title) {
    throw new Error('Product title is required')
  }

  if (!Number.isFinite(price) || price <= 0) {
    throw new Error('A valid price is required')
  }

  await createProduct({
    id: Date.now(),
    title,
    price,
    category,
  })

  updateTag('products')

  redirect('/dashboard/products')
}
```

Use `updateTag` when the user who performed a mutation should immediately see the updated result.

## Background refresh with `revalidateTag`

```ts
'use server'

import { revalidateTag } from 'next/cache'

export async function refreshProductCatalogue() {
  revalidateTag('products', 'max')
}
```

This approach is useful when stale content can be served briefly while fresh content is regenerated.

## Exercise

Create:

```ts
deleteProductAction(productId: number)
```

After deleting the product, invalidate the `products` tag.

---

# Lesson 11 — Enable React Compiler

## Goal

Let React Compiler optimize compatible components automatically.

Update `next.config.ts`:

```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
  reactCompiler: true,
}

export default nextConfig
```

Restart the server:

```bash
npm run dev
```

## Create a rendering exercise

Create `app/dashboard/compiler-demo/page.tsx`:

```tsx
import { ProductSearch } from './product-search'

const products = [
  'Laptop',
  'Keyboard',
  'Monitor',
  'Mouse',
  'Webcam',
]

export default function CompilerDemoPage() {
  return (
    <section>
      <h1 className="text-3xl font-bold">React Compiler demo</h1>

      <div className="mt-8">
        <ProductSearch products={products} />
      </div>
    </section>
  )
}
```

Create `app/dashboard/compiler-demo/product-search.tsx`:

```tsx
'use client'

import { useState } from 'react'

type ProductSearchProps = {
  products: string[]
}

export function ProductSearch({
  products,
}: ProductSearchProps) {
  const [query, setQuery] = useState('')

  const filteredProducts = products.filter((product) =>
    product.toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <div>
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search products"
        className="rounded border p-2"
      />

      <ul className="mt-4 space-y-2">
        {filteredProducts.map((product) => (
          <li key={product}>{product}</li>
        ))}
      </ul>
    </div>
  )
}
```

Notice that you did not add:

```ts
useMemo()
```

around the filtered list.

## Important lesson

React Compiler reduces the need for routine manual memoization, but it does not fix:

- expensive network requests
- inefficient database queries
- poor component architecture
- unnecessary client-side JavaScript
- incorrect state design

Do not remove every `useMemo` or `useCallback` blindly. Some code may use them for semantic stability rather than basic rendering optimization.

---

# Lesson 12 — Explore Turbopack

## Goal

Understand Next.js 16's default bundler and compare it with Webpack.

Run the project normally:

```bash
npm run dev
```

Turbopack is used by default.

## Compare with Webpack

Stop the server and run:

```bash
npm run dev -- --webpack
```

Compare:

- initial startup time
- time to compile the first route
- Fast Refresh after editing a component
- memory usage on a larger project

Return to Turbopack:

```bash
npm run dev
```

## Test persistent compilation

1. Start the development server.
2. Visit several routes.
3. Stop the server.
4. Start it again.
5. Revisit the same routes.
6. Compare the compilation behavior.

## Production build

```bash
npm run build
npm run start
```

## Exercise

Create 20 simple dashboard routes and compare route compilation between Turbopack and Webpack.

---

# Lesson 13 — Routing, prefetching, and navigation

## Goal

Observe Next.js 16's optimized navigation behavior.

Next.js uses its `Link` component to support client-side navigation and route prefetching.

Create `app/dashboard/products/product-navigation.tsx`:

```tsx
import Link from 'next/link'

export function ProductNavigation() {
  return (
    <nav className="grid gap-3 md:grid-cols-3">
      {Array.from({ length: 12 }).map((_, index) => {
        const id = index + 1

        return (
          <Link
            key={id}
            href={`/dashboard/products/${id}`}
            className="rounded border p-4 hover:bg-gray-50"
          >
            Product {id}
          </Link>
        )
      })}
    </nav>
  )
}
```

## Experiment 1: Prefetch enabled

Use the component normally and inspect the Network tab in browser developer tools.

## Experiment 2: Prefetch disabled

Change a link to:

```tsx
<Link
  href={`/dashboard/products/${id}`}
  prefetch={false}
>
  Product {id}
</Link>
```

Compare the network behavior.

## Experiment 3: Shared layouts

Navigate between:

```text
/dashboard/products/1
/dashboard/products/2
/dashboard/products/3
/dashboard/analytics
```

Notice that the dashboard layout remains mounted while the route content changes.

## Add a route-level loading state

Create:

```text
app/dashboard/products/[id]/loading.tsx
```

```tsx
export default function ProductLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-8 w-64 rounded bg-gray-200" />
      <div className="mt-4 h-4 w-40 rounded bg-gray-200" />
    </div>
  )
}
```

This gives navigations an immediate visual state while dynamic content loads.

---

# Lesson 14 — Protect routes with Proxy

## Goal

Run request-boundary logic before allowing access to dashboard routes.

Create `proxy.ts` in the project root:

```ts
import { NextRequest, NextResponse } from 'next/server'

export function proxy(request: NextRequest) {
  const session = request.cookies.get('session')?.value

  if (!session) {
    const loginUrl = new URL('/login', request.url)

    loginUrl.searchParams.set(
      'from',
      request.nextUrl.pathname,
    )

    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
```

Create `app/login/page.tsx`:

```tsx
export default function LoginPage() {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">Login</h1>

      <p className="mt-3">
        A session cookie is required to access the dashboard.
      </p>
    </main>
  )
}
```

Now visit:

```text
/dashboard
```

You should be redirected to `/login` when the session cookie is absent.

## Important security lesson

Proxy can perform an early redirect, but it should not be the only authorization layer.

Sensitive operations must still verify authorization:

- inside Server Actions
- inside Route Handlers
- before database operations
- inside server-side service functions

Never assume that hiding or redirecting a page protects the underlying mutation.

---

# Lesson 15 — Debugging

## Goal

Inspect server-side execution with the Node.js debugger.

Start development debugging:

```bash
next dev --inspect
```

When using npm scripts:

```bash
npm run dev -- --inspect
```

Open Chrome:

```text
chrome://inspect
```

Choose the Next.js Node.js process.

## Add a breakpoint target

Create:

```ts
export async function getProductById(id: string) {
  console.log('Loading product:', id)

  const response = await fetch(
    `https://dummyjson.com/products/${id}`,
  )

  if (!response.ok) {
    throw new Error(`Failed to load product ${id}`)
  }

  return response.json()
}
```

Place a breakpoint inside the function and load a product page.

## Production debugging

Build the application:

```bash
npm run build
```

Then run:

```bash
npm run start -- --inspect
```

Debugging production mode is helpful because production rendering and caching behavior can differ from development mode.

---

# Lesson 16 — Analyze the bundle

## Goal

Identify code that increases client and server bundles.

Create a production build first:

```bash
npm run build
```

Try the Next.js experimental analyzer available in your installed 16.x release:

```bash
npx next experimental-analyze
```

Inspect:

- large client dependencies
- modules imported by many routes
- unexpected server-to-client boundaries
- duplicated dependencies
- oversized CSS or assets

## Deliberately create a bundle issue

Install a larger utility package:

```bash
npm install lodash
```

Bad import:

```tsx
'use client'

import _ from 'lodash'
```

More targeted import:

```tsx
'use client'

import debounce from 'lodash/debounce'
```

Compare the resulting dependency graph.

## Optimization questions

For every large dependency, ask:

1. Is it needed in a Client Component?
2. Can it stay in a Server Component?
3. Can it be dynamically imported?
4. Can a smaller package replace it?
5. Can a native browser or JavaScript API handle the task?

---

# Lesson 17 — Build a complete cached product page

## Goal

Combine the major concepts in a single route.

Create `app/lib/cached-products.ts`:

```ts
import { cacheLife, cacheTag } from 'next/cache'
import type { Product } from './types'

export async function getCachedProduct(
  id: string,
): Promise<Product> {
  'use cache'

  cacheLife('minutes')
  cacheTag('products')
  cacheTag(`product-${id}`)

  const response = await fetch(
    `https://dummyjson.com/products/${id}`,
  )

  if (!response.ok) {
    throw new Error(`Failed to load product ${id}`)
  }

  return response.json()
}
```

Update `app/dashboard/products/[id]/page.tsx`:

```tsx
import { getCachedProduct } from '@/app/lib/cached-products'

type ProductPageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { id } = await params
  const product = await getCachedProduct(id)

  return (
    <section>
      <p className="text-sm text-gray-500">
        {product.category}
      </p>

      <h1 className="mt-2 text-3xl font-bold">
        {product.title}
      </h1>

      <p className="mt-4 text-xl">
        ${product.price}
      </p>
    </section>
  )
}
```

Create an update action:

```ts
'use server'

import { updateTag } from 'next/cache'

export async function updateProductAction(
  productId: string,
  formData: FormData,
) {
  const title = String(formData.get('title') ?? '').trim()

  if (!title) {
    throw new Error('Title is required')
  }

  // Replace this with a real database update.
  console.log('Updating product', productId, title)

  updateTag(`product-${productId}`)
  updateTag('products')
}
```

You now have:

- async route parameters
- server-side fetching
- explicit caching
- cache lifetime
- general and product-specific tags
- mutation-driven invalidation

---

# Recommended learning schedule

## Week 1 — Fundamentals

### Day 1

Complete Lessons 1 and 2.

Build:

- the project
- dashboard routes
- nested layouts
- navigation

### Day 2

Complete Lessons 3 and 4.

Practice:

- Server Components
- Client Components
- async `params`
- async `searchParams`
- `cookies()`
- `headers()`

### Day 3

Complete Lesson 5.

Practice:

- server-side fetch
- Suspense
- loading skeletons
- streaming

### Day 4

Complete Lesson 6.

Practice:

- forms
- Server Actions
- validation
- redirects

### Day 5

Rebuild Lessons 1–6 without copying the code.

---

## Week 2 — Next.js 16 features

### Day 6

Complete Lessons 7 and 8.

Focus on:

- Cache Components
- dynamic-by-default behavior
- `"use cache"`

### Day 7

Complete Lessons 9 and 10.

Focus on:

- `cacheLife`
- `cacheTag`
- `updateTag`
- `revalidateTag`

### Day 8

Complete Lesson 11.

Focus on:

- React Compiler
- component rendering
- when manual memoization is still appropriate

### Day 9

Complete Lessons 12 and 13.

Focus on:

- Turbopack
- prefetching
- shared layouts
- loading states

### Day 10

Complete Lessons 14–16.

Focus on:

- Proxy
- debugging
- bundle analysis

---

# Final project challenges

Complete these without following step-by-step code.

## Challenge 1 — PostgreSQL integration

Replace the dummy API and memory store with PostgreSQL.

Suggested table:

```sql
CREATE TABLE products (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  category VARCHAR(100) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

Add:

- create product
- update product
- delete product
- product list
- product details

## Challenge 2 — Authentication

Add authentication and protect:

```text
/dashboard
/dashboard/products
/dashboard/analytics
```

Verify the session again inside every sensitive Server Action.

## Challenge 3 — Cache strategy

Implement:

```text
products
product-{id}
analytics
dashboard-summary
```

as separate tags.

Use immediate invalidation for user mutations and stale-while-revalidate behavior for analytics.

## Challenge 4 — Streaming dashboard

Build a dashboard where these sections load independently:

- revenue
- product count
- recent orders
- low-stock products
- sales chart

Each section should have its own Suspense boundary.

## Challenge 5 — Performance investigation

Use the bundle analyzer and browser developer tools to identify:

- the largest client dependency
- the slowest route
- unnecessary Client Components
- duplicate network requests
- routes that should use caching
- routes that must stay dynamic

---

# Knowledge checklist

You are ready to use Next.js 16 confidently when you can explain the following without looking them up:

## Rendering

- Why are App Router components Server Components by default?
- When is `"use client"` necessary?
- How does Suspense enable streaming?
- What makes a route dynamic?

## Async APIs

- Why must `params` be awaited?
- How do you read `searchParams`?
- How do you read cookies and headers?

## Caching

- What changes when `cacheComponents` is enabled?
- What does `"use cache"` cache?
- What is the purpose of `cacheLife`?
- Why use `cacheTag`?
- When should you use `updateTag`?
- When should you use `revalidateTag`?

## Mutations

- How does a Server Action receive form data?
- Where should input validation happen?
- How do you invalidate data after a mutation?
- Why must authorization be checked inside the action?

## Performance

- What does Turbopack do?
- How does route prefetching work?
- What does React Compiler optimize?
- How can Client Components increase bundle size?
- How do you inspect the dependency graph?

## Security

- What should Proxy handle?
- Why is Proxy not a complete authorization system?
- Where must sensitive permissions be verified?

---

# Recommended project architecture

As the application grows, use:

```text
app/
├── dashboard/
│   ├── analytics/
│   ├── products/
│   │   ├── [id]/
│   │   ├── new/
│   │   ├── actions.ts
│   │   └── page.tsx
│   ├── layout.tsx
│   └── page.tsx
├── login/
├── lib/
│   ├── auth.ts
│   ├── database.ts
│   ├── products.ts
│   └── types.ts
├── ui/
│   ├── button.tsx
│   ├── input.tsx
│   └── skeleton.tsx
└── layout.tsx
```

Keep:

- database code in server-only modules
- mutation logic in Server Actions
- reusable visual components in `ui`
- route-specific components near their routes
- caching close to the relevant data function
- Client Component boundaries as small as practical

---

# Final learning rule

For every Next.js feature, complete this cycle:

1. Build the simplest working example.
2. Observe its default behavior.
3. deliberately break it.
4. Read the resulting error.
5. fix the issue.
6. test it in development.
7. test it in a production build.
8. explain the feature in your own words.
9. rebuild it without copying the original code.

Following this process will teach you more than copying a completed repository.