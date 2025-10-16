# PostgreSQL拡張機能とPrisma ORMの使用方法

## PostgreSQL拡張機能とは

PostgreSQLでは、_拡張機能_というパッケージをインストールして、データベース機能を拡張できます。例えば、`citext`拡張機能は大文字小文字を区別しない文字列データ型を追加します。拡張機能を使用するには、データベースサーバーのローカルファイルシステムにインストールし、アクティブ化する必要があります。

## Prisma ORMでPostgreSQL拡張機能を使用する

`citext`拡張機能を使用する手順：

### 1. 空のマイグレーションを作成

```bash
npx prisma migrate dev --create-only
```

### 2. 拡張機能をインストールするSQLステートメントを追加

マイグレーションファイルに以下のステートメントを追加：

```sql
CREATE EXTENSION IF NOT EXISTS citext;
```

### 3. マイグレーションをデプロイ

```bash
npx prisma migrate deploy
```

### 4. 拡張機能を使用

Prisma Clientでクエリに拡張機能を使用できます。拡張機能に特殊なデータ型がある場合は、`Unsupported`型を使用してモデルのフィールドを定義できます。

```prisma
model User {
  id    Int                  @id @default(autoincrement())
  email Unsupported("citext")
}
```

## 注意事項

- v4.5.0からv6.16.0の間の`postgresqlExtensions`プレビュー機能フラグは非推奨です
- 拡張機能はデータベースサーバーに事前にインストールされている必要があります
- 一部の拡張機能は特定のPostgreSQLバージョンでのみ利用可能です

## よく使用される拡張機能

- `citext`: 大文字小文字を区別しない文字列
- `uuid-ossp`: UUID生成関数
- `pg_trgm`: 文字列の類似性検索
- `postgis`: 地理空間データのサポート
