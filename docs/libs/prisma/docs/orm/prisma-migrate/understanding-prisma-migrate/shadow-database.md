# シャドウデータベースについて

シャドウデータベースは、`prisma migrate dev` 中に自動的に作成および削除される一時的なデータベースで、スキーマドリフトやデータ損失リスクなどの潜在的な問題を検出するために使用されます。

## シャドウデータベースの仕組み

`prisma migrate dev` を実行すると、Prisma Migrate はシャドウデータベースを使用して以下を行います：

1. スキーマドリフトを検出
2. 新しいマイグレーションを生成
3. 潜在的なデータ損失を評価

### スキーマドリフトの検出

Prisma Migrate は以下によってドリフトを検出します：

- 新しいシャドウデータベースのコピーを作成
- 既存のマイグレーション履歴を再実行
- シャドウデータベースをイントロスペクト
- 最終状態を開発データベースと比較

### 新しいマイグレーションの生成

マイグレーション生成のプロセスには以下が含まれます：

- ターゲットデータベーススキーマの計算
- 既存のマイグレーション履歴との比較
- マイグレーションステップの生成
- 潜在的なデータ損失の評価
- 開発データベースへのマイグレーション適用
- シャドウデータベースの削除

## シャドウデータベースの手動設定

シャドウデータベースを手動で設定するには：

### ステップ1: 専用データベースを作成

```sql
CREATE DATABASE shadow_db;
```

### ステップ2: 接続文字列を `SHADOW_DATABASE_URL` に追加

```env
# .env
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
SHADOW_DATABASE_URL="postgresql://user:password@localhost:5432/shadow_db"
```

### ステップ3: Prisma スキーマで `shadowDatabaseUrl` を設定

```prisma
datasource db {
  provider          = "postgresql"
  url               = env("DATABASE_URL")
  shadowDatabaseUrl = env("SHADOW_DATABASE_URL")
}
```

## クラウドホストのシャドウデータベース

データベース作成を制限するクラウド環境の場合：

- 専用のクラウドホストシャドウデータベースを作成
- URL を `SHADOW_DATABASE_URL` に追加
- Prisma スキーマで `shadowDatabaseUrl` を設定

## シャドウデータベースユーザー権限

データベースタイプごとのユーザー要件：

| データベース | ユーザー要件 |
|----------|-------------------|
| SQLite | 特別な要件なし |
| MySQL/MariaDB | `*.*` に対する `CREATE, ALTER, DROP, REFERENCES` 権限 |
| PostgreSQL | スーパーユーザーまたは `CREATEDB` 権限 |
| Microsoft SQL Server | サイト管理者または `SERVER` セキュリティ保護可能 |

**重要**: シャドウデータベースは開発環境でのみ使用され、本番環境では使用されません。

## ベストプラクティス

1. **専用データベース**: シャドウデータベース専用の別のデータベースを使用
2. **権限の最小化**: 必要最小限の権限のみを付与
3. **開発環境のみ**: シャドウデータベースは開発ワークフローでのみ使用
4. **クラウド環境**: クラウドプロバイダーの制限を確認し、適切に設定

シャドウデータベースは、開発中の問題を早期に検出し、より安全なマイグレーションを可能にする重要なツールです。

詳細については、[公式ドキュメント](https://www.prisma.io/docs/orm/prisma-migrate/understanding-prisma-migrate/shadow-database)を参照してください。
