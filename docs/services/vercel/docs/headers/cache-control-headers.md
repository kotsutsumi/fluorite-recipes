# Cache-Control Headers（キャッシュ制御ヘッダー）

Cache-Controlヘッダーは、ネットワークキャッシュとブラウザキャッシュの動作を制御するための重要なツールです。

## デフォルトのCache-Control値

Vercelのデフォルト設定:

```
cache-control: public, max-age=0, must-revalidate
```

この設定は、CDNとブラウザの両方にキャッシュしないよう指示します。

## 推奨設定

推奨される設定:

```
Cache-Control: max-age=0, s-maxage=86400
```

### この設定の意味

- **max-age=0**: ブラウザにキャッシュしないよう指示
- **s-maxage=86400**: VercelのCDNに86400秒（24時間）キャッシュを許可

この設定により、デプロイメント更新時にキャッシュが自動的に無効化されます。

## 主要なディレクティブ

### s-maxage

CDNがレスポンスを「新鮮」と見なす秒数を設定します。

**範囲**:
- 最小値: 1秒
- 最大値: 31,536,000秒（1年）

**例**:

```
Cache-Control: s-maxage=60
```

この設定では、レスポンスが60秒間キャッシュされます。

### stale-while-revalidate

バックグラウンドでキャッシュを更新しながら、キャッシュされたコンテンツを配信します。

**使用ケース**:
- 頻繁に変更されるコンテンツ
- 再生成に時間がかかるコンテンツ

**例**:

```
Cache-Control: s-maxage=1, stale-while-revalidate=59
```

### この動作

1. 最初のリクエスト: 新しいレスポンスを生成し、1秒間キャッシュ
2. 1秒後のリクエスト: 古いキャッシュを即座に配信し、バックグラウンドで更新
3. 更新完了後: 新しいレスポンスが次回のリクエストで配信される

**注意**: `stale-while-revalidate`は最終的なHTTPレスポンスには含まれません。

## 追加のヘッダー

### CDN-Cache-Control

CDNでのキャッシュを明示的に制御します。

**特徴**:
- Cache-Controlと同じディレクティブを使用可能
- 標準のCache-Controlを上書き

**例**:

```typescript
export async function GET() {
  return new Response('CDN Cache example', {
    status: 200,
    headers: {
      'Cache-Control': 'max-age=10',
      'CDN-Cache-Control': 'max-age=60',
    },
  });
}
```

### Vercel-CDN-Cache-Control

Vercel専用のキャッシュ制御ヘッダー。

**特徴**:
- Vercelでのみ有効
- 最も高い優先度
- クライアントに送信される前にレスポンスから削除される

**例**:

```typescript
export async function GET() {
  return new Response('Vercel CDN Cache example', {
    status: 200,
    headers: {
      'Cache-Control': 'max-age=10',
      'CDN-Cache-Control': 'max-age=60',
      'Vercel-CDN-Cache-Control': 'max-age=3600',
    },
  });
}
```

## ヘッダーの優先順位

キャッシュ動作の優先順位:

1. **Vercel-CDN-Cache-Control** (最優先)
2. **CDN-Cache-Control**
3. **Cache-Control**

## 実装例（Next.js App Router）

```typescript
export async function GET() {
  return new Response('Cache Control example', {
    status: 200,
    headers: {
      'Cache-Control': 'max-age=10',
      'CDN-Cache-Control': 'max-age=60',
      'Vercel-CDN-Cache-Control': 'max-age=3600',
    },
  });
}
```

### この例の動作

- **ブラウザ**: 10秒間キャッシュ
- **一般的なCDN**: 60秒間キャッシュ
- **Vercel CDN**: 3600秒（1時間）キャッシュ

## ベストプラクティス

### 1. 適切なs-maxageの設定

コンテンツの更新頻度に応じて適切な値を設定します。

### 2. stale-while-revalidateの活用

ユーザーエクスペリエンスを向上させるために、適切に使用します。

### 3. デプロイメント更新を考慮

デプロイメント更新時にキャッシュが自動的に無効化されることを活用します。

### 4. ブラウザとCDNのバランス

ブラウザとCDNのキャッシュ期間を適切にバランスさせます。

この包括的なガイドにより、Vercelプラットフォームで効果的なキャッシュ戦略を実装することができます。
