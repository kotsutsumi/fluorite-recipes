# Drizzle | Gel Auth拡張機能ガイド

## 前提条件
- Gelの知識
- drizzle-kit pullの知識

## ステップ1: Gel Authスキーマを定義
`dbschema/default.esdl`に、auth拡張機能を持つGelスキーマを追加:

```edgeql
using extension auth;

module default {
  global current_user := (
    assert_single((
      select User { id, username, email }
      filter .identity = global ext::auth::ClientTokenIdentity
    ))
  );

  type User {
    required identity: ext::auth::Identity;
    required username: str;
    required email: str;
  }
}
```

## ステップ2: GelスキーマをデータベースにPush
マイグレーションを生成:
```bash
gel migration create
```

マイグレーションを適用:
```bash
gel migration apply
```

## ステップ3: Drizzle設定ファイルをセットアップ
`drizzle.config.ts`を作成:

```typescript
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'gel',
  schemaFilter: ['ext::auth', 'public']
});
```

## ステップ4: Gel型をDrizzleスキーマにPull
データベーススキーマをpull:

```bash
npx drizzle-kit pull
```

生成された`schema.ts`には、`Identity`や`User`などのGel authテーブルが含まれます。

## 結果
これで、Drizzle ORMのクエリでGel authテーブルを使用できます！ 🎉

## 主なポイント
- Gelのauth拡張機能を統合
- スキーマフィルタリングで特定のモジュールを含める
- Drizzle Kitで既存のスキーマをpull
- 認証テーブルへの型安全なアクセス
