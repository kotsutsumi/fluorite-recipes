# Drizzle Seed 概要

Drizzle Seedは、データベースに入力するための決定論的で現実的な偽データを生成するTypeScriptライブラリです。

## コア概念

- シード可能な擬似乱数生成器（pRNG）を使用
- 異なる実行間で一貫したデータ生成を保証
- テスト、開発、デバッグに有用

## インストール

```bash
npm i drizzle-seed
yarn add drizzle-seed
pnpm add drizzle-seed
bun add drizzle-seed
```

## 基本的な使用法

10人のユーザーをランダムな名前とIDで作成する例：

```typescript
import { seed } from "drizzle-seed";

async function main() {
  const db = drizzle(process.env.DATABASE_URL!);
  await seed(db, { users });
}
```

## 主要なオプション

- `count`: エンティティの数を指定（デフォルト10）
- `seed`: 一意の値生成のための特定のシードを設定

## データベースのリセット

異なる戦略でデータベースをリセットできます：
- PostgreSQL: `TRUNCATE CASCADE`を使用
- MySQL: 外部キーチェックを無効化
- SQLite: 外部キープラグマを無効化

## リファインメント

以下をカスタマイズできます：
- カラム固有のジェネレーター
- テーブルごとのカスタムカウント
- 関連エンティティの生成

## 重み付きランダム

以下を使用してデータセットを作成できます：
- 重み付きカラム値生成
- 確率的エンティティ関係作成

## 制限事項

- テーブルリレーションシップの型推論が制限される
- テーブルパラメータに一部の型制限がある

このライブラリは、異なるデータベースシナリオ全体で一貫したテストデータを生成するための柔軟で強力なアプローチを提供します。
