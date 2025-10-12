# 静的レンダリング

Expo Routerで静的HTMLとCSSファイルを生成する方法を学びます。

## 静的レンダリングとは

静的レンダリングは、Webアプリケーション用の静的HTMLとCSSファイルを生成する機能です。主に検索エンジン最適化（SEO）を改善するために使用されます。

## セットアップ

### 1. app.jsonの設定

Metroバンドラーと静的レンダリングを有効にします。

```json
{
  "expo": {
    "web": {
      "bundler": "metro",
      "output": "static"
    }
  }
}
```

### 2. metro.config.jsの設定

`expo/metro-config`を拡張していることを確認します。

```javascript
// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

module.exports = getDefaultConfig(__dirname);
```

### 3. Fast Refreshの設定

React 18のFast Refreshを有効にします（react-refresh@0.14.0+が必要）。

```json
{
  "dependencies": {
    "react-refresh": "^0.14.0"
  }
}
```

## 本番デプロイ

### ビルドコマンド

```bash
npx expo export --platform web
```

このコマンドは、静的にレンダリングされたWebサイトを含む`dist`ディレクトリを生成します。

### 生成されるファイル

```
dist/
├── _expo/
│   └── static/
│       └── js/
│           └── web/
│               ├── entry.js
│               └── ...chunks.js
├── index.html
├── about.html
├── contact.html
└── ...
```

## 動的ルート

### generateStaticParams()の使用

動的ルートには、既知のルートを事前生成するために`generateStaticParams()`を使用します。

```typescript
// app/posts/[id].tsx
import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export async function generateStaticParams(): Promise<
  Record<string, string>[]
> {
  const posts = await getPosts();
  return posts.map((post) => ({ id: post.id }));
}

export default function PostScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View>
      <Text>Post ID: {id}</Text>
    </View>
  );
}

async function getPosts() {
  // APIまたはデータベースから投稿を取得
  return [
    { id: '1', title: 'First Post' },
    { id: '2', title: 'Second Post' },
    { id: '3', title: 'Third Post' },
  ];
}
```

### 生成される静的ファイル

上記の例では、以下のHTMLファイルが生成されます：

```
dist/
├── posts/
│   ├── 1.html
│   ├── 2.html
│   └── 3.html
```

## ルートHTMLのカスタマイズ

### app/+html.tsxの使用

ルートHTMLドキュメントをカスタマイズできます。

```typescript
// app/+html.tsx
import { ScrollViewStyleReset } from 'expo-router/html';

export default function Root({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <ScrollViewStyleReset />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

## メタタグの管理

### expo-router/headの使用

各ルートでメタタグを管理できます。

```typescript
// app/about.tsx
import Head from 'expo-router/head';
import { View, Text } from 'react-native';

export default function AboutScreen() {
  return (
    <>
      <Head>
        <title>About Us</title>
        <meta name="description" content="Learn more about our company" />
        <meta property="og:title" content="About Us" />
        <meta property="og:description" content="Learn more about our company" />
      </Head>
      <View>
        <Text>About Screen</Text>
      </View>
    </>
  );
}
```

## 静的ファイルの処理

### publicディレクトリ

静的アセットは`public`ディレクトリに配置します。

**プロジェクト構造**：
```
project/
├── app/
├── public/
│   ├── favicon.ico
│   ├── logo.png
│   └── robots.txt
```

**アクセス方法**：
```typescript
<Image source={{ uri: '/logo.png' }} />
```

## フォントの最適化

### 自動フォント最適化

Expo Routerは、フォントの読み込みを自動的に最適化します。

```typescript
// app/_layout.tsx
import { useFonts } from 'expo-font';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'Inter-Regular': require('../assets/fonts/Inter-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return <Slot />;
}
```

## アセットのプリロード

### リンクのプリロード

```typescript
// app/+html.tsx
export default function Root({ children }) {
  return (
    <html>
      <head>
        <link rel="preload" href="/fonts/Inter.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/images/hero.jpg" as="image" />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

## デプロイオプション

### EAS Hosting

```bash
npx expo export --platform web
eas hosting:deploy dist
```

### Netlify

```bash
npx expo export --platform web
netlify deploy --dir=dist --prod
```

### Cloudflare Pages

```bash
npx expo export --platform web
# Cloudflareダッシュボードでdistディレクトリをアップロード
```

### Vercel

```bash
npx expo export --platform web
vercel --prod
```

### GitHub Pages

```bash
npx expo export --platform web
# dist/内容をgh-pagesブランチにプッシュ
```

## 制限事項

### サーバーサイドレンダリング（SSR）未サポート

現在、サーバーサイドレンダリングはサポートされていません。

**影響**：
- 初回ページロードは静的HTML
- その後のナビゲーションはクライアントサイド

### 動的ルートの手動生成

動的ルートには`generateStaticParams()`が必要です。

**影響**：
- すべての動的ルートを事前に定義する必要があります
- 無限の動的ルートは不可能

### シングルページアプリケーション（SPA）ではない

静的レンダリングはSPAアプローチではありません。

**違い**：
- SPA: すべてのルートが1つのHTMLファイル
- 静的レンダリング: 各ルートに個別のHTMLファイル

## ベストプラクティス

### 1. generateStaticParams()を動的ルートに使用

```typescript
export async function generateStaticParams() {
  const items = await fetchItems();
  return items.map((item) => ({ id: item.id }));
}
```

### 2. publicディレクトリを活用

静的アセットは`public`ディレクトリに配置します。

```
public/
├── favicon.ico
├── robots.txt
├── sitemap.xml
└── images/
    └── logo.png
```

### 3. メタタグを最適化

SEOのためにすべてのページにメタタグを設定します。

```typescript
<Head>
  <title>Page Title</title>
  <meta name="description" content="Page description" />
  <meta property="og:title" content="Page Title" />
  <meta property="og:description" content="Page description" />
  <meta property="og:image" content="/images/og-image.jpg" />
</Head>
```

### 4. フォントの読み込みを最適化

フォントをプリロードして、パフォーマンスを向上させます。

```typescript
<link
  rel="preload"
  href="/fonts/Inter.woff2"
  as="font"
  type="font/woff2"
  crossOrigin="anonymous"
/>
```

## まとめ

Expo Routerの静的レンダリングは、以下の特徴があります：

1. **SEO改善**: 静的HTMLとCSSファイルの生成
2. **柔軟なデプロイ**: 多様なホスティングサービスをサポート
3. **メタタグ管理**: expo-router/headによる管理
4. **動的ルート対応**: generateStaticParams()による事前生成

**主な機能**：
- ルートHTMLカスタマイズ
- メタタグ管理
- 静的ファイル処理
- フォント最適化
- アセットプリロード

**デプロイオプション**：
- EAS Hosting
- Netlify
- Cloudflare Pages
- Vercel
- GitHub Pages

**制限事項**：
- SSR未サポート
- 動的ルートの手動生成
- SPAではない

**ベストプラクティス**：
- generateStaticParams()を使用
- publicディレクトリを活用
- メタタグを最適化
- フォント読み込みを最適化

これらの機能を活用して、SEOに最適化された静的WebサイトをExpo Routerで構築できます。
