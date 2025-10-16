# Drizzle Kit 概要

Drizzle KitはSQL データベースマイグレーションを管理するためのCLIツールです。

## 主なコマンド

- `generate`: スキーマ変更に基づいてSQLマイグレーションファイルを作成
- `migrate`: 生成されたSQLマイグレーションファイルをデータベースに適用
- `push`: スキーマ変更をデータベースに直接プッシュ
- `pull`: データベーススキーマをイントロスペクトしてDrizzleスキーマに変換
- `studio`: データベースブラウジング用のDrizzle Studioを起動
- `check`: マイグレーションファイルの互換性を確認
- `up`: マイグレーションスナップショットをアップグレード

## 基本設定

`drizzle.config.ts`を使用して設定：

```typescript
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
});
```

## 拡張設定オプション

- 出力ディレクトリ
- データベースドライバー
- データベース認証情報
- スキーマとテーブルフィルター
- マイグレーションの命名
- イントロスペクション設定

## CLI使用法

```bash
# 異なる環境用の設定ファイルを指定
npx drizzle-kit push --config=drizzle-dev.config.ts
```

このツールは、SQLデータベース用の柔軟なマイグレーション管理を提供し、さまざまなワークフローと設定オプションをサポートします。
