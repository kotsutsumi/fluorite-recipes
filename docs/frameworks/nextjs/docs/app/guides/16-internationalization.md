# 国際化（Internationalization）

Next.js を使用して、複数の言語をサポートする国際化（i18n）アプリケーションを構築する方法を説明します。このガイドでは、ルーティング、ローカライゼーション、ベストプラクティスについて説明します。

## 用語

- **ロケール（Locale）**: 言語とフォーマット設定の識別子
  - 例：
    - `en-US`: アメリカ合衆国の英語
    - `nl-NL`: オランダのオランダ語
    - `nl`: オランダ語（地域指定なし）
    - `ja`: 日本語
    - `ja-JP`: 日本の日本語

## ルーティング戦略

### ロケールの検出

ブラウザの言語設定を使用してロケールを選択することをお勧めします。

#### ライブラリを使用したロケール検出

```typescript
// lib/get-locale.ts
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'

const locales = ['en-US', 'nl-NL', 'nl', 'ja']
const defaultLocale = 'en-US'

function getLocale(request: Request): string {
  // Negotiator を使用してリクエストヘッダーから言語を取得
  const headers = {
    'accept-language': request.headers.get('accept-language') || '',
  }
  const languages = new Negotiator({ headers }).languages()

  // 最適なロケールをマッチング
  return match(languages, locales, defaultLocale)
}

export { getLocale }
```

### Middleware でのルーティング

Middleware を使用して、ロケールに基づいてリクエストをルーティングします。

```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'

const locales = ['en', 'nl', 'ja']
const defaultLocale = 'en'

function getLocale(request: NextRequest): string {
  const headers = {
    'accept-language': request.headers.get('accept-language') || '',
  }
  const languages = new Negotiator({ headers }).languages()
  return match(languages, locales, defaultLocale)
}

export function middleware(request: NextRequest) {
  // パス名にロケールがあるか確認
  const { pathname } = request.nextUrl
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return

  // ロケールがない場合はリダイレクト
  const locale = getLocale(request)
  request.nextUrl.pathname = `/${locale}${pathname}`
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  matcher: [
    // API ルート、静的ファイルを除外
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
```

### ルーティングアプローチ

#### 1. サブパスルーティング（推奨）

URL パスにロケールを含めます。

```
example.com/en/products
example.com/nl/products
example.com/ja/products
```

ディレクトリ構造：

```
app/
├── [lang]/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── products/
│   │   └── page.tsx
│   └── about/
│       └── page.tsx
└── middleware.ts
```

レイアウトの実装：

```typescript
// app/[lang]/layout.tsx
export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'nl' }, { lang: 'ja' }]
}

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { lang: string }
}) {
  return (
    <html lang={params.lang}>
      <body>{children}</body>
    </html>
  )
}
```

#### 2. ドメインルーティング

異なるドメインで異なる言語を提供します。

```
example.com/products     (英語)
example.nl/products      (オランダ語)
example.jp/products      (日本語)
```

## ローカライゼーション

### ディクショナリーアプローチ

翻訳ファイルを作成して管理します。

#### 翻訳ファイルの作成

```json
// dictionaries/en.json
{
  "products": {
    "cart": "Add to Cart",
    "title": "Products",
    "description": "Browse our products"
  },
  "navigation": {
    "home": "Home",
    "about": "About",
    "contact": "Contact"
  }
}
```

```json
// dictionaries/nl.json
{
  "products": {
    "cart": "Toevoegen aan Winkelwagen",
    "title": "Producten",
    "description": "Bekijk onze producten"
  },
  "navigation": {
    "home": "Home",
    "about": "Over ons",
    "contact": "Contact"
  }
}
```

```json
// dictionaries/ja.json
{
  "products": {
    "cart": "カートに追加",
    "title": "製品",
    "description": "製品を見る"
  },
  "navigation": {
    "home": "ホーム",
    "about": "について",
    "contact": "お問い合わせ"
  }
}
```

#### ディクショナリーの読み込み

