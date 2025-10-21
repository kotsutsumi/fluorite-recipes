# Incremental Static Regeneration (ISR)

Incremental Static Regeneration（インクリメンタル静的再生成）は、サイト全体を再デプロイすることなく、静的コンテンツを作成または更新できる機能です。

## 概要

**利用可能なプラン**: すべてのVercelプラン

ISRを使用すると、完全な再構築を行わずに、サイトのコンテンツを動的に更新できます。

## 主な利点

### 1. パフォーマンスの向上

- 静的コンテンツの配信速度
- キャッシュの効率的な活用
- ユーザーエクスペリエンスの向上

### 2. バックエンド負荷の削減

- オリジンサーバーへのリクエスト削減
- リソース使用量の最適化
- スケーラビリティの向上

### 3. ビルド時間の短縮

- 全ページの再ビルドが不要
- デプロイ時間の削減
- 開発速度の向上

## サポートされているフレームワーク

ISRは、以下のフレームワークでサポートされています:

- **Next.js**
- **SvelteKit**
- **Nuxt**
- **Astro**
- **Gatsby**
- **カスタムフレームワーク**（Build Output APIを使用）

## Next.js App Routerでの実装例

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
- **データフェッチ**: 最新のデータを取得
- **レンダリング**: データを使用してページをレンダリング

## Cache-Controlヘッダーとの主な違い

### ISRの利点

1. **共有グローバルキャッシュ**
   - すべてのユーザーに共通のキャッシュ
   - 一貫したコンテンツ配信

2. **300msのグローバルパージ**
   - 高速なキャッシュ無効化
   - リアルタイム更新に近い

3. **即座のロールバック**
   - 問題が発生した場合、即座に前のバージョンに戻せる
   - デプロイのリスク軽減

4. **簡素化されたキャッシュエクスペリエンス**
   - 複雑なキャッシュ戦略の簡素化
   - 管理の容易さ

## ISRの動作フロー

### 1. 最初のリクエスト

```
ユーザー → Vercel CDN → (キャッシュなし) → オリジンサーバー
         ← 静的HTML生成 ← キャッシュに保存 ←
```

### 2. 再検証期間内のリクエスト

```
ユーザー → Vercel CDN → (キャッシュHIT) → 即座にレスポンス
```

### 3. 再検証期間後のリクエスト

```
ユーザー → Vercel CDN → (古いキャッシュ配信)
                      → バックグラウンドで再生成
                      → 新しいキャッシュを保存
```

## 料金に関する考慮事項

ISRは、以下の場合に使用量が発生します:

### 1. Function Invocation（関数呼び出し）

関数が呼び出されたときに課金されます。

### 2. ISR Writes/Reads（ISR書き込み/読み込み）

キャッシュの書き込みと読み込みに課金されます。

### 3. Fast Origin Transfer（高速オリジン転送）

オリジンサーバーとのデータ転送に課金されます。

詳細: [ISR Limits and Pricing](/docs/incremental-static-regeneration/limits-and-pricing)

## 実装パターン

### 時間ベースの再検証

```typescript
export const revalidate = 60; // 60秒ごとに再検証

export default async function Page() {
  const data = await fetchData();
  return <div>{data}</div>;
}
```

### オンデマンド再検証

```typescript
import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
  const secret = request.headers.get('x-revalidate-secret');

  if (secret !== process.env.REVALIDATE_SECRET) {
    return new Response('Invalid secret', { status: 401 });
  }

  revalidatePath('/blog');

  return Response.json({ revalidated: true });
}
```

## ベストプラクティス

### 1. 適切な再検証間隔の設定

コンテンツの更新頻度に応じて、適切な`revalidate`値を設定します。

**例**:
- ニュースサイト: 30-60秒
- ブログ: 3600秒（1時間）
- 商品ページ: 300秒（5分）

### 2. オンデマンド再検証の活用

コンテンツが更新されたときに、即座に再検証を実行します。

### 3. エラーハンドリング

再検証中のエラーを適切に処理します。

```typescript
export const revalidate = 60;

export default async function Page() {
  try {
    const data = await fetchData();
    return <div>{data}</div>;
  } catch (error) {
    return <div>Error loading data</div>;
  }
}
```

### 4. モニタリング

ISRの使用量とパフォーマンスを定期的に監視します。

詳細: [Observability Monitoring](/docs/observability/monitoring)

## 次のステップ

- [ISRクイックスタート](/docs/incremental-static-regeneration/quickstart)
- [ISR制限と料金](/docs/incremental-static-regeneration/limits-and-pricing)

## まとめ

Incremental Static Regenerationは、静的サイトのパフォーマンスと動的コンテンツの柔軟性を組み合わせた強力な機能です。適切に実装することで、高速なページ読み込み、低いサーバー負荷、迅速なコンテンツ更新を実現できます。
