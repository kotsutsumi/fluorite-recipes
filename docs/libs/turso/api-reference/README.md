# Turso Platform API リファレンス

Turso Platform APIの完全な日本語ドキュメントです。すべてのAPIエンドポイント、リクエスト/レスポンス形式、実践的な使用例を含む包括的なリファレンスガイドを提供します。

## 📚 ドキュメント構成

### 基礎ドキュメント (01-04)

最初にこれらのドキュメントを読むことをお勧めします：

- **[00. 完全ガイド・インデックス](./00-index.md)** - 全APIの概要とクイックリファレンス
- **[01. イントロダクション](./01-introduction.md)** - API概要、ベースURL、認証の基礎
- **[02. クイックスタート](./02-quickstart.md)** - 最初のAPIコール、データベース作成手順
- **[03. 認証](./03-authentication.md)** - トークン管理、セキュリティベストプラクティス
- **[04. レスポンスコード](./04-response-codes.md)** - HTTPステータスコード、エラーハンドリング

### Database API (05-16)

データベースの作成、管理、削除、設定、使用量監視など、すべてのデータベース操作：

| # | ドキュメント | 説明 |
|---|------------|------|
| 05 | [データベース一覧](./05-databases-list.md) | すべてのデータベースを取得、フィルタリング |
| 06 | [データベース作成](./06-databases-create.md) | 新規データベース作成、シード、サイズ制限 |
| 07 | [データベース取得](./07-databases-retrieve.md) | 特定データベースの詳細情報を取得 |
| 08 | [設定取得](./08-databases-configuration.md) | データベース設定の取得 |
| 09 | [設定更新](./09-databases-update-configuration.md) | サイズ制限、削除保護、読み書きブロック |
| 10 | [使用量取得](./10-databases-usage.md) | ストレージ、行読み書き、同期バイト数 |
| 11 | [統計取得](./11-databases-stats.md) | 上位クエリとパフォーマンス統計 |
| 12 | [データベース削除](./12-databases-delete.md) | データベースの完全削除 |
| 13 | [インスタンス一覧](./13-databases-instances-list.md) | プライマリとレプリカインスタンス |
| 14 | [トークン作成](./14-databases-tokens-create.md) | 接続用認証トークンの作成 |
| 15 | [トークン無効化](./15-databases-tokens-invalidate.md) | すべてのトークンを即座に無効化 |
| 16 | [ダンプアップロード](./16-databases-upload.md) | SQLダンプからのDB作成、移行 |

### Group API (17-28) - 概要

グループはデータベースのレプリケーションとロケーション管理を行います。以下の操作が可能です：

- **グループの作成と削除**: 新しいグループの作成、既存グループの削除
- **ロケーション管理**: グループへのロケーション追加・削除でマルチリージョンレプリケーション
- **グループ転送**: グループを別の組織に転送
- **トークン管理**: グループレベルのアクセストークン作成・無効化

**主要なエンドポイント**:
- `GET /groups` - グループ一覧
- `POST /groups` - グループ作成
- `GET /groups/{name}` - グループ詳細
- `DELETE /groups/{name}` - グループ削除
- `POST /groups/{name}/locations/{location}` - ロケーション追加
- `DELETE /groups/{name}/locations/{location}` - ロケーション削除

### Location API (29-30)

グローバルロケーションの取得と選択：

| # | ドキュメント | 説明 |
|---|------------|------|
| 29 | [ロケーション一覧](./29-locations-list.md) | 利用可能な全ロケーション（32+ locations） |
| 30 | 最寄りロケーション | 最も近いロケーションの自動検出 |

**利用可能なロケーション**: 北米、欧州、アジア太平洋、南米、アフリカの32以上のロケーション

### Organization API (31-39) - 概要

組織レベルの設定、メンバー管理、サブスクリプション、請求：

**組織管理**:
- 組織一覧取得、詳細取得、設定更新
- プラン情報、サブスクリプション状態
- 請求書一覧、組織全体の使用量