```typescript
// lib/dictionaries.ts
import 'server-only'

const dictionaries = {
  en: () => import('./dictionaries/en.json').then((module) => module.default),
  nl: () => import('./dictionaries/nl.json').then((module) => module.default),
  ja: () => import('./dictionaries/ja.json').then((module) => module.default),
}

export const getDictionary = async (locale: 'en' | 'nl' | 'ja') =>
  dictionaries[locale]()
```

**重要**: `server-only` パッケージを使用して、ディクショナリーがサーバーでのみ使用されることを保証します。

```bash
npm install server-only
```

#### ページでの使用

```typescript
// app/[lang]/page.tsx
import { getDictionary } from '@/lib/dictionaries'

export default async function HomePage({
  params,
}: {
  params: { lang: 'en' | 'nl' | 'ja' }
}) {
  const dict = await getDictionary(params.lang)

  return (
    <main>
      <h1>{dict.products.title}</h1>
      <p>{dict.products.description}</p>
      <button>{dict.products.cart}</button>
    </main>
  )
}
```

### 言語切り替えコンポーネント

```typescript
// app/components/LanguageSwitcher.tsx
'use client'

import { usePathname, useRouter } from 'next/navigation'

const languages = [
  { code: 'en', name: 'English' },
  { code: 'nl', name: 'Nederlands' },
  { code: 'ja', name: '日本語' },
]

export function LanguageSwitcher({ currentLang }: { currentLang: string }) {
  const pathname = usePathname()
  const router = useRouter()

  const switchLanguage = (newLang: string) => {
    // 現在のパスからロケールを置き換え
    const newPathname = pathname.replace(`/${currentLang}`, `/${newLang}`)
    router.push(newPathname)
  }

  return (
    <select
      value={currentLang}
      onChange={(e) => switchLanguage(e.target.value)}
      className="language-switcher"
    >
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.name}
        </option>
      ))}
    </select>
  )
}
```

レイアウトに追加：

```typescript
// app/[lang]/layout.tsx
import { LanguageSwitcher } from '@/app/components/LanguageSwitcher'

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { lang: string }
}) {
  return (
    <html lang={params.lang}>
      <body>
        <header>
          <LanguageSwitcher currentLang={params.lang} />
        </header>
        {children}
      </body>
    </html>
  )
}
```

## 高度な実装

### 動的な翻訳

変数を含む翻訳を実装します。

```json
// dictionaries/en.json
{
  "welcome": "Welcome, {{name}}!",
  "itemCount": "You have {{count}} items in your cart"
}
```

```typescript
// lib/translate.ts
export function translate(
  template: string,
  variables: Record<string, string | number>
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return String(variables[key] || match)
  })
}
```

使用例：

```typescript
import { getDictionary } from '@/lib/dictionaries'
import { translate } from '@/lib/translate'

export default async function Page({
  params,
}: {
  params: { lang: 'en' | 'nl' | 'ja' }
}) {
  const dict = await getDictionary(params.lang)

  return (
    <div>
      <h1>{translate(dict.welcome, { name: 'John' })}</h1>
      <p>{translate(dict.itemCount, { count: 5 })}</p>
    </div>
  )
}
```

### 日付と数値のフォーマット

Intl API を使用して、ロケールに応じた日付と数値のフォーマットを実装します。

```typescript
// lib/format.ts
export function formatDate(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export function formatCurrency(
  amount: number,
  locale: string,
  currency: string = 'USD'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount)
}

export function formatNumber(num: number, locale: string): string {
  return new Intl.NumberFormat(locale).format(num)
}
```

使用例：

```typescript
import { formatDate, formatCurrency, formatNumber } from '@/lib/format'

export default function ProductPage({
  params,
}: {
  params: { lang: string }
}) {
  const date = new Date()
  const price = 99.99
  const views = 1234567

  return (
    <div>
      <p>{formatDate(date, params.lang)}</p>
      {/* en: January 1, 2024 */}
      {/* ja: 2024年1月1日 */}

      <p>{formatCurrency(price, params.lang, 'USD')}</p>
      {/* en: $99.99 */}
      {/* ja: $99.99 */}

      <p>{formatNumber(views, params.lang)}</p>
      {/* en: 1,234,567 */}
      {/* ja: 1,234,567 */}
    </div>
  )
}
```

