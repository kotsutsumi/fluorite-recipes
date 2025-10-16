# drizzle-kit push

`drizzle-kit push`コマンドは、SQLマイグレーションファイルを生成せずに、スキーマ変更を直接データベースにプッシュします。

## 動作の仕組み

1. スキーマファイルを読み取り
2. スキーマのJSONスナップショットを作成
3. 現在のデータベーススキーマをプル
4. 差分に基づいてSQL変更を生成
5. マイグレーションをデータベースに適用

## 基本設定

```typescript
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
  dbCredentials: {
    url: "postgresql://user:password@host:port/dbname"
  }
});
```

## CLIオプション

```bash
npx drizzle-kit push --strict --verbose --force
```

主要オプション：
- `verbose`: SQL文を出力
- `strict`: 実行前に承認を要求
- `force`: データ損失文を自動承認

## ベストプラクティス

- 迅速なプロトタイピングに最適
- サーバーレスデータベースとの相性が良い
- ブルー/グリーンデプロイメント戦略に推奨

## 制限事項

- Expo SQLiteのような組み込みデータベースには不向き
- 特殊なデータベースドライバーには明示的な設定が必要