**メンバー管理**:
- メンバー一覧、招待、削除
- 招待状況の確認
- ロール管理（Owner, Admin, Member）

### Audit Logs API (40-41) - 概要

監査ログによるアクティビティ追跡：

- すべてのAPI操作の記録
- ページネーション付きログ取得
- フィルタリングとソート

### API Tokens (42-44) - 概要

Platform APIトークンの管理：

- APIトークン一覧取得
- 新しいトークンの作成
- トークンの削除（取り消し）

## 🚀 クイックスタート

### 1. 環境設定

```bash
# Turso CLIのインストール
curl -sSfL https://get.tur.so/install.sh | bash

# ログイン
turso auth login

# 組織スラッグの確認
turso org list

# APIトークンの作成
turso auth api-tokens mint my-api-token

# 環境変数に設定
export TURSO_API_TOKEN="your-token"
export TURSO_ORG_SLUG="your-org"
```

### 2. 最初のデータベースを作成

```bash
# グループを作成
curl -X POST "https://api.turso.tech/v1/organizations/${TURSO_ORG_SLUG}/groups" \
  -H "Authorization: Bearer ${TURSO_API_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"name":"default","location":"lhr"}'

# データベースを作成
curl -X POST "https://api.turso.tech/v1/organizations/${TURSO_ORG_SLUG}/databases" \
  -H "Authorization: Bearer ${TURSO_API_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"name":"my-first-db","group":"default"}'
```

### 3. TypeScript/JavaScriptで使用

```typescript
import { createClient } from "@turso/api";

const turso = createClient({
  org: process.env.TURSO_ORG_SLUG!,
  token: process.env.TURSO_API_TOKEN!,
});

// データベースを作成
const db = await turso.databases.create("my-app", {
  group: "default"
});

// データベース一覧を取得
const databases = await turso.databases.list();
console.log(`Total databases: ${databases.length}`);

// 使用量を確認
const usage = await turso.databases.getUsage("my-app");
console.log(`Storage: ${usage.total.storage_bytes} bytes`);
```

## 📖 主要なユースケース

### マルチテナントアプリケーション

ユーザーごとに分離されたデータベースを提供：

```typescript
async function provisionUserDatabase(userId: string) {
  // ユーザー専用のデータベースを作成
  const dbName = `user-${userId}`;

  const database = await turso.databases.create(dbName, {
    group: "users",
    size_limit: "100mb"  // ユーザーごとに100MB制限
  });

  // 接続トークンを作成
  const token = await turso.databases.createToken(dbName);

  return {
    url: `libsql://${database.Hostname}`,
    token: token.jwt
  };
}
```

### グローバルレプリケーション

世界中のユーザーに低レイテンシでサービスを提供：

```typescript
async function setupGlobalDatabase() {
  // グローバルグループを作成
  const group = await turso.groups.create("global", "iad");

  // 追加ロケーションでレプリケーション
  await turso.groups.addLocation("global", "lhr");  // ロンドン
  await turso.groups.addLocation("global", "nrt");  // 東京
  await turso.groups.addLocation("global", "syd");  // シドニー

  // グローバルデータベースを作成
  const db = await turso.databases.create("worldwide-app", {
    group: "global"
  });

  console.log("Database replicated to:", db.regions);
}
```

### データベース移行

既存のSQLiteデータベースをTursoに移行：

```typescript
async function migrateToTurso(
  localDbPath: string,
  targetName: string
) {
  // 1. SQLダンプを作成
  const dumpPath = await createSQLDump(localDbPath);

  // 2. クラウドストレージにアップロード
  const dumpUrl = await uploadToS3(dumpPath);

  // 3. Tursoデータベースを作成
  const db = await turso.databases.create(targetName, {
    group: "default",
    seed: {
      type: "dump",
      url: dumpUrl
    }
  });

  console.log("Migration complete!");
  console.log("New database:", db.Hostname);
}
```

### モニタリングとアラート

使用量を監視して制限に達する前に通知：

```typescript
async function monitorDatabases() {
  const databases = await turso.databases.list();

  for (const db of databases) {
    const usage = await turso.databases.getUsage(db.Name);
    const config = await turso.databases.getConfiguration(db.Name);

    const usagePercent =
      (usage.total.storage_bytes / parseInt(config.size_limit)) * 100;

    if (usagePercent > 80) {
      await sendAlert({
        database: db.Name,
        usage: usagePercent,
        message: `Database ${db.Name} is at ${usagePercent.toFixed(2)}% capacity`
      });
    }
  }
}

