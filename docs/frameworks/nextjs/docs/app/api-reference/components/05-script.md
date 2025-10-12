# Script

`<Script>`コンポーネントは、HTMLの`<script>`要素を拡張し、サードパーティスクリプトの読み込みと実行を最適化します。

## 概要

`<Script>`コンポーネントは以下の機能を提供します:

- **最適化された読み込み**: 複数の読み込み戦略をサポート
- **パフォーマンス向上**: スクリプトの読み込みタイミングを制御
- **イベントハンドリング**: スクリプトの読み込み状態を監視
- **Web Worker対応**: 実験的機能でメインスレッドの負荷を軽減

## インポート

```typescript
import Script from 'next/script'
```

## 基本的な使い方

```typescript
import Script from 'next/script'

export default function Page() {
  return (
    <>
      <Script src="https://example.com/script.js" />
    </>
  )
}
```

## Props

### `src` (必須)

外部スクリプトのURLを指定します。絶対URLまたは内部パスを使用できます。

```typescript
// 外部スクリプト
<Script src="https://example.com/script.js" />

// 内部スクリプト
<Script src="/scripts/analytics.js" />
```

**注意**: インラインスクリプトを使用する場合は`src`は不要です。

### `strategy`

スクリプトの読み込み戦略を指定します。

#### `beforeInteractive`

Next.jsコードとページのハイドレーション前に読み込みます。

```typescript
import Script from 'next/script'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body>
        {children}
        <Script
          src="https://example.com/critical-script.js"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  )
}
```

**用途**:
- サイト全体で必要な重要なスクリプト
- Bot検出
- Cookie同意管理
- セキュリティスクリプト

**注意**:
- ルートレイアウト (`app/layout.tsx`) 内でのみ使用可能
- 常にドキュメントの`<head>`に挿入される

#### `afterInteractive` (デフォルト)

ページのハイドレーション後に読み込みます。

```typescript
<Script
  src="https://example.com/script.js"
  strategy="afterInteractive"
/>
```

**用途**:
- タグマネージャー
- アナリティクス
- すぐに必要だが、クリティカルではないスクリプト

**特徴**:
- ページの初期表示には影響しない
- デフォルトの戦略

#### `lazyOnload`

ブラウザのアイドル時間中に読み込みます。

```typescript
<Script
  src="https://example.com/script.js"
  strategy="lazyOnload"
/>
```

**用途**:
- チャットサポートウィジェット
- ソーシャルメディアウィジェット
- バックグラウンドで動作するスクリプト
- 優先度の低いスクリプト

**特徴**:
- パフォーマンスへの影響を最小化
- ユーザー体験に影響しない

#### `worker` (実験的)

Web Workerでスクリプトを実行します。

```typescript
<Script
  src="https://example.com/script.js"
  strategy="worker"
/>
```

**用途**:
- 計算集約的なスクリプト
- メインスレッドをブロックしたくないスクリプト

**注意**:
- 実験的機能
- すべてのスクリプトで動作するわけではない
- `next.config.js`で設定が必要:

```javascript
// next.config.js
module.exports = {
  experimental: {
    nextScriptWorkers: true,
  },
}
```

### イベントハンドラー

#### `onLoad`

スクリプトの読み込みが完了したときに実行されます。

```typescript
<Script
  src="https://example.com/script.js"
  onLoad={() => {
    console.log('スクリプトが読み込まれました')
  }}
/>
```

**用途**:
- スクリプト読み込み後の初期化処理
- 依存関係のあるコードの実行

#### `onReady`

スクリプトの読み込み完了後と、コンポーネントのマウント時に実行されます。

```typescript
<Script
  src="https://example.com/script.js"
  onReady={() => {
    console.log('スクリプトの準備ができました')
  }}
/>
```

**用途**:
- 初回読み込み時とコンポーネント再マウント時の両方で実行したい処理

#### `onError`

スクリプトの読み込みに失敗したときに実行されます。

```typescript
<Script
  src="https://example.com/script.js"
  onError={(e) => {
    console.error('スクリプトの読み込みに失敗しました', e)
  }}
/>
```

**用途**:
- エラーハンドリング
- フォールバック処理
- エラーログの記録

### その他のProps

- `id`: スクリプト要素のID
- `nonce`: Content Security Policy (CSP) のnonce値
- `data-*`: カスタムデータ属性

## 使用例

### Google Analytics

```typescript
import Script from 'next/script'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body>
        {children}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GA_MEASUREMENT_ID');
          `}
        </Script>
      </body>
    </html>
  )
}
```

### インラインスクリプト

```typescript
<Script id="inline-script">
  {`
    console.log('インラインスクリプトが実行されました');
  `}
</Script>
```

**注意**: インラインスクリプトには必ず`id`プロパティを指定してください。

### スクリプトの初期化処理

```typescript
'use client'

import Script from 'next/script'

export default function Page() {
  return (
    <>
      <Script
        src="https://example.com/sdk.js"
        onLoad={() => {
          // @ts-ignore
          window.ExampleSDK.init({
            apiKey: 'your-api-key',
          })
        }}
      />
    </>
  )
}
```

### 条件付きスクリプト読み込み

```typescript
'use client'

import Script from 'next/script'
import { useState, useEffect } from 'react'

export default function Page() {
  const [loadScript, setLoadScript] = useState(false)

  useEffect(() => {
    // ユーザーの同意後にスクリプトを読み込む
    const consent = localStorage.getItem('analytics-consent')
    if (consent === 'true') {
      setLoadScript(true)
    }
  }, [])

  return (
    <>
      {loadScript && (
        <Script
          src="https://example.com/analytics.js"
          strategy="afterInteractive"
        />
      )}
    </>
  )
}
```

### 複数のスクリプトの順序制御

```typescript
'use client'

