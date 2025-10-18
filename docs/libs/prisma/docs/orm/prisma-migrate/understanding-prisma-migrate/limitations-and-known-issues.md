# 制限事項と既知の問題

## MongoDB コネクタはサポートされていません

Prisma Migrate は現在、MongoDB コネクタをサポートしていません。

## データベースプロバイダーを自動的に切り替えることはできません

Prisma Migrate は各データベースプロバイダー固有の SQL ファイルを生成します。つまり、マイグレーションファイルは異なるデータベースシステム間で互換性がありません。

プロバイダーを切り替えようとする場合、以下を行う必要があります：

- datasource ブロックの `provider` と `url` を変更
- 既存のマイグレーション履歴を削除
- `prisma migrate dev` を実行して新しいマイグレーション履歴を作成

> 注意: 新しいマイグレーションは `schema.prisma` の内容のみを含み、新しいデータベースは空になります。

## データベースリセット時のデータ損失

開発環境では、Prisma Migrate がデータベースリセットを促す場合があり、データ損失が発生します。これは以下の場合に発生します：

- 明示的に `prisma migrate reset` を呼び出す
- `prisma migrate dev` を実行してドリフトまたはマイグレーション競合が検出された

これらのコマンドは開発専用であり、本番データに影響を与えるべきではありません。

`package.json` にシードスクリプトが存在する場合、Prisma Migrate はリセット後にシードをトリガーします。

## Prisma Migrate と PgBouncer

PgBouncer を使用している場合、以下のエラーが発生する可能性があります：

```
Error: undefined: Database error
Error querying the database: db error: ERROR: prepared statement "s0" already exists
```

回避策は Prisma ドキュメントで利用可能です。

## 非対話的環境での Prisma Migrate

Prisma ORM は非対話的環境（Docker、スクリプト、bash シェル）を検出し、`migrate dev` がサポートされていないと警告します。

これを解決するには、Docker イメージをインタラクティブモードで実行します：

```bash
docker run --interactive --tty <image name>
# または
docker -it <image name>
```

## まとめ

Prisma Migrate には以下の制限があります：

- MongoDB はサポートされていない
- データベースプロバイダー間の自動切り替えは不可
- 開発環境でのデータ損失の可能性
- PgBouncer との互換性問題
- 非対話的環境での制限

これらの制限を理解し、適切に対処することで、Prisma Migrate を効果的に使用できます。

詳細については、[公式ドキュメント](https://www.prisma.io/docs/orm/prisma-migrate/understanding-prisma-migrate/limitations-and-known-issues)を参照してください。