// 定期実行
setInterval(monitorDatabases, 60 * 60 * 1000); // 1時間ごと
```

## 🔐 セキュリティベストプラクティス

### トークン管理

```typescript
// ✅ 正しい方法
const token = process.env.TURSO_API_TOKEN;

// ❌ 間違った方法
const token = "eyJhbGciOiJFZERTQSI...";  // ハードコードしない！
```

### 削除保護

本番データベースには必ず削除保護を有効化：

```typescript
await turso.databases.updateConfiguration("production-db", {
  delete_protection: true
});
```

### 最小権限の原則

必要な権限のみを持つトークンを使用：

```typescript
// 読み取り専用アクセスが必要な場合
const readOnlyToken = await turso.databases.createToken("analytics-db", {
  authorization: "read-only",
  expiration: "30d"
});
```

## 🌍 グローバルロケーション

Tursoは世界中の32以上のロケーションでデータベースをホストできます：

- **北米**: 10ロケーション（米国、カナダ、メキシコ）
- **欧州**: 8ロケーション（英国、ドイツ、フランス、オランダなど）
- **アジア太平洋**: 4ロケーション（日本、シンガポール、香港、オーストラリア）
- **南米**: 4ロケーション（ブラジル、コロンビア、チリ、メキシコ）
- **アフリカ**: 1ロケーション（南アフリカ）

詳細は[ロケーション一覧](./29-locations-list.md)を参照してください。

## 📊 API使用制限

### レート制限

APIリクエストにはレート制限が適用される場合があります。429エラーが返された場合は、指数バックオフでリトライしてください：

```typescript
async function fetchWithRetry(url: string, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.status === 429) {
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }

      return response;
    } catch (error) {
      if (attempt === maxRetries - 1) throw error;
    }
  }
}
```

### プラン制限

サブスクリプションプランによって以下の制限があります：

- データベース数
- グループ数
- レプリケーションロケーション数
- ストレージ容量
- 行の読み書き数

詳細は組織のプラン情報を確認してください。

## 🔗 関連リソース

### 公式リソース

- [Turso公式サイト](https://turso.tech/)
- [Turso公式ドキュメント](https://docs.turso.tech/)
- [Turso CLI](https://docs.turso.tech/cli)
- [SDK一覧](https://docs.turso.tech/sdk)

### コミュニティ

- [Discord](https://discord.gg/turso)
- [GitHub](https://github.com/tursodatabase)
- [Twitter](https://twitter.com/tursodatabase)

### チュートリアル

- [Getting Started Guide](https://docs.turso.tech/tutorials/get-started)
- [E-commerce Tutorial](https://docs.turso.tech/tutorials/e-commerce)
- [Multi-tenant App Tutorial](https://docs.turso.tech/tutorials/multi-tenant)

## 📝 ドキュメントについて

### 更新履歴

- **2024-01-15**: 初版リリース
  - 全47ファイルの包括的なAPI リファレンスドキュメント
  - Database API (12エンドポイント)
  - Group API (12エンドポイント)
  - Location API (2エンドポイント)
  - Organization API (9エンドポイント)
  - Audit Logs API (2エンドポイント)
  - API Tokens (3エンドポイント)

### 貢献

このドキュメントへの改善提案や修正は歓迎します。

### ライセンス

このドキュメントはTurso公式ドキュメントに基づいています。

---

**作成者**: Fluorite Recipes Project
**作成日**: 2025-01-15
**APIバージョン**: v1
**ドキュメントバージョン**: 1.0.0
