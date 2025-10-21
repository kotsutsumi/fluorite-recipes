# Postgres.js

## 概要

Postgres.jsは、Node.jsとDeno用の「フル機能のPostgresクライアント」です。

## はじめに

### 1. インストール

```bash
npm i postgres
```

### 2. 接続

接続の詳細を含む`db.js`ファイルを作成:

```javascript
import postgres from 'postgres'
const connectionString = process.env.DATABASE_URL
const sql = postgres(connectionString)
export default sql
```

### 3. コマンドの実行

データベースクエリを実行する例:

```javascript
import sql from './db.js'

async function getUsersOver(age) {
  const users = await sql`
    select name, age
    from users
    where age > ${ age }
  `
  // 指定された年齢を超えるユーザーを含む結果
  return users
}
```

## 主なポイント

- 接続には環境変数`DATABASE_URL`を使用
- Node.jsとDenoの両方をサポート
- テンプレートリテラルSQLクエリをサポート
- 非同期クエリ実行を提供

## 追加のノート

- サーバーレス関数には「トランザクションプーラー」を選択
- 長期接続には「セッションプーラー」を選択

このドキュメントは、シンプルさと使いやすさに焦点を当て、データベースとPostgres.jsを統合するための分かりやすいガイドを提供します。
