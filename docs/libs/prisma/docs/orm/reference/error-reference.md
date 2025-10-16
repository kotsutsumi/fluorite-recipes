# エラーメッセージリファレンス

## Prisma Client エラータイプ

### `PrismaClientKnownRequestError`

`PrismaClientKnownRequestError` は、クエリエンジンが既知のリクエスト関連エラーを返したときにスローされます。

**プロパティ**：
- `code`: Prisma 固有のエラーコード
- `meta`: 追加のエラー情報
- `message`: エラーメッセージ
- `clientVersion`: Prisma Client のバージョン

### `PrismaClientUnknownRequestError`

クエリエンジンが特定のエラーコードなしでエラーを返したときにスローされます。

### `PrismaClientRustPanicError`

基盤となるエンジンがクラッシュし、ゼロ以外の終了コードで終了したときに発生します。

### `PrismaClientInitializationError`

クエリエンジンの起動時または初期データベース接続時にスローされます。以下のような場合に発生します：
- 無効なデータベース認証情報
- データベースサーバーが起動していない
- 環境変数が見つからない

### `PrismaClientValidationError`

検証の失敗時に発生します。以下のような場合：
- 必須フィールドの欠落
- 不正なフィールド型

## エラーコード

### 共通エラー

#### `P1000`: 認証失敗
"Authentication failed against database server at `{database_host}`"

データベースサーバーに対する認証が失敗しました。認証情報を確認してください。

#### `P1001`: データベースサーバーに到達できない
"Can't reach database server at `{database_host}`:`{database_port}`"

データベースサーバーに接続できません。サーバーが起動していること、ホストとポートが正しいことを確認してください。

#### `P1002`: データベースサーバーのタイムアウト
"Database server timed out at `{database_host}`:`{database_port}`"

データベースサーバーとの接続がタイムアウトしました。

#### `P1003`: データベースが存在しない
"Database `{database_name}` does not exist at `{database_host}`:`{database_port}`"

指定されたデータベースが存在しません。

#### `P1008`: 操作がタイムアウト
"Operations timed out after `{time}`"

操作が指定された時間内に完了しませんでした。

#### `P1009`: データベースが既に存在
"Database `{database_name}` already exists on the database server"

作成しようとしているデータベースが既に存在します。

#### `P1010`: アクセス拒否
"User `{user}` was denied access on the database `{database_name}`"

ユーザーにデータベースへのアクセス権限がありません。

#### `P1011`: TLS 接続エラー
"Error opening a TLS connection"

TLS/SSL 接続の確立中にエラーが発生しました。

#### `P1012`: スキーマ検証エラー
"Schema validation error"

Prisma スキーマに検証エラーがあります。

#### `P1013`: 提供されたデータベース文字列が無効
"The provided database string is invalid"

データベース接続文字列の形式が正しくありません。

#### `P1014`: モデルが存在しない
"The model `{model}` does not exist"

参照されているモデルが Prisma スキーマに存在しません。

#### `P1015`: サポートされていない機能
"Your Prisma schema is using features that are not supported for your version"

使用している機能が現在の Prisma バージョンでサポートされていません。

#### `P1016`: Raw クエリのパラメータ数が正しくない
"Raw query parameter count incorrect"

Raw SQL クエリのパラメータ数が一致しません。

#### `P1017`: サーバーが接続を閉じた
"Server has closed the connection"

データベースサーバーが接続を閉じました。

### Prisma Client クエリエンジンエラー

#### `P2000`: 値が長すぎる
"Provided value for column is too long"

カラムに提供された値が、許可されている最大長を超えています。

#### `P2001`: レコードが見つからない
"Record searched for does not exist"

検索対象のレコードが存在しません。

#### `P2002`: 一意制約違反
"Unique constraint failed on the `{constraint}`"

一意制約に違反しています。指定されたフィールドに重複する値が存在します。

#### `P2003`: 外部キー制約失敗
"Foreign key constraint failed on the field: `{field_name}`"

外部キー制約に違反しています。

#### `P2004`: データベース制約失敗
"A constraint failed on the database: `{database_error}`"

データベースレベルの制約に違反しています。

#### `P2005`: 無効な値
"Invalid value stored in the database: `{database_value}`"

データベースに格納されている値が無効です。

#### `P2006`: 提供された値が無効
"Provided value `{provided_value}` is not valid"

提供された値がフィールドの型に対して無効です。

#### `P2007`: データ検証エラー
"Data validation error `{database_error}`"

データ検証中にエラーが発生しました。

#### `P2008`: クエリ解析エラー
"Failed to parse the query `{query_parsing_error}`"

クエリの解析に失敗しました。

#### `P2009`: クエリ検証エラー
"Failed to validate the query: `{query_validation_error}`"

