# Prisma Migrate の概要

## 主要情報

> Prisma Migrate を使用すると、データベーススキーマを Prisma スキーマと同期させ、既存のデータを維持できます

### 特性

Prisma Migrate は *ハイブリッド* データベーススキーママイグレーションツールで、以下の要素があります：

- **宣言的**要素：Prisma スキーマで記述されたデータモデル
- **命令的**要素：カスタマイズ可能な SQL マイグレーションファイル

### 機能

- `.sql` マイグレーションファイルの履歴を生成
- 開発と本番のワークフローをサポート
- 完全にカスタマイズ可能なマイグレーションファイル

### 重要な注意事項

⚠️ **MongoDB 注意**: MongoDB の場合、migrate コマンドの代わりに `db push` を使用してください

### 推奨事項

💡 プロトタイピングには、`db push` コマンドの使用を検討してください

## 追加リソース

- [Prisma Migrate リファレンス](https://www.prisma.io/docs/orm/reference/prisma-cli-reference#prisma-migrate)
- [スキーマプロトタイピングガイド](https://www.prisma.io/docs/orm/prisma-migrate/workflows/prototyping-your-schema)

## 主要コマンド

### 開発環境

```bash
# マイグレーションを生成して適用
npx prisma migrate dev

# データベースをリセット
npx prisma migrate reset
```

### 本番環境

```bash
# マイグレーションを適用
npx prisma migrate deploy
```

### プロトタイピング

```bash
# スキーマを素早く同期
npx prisma db push
```

## ワークフロー

1. **開発**: `migrate dev` でスキーマを進化
2. **ステージング**: `migrate deploy` で変更を適用
3. **本番**: `migrate deploy` で本番に展開

Prisma Migrate は、開発から本番まで、データベーススキーマの進化を安全に管理するための包括的なソリューションを提供します。

詳細については、[公式ドキュメント](https://www.prisma.io/docs/orm/prisma-migrate/understanding-prisma-migrate/overview)を参照してください。
