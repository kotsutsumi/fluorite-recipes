# シーケンス

PostgreSQLにおけるシーケンスの包括的なガイドです。

## シーケンスの概要

シーケンスは、PostgreSQLで一意の識別子を生成するために使用される特殊な単一行テーブルです。特に、自動インクリメントするプライマリキー値に使用されます。

## 主要な機能

- スレッドセーフな一意の値生成
- カスタマイズ可能な作成と初期化
- 複数の操作関数

## 主要な関数

### 1. `nextval('sequence_name')`
シーケンスを進めて、次の値を返します。

```typescript
import { sql } from 'drizzle-orm';

await db.execute(sql`SELECT nextval('my_sequence')`);
```

### 2. `currval('sequence_name')`
現在のシーケンス値を返します。

```typescript
await db.execute(sql`SELECT currval('my_sequence')`);
```

### 3. `setval('sequence_name', value)`
シーケンスの現在値を設定します。

```typescript
await db.execute(sql`SELECT setval('my_sequence', 100)`);
```

### 4. `lastval()`
現在のセッションで生成された最後の値を返します。

```typescript
await db.execute(sql`SELECT lastval()`);
```

## 設定オプション

シーケンスは以下のオプションで設定できます：

- 開始値
- インクリメント値
- 最小値/最大値
- サイクル動作
- キャッシング

## 基本的な使用例

```typescript
import { pgSchema, pgSequence } from "drizzle-orm/pg-core";

// 基本的なシーケンス
export const customSequence = pgSequence("name");
```

## 詳細なシーケンス設定

```typescript
import { pgSequence } from "drizzle-orm/pg-core";

export const customSequence = pgSequence("name", {
  startWith: 100,
  maxValue: 10000,
  minValue: 100,
  cycle: true,
  cache: 10,
  increment: 2
});
```

### 設定パラメータの説明

- `startWith`: シーケンスの開始値
- `maxValue`: シーケンスの最大値
- `minValue`: シーケンスの最小値
- `cycle`: 最大値に達したときにサイクルするかどうか
- `cache`: パフォーマンス向上のためにキャッシュする値の数
- `increment`: 各呼び出しでのインクリメント量

## テーブルでのシーケンスの使用

```typescript
import { pgTable, integer, text, pgSequence } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const userIdSequence = pgSequence("user_id_seq");

export const users = pgTable("users", {
  id: integer("id").default(sql`nextval('user_id_seq')`).primaryKey(),
  name: text("name")
});
```

## 制限事項

シーケンスを使用する際には、以下の制限に注意してください：

### 潜在的な値のギャップ
- トランザクションのロールバック時に値がスキップされる可能性があります
- 複数のセッションで値が順序通りでない可能性があります

### 値の順序
- 異なるセッション間で値が順序通りになることは保証されません
- 複数の同時接続がある場合、順序が乱れる可能性があります

### トランザクションの動作
- シーケンスの変更はロールバックされません
- `nextval()`で取得された値は、トランザクションが失敗しても返されません

### クラッシュリカバリ
- データベースクラッシュ後に値のギャップが発生する可能性があります
- キャッシュされた値は失われる可能性があります

## ベストプラクティス

1. **適切な開始値**: データの要件に基づいて適切な開始値を設定します
2. **キャッシュの使用**: 高トラフィックシステムではキャッシュを使用してパフォーマンスを向上させます
3. **制限の理解**: シーケンスの制限を理解し、それに応じて設計します
4. **モニタリング**: 本番環境でシーケンスの使用状況を監視します

## まとめ

シーケンスは、PostgreSQLデータベースで一意の識別子を管理するための強力なツールです。適切に設定すれば、アプリケーションに信頼性の高い一意の値生成を提供できます。