### SEO 対策

多言語サイトの SEO を改善します。

```typescript
// app/[lang]/page.tsx
import type { Metadata } from 'next'
import { getDictionary } from '@/lib/dictionaries'

export async function generateMetadata({
  params,
}: {
  params: { lang: 'en' | 'nl' | 'ja' }
}): Promise<Metadata> {
  const dict = await getDictionary(params.lang)

  return {
    title: dict.products.title,
    description: dict.products.description,
    alternates: {
      languages: {
        'en-US': '/en',
        'nl-NL': '/nl',
        'ja-JP': '/ja',
      },
    },
  }
}

export default async function Page({
  params,
}: {
  params: { lang: 'en' | 'nl' | 'ja' }
}) {
  const dict = await getDictionary(params.lang)
  return <h1>{dict.products.title}</h1>
}
```

## ベストプラクティス

### 1. TypeScript で型安全性を確保

```typescript
// types/dictionary.ts
export interface Dictionary {
  products: {
    cart: string
    title: string
    description: string
  }
  navigation: {
    home: string
    about: string
    contact: string
  }
}
```

```typescript
// lib/dictionaries.ts
import 'server-only'
import type { Dictionary } from '@/types/dictionary'

const dictionaries: Record<string, () => Promise<Dictionary>> = {
  en: () => import('./dictionaries/en.json').then((module) => module.default),
  nl: () => import('./dictionaries/nl.json').then((module) => module.default),
  ja: () => import('./dictionaries/ja.json').then((module) => module.default),
}

export const getDictionary = async (
  locale: 'en' | 'nl' | 'ja'
): Promise<Dictionary> => dictionaries[locale]()
```

### 2. デフォルトロケールを設定

```typescript
// lib/i18n.ts
export const defaultLocale = 'en'
export const locales = ['en', 'nl', 'ja'] as const
export type Locale = (typeof locales)[number]

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale)
}
```

### 3. Cookie でロケールを保存

ユーザーの言語設定を記憶します。

```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { getLocale } from './lib/get-locale'

export function middleware(request: NextRequest) {
  // Cookie からロケールを取得
  const localeCookie = request.cookies.get('NEXT_LOCALE')?.value

  let locale = localeCookie || getLocale(request)

  const response = NextResponse.redirect(
    new URL(`/${locale}${request.nextUrl.pathname}`, request.url)
  )

  // Cookie にロケールを保存
  response.cookies.set('NEXT_LOCALE', locale, {
    maxAge: 60 * 60 * 24 * 365, // 1年
  })

  return response
}
```

### 4. 翻訳の検証

すべてのロケールで翻訳が揃っていることを確認するスクリプトを作成します。

```typescript
// scripts/validate-translations.ts
import en from '../dictionaries/en.json'
import nl from '../dictionaries/nl.json'
import ja from '../dictionaries/ja.json'

function validateTranslations() {
  const enKeys = Object.keys(en)
  const nlKeys = Object.keys(nl)
  const jaKeys = Object.keys(ja)

  const missingInNl = enKeys.filter((key) => !nlKeys.includes(key))
  const missingInJa = enKeys.filter((key) => !jaKeys.includes(key))

  if (missingInNl.length > 0) {
    console.error('Missing in nl:', missingInNl)
  }

  if (missingInJa.length > 0) {
    console.error('Missing in ja:', missingInJa)
  }

  if (missingInNl.length === 0 && missingInJa.length === 0) {
    console.log('All translations are complete!')
  }
}

validateTranslations()
```

## まとめ

Next.js で国際化を実装する主なポイント：

1. **ルーティング**: Middleware を使用してロケールベースのルーティング
2. **ローカライゼーション**: ディクショナリーアプローチで翻訳を管理
3. **フォーマット**: Intl API で日付と数値をフォーマット
4. **SEO**: 代替言語リンクとメタデータを設定
5. **UX**: 言語切り替えコンポーネントを提供
6. **型安全性**: TypeScript で翻訳キーを型チェック

適切な国際化により、グローバルユーザーに最適化されたエクスペリエンスを提供できます。
