# カスタムマイグレーション

Drizzle Kitでカスタムマイグレーションを作成する方法のガイドです。

## 概要

カスタムマイグレーションを使用すると、Drizzle Kitでサポートされていない SQL変更用の空のマイグレーションファイルを生成できます。データシーディングやカスタムデータベーススキーマ変更に便利です。

## カスタムマイグレーションの生成

```bash
drizzle-kit generate --custom --name=seed-users
```

## ファイル構造例

```
📦 <project root>
 ├ 📂 drizzle
 │ ├ 📂 _meta
 │ ├ 📜 0000_init.sql 
 │ └ 📜 0001_seed-users.sql 
 ├ 📂 src
 └ …
```

## マイグレーションSQL例

```sql
-- ./drizzle/0001_seed-users.sql
INSERT INTO "users" ("name") VALUES('Dan');
INSERT INTO "users" ("name") VALUES('Andrew');
INSERT INTO "users" ("name") VALUES('Dandrew');
```

## 今後の予定

JavaScriptとTypeScriptのマイグレーションスクリプトは将来のリリースで計画されています。

## 前提条件

- Drizzle、スキーマ宣言、データベース接続、マイグレーションの知識
- Drizzle Kitの設定とコマンドの理解
