# キャッシュ

Drizzle ORMのキャッシュ機能の包括的なガイドです。

## 概要

Drizzleは、明示的なオプトインキャッシュ戦略を提供します。

## デフォルトの動作

- デフォルトでは、クエリはキャッシュされない
- 手動のオプトインが必要
- 予期しないパフォーマンスの驚きを防止

## Upstash統合

Drizzleは、簡単なRedisベースのキャッシュ用の組み込み`upstashCache()`ヘルパーを提供：

```typescript
const db = drizzle(process.env.DB_URL!, {
  cache: upstashCache({
    url: '<UPSTASH_URL>',
    token: '<UPSTASH_TOKEN>',
    global: true,  // オプション: すべてのクエリをキャッシュ
    config: { ex: 60 }  // オプション: 有効期限を設定
  })
});
```

## キャッシュ戦略

### 1. 明示的なキャッシュ（デフォルト）

`.$withCache()`が呼び出されたときのみキャッシュ：

```typescript
const result = await db.select().from(users).$withCache();
```

### 2. グローバルキャッシュ

`global: true`で有効化し、すべてのクエリをデフォルトでキャッシュ：

```typescript
const result = await db.select().from(users);
// 特定のクエリで無効化
const result = await db.select().from(users).$withCache(false);
```

## キャッシュの無効化

### 自動無効化

ミューテーションの影響を受けるテーブルの自動無効化

### 手動無効化

```typescript
// 特定のテーブルを無効化
await db.$cache.invalidate({ tables: users });
await db.$cache.invalidate({ tables: [users, posts] });

// カスタムタグを無効化
await db.$cache.invalidate({ tags: "custom_key" });
```

## 制限事項

以下ではサポートされていません：
- 生のクエリ
- バッチ操作
- トランザクション
- リレーショナルクエリ
- 一部の特定のデータベースドライバー

## カスタムキャッシュ実装

開発者は、`get()`、`put()`、`onMutate()`などのキャッシュメソッドを実装することで、カスタムキャッシュ戦略を作成できます。

## 重要なポイント

- 明示的でオプトインのキャッシュ
- Upstashとのネイティブ統合
- 柔軟な無効化戦略
- カスタム実装のサポート
