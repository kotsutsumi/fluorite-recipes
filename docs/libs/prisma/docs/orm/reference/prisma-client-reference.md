# Prisma Clientリファレンス

Prisma Client APIの完全なリファレンスです。

## クエリ

- `findUnique`: 一意な条件でレコードを取得
- `findFirst`: 最初のレコードを取得
- `findMany`: 複数のレコードを取得
- `create`: レコードを作成
- `update`: レコードを更新
- `delete`: レコードを削除
- `upsert`: レコードを作成または更新
- `count`: レコード数をカウント
- `aggregate`: 集計クエリ
- `groupBy`: グループ化クエリ

## トランザクション

- `$transaction`: トランザクションを実行
- `$executeRaw`: 生のSQLを実行
- `$queryRaw`: 生のSQLクエリを実行

## その他のメソッド

- `$connect`: データベースに接続
- `$disconnect`: データベース接続を切断
- `$on`: イベントリスナーを登録
- `$use`: ミドルウェアを追加
- `$extends`: 拡張を追加

詳細については、[公式ドキュメント](https://www.prisma.io/docs/orm/reference/prisma-client-reference)を参照してください。
