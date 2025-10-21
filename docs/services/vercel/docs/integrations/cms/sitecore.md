# Vercel と Sitecore XM Cloud の統合

[Sitecore XM Cloud](https://www.sitecore.com/products/xm-cloud) は、開発者とマーケターの両方のためのCMSプラットフォームです。ヘッドレスアーキテクチャを採用し、コンテンツをプレゼンテーション層から独立して管理できます。これにより、様々なチャネルやプラットフォームへのコンテンツ配信が可能になります。

このガイドでは、Vercel上のヘッドレスJavaScriptアプリケーションとSitecore XM Cloudを統合する手順を説明します。XM Cloud Deployアプリで新しいXM Cloudプロジェクトをセットアップし、新規または既存のXM Cloudウェブサイトに接続できるスタンドアロンのNext.js JSSアプリケーションを作成する方法を学びます。

このガイドで学べる主なポイントは:

1. Sitecore XM CloudからコンテンツをGraphQLエンドポイントで取得する設定
2. コンテンツ統合のためのSitecore Next.js for JSSライブラリの利用
3. VercelでのSitecoreのAPIキー、GraphQLエンドポイント、JSSアプリ名の環境変数設定

## XM Cloudプロジェクト、環境、ウェブサイトのセットアップ

### 1. XM Cloud Deployアプリへのアクセス

XM Cloud Deployアプリのアカウントにログインします。

### 2. プロジェクト作成の開始

「プロジェクト」ページに移動し、「プロジェクトを作成」を選択します。

### 3. プロジェクトの基本設定

プロジェクト名と説明を入力し、リージョンを選択します。

### 4. 環境の作成

開発、ステージング、本番環境を作成します。

### 5. ウェブサイトの作成

新しいウェブサイトを作成し、言語とテンプレートを選択します。

## Next.js JSS アプリケーションのセットアップ

### 1. Sitecore JSS CLI のインストール

```bash
pnpm add -g @sitecore-jss/sitecore-jss-cli
```

### 2. 新しい Next.js JSS プロジェクトの作成

```bash
jss create my-sitecore-app nextjs
cd my-sitecore-app
```

### 3. 依存関係のインストール

```bash
pnpm install
```

### 4. Sitecore 接続の設定

`.env.local` ファイルを作成：

```bash
# Sitecore XM Cloud 設定
SITECORE_API_HOST=https://your-instance.sitecorecloud.io
SITECORE_API_KEY=your_api_key
JSS_APP_NAME=your_app_name
GRAPH_QL_ENDPOINT=https://your-instance.sitecorecloud.io/sitecore/api/graph/edge
```

### 5. Sitecore クライアントの設定

```typescript
// lib/sitecore.ts
import {
  GraphQLRequestClient,
  GraphQLRequestClientFactory,
} from '@sitecore-jss/sitecore-jss-nextjs';

export const graphQLClientFactory = GraphQLRequestClientFactory({
  endpoint: process.env.GRAPH_QL_ENDPOINT!,
  apiKey: process.env.SITECORE_API_KEY!,
});
```

## コンテンツの取得

### GraphQL クエリの作成

```typescript
// lib/queries.ts
import { gql } from 'graphql-request';

export const GET_ROUTE_QUERY = gql`
  query GetRoute($path: String!, $language: String!) {
    route(path: $path, language: $language) {
      name
      displayName
      fields {
        name
        value
      }
      placeholders {
        name
        path
      }
    }
  }
`;

export const GET_PAGE_QUERY = gql`
  query GetPage($path: String!, $language: String!) {
    item(path: $path, language: $language) {
      id
      name
      displayName
      fields {
        name
        value
      }
    }
  }
`;
```

### ページでの使用

```typescript
// app/[[...path]]/page.tsx
import { SitecorePageProps } from 'lib/page-props';
import { sitecorePagePropsFactory } from 'lib/page-props-factory';
import { componentBuilder } from 'temp/componentBuilder';

export default async function SitecorePage({ params }: { params: { path: string[] } }) {
  const path = '/' + (params.path?.join('/') || '');

  const props = await sitecorePagePropsFactory.create({
    params: { path }
  });

  if (!props.layoutData) {
    return <div>ページが見つかりません</div>;
  }

  return <SitecorePage {...props} componentBuilder={componentBuilder} />;
}
```

## カスタムコンポーネントの作成

### 1. コンポーネントの定義

```typescript
// components/Hero.tsx
import { Field, ImageField } from '@sitecore-jss/sitecore-jss-nextjs';
import Image from 'next/image';

type HeroProps = {
  fields: {
    title: Field<string>;
    subtitle: Field<string>;
    backgroundImage: ImageField;
  };
};

export function Hero({ fields }: HeroProps) {
  return (
    <div className="relative h-96 flex items-center justify-center">
      {fields.backgroundImage?.value?.src && (
        <Image
          src={fields.backgroundImage.value.src}
          alt={fields.backgroundImage.value.alt || ''}
          fill
          className="object-cover"
        />
      )}
      <div className="relative z-10 text-center text-white">
        <h1 className="text-5xl font-bold mb-4">
          <Field field={fields.title} />
        </h1>
        <p className="text-xl">
          <Field field={fields.subtitle} />
        </p>
      </div>
    </div>
  );
}
```

### 2. コンポーネントの登録

```typescript
// temp/componentBuilder.ts
import { ComponentFactory } from '@sitecore-jss/sitecore-jss-nextjs';
import { Hero } from '@/components/Hero';

export const componentBuilder = new ComponentFactory();

componentBuilder.setComponent('Hero', Hero);
```

## パーソナライゼーション

### 1. パーソナライゼーションの設定

```typescript
// lib/personalization.ts
import { PersonalizeMiddleware } from '@sitecore-jss/sitecore-jss-nextjs';

export const personalizeMiddleware = new PersonalizeMiddleware({
  sitecoreApiHost: process.env.SITECORE_API_HOST!,
  sitecoreApiKey: process.env.SITECORE_API_KEY!,
  scope: process.env.JSS_APP_NAME!,
});
```

### 2. パーソナライズされたコンテンツの取得

```typescript
// app/[[...path]]/page.tsx
import { personalizeMiddleware } from '@/lib/personalization';

export default async function SitecorePage({ params, searchParams }) {
  const path = '/' + (params.path?.join('/') || '');

  // パーソナライゼーションを適用
  const personalizedProps = await personalizeMiddleware.getPersonalizedLayoutData({
    path,
    language: 'en',
    // ユーザーコンテキスト
    pointOfSale: searchParams.pos || 'default',
  });

  return <SitecorePage {...personalizedProps} />;
}
```

## 編集モード

### 1. 編集モードの実装

```typescript
// lib/editing.ts
import { EditingDataMiddleware } from '@sitecore-jss/sitecore-jss-nextjs';

export const editingDataMiddleware = new EditingDataMiddleware({
  sitecoreApiHost: process.env.SITECORE_API_HOST!,
  sitecoreApiKey: process.env.SITECORE_API_KEY!,
});
```

### 2. 編集モードの検出

```typescript
// lib/utils.ts
export function isEditingMode(searchParams: Record<string, string>) {
  return searchParams.sc_mode === 'edit';
}
```

### 3. 編集モードでのレンダリング

```typescript
// app/[[...path]]/page.tsx
import { isEditingMode } from '@/lib/utils';

export default async function SitecorePage({ params, searchParams }) {
  const isEditing = isEditingMode(searchParams);

  if (isEditing) {
    const editingData = await editingDataMiddleware.getEditingData({
      path: '/' + (params.path?.join('/') || ''),
      language: 'en',
    });

    return <SitecorePage {...editingData} />;
  }

  // 通常のレンダリング
}
```

## マルチサイト対応

### 1. サイト設定

```typescript
// config/sites.ts
export const sites = [
  {
    name: 'site1',
    hostname: 'site1.example.com',
    language: 'en',
    database: 'web',
  },
  {
    name: 'site2',
    hostname: 'site2.example.com',
    language: 'ja',
    database: 'web',
  },
];
```

### 2. サイトの検出

```typescript
// lib/site-resolver.ts
import { sites } from '@/config/sites';

export function getSiteByHostname(hostname: string) {
  return sites.find((site) => site.hostname === hostname);
}
```

## Webhook の設定

### 1. Deploy Hook の作成

Vercel ダッシュボードで Deploy Hook を作成

### 2. Sitecore で Webhook を設定

XM Cloud Deploy で：
1. Settings → Webhooks
2. Add webhook
3. Deploy Hook URL を入力
4. トリガーイベントを選択

## ISR（インクリメンタル静的再生成）

```typescript
// app/[[...path]]/page.tsx
export const revalidate = 60; // 60秒ごとに再検証

export async function generateStaticParams() {
  // すべてのパスを取得
  const paths = await getAllPaths();

  return paths.map((path) => ({
    path: path.split('/').filter(Boolean),
  }));
}
```

## 環境変数

`.env.local` ファイル：

```bash
SITECORE_API_HOST=https://your-instance.sitecorecloud.io
SITECORE_API_KEY=your_api_key
JSS_APP_NAME=your_app_name
GRAPH_QL_ENDPOINT=https://your-instance.sitecorecloud.io/sitecore/api/graph/edge
SITECORE_EDGE_URL=https://edge.sitecorecloud.io
SITECORE_EDGE_CONTEXT_ID=your_context_id
```

## デプロイ

### Vercel へのデプロイ

1. Vercel ダッシュボードでプロジェクトをインポート
2. 環境変数を設定
3. デプロイ

### ビルド設定

```json
{
  "buildCommand": "next build",
  "outputDirectory": ".next",
  "devCommand": "next dev",
  "installCommand": "pnpm install"
}
```

## ベストプラクティス

### パフォーマンス

- **GraphQL クエリの最適化**: 必要なフィールドのみを取得
- **画像最適化**: Next.js Image を使用
- **ISR の活用**: 適切なrevalidate値を設定

### セキュリティ

- **API キーの保護**: 環境変数として保存
- **CORS 設定**: 適切な CORS ポリシーを設定
- **認証**: 必要に応じて認証を実装

## トラブルシューティング

### コンテンツが表示されない

1. API キーが正しいか確認
2. GraphQL エンドポイントが正しいか確認
3. アプリ名が正しいか確認

### 編集モードが動作しない

1. 編集データミドルウェアが正しく設定されているか確認
2. Sitecore XM Cloud で編集権限があるか確認

## 関連リソース

- [Sitecore XM Cloud ドキュメント](https://doc.sitecore.com/xmc)
- [Sitecore JSS ドキュメント](https://doc.sitecore.com/xmc/en/developers/jss/latest/jss-xmc/index-en.html)
- [Vercel Sitecore 統合](https://vercel.com/integrations/sitecore)
