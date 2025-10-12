# ISR Blog with Next.js and WordPress

## 概要

Next.jsとWordPressを使用した増分静的再生成(ISR)ブログの例です。

**デモ**: https://next-blog-wordpress.vercel.app/
**GitHub**: https://github.com/vercel/next.js/tree/canary/examples/cms-wordpress

## 主な機能

- Next.js 14のApp Router
- WordPressをデータソースとして使用
- 自動robots.txt生成
- 動的サイトマップ生成
- リダイレクト処理のためのミドルウェア
- Draft Modeプレビューサポート
- オンデマンドキャッシュ再検証
- Yoast SEOとのSEO統合
- GraphQLデータフェッチング
- TypeScript型生成

## 技術スタック

- **フレームワーク**: Next.js 14
- **CMS**: WordPress
- **GraphQL**: WPGraphQL
- **言語**: TypeScript

## はじめに

### 前提条件

- WordPressサイト(ローカルまたはホスト済み)
- WPGraphQLプラグイン

### 必要なWordPressプラグイン

#### 必須プラグイン

1. **WPGraphQL** - GraphQL APIを提供
2. **WPGraphQL SEO** - SEOメタデータの取得

#### 推奨プラグイン

3. **Classic Editor** - より良いコンテンツ編集体験
4. **Redirection** - リダイレクト管理
5. **Yoast SEO** - SEO最適化
6. **Advanced Custom Fields PRO** (オプション) - カスタムフィールド

### WordPressのセットアップ

#### 1. プラグインのインストール

WordPress管理画面で上記のプラグインをインストールして有効化します。

#### 2. WPGraphQLの設定

WPGraphQL設定で以下のスコープを有効化:

- 投稿
- ページ
- メディア
- カテゴリー
- タグ
- ユーザー

#### 3. 認証の設定(Draft Mode用)

WPGraphQL JWTプラグインをインストールして認証を設定:

```bash
# wp-config.phpに追加
define('GRAPHQL_JWT_AUTH_SECRET_KEY', 'your-secret-key');
```

### プロジェクトのセットアップ

#### 環境変数の設定

`.env.local`ファイルを作成:

```bash
# WordPress GraphQL URL
WORDPRESS_API_URL=https://your-wordpress-site.com/graphql

# Draft Mode用の認証情報
WORDPRESS_AUTH_REFRESH_TOKEN=your_refresh_token
WORDPRESS_PREVIEW_SECRET=your_preview_secret
```

#### 依存関係のインストール

```bash
npm install
# または
yarn install
# または
pnpm install
```

#### 開発サーバーの起動

```bash
npm run dev
# または
yarn dev
# または
pnpm dev
```

## 主要な機能

### 増分静的再生成(ISR)

記事が更新されると、WordPressウェブフックがNext.jsに通知し、該当ページを再生成:

```typescript
// app/api/revalidate/route.ts
export async function POST(request: Request) {
  const body = await request.json()

  // 特定のパスを再検証
  revalidatePath(`/posts/${body.slug}`)

  return Response.json({ revalidated: true })
}
```

### Draft Modeプレビュー

公開前の下書きをプレビュー:

```typescript
// app/api/draft/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  const slug = searchParams.get('slug')

  if (secret !== process.env.WORDPRESS_PREVIEW_SECRET) {
    return new Response('Invalid token', { status: 401 })
  }

  draftMode().enable()
  redirect(`/posts/${slug}`)
}
```

### GraphQLデータフェッチング

WPGraphQLを使用してデータを取得:

```typescript
async function fetchAPI(query: string, variables = {}) {
  const response = await fetch(process.env.WORDPRESS_API_URL!, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  })

  const json = await response.json()
  return json.data
}
```

### SEO統合

Yoast SEOデータをGraphQL経由で取得:

```graphql
query GetPost($slug: ID!) {
  post(id: $slug, idType: SLUG) {
    title
    content
    seo {
      title
      metaDesc
      opengraphImage {
        sourceUrl
      }
    }
  }
}
```

### TypeScript型生成

GraphQL CodeGenを使用して型を自動生成:

```bash
npm run codegen
```

```typescript
// 生成された型を使用
import type { Post } from '@/types/graphql'

const post: Post = await fetchPost(slug)
```

## Advanced Custom Fields統合

カスタムフィールドをGraphQLクエリに追加:

```graphql
query GetPost($slug: ID!) {
  post(id: $slug, idType: SLUG) {
    title
    content
    customFields {
      customField1
      customField2
    }
  }
}
```

## WordPressウェブフックの設定

### Next.jsに通知するウェブフックを作成

`functions.php`に追加:

```php
add_action('save_post', 'revalidate_nextjs', 10, 3);

function revalidate_nextjs($post_id, $post, $update) {
    if ($post->post_status !== 'publish') {
        return;
    }

    $url = 'https://your-nextjs-site.com/api/revalidate';

    wp_remote_post($url, [
        'body' => json_encode([
            'slug' => $post->post_name,
        ]),
        'headers' => [
            'Content-Type' => 'application/json',
        ],
    ]);
}
```

## デプロイ

### Vercelへのデプロイ

```bash
vercel deploy
```

### 環境変数の設定

本番環境で必要な環境変数:

```bash
WORDPRESS_API_URL=https://your-wordpress-site.com/graphql
WORDPRESS_AUTH_REFRESH_TOKEN=your_refresh_token
WORDPRESS_PREVIEW_SECRET=your_preview_secret
```

## パフォーマンス最適化

- ISRによる高速なページロード
- 静的生成されたページのキャッシュ
- 画像の最適化(Next.js Image)
- オンデマンド再検証

## 使用例

- 企業ブログ
- ニュースサイト
- マガジン
- コンテンツポータル

## リソース

- [WPGraphQL Documentation](https://www.wpgraphql.com/docs/introduction)
- [Next.js ISR Documentation](https://nextjs.org/docs/pages/building-your-application/data-fetching/incremental-static-regeneration)
- [WordPress Plugin Directory](https://wordpress.org/plugins/)

## ライセンス

MITライセンス
