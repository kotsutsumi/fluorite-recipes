# ISR クイックスタート

Incremental Static Regeneration（ISR）を使い始めるための包括的なガイドです。

## 概要

ISRを使用すると、サイト全体を再構築および再デプロイすることなく、ページを再生成できます。

## 再生成のトリガー方法

ISRには、2つの再生成トリガー方法があります:

1. **Background Revalidation（バックグラウンド再検証）**
2. **On-Demand Revalidation（オンデマンド再検証）**

## 前提条件

- Vercelアカウント
- Vercelプロジェクト
- Vercel CLIがインストールされている

### Vercel CLIのインストール

```bash
pnpm i -g vercel
```

## 1. Background Revalidation（バックグラウンド再検証）

バックグラウンド再検証は、指定された間隔でISRルートのキャッシュを自動的にパージします。

### Next.js App Routerでの実装

#### ルートセグメント設定を使用

```typescript
export const revalidate = 10; // 秒単位

export default async function Page() {
  const res = await fetch('https://api.vercel.app/blog');
  const posts = (await res.json()) as Post[];

  return (
    <ul>
      {posts.map((post: Post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

### コードの説明

- **`export const revalidate = 10;`**: 10秒ごとにページを再検証
- **データフェッチ**: APIから最新のブログ投稿を取得
- **レンダリング**: 取得したデータを使用してページをレンダリング

### 動作フロー

1. **最初のリクエスト**: 静的HTMLを生成し、キャッシュに保存
2. **10秒以内のリクエスト**: キャッシュされたHTMLを即座に配信
3. **10秒後のリクエスト**: 古いキャッシュを配信し、バックグラウンドで再生成
4. **再生成完了後**: 次のリクエストから新しいキャッシュを配信

## 2. On-Demand Revalidation（オンデマンド再検証）

オンデマンド再検証を使用すると、任意のタイミングでISRルートのキャッシュをパージできます。

### 実装手順

#### ステップ1: 環境変数の作成

再検証シークレットのための環境変数を作成します。

**.env.local**:

```
MY_SECRET_TOKEN=your-secret-token-here
```

#### ステップ2: APIルートの作成

再検証をトリガーするAPIルートを作成します。

**app/api/revalidate/route.ts**:

```typescript
import { revalidatePath } from 'next/cache';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // シークレットトークンの検証
  if (searchParams.get('secret') !== process.env.MY_SECRET_TOKEN) {
    return new Response('Invalid credentials', { status: 401 });
  }

  // パスの再検証
  revalidatePath('/blog-posts');

  return Response.json({
    revalidated: true,
    now: Date.now(),
  });
}
```

### APIの使用方法

#### 再検証のトリガー

```bash
curl https://your-domain.com/api/revalidate?secret=your-secret-token-here
```

#### レスポンス例

```json
{
  "revalidated": true,
  "now": 1705320000000
}
```

### セキュリティのベストプラクティス

1. **シークレットトークンの保護**
   - 環境変数に保存
   - コードにハードコードしない
   - 定期的にトークンを更新

2. **アクセス制御**
   - 信頼できるソースからのみアクセスを許可
   - IPアドレス制限を検討

3. **レート制限**
   - 過度な再検証リクエストを防止

## 特定のパスの再検証

### 単一パスの再検証

```typescript
import { revalidatePath } from 'next/cache';

export async function GET(request: Request) {
  revalidatePath('/blog-posts');
  return Response.json({ revalidated: true });
}
```

### 複数パスの再検証

```typescript
import { revalidatePath } from 'next/cache';

export async function GET(request: Request) {
  revalidatePath('/blog-posts');
  revalidatePath('/about');
  revalidatePath('/contact');

  return Response.json({ revalidated: true });
}
```

### タグベースの再検証

```typescript
import { revalidateTag } from 'next/cache';

export async function GET(request: Request) {
  revalidateTag('blog');
  return Response.json({ revalidated: true });
}
```

**データフェッチ時のタグ設定**:

```typescript
export default async function Page() {
  const res = await fetch('https://api.vercel.app/blog', {
    next: { tags: ['blog'] },
  });
  const posts = await res.json();

  return <div>{/* posts */}</div>;
}
```

## 実装例（完全版）

### ブログシステムでの使用

**app/blog/[slug]/page.tsx**:

```typescript
export const revalidate = 3600; // 1時間ごとに再検証

interface Post {
  slug: string;
  title: string;
  content: string;
}

export default async function BlogPost({
  params,
}: {
  params: { slug: string };
}) {
  const res = await fetch(`https://api.vercel.app/blog/${params.slug}`, {
    next: { tags: ['blog', `post-${params.slug}`] },
  });
  const post = (await res.json()) as Post;

  return (
    <article>
      <h1>{post.title}</h1>
      <div>{post.content}</div>
    </article>
  );
}
```

**app/api/revalidate/route.ts**:

```typescript
import { revalidatePath, revalidateTag } from 'next/cache';

export async function POST(request: Request) {
  const body = await request.json();
  const { secret, type, value } = body;

  if (secret !== process.env.REVALIDATE_SECRET) {
    return new Response('Invalid secret', { status: 401 });
  }

  if (type === 'path') {
    revalidatePath(value);
  } else if (type === 'tag') {
    revalidateTag(value);
  }

  return Response.json({ revalidated: true, type, value });
}
```

### WebhookからのトリガーExample

CMSからのWebhookを使用してコンテンツを自動的に更新:

```typescript
export async function POST(request: Request) {
  const body = await request.json();
  const { webhookSecret, postSlug } = body;

  // Webhookシークレットの検証
  if (webhookSecret !== process.env.WEBHOOK_SECRET) {
    return new Response('Invalid webhook', { status: 401 });
  }

  // 特定の投稿を再検証
  revalidateTag(`post-${postSlug}`);

  return Response.json({
    message: 'Post revalidated successfully',
    postSlug,
  });
}
```

## トラブルシューティング

### 再検証が機能しない場合

1. **シークレットトークンの確認**
   - 環境変数が正しく設定されているか確認

2. **パスの確認**
   - 再検証するパスが正しいか確認

3. **キャッシュの確認**
   - `x-vercel-cache`ヘッダーでキャッシュステータスを確認

### パフォーマンスの問題

1. **再検証間隔の調整**
   - 適切な`revalidate`値を設定

2. **オンデマンド再検証の活用**
   - 頻繁に変更されるコンテンツには、オンデマンド再検証を使用

## 次のステップ

- [ISR制限と料金を確認](/docs/incremental-static-regeneration/limits-and-pricing)
- [Observabilityでモニタリング](/docs/observability/monitoring)

## テンプレート

ISRをすぐに始めるためのテンプレート:

- Next.js Blog with ISR
- E-commerce with ISR
- Documentation Site with ISR

## まとめ

ISRを使用することで、サイトのパフォーマンスを維持しながら、コンテンツを柔軟に更新できます。バックグラウンド再検証とオンデマンド再検証を組み合わせることで、最適なコンテンツ配信戦略を実現できます。