クエリの検証に失敗しました。

#### `P2010`: Raw クエリ失敗
"Raw query failed: `{database_error}`"

Raw SQL クエリの実行に失敗しました。

#### `P2011`: Null 制約違反
"Null constraint violation on the `{constraint}`"

Null を許可しないフィールドに Null 値が提供されました。

#### `P2012`: 必須値の欠落
"Missing a required value at `{path}`"

必須の値が提供されていません。

#### `P2013`: 必須引数の欠落
"Missing the required argument `{argument_name}` for field `{field_name}`"

フィールドの必須引数が欠落しています。

#### `P2014`: 関連レコード違反
"The change you are trying to make would violate the required relation `{relation_name}`"

必須のリレーションに違反する変更を試みています。

#### `P2015`: 関連レコードが見つからない
"A related record could not be found. `{details}`"

関連するレコードが見つかりませんでした。

#### `P2016`: クエリ解釈エラー
"Query interpretation error. `{details}`"

クエリの解釈中にエラーが発生しました。

#### `P2017`: レコードが接続されていない
"The records for relation `{relation_name}` are not connected"

リレーションのレコードが接続されていません。

#### `P2018`: 必須の接続レコードが見つからない
"Required connected records were not found. `{details}`"

必須の接続レコードが見つかりませんでした。

#### `P2019`: 入力エラー
"Input error. `{details}`"

入力データにエラーがあります。

#### `P2020`: 値が範囲外
"Value out of range for the type. `{details}`"

値が型の範囲外です。

#### `P2021`: テーブルが存在しない
"The table `{table}` does not exist in the current database"

指定されたテーブルがデータベースに存在しません。

#### `P2022`: カラムが存在しない
"The column `{column}` does not exist in the current database"

指定されたカラムがデータベースに存在しません。

#### `P2023`: 不整合なカラムデータ
"Inconsistent column data: `{message}`"

カラムデータに不整合があります。

#### `P2024`: 接続プールからの接続取得タイムアウト
"Timed out fetching a new connection from the connection pool"

接続プールから新しい接続を取得する際にタイムアウトしました。

#### `P2025`: レコードが見つからない
"An operation failed because it depends on one or more records that were required but not found. `{cause}`"

必要なレコードが見つからなかったため、操作が失敗しました。

#### `P2026`: サポートされていない機能
"The current database provider doesn't support a feature that the query used: `{feature}`"

クエリで使用されている機能がデータベースプロバイダーでサポートされていません。

#### `P2027`: 複数のエラー
"Multiple errors occurred on the database during query execution: `{errors}`"

クエリ実行中にデータベースで複数のエラーが発生しました。

#### `P2028`: トランザクション API エラー
"Transaction API error: `{error}`"

トランザクション API でエラーが発生しました。

#### `P2029`: クエリパラメータ数の制限超過
"Query parameter limit exceeded error: `{details}`"

クエリパラメータ数が制限を超えています。

#### `P2030`: フルテキストインデックスが見つからない
"Cannot find a fulltext index to use for the search"

検索に使用するフルテキストインデックスが見つかりません。

#### `P2031`: MongoDB トランザクションエラー
"Transaction error: `{details}`"

MongoDB でトランザクションエラーが発生しました。

#### `P2033`: 数値が JSON の範囲外
"A number used in the query does not fit into a 64 bit signed integer"

クエリで使用されている数値が 64 ビット符号付き整数の範囲に収まりません。

#### `P2034`: トランザクション競合
"Transaction failed due to a write conflict or a deadlock"

書き込み競合またはデッドロックによりトランザクションが失敗しました。

### Prisma Migrate スキーマエンジンエラー

#### `P3000`: データベース作成失敗
"Failed to create database: `{database_error}`"

データベースの作成に失敗しました。

#### `P3001`: 破壊的マイグレーションの可能性
"Migration possible with potential data loss"

データ損失の可能性がある破壊的なマイグレーションです。

#### `P3002`: ロールバックの試行
"The attempted migration was rolled back: `{database_error}`"

マイグレーションがロールバックされました。

#### `P3003`: マイグレーション形式が無効
"The format of migrations changed, the saved migrations are no longer valid"

マイグレーションの形式が変更され、保存されているマイグレーションが無効になりました。

#### `P3004`: データベーススキーマが空でない
"The database schema is not empty"

データベーススキーマが空ではありません。

#### `P3005`: 空でないデータベース
"The database schema is not empty. Read more about how to baseline an existing production database"

データベーススキーマが空ではありません。既存の本番データベースのベースライン化について詳細を確認してください。

#### `P3006`: 自動マイグレーション作成失敗
"Migration failed to apply cleanly to the shadow database"

