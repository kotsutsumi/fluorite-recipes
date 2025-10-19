# Vercel と Contentful の統合

[Contentful](https://contentful.com/) は、Web アプリケーションのコンテンツ管理層とプレゼンテーション層を分離できるヘッドレス CMS です。この統合により、Contentful のコンテンツを Vercel にデプロイできます。

このクイックスタートガイドでは、[Vercel Contentful 統合](/integrations/contentful)を使用して、Contentful コンテンツと Vercel デプロイメント間のシームレスなアクセスを実現します。テンプレートを使用すると、デプロイ中に自動的に統合のインストールを求められます。

既に Vercel デプロイメントと Contentful アカウントをお持ちの場合は、[Contentful 統合](/integrations/contentful)をインストールしてスペースを Vercel プロジェクトに接続してください。クイックスタートで重要なポイントは以下の通りです：

- [スペース ID の取得](#contentfulスペースidの取得)
- [コンテンツ管理 API トークンの作成](#コンテンツ管理apiトークンの作成)
- [コンテンツモデルのインポート](#コンテンツモデルのインポート)
- [Contentful 環境変数の追加](#環境変数の追加)

## はじめに

Next.js、Contentful、Tailwind CSS を使用したテンプレートを用意しました。

[Next.js ブログ ドラフトモード](https://vercel.com/templates/next.js/nextjs-blog-draft-mode)

以下の手順でテンプレートをクローンしてローカルにデプロイできます：

### 1. リポジトリのクローン

テンプレートリポジトリをクローンします：

```bash
git clone https://github.com/vercel/next.js.git
cd examples/cms-contentful
```

### 2. 依存関係のインストール

```bash
pnpm install
```

### 3. Contentful スペースのセットアップ

1. [Contentful アカウント](https://www.contentful.com/sign-up/)を作成
2. 新しいスペースを作成
3. スペース ID をコピー

### 4. コンテンツ管理 API トークンの作成

1. Contentful ダッシュボードで Settings → API keys に移動
2. Add API key をクリック
3. Content Management API トークンをコピー

### 5. コンテンツモデルのインポート

Contentful CLI を使用してコンテンツモデルをインポートします：

```bash
npx contentful space import --space-id YOUR_SPACE_ID --management-token YOUR_MANAGEMENT_TOKEN --content-file contentful/export.json
```

### 6. 環境変数の設定

`.env.local` ファイルを作成し、以下の環境変数を追加：

```bash
CONTENTFUL_SPACE_ID=your_space_id
CONTENTFUL_ACCESS_TOKEN=your_access_token
CONTENTFUL_PREVIEW_ACCESS_TOKEN=your_preview_token
CONTENTFUL_PREVIEW_SECRET=your_preview_secret
```

### 7. ローカルで実行

```bash
pnpm dev
```

ブラウザで `http://localhost:3000` を開いてアプリケーションを確認します。

## Contentful からコンテンツを取得

Next.js アプリケーションで Contentful からコンテンツを取得する方法：

### Contentful クライアントの設定

```typescript
// lib/contentful.ts
import { createClient } from 'contentful';

export const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
});

export const previewClient = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN!,
  host: 'preview.contentful.com',
});
```

### コンテンツの取得

```typescript
// lib/api.ts
import { client, previewClient } from './contentful';

export async function getAllPosts(preview = false) {
  const contentfulClient = preview ? previewClient : client;

  const entries = await contentfulClient.getEntries({
    content_type: 'post',
    order: '-sys.createdAt',
  });

  return entries.items;
}

export async function getPostBySlug(slug: string, preview = false) {
  const contentfulClient = preview ? previewClient : client;

  const entries = await contentfulClient.getEntries({
    content_type: 'post',
    'fields.slug': slug,
    limit: 1,
  });

  return entries.items[0];
}
```

### ページでの使用

```typescript
// app/blog/[slug]/page.tsx
import { getAllPosts, getPostBySlug } from '@/lib/api';

export async function generateStaticParams() {
  const posts = await getAllPosts();

  return posts.map((post) => ({
    slug: post.fields.slug,
  }));
}

export default async function BlogPost({ params }) {
  const post = await getPostBySlug(params.slug);

  return (
    <article>
      <h1>{post.fields.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.fields.content }} />
    </article>
  );
}
```

## ドラフトモードの実装

Contentful の下書きコンテンツをプレビューするためのドラフトモードを実装：

### 1. ドラフトモード API ルートの作成

```typescript
// app/api/draft/route.ts
import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const slug = searchParams.get('slug');

  // シークレットを検証
  if (secret !== process.env.CONTENTFUL_PREVIEW_SECRET) {
    return new Response('Invalid token', { status: 401 });
  }

  // スラッグが存在するか確認
  if (!slug) {
    return new Response('Slug not provided', { status: 400 });
  }

  // ドラフトモードを有効化
  draftMode().enable();

  // プレビューページにリダイレクト
  redirect(`/blog/${slug}`);
}
```

### 2. ページでドラフトモードを使用

```typescript
// app/blog/[slug]/page.tsx
import { draftMode } from 'next/headers';
import { getPostBySlug } from '@/lib/api';

export default async function BlogPost({ params }) {
  const { isEnabled } = draftMode();
  const post = await getPostBySlug(params.slug, isEnabled);

  return (
    <>
      {isEnabled && (
        <div className="bg-yellow-100 p-4">
          プレビューモード - <a href="/api/exit-draft">終了</a>
        </div>
      )}
      <article>
        <h1>{post.fields.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: post.fields.content }} />
      </article>
    </>
  );
}
```

### 3. ドラフトモード終了ルート

```typescript
// app/api/exit-draft/route.ts
import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';

export async function GET() {
  draftMode().disable();
  redirect('/');
}
```

## Webhook の設定

Contentful でコンテンツが更新されたときに自動的に再デプロイ：

### 1. Deploy Hook の作成

1. Vercel ダッシュボードでプロジェクトを開く
2. Settings → Git → Deploy Hooks
3. Create Hook をクリック
4. フック名とブランチを入力
5. URL をコピー

### 2. Contentful で Webhook を設定

1. Contentful ダッシュボードで Settings → Webhooks
2. Add Webhook をクリック
3. 名前を入力（例：Vercel Deploy）
4. URL フィールドに Deploy Hook URL を貼り付け
5. トリガーを選択：
   - Entry published
   - Entry unpublished
   - Entry deleted
6. Save をクリック

## ISR（インクリメンタル静的再生成）の使用

全体を再デプロイする代わりに ISR を使用：

```typescript
// app/blog/[slug]/page.tsx
export const revalidate = 60; // 60秒ごとに再検証

export default async function BlogPost({ params }) {
  const post = await getPostBySlug(params.slug);

  return (
    <article>
      <h1>{post.fields.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.fields.content }} />
    </article>
  );
}
```

またはオンデマンド再検証：

```typescript
// app/api/revalidate/route.ts
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();

  // Contentful からの Webhook を検証
  if (body.sys.type !== 'Entry') {
    return NextResponse.json({ error: 'Invalid webhook' }, { status: 400 });
  }

  const slug = body.fields.slug['en-US'];

  try {
    await revalidatePath(`/blog/${slug}`);
    return NextResponse.json({ revalidated: true, slug });
  } catch (err) {
    return NextResponse.json({ error: 'Error revalidating' }, { status: 500 });
  }
}
```

## ベストプラクティス

### パフォーマンス最適化

- **GraphQL の使用**: REST API の代わりに GraphQL を使用して必要なフィールドのみを取得
- **キャッシング**: 適切なキャッシュ戦略を実装
- **画像最適化**: Contentful の画像 API と Next.js Image を併用

### セキュリティ

- **環境変数**: API トークンを環境変数として保存
- **Webhook 検証**: Webhook リクエストを検証
- **プレビューシークレット**: ドラフトモード用の強力なシークレットを使用

## トラブルシューティング

### コンテンツが表示されない

1. 環境変数が正しく設定されているか確認
2. Contentful スペース ID とアクセストークンが正しいか確認
3. コンテンツモデルが正しくインポートされているか確認

### プレビューモードが動作しない

1. プレビューアクセストークンが正しいか確認
2. プレビューシークレットが設定されているか確認
3. ドラフトモード API ルートが正しく実装されているか確認

## 関連リソース

- [Contentful 公式ドキュメント](https://www.contentful.com/developers/docs/)
- [Next.js ドラフトモード](/docs/app/building-your-application/configuring/draft-mode)
- [Vercel Contentful 統合](https://vercel.com/integrations/contentful)
