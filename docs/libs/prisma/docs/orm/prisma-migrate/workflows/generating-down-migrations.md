# ダウンマイグレーションの生成

## ダウンマイグレーションについて

ダウンマイグレーションは、対応する「アップマイグレーション」ファイルのスキーマ変更を元に戻す SQL ファイルです。データベーススキーマの変更をロールバックすることを可能にします。

## 考慮事項

- ダウンマイグレーションはスキーマ変更のみを元に戻せる
- データ変更は元に戻せない
- ビューやトリガーなど手動追加 SQL は自動的に元に戻せない
- 失敗したマイグレーションには `migrate resolve` を使用
- リレーショナルデータベースのみ適用（MongoDB 不適用）

## 生成方法

### シャドウデータベース使用

```bash
npx prisma migrate diff \
  --from-schema-datamodel prisma/schema.prisma \
  --to-migrations prisma/migrations \
  --shadow-database-url $SHADOW_DATABASE_URL \
  --script > down.sql
```

### シャドウデータベースなし

```bash
npx prisma migrate diff \
  --from-schema-datamodel prisma/schema.prisma \
  --to-schema-datasource prisma/schema.prisma \
  --script > down.sql
```

## 実行方法

```bash
# ダウンマイグレーションを実行
npx prisma db execute --file ./down.sql --schema prisma/schema.prisma

# マイグレーションをロールバック済みとしてマーク
npx prisma migrate resolve --rolled-back migration_name
```

詳細については、[公式ドキュメント](https://www.prisma.io/docs/orm/prisma-migrate/workflows/generating-down-migrations)を参照してください。