シャドウデータベースへのマイグレーション適用に失敗しました。

#### `P3007`: プレビュー機能エラー
"Some of the requested preview features are not yet allowed in migration engine"

リクエストされたプレビュー機能の一部がマイグレーションエンジンでまだ許可されていません。

#### `P3008`: マイグレーションが既に適用済み
"The migration `{migration_name}` is already recorded as applied in the database"

マイグレーションは既にデータベースに適用済みとして記録されています。

#### `P3009`: マイグレーションが見つからない
"Failed migrations: `{migration_names}`"

マイグレーションが失敗しました。

#### `P3010`: マイグレーション名が無効
"The name of the migration is invalid"

マイグレーション名が無効です。

#### `P3011`: マイグレーションが見つからない
"Migration `{migration_name}` cannot be rolled back because it was never applied to the database"

マイグレーションがデータベースに適用されていないため、ロールバックできません。

#### `P3012`: マイグレーションが見つからない
"Migration `{migration_name}` cannot be rolled back because it is not in a failed state"

マイグレーションが失敗状態ではないため、ロールバックできません。

#### `P3013`: プロバイダー配列が指定されている
"Datasource provider arrays are not supported with this command"

このコマンドではデータソースプロバイダー配列がサポートされていません。

#### `P3014`: シャドウデータベース作成エラー
"Prisma Migrate could not create the shadow database"

Prisma Migrate がシャドウデータベースを作成できませんでした。

#### `P3015`: マイグレーションファイルが見つからない
"Could not find the migration file at `{migration_file_path}`"

指定されたマイグレーションファイルが見つかりませんでした。

#### `P3016`: データベース削除失敗
"Failed to drop database: `{database_error}`"

データベースの削除に失敗しました。

#### `P3017`: マイグレーションが見つからない
"The migration `{migration_name}` could not be found"

指定されたマイグレーションが見つかりませんでした。

#### `P3018`: 破壊的変更の検出
"A migration failed to apply. New migrations cannot be applied before the error is recovered from"

マイグレーションの適用に失敗しました。エラーから回復するまで新しいマイグレーションを適用できません。

#### `P3019`: データソースプロバイダー配列
"The datasource provider `{provider}` specified in your schema does not match the one specified in the migration"

スキーマで指定されたデータソースプロバイダーがマイグレーションで指定されたものと一致しません。

#### `P3020`: 組み込みエンジンプロトコルバージョン
"The automatic creation of shadow databases is disabled on Postgres"

PostgreSQL でシャドウデータベースの自動作成が無効になっています。

#### `P3021`: 外部キー制約エラー
"Foreign keys cannot reference fields across databases"

外部キーはデータベース間のフィールドを参照できません。

### Prisma Accelerate エラー

#### `P6000`: サーバーエラー
"Server error"

サーバーでエラーが発生しました。

#### `P6001`: 認証エラー
"Authentication error"

認証に失敗しました。

#### `P6002`: 無効なリクエスト
"Invalid request"

リクエストが無効です。

#### `P6003`: タイムアウト
"Query timed out"

クエリがタイムアウトしました。

#### `P6004`: レート制限
"Rate limit exceeded"

レート制限を超えました。

#### `P6005`: 接続エラー
"Connection error"

接続エラーが発生しました。

#### `P6006`: リソース制限
"Resource limit exceeded"

リソース制限を超えました。

#### `P6007`: サポートされていない機能
"Feature not supported"

機能がサポートされていません。

#### `P6008`: 内部エラー
"Internal error"

内部エラーが発生しました。

#### `P6009`: 設定エラー
"Configuration error"

設定にエラーがあります。

## エラーハンドリングの例

### TypeScript での例

```typescript
import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    await prisma.user.create({
      data: {
        email: 'existing@email.com', // すでに存在するメール
      },
    })
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      // P2002 は一意制約違反
      if (e.code === 'P2002') {
        console.log(
          'このメールアドレスは既に使用されています'
        )
      }
    }
    throw e
  }
}

main()
```

### エラーコードによる処理分岐

```typescript
try {
  // データベース操作
} catch (e) {
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    switch (e.code) {
      case 'P2002':
        // 一意制約違反の処理
        break
      case 'P2003':
        // 外部キー制約違反の処理
        break
      case 'P2025':
        // レコードが見つからない場合の処理
        break
      default:
        // その他のエラー処理
        break
    }
  }
}
```

## 注意事項

- エラーコードは Prisma のバージョンによって追加または変更される可能性があります
- 本番環境では適切なエラーログとモニタリングを実装してください
- 機密情報をエラーメッセージに含めないよう注意してください
- エラーハンドリングはアプリケーションのロジックに応じて適切に実装してください
