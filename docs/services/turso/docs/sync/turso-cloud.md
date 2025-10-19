# Turso Cloud との同期

Turso Cloudとローカルデータベースを同期する方法を説明します。

## 概要

`@tursodatabase/sync`パッケージを使用すると、ローカルデータベースとTurso Cloudでホストされているリモートデータベースを簡単に同期できます。

## インストール

npmを使用してsyncパッケージをインストールします：

```bash
npm install @tursodatabase/sync
```

## 基本的な使い方

### 接続設定

Turso Cloudデータベースに接続するための設定を行います：

```javascript
import { createClient } from '@tursodatabase/sync';

const client = createClient({
  path: 'local',              // ローカルファイルのプレフィックス
  url: 'your-database-url',   // リモートデータベースURL
  authToken: 'your-token',    // 認証トークン
  clientName: 'my-app',       // 任意のクライアント識別子
});
```

### パラメータの説明

| パラメータ | 説明 |
|-----------|------|
| `path` | ローカルデータベースファイルのパス/プレフィックス |
| `url` | Turso CloudのリモートデータベースURL |
| `authToken` | 認証トークン |
| `clientName` | クライアントを識別するための任意の名前 |

## 同期操作

### pull() - リモートから取得

リモートデータベースの変更をローカルに反映します：

```javascript
await client.pull();
```

### push() - リモートへ送信

ローカルの変更をリモートデータベースに送信します：

```javascript
await client.push();
```

### sync() - 双方向同期

pullとpushを組み合わせた操作を実行します：

```javascript
await client.sync();
```

これは以下と同等です：

```javascript
await client.pull();
await client.push();
```

## データ操作と同期

### テーブルの作成

```javascript
await client.execute(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    email TEXT
  )
`);
```

### データの挿入

```javascript
await client.execute(
  "INSERT INTO users (username, email) VALUES (?, ?)",
  ["alice", "alice@example.com"]
);

await client.execute(
  "INSERT INTO users (username, email) VALUES (?, ?)",
  ["bob", "bob@example.com"]
);
```

### データのクエリ

```javascript
const users = await client.query("SELECT * FROM users");
console.log(users);
```

### 変更の同期

ローカルでデータを変更した後、リモートと同期します：

```javascript
// データを挿入
await client.execute(
  "INSERT INTO users (username, email) VALUES (?, ?)",
  ["charlie", "charlie@example.com"]
);

// リモートと同期
await client.sync();
```

## 完全なコード例

```javascript
import { createClient } from '@tursodatabase/sync';

async function main() {
  // クライアントを作成
  const client = createClient({
    path: 'local',
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
    clientName: 'my-sync-app',
  });

  // リモートから最新データを取得
  await client.pull();

  // テーブルを作成
  await client.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      email TEXT
    )
  `);

  // データを挿入
  await client.execute(
    "INSERT INTO users (username, email) VALUES (?, ?)",
    ["alice", "alice@example.com"]
  );

  await client.execute(
    "INSERT INTO users (username, email) VALUES (?, ?)",
    ["bob", "bob@example.com"]
  );

  // データをクエリ
  const users = await client.query("SELECT * FROM users");
  console.log("Users:", users);

  // 変更をリモートに送信
  await client.push();

  console.log("Sync completed!");
}

main().catch(console.error);
```

## 同期戦略

### 定期的な同期

一定間隔でリモートと同期する場合：

```javascript
// 5分ごとに同期
setInterval(async () => {
  try {
    await client.sync();
    console.log('Sync completed');
  } catch (error) {
    console.error('Sync failed:', error);
  }
}, 5 * 60 * 1000); // 5分
```

### イベントベースの同期

特定の操作後に同期する場合：

```javascript
async function addUser(username, email) {
  await client.execute(
    "INSERT INTO users (username, email) VALUES (?, ?)",
    [username, email]
  );

  // 挿入後すぐに同期
  await client.sync();
}
```

### オフライン対応

ネットワークが利用できない場合の処理：

```javascript
async function safeSyPush() {
  try {
    await client.push();
    console.log('Pushed successfully');
  } catch (error) {
    console.warn('Push failed, will retry later:', error.message);
    // 後でリトライするロジック
  }
}
```

## エラーハンドリング

同期操作では適切なエラーハンドリングが重要です：

```javascript
try {
  await client.sync();
} catch (error) {
  if (error.code === 'NETWORK_ERROR') {
    console.error('Network unavailable, sync will retry later');
  } else if (error.code === 'AUTH_ERROR') {
    console.error('Authentication failed, check your token');
  } else {
    console.error('Sync error:', error);
  }
}
```

## ユースケース

### モバイルアプリ

オフラインでデータを編集し、オンラインになったときに同期：

```javascript
// アプリ起動時
await client.pull();

// オフラインでの作業
await client.execute("INSERT INTO tasks (title) VALUES (?)", ["New Task"]);

// オンラインに戻ったとき
await client.push();
```

### エッジコンピューティング

エッジで処理したデータをクラウドに定期的に同期：

```javascript
// エッジでのデータ処理
await processEdgeData();

// 定期的にクラウドと同期
await client.sync();
```

### コラボレーションアプリ

複数のクライアント間でデータを共有：

```javascript
// 他のクライアントの変更を取得
await client.pull();

// 自分の変更を適用
await updateLocalData();

// 変更を共有
await client.push();
```

## ベストプラクティス

1. **環境変数を使用**: 認証情報をコードにハードコードしない
2. **エラーハンドリング**: すべての同期操作でエラーをキャッチ
3. **競合解決**: 同時編集の可能性を考慮
4. **効率的な同期**: 必要なときのみ同期を実行
5. **バックグラウンド同期**: UIをブロックしないようにする

## 関連リンク

- [Turso公式サイト](https://turso.tech/)
- [Turso GitHub](https://github.com/tursodatabase/turso)
- [Turso Documentation](https://docs.turso.tech/)
- [@tursodatabase/sync npm package](https://www.npmjs.com/package/@tursodatabase/sync)
