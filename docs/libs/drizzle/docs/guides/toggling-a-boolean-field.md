# Drizzle ORM: ブールフィールドの切り替え

## 概要
このガイドでは、異なるデータベースタイプ(PostgreSQL、MySQL、SQLite)でDrizzle ORMを使用してブールフィールドの値を切り替える方法を説明します。

## コード例

```typescript
import { eq, not } from 'drizzle-orm';

const db = drizzle(...);

await db
  .update(table)
  .set({
    isActive: not(table.isActive),
  })
  .where(eq(table.id, 1));
```

## 主なポイント

- `update().set()`メソッドを使用してフィールドを切り替え
- `not()`関数を使用して現在のブール値を反転
- `where()`を使用して特定の条件で更新を適用

## データベースタイプの考慮事項

- PostgreSQL: ネイティブなboolean型をサポート
- MySQL: booleanの表現に`tinyint(1)`を使用
- SQLite: 整数の0(false)と1(true)を使用

## 前提条件

このガイドは以下の知識を前提としています:
- PostgreSQL、MySQL、SQLiteのデータベース設定
- Drizzle ORMのupdate文
- フィルタリングとnot演算子
- 異なるデータベースにおけるブールデータ型
