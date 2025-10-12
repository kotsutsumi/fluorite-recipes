# CSS-in-JS

Next.js App Router では、クライアントコンポーネントで CSS-in-JS ライブラリを使用できます。このガイドでは、設定方法とサポートされているライブラリについて説明します。

## 重要なポイント

- CSS-in-JS ライブラリはクライアントコンポーネントでサポートされています
- 設定には3ステップのオプトインプロセスが必要です
- ライブラリは React 18 の機能と並行レンダリングをサポートしている必要があります

## サポートされているライブラリ

以下のライブラリがサポートされています：

- **styled-jsx** - Next.js に組み込み
- **Styled Components**
- **Emotion**
- **MUI (Material-UI)**
- **Chakra UI**
- **Tamagui**
- **Kuma UI**
- **Pandacss**
- その他多数

## 設定プロセス

CSS-in-JS を使用するには、以下の3つのステップが必要です：

1. **スタイルレジストリの作成**
2. **`useServerInsertedHTML` フックの使用**
3. **クライアントコンポーネントでアプリをラップ**

### 例：Styled Components の設定

#### 1. ライブラリのインストール

```bash
npm install styled-components
```

#### 2. スタイルレジストリコンポーネントの作成

```typescript
'use client'

import React, { useState } from 'react'
import { useServerInsertedHTML } from 'next/navigation'
import { ServerStyleSheet, StyleSheetManager } from 'styled-components'

export default function StyledComponentsRegistry({
  children,
}: {
  children: React.ReactNode
}) {
  // サーバーコンポーネントで再レンダリングされた時のみ、スタイルシートを作成
  const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet())

  useServerInsertedHTML(() => {
    const styles = styledComponentsStyleSheet.getStyleElement()
    styledComponentsStyleSheet.instance.clearTag()
    return <>{styles}</>
  })

  if (typeof window !== 'undefined') return <>{children}</>

  return (
    <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
      {children}
    </StyleSheetManager>
  )
}
```

#### 3. ルートレイアウトでラップ

```typescript
import StyledComponentsRegistry from './lib/registry'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  )
}
```

#### 4. TypeScript 設定（オプション）

TypeScript を使用している場合、`next.config.js` で以下の設定を追加：

```javascript
// next.config.js
module.exports = {
  compiler: {
    styledComponents: true,
  },
}
```

### 例：Emotion の設定

#### 1. ライブラリのインストール

```bash
npm install @emotion/react @emotion/styled @emotion/cache
```

#### 2. スタイルレジストリコンポーネントの作成

```typescript
'use client'

import { useServerInsertedHTML } from 'next/navigation'
import { CacheProvider } from '@emotion/react'
import createCache from '@emotion/cache'
import { useState } from 'react'

export default function EmotionRegistry({
  children,
}: {
  children: React.ReactNode
}) {
  const [cache] = useState(() => {
    const cache = createCache({ key: 'css' })
    cache.compat = true
    return cache
  })

  useServerInsertedHTML(() => {
    return (
      <style
        data-emotion={`${cache.key} ${Object.keys(cache.inserted).join(' ')}`}
        dangerouslySetInnerHTML={{
          __html: Object.values(cache.inserted).join(' '),
        }}
      />
    )
  })

  return <CacheProvider value={cache}>{children}</CacheProvider>
}
```

## 動作の仕組み

### サーバーサイドレンダリング

1. **レンダリング中**: スタイルが収集される
2. **HTML 生成**: スタイルがインラインで挿入される
3. **クライアント送信**: スタイルを含む完全な HTML が送信される

### クライアントサイドハイドレーション

1. **初期表示**: サーバーから送られたスタイルを使用
2. **ハイドレーション後**: CSS-in-JS ライブラリが制御を引き継ぐ
3. **動的更新**: ライブラリが新しいスタイルを管理

## ベストプラクティス

### 1. クライアントコンポーネントを使用

スタイルレジストリは必ずクライアントコンポーネント（`'use client'`）として実装してください。

```typescript
'use client'

import { useServerInsertedHTML } from 'next/navigation'
// ...
```

### 2. パフォーマンスの最適化

- スタイルの抽出はサーバーレンダリング中に行われます
- 不要な再レンダリングを避けるため、`useState` でスタイルシートをメモ化します
- ハイドレーション後、CSS-in-JS ライブラリが通常通り動作します

### 3. Server Components との併用

- CSS-in-JS はクライアントコンポーネントでのみ使用可能
- Server Components では、CSS Modules や Tailwind CSS を使用することを推奨
- 必要に応じてクライアントコンポーネントでラップ

## トラブルシューティング

### スタイルが適用されない

1. スタイルレジストリがルートレイアウトで正しくラップされているか確認
2. `'use client'` ディレクティブが記述されているか確認
3. ライブラリが React 18+ に対応しているか確認

### サーバーエラーが発生する

1. `useServerInsertedHTML` を正しく使用しているか確認
2. ライブラリのバージョンが最新か確認
3. 並行レンダリングに対応しているライブラリか確認

## まとめ

CSS-in-JS は Next.js App Router で引き続き使用できますが、適切な設定が必要です。新しいプロジェクトでは、CSS Modules や Tailwind CSS などの他のスタイリング方法も検討することをお勧めします。各アプローチには独自の利点があり、プロジェクトの要件に応じて選択してください。
