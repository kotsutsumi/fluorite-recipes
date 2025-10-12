# userAgent

`userAgent` ヘルパーは、Web Request API を追加のプロパティで拡張し、リクエストメタデータを分析します。ミドルウェアでデバイス特性を検出するために使用できます。

## 使用方法

```typescript
import { NextRequest, NextResponse, userAgent } from 'next/server'

export function middleware(request: NextRequest) {
  const { device } = userAgent(request)
  const viewport = device.type || 'desktop'

  // デバイスタイプに基づいてリクエストを変更
  const url = request.nextUrl
  url.searchParams.set('viewport', viewport)
  return NextResponse.rewrite(url)
}
```

## パラメータ

`userAgent` 関数は `NextRequest` オブジェクトを受け取ります：

```typescript
userAgent(request: NextRequest)
```

## 戻り値

ユーザーエージェント情報を含むオブジェクトを返します。以下のプロパティを持ちます：

### `isBot`

リクエストが既知のボットからのものかどうかを示すブール値です。

```typescript
const { isBot } = userAgent(request)
if (isBot) {
  // ボット用の処理
}
```

### `browser`

ブラウザに関する情報を含むオブジェクトです：

- `name`: ブラウザ名（例: Chrome、Firefox、Safari）
- `version`: ブラウザのバージョン

```typescript
const { browser } = userAgent(request)
console.log(browser.name)    // "Chrome"
console.log(browser.version) // "91.0.4472.124"
```

### `device`

デバイスに関する情報を含むオブジェクトです：

- `model`: デバイスモデル
- `type`: デバイスカテゴリ（mobile、tablet、console、smarttv、wearable、embedded など）
- `vendor`: デバイスメーカー

```typescript
const { device } = userAgent(request)
console.log(device.type)   // "mobile"
console.log(device.vendor) // "Apple"
console.log(device.model)  // "iPhone"
```

### `engine`

ブラウザのレンダリングエンジンに関する情報を含むオブジェクトです：

- `name`: エンジン名（Blink、WebKit、Gecko など）
- `version`: エンジンのバージョン

```typescript
const { engine } = userAgent(request)
console.log(engine.name)    // "Blink"
console.log(engine.version) // "91.0.4472.124"
```

### `os`

オペレーティングシステムに関する情報を含むオブジェクトです：

- `name`: OS 名（Windows、macOS、iOS、Android など）
- `version`: OS バージョン

```typescript
const { os } = userAgent(request)
console.log(os.name)    // "iOS"
console.log(os.version) // "14.6"
```

### `cpu`

CPU アーキテクチャに関する情報を含むオブジェクトです：

- `architecture`: CPU アーキテクチャ（arm、x86、x64 など）

```typescript
const { cpu } = userAgent(request)
console.log(cpu.architecture) // "arm"
```

## 実用例

### デバイスベースのリダイレクト

```typescript
import { NextRequest, NextResponse, userAgent } from 'next/server'

export function middleware(request: NextRequest) {
  const { device } = userAgent(request)

  if (device.type === 'mobile') {
    return NextResponse.redirect(new URL('/mobile', request.url))
  }

  return NextResponse.next()
}
```

### ボット検出

```typescript
import { NextRequest, NextResponse, userAgent } from 'next/server'

export function middleware(request: NextRequest) {
  const { isBot } = userAgent(request)

  if (isBot) {
    // ボット用の最適化されたレスポンスを返す
    return NextResponse.rewrite(new URL('/bot-optimized', request.url))
  }

  return NextResponse.next()
}
```

### ブラウザ固有の処理

```typescript
import { NextRequest, NextResponse, userAgent } from 'next/server'

export function middleware(request: NextRequest) {
  const { browser } = userAgent(request)

  if (browser.name === 'Safari' && parseFloat(browser.version) < 14) {
    // 古い Safari ブラウザ用のフォールバック
    return NextResponse.redirect(new URL('/legacy-browser', request.url))
  }

  return NextResponse.next()
}
```

### レスポンシブビューポートの設定

```typescript
import { NextRequest, NextResponse, userAgent } from 'next/server'

export function middleware(request: NextRequest) {
  const url = request.nextUrl
  const { device } = userAgent(request)

  // デバイスタイプに基づいてビューポートを設定
  const viewport = device.type === 'mobile' ? 'mobile' :
                   device.type === 'tablet' ? 'tablet' : 'desktop'

  url.searchParams.set('viewport', viewport)
  return NextResponse.rewrite(url)
}
```

### OS 固有の最適化

```typescript
import { NextRequest, NextResponse, userAgent } from 'next/server'

export function middleware(request: NextRequest) {
  const { os } = userAgent(request)

  if (os.name === 'iOS') {
    // iOS 固有の処理
    const response = NextResponse.next()
    response.headers.set('X-Platform', 'ios')
    return response
  }

  return NextResponse.next()
}
```

### 総合的な例

```typescript
import { NextRequest, NextResponse, userAgent } from 'next/server'

export function middleware(request: NextRequest) {
  const ua = userAgent(request)
  const { device, browser, os, isBot } = ua

  console.log('User Agent Info:', {
    isBot,
    device: {
      type: device.type,
      vendor: device.vendor,
      model: device.model,
    },
    browser: {
      name: browser.name,
      version: browser.version,
    },
    os: {
      name: os.name,
      version: os.version,
    },
  })

  // ボットの場合、特別な処理
  if (isBot) {
    return NextResponse.rewrite(new URL('/bot', request.url))
  }

  // モバイルデバイスの場合、モバイルビューにリダイレクト
  if (device.type === 'mobile') {
    return NextResponse.rewrite(new URL('/mobile', request.url))
  }

  // デフォルトの処理
  return NextResponse.next()
}

export const config = {
  matcher: '/:path*',
}
```

## TypeScript での使用

TypeScript では、`userAgent` の戻り値の型は自動的に推論されます：

```typescript
import { NextRequest, userAgent } from 'next/server'

export function middleware(request: NextRequest) {
  const ua = userAgent(request)

  // ua の型は自動的に推論されます
  const isBot: boolean = ua.isBot
  const deviceType: string | undefined = ua.device.type
  const browserName: string | undefined = ua.browser.name
}
```

## 注意事項

> **Good to know**:
> - `userAgent` はミドルウェアでのみ使用できます
> - User-Agent 文字列は偽装される可能性があるため、信頼できる情報源として扱わないでください
> - セキュリティ上の判断には使用しないでください
> - UX の最適化や分析目的で使用することを推奨します

## デバイスタイプの一覧

`device.type` が返す可能性のある値：

- `mobile`: モバイルデバイス
- `tablet`: タブレットデバイス
- `smarttv`: スマートテレビ
- `console`: ゲームコンソール
- `wearable`: ウェアラブルデバイス
- `embedded`: 組み込みデバイス
- `undefined`: デスクトップまたは不明

## 主要なブラウザ名

`browser.name` が返す可能性のある値：

- `Chrome`
- `Safari`
- `Firefox`
- `Edge`
- `Opera`
- `IE` (Internet Explorer)
- その他多数

## 主要な OS 名

`os.name` が返す可能性のある値：

- `Windows`
- `macOS`
- `iOS`
- `Android`
- `Linux`
- その他多数

## バージョン履歴

| バージョン | 変更内容 |
|---------|---------|
| `v13.0.0` | `userAgent` が導入されました |