import Script from 'next/script'
import { useState } from 'react'

export default function Page() {
  const [loadSecondScript, setLoadSecondScript] = useState(false)

  return (
    <>
      <Script
        src="https://example.com/first-script.js"
        strategy="afterInteractive"
        onLoad={() => {
          console.log('最初のスクリプトが読み込まれました')
          // 2番目のスクリプトを読み込む
          setLoadSecondScript(true)
        }}
      />

      {loadSecondScript && (
        <Script
          src="https://example.com/second-script.js"
          strategy="afterInteractive"
          onLoad={() => {
            console.log('2番目のスクリプトが読み込まれました')
          }}
        />
      )}
    </>
  )
}
```

### エラーハンドリング付きスクリプト

```typescript
'use client'

import Script from 'next/script'
import { useState } from 'react'

export default function Page() {
  const [scriptError, setScriptError] = useState<Error | null>(null)

  return (
    <>
      {scriptError && (
        <div className="error">
          スクリプトの読み込みに失敗しました: {scriptError.message}
        </div>
      )}

      <Script
        src="https://example.com/script.js"
        strategy="afterInteractive"
        onLoad={() => {
          console.log('スクリプトが正常に読み込まれました')
        }}
        onError={(e) => {
          console.error('スクリプトエラー:', e)
          setScriptError(e)
        }}
      />
    </>
  )
}
```

### サードパーティサービス (Stripe)

```typescript
import Script from 'next/script'

export default function CheckoutPage() {
  return (
    <>
      <Script
        src="https://js.stripe.com/v3/"
        strategy="lazyOnload"
        onLoad={() => {
          // @ts-ignore
          const stripe = window.Stripe('pk_test_...')
          console.log('Stripe SDK loaded')
        }}
      />

      {/* チェックアウトフォーム */}
    </>
  )
}
```

### Facebook Pixel

```typescript
import Script from 'next/script'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body>
        {children}
        <Script
          id="facebook-pixel"
          strategy="afterInteractive"
        >
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', 'YOUR_PIXEL_ID');
            fbq('track', 'PageView');
          `}
        </Script>
      </body>
    </html>
  )
}
```

### CSP (Content Security Policy) 対応

```typescript
import Script from 'next/script'

export default function Page({ nonce }: { nonce: string }) {
  return (
    <>
      <Script
        src="https://example.com/script.js"
        strategy="afterInteractive"
        nonce={nonce}
      />
    </>
  )
}
```

## ベストプラクティス

### 1. 適切な戦略を選択

```typescript
// ✅ 良い: クリティカルなスクリプトには beforeInteractive
<Script src="/critical.js" strategy="beforeInteractive" />

// ✅ 良い: 通常のスクリプトには afterInteractive
<Script src="/analytics.js" strategy="afterInteractive" />

// ✅ 良い: 優先度の低いスクリプトには lazyOnload
<Script src="/chat-widget.js" strategy="lazyOnload" />
```

### 2. イベントハンドラーの活用

```typescript
// ✅ 良い: onLoadで初期化処理
<Script
  src="https://example.com/sdk.js"
  onLoad={() => {
    // 初期化コード
  }}
/>

// ✅ 良い: onErrorでエラーハンドリング
<Script
  src="https://example.com/script.js"
  onError={(e) => {
    console.error('スクリプトエラー:', e)
    // フォールバック処理
  }}
/>
```

### 3. インラインスクリプトにはIDを指定

```typescript
// ✅ 良い: idを指定
<Script id="my-script">
  {`console.log('Hello');`}
</Script>

// ❌ 悪い: idなし
<Script>
  {`console.log('Hello');`}
</Script>
```

### 4. Client Componentで使用

イベントハンドラーを使用する場合は、Client Componentで使用してください:

```typescript
'use client'

import Script from 'next/script'

export default function Page() {
  return (
    <Script
      src="https://example.com/script.js"
      onLoad={() => {
        console.log('Loaded')
      }}
    />
  )
}
```

### 5. パフォーマンスを考慮

```typescript
// ✅ 良い: 必要なスクリプトのみ読み込む
// ✅ 良い: 優先度に応じて戦略を選択
// ✅ 良い: 遅延読み込みを活用

// ❌ 悪い: すべてのスクリプトを beforeInteractive にする
// ❌ 悪い: 不必要なスクリプトを読み込む
```

## トラブルシューティング

### スクリプトが実行されない

1. **戦略の確認**: 適切な`strategy`を指定しているか
2. **配置場所**: `beforeInteractive`の場合、ルートレイアウトに配置しているか
3. **イベントハンドラー**: Client Componentで使用しているか

### 複数回実行される

1. **idの指定**: インラインスクリプトに`id`を指定しているか
2. **条件分岐**: 条件付きレンダリングが適切か確認

### パフォーマンスへの影響

1. **戦略の見直し**: `lazyOnload`を使用できないか検討
2. **Web Worker**: `worker`戦略が使用可能か検討
3. **スクリプトの最小化**: 必要なスクリプトのみ読み込む

## まとめ

`<Script>`コンポーネントは、Next.jsアプリケーションでサードパーティスクリプトを最適化するための強力なツールです。適切な読み込み戦略を選択し、イベントハンドラーを活用することで、パフォーマンスとユーザーエクスペリエンスを向上させることができます。
