# Turso Platform API リファレンス - 完全ガイド

Turso Platform APIの包括的な日本語ドキュメントインデックスです。すべてのAPIエンドポイント、リクエスト/レスポンス例、実践的な使用方法を網羅しています。

## 📚 目次

### イントロダクションと基礎

| # | ドキュメント | 説明 |
|---|------------|------|
| 01 | [イントロダクション](./01-introduction.md) | API概要、ベースURL、主な機能 |
| 02 | [クイックスタート](./02-quickstart.md) | 最初のAPIコール、認証、データベース作成 |
| 03 | [認証](./03-authentication.md) | トークン取得、使用方法、セキュリティ |
| 04 | [レスポンスコード](./04-response-codes.md) | HTTPステータスコード、エラーハンドリング |

### Databases API (データベース管理)

| # | エンドポイント | メソッド | 説明 |
|---|--------------|---------|------|
| 05 | [データベース一覧](./05-databases-list.md) | `GET /databases` | すべてのデータベースを取得 |
| 06 | [データベース作成](./06-databases-create.md) | `POST /databases` | 新しいデータベースを作成 |
| 07 | [データベース取得](./07-databases-retrieve.md) | `GET /databases/{name}` | 特定のデータベース詳細を取得 |
| 08 | [設定取得](./08-databases-configuration.md) | `GET /databases/{name}/configuration` | データベース設定を取得 |
| 09 | [設定更新](./09-databases-update-configuration.md) | `PATCH /databases/{name}/configuration` | データベース設定を更新 |
| 10 | [使用量取得](./10-databases-usage.md) | `GET /databases/{name}/usage` | 使用量統計を取得 |
| 11 | [統計取得](./11-databases-stats.md) | `GET /databases/{name}/stats` | クエリ統計を取得 |
| 12 | [データベース削除](./12-databases-delete.md) | `DELETE /databases/{name}` | データベースを削除 |
| 13 | [インスタンス一覧](./13-databases-instances-list.md) | `GET /databases/{name}/instances` | すべてのインスタンスを取得 |
| 14 | [トークン作成](./14-databases-tokens-create.md) | `POST /databases/{name}/auth/tokens` | 接続トークンを作成 |
| 15 | [トークン無効化](./15-databases-tokens-invalidate.md) | `POST /databases/{name}/auth/rotate` | すべてのトークンを無効化 |
| 16 | [ダンプアップロード](./16-databases-upload.md) | `POST /databases` (seed type=dump) | SQLダンプからDB作成 |

### Groups API (グループ管理)

グループはデータベースのレプリケーションとロケーション管理を行います。

| # | エンドポイント | メソッド | 説明 |
|---|--------------|---------|------|
| 17 | グループ一覧 | `GET /groups` | すべてのグループを取得 |
| 18 | グループ作成 | `POST /groups` | 新しいグループを作成 |
| 19 | グループ取得 | `GET /groups/{name}` | 特定のグループ詳細を取得 |
| 20 | グループ削除 | `DELETE /groups/{name}` | グループを削除 |
| 21 | ロケーション追加 | `POST /groups/{name}/locations/{location}` | グループにロケーションを追加 |
| 22 | ロケーション削除 | `DELETE /groups/{name}/locations/{location}` | グループからロケーションを削除 |
| 23 | グループ転送 | `POST /groups/{name}/transfer` | グループを別組織に転送 |
| 24 | トークン作成 | `POST /groups/{name}/auth/tokens` | グループトークンを作成 |
| 25 | トークン無効化 | `POST /groups/{name}/auth/rotate` | グループトークンを無効化 |

### Locations API (ロケーション情報)

| # | エンドポイント | メソッド | 説明 |
|---|--------------|---------|------|
| 26 | [ロケーション一覧](./29-locations-list.md) | `GET /locations` | 利用可能なすべてのロケーションを取得 |
| 27 | 最寄りロケーション | `GET /locations/closest` | 最も近いロケーションを取得 |

### Organizations API (組織管理)

| # | エンドポイント | メソッド | 説明 |
|---|--------------|---------|------|
| 28 | 組織一覧 | `GET /organizations` | アクセス可能な組織を取得 |
| 29 | 組織取得 | `GET /organizations/{slug}` | 特定の組織詳細を取得 |
| 30 | 組織更新 | `PATCH /organizations/{slug}` | 組織設定を更新 |
| 31 | メンバー一覧 | `GET /organizations/{slug}/members` | 組織メンバーを取得 |
| 32 | メンバー追加 | `POST /organizations/{slug}/members` | メンバーを招待 |
| 33 | メンバー削除 | `DELETE /organizations/{slug}/members/{username}` | メンバーを削除 |
| 34 | 招待一覧 | `GET /organizations/{slug}/invites` | 保留中の招待を取得 |
| 35 | プラン取得 | `GET /organizations/{slug}/plans` | 利用可能なプランを取得 |
| 36 | サブスクリプション取得 | `GET /organizations/{slug}/subscription` | 現在のサブスクリプションを取得 |
| 37 | 請求書一覧 | `GET /organizations/{slug}/invoices` | 請求書を取得 |
| 38 | 使用量取得 | `GET /organizations/{slug}/usage` | 組織全体の使用量を取得 |

### Audit Logs API (監査ログ)

| # | エンドポイント | メソッド | 説明 |
|---|--------------|---------|------|
| 39 | 監査ログ一覧 | `GET /organizations/{slug}/audit-logs` | 監査ログを取得 |
| 40 | ログページネーション | `GET /organizations/{slug}/audit-logs?page=` | ページネーション付き取得 |

### API Tokens (APIトークン管理)

| # | エンドポイント | メソッド | 説明 |
|---|--------------|---------|------|
| 41 | トークン一覧 | `GET /organizations/{slug}/api-tokens` | すべてのAPIトークンを取得 |
| 42 | トークン作成 | `POST /organizations/{slug}/api-tokens/{name}` | 新しいAPIトークンを作成 |
| 43 | トークン削除 | `DELETE /organizations/{slug}/api-tokens/{name}` | APIトークンを削除 |

## 🚀 クイックスタート

### 1. 認証の設定

```bash
# Turso CLIで認証
turso auth login

# APIトークンを作成
turso auth api-tokens mint my-token

# 環境変数に設定
export TURSO_API_TOKEN="your-token-here"
export TURSO_ORG_SLUG="your-org-slug"
```

### 2. 最初のAPIコール

```bash
# ロケーション一覧を取得
curl -L 'https://api.turso.tech/v1/locations' \
  -H "Authorization: Bearer ${TURSO_API_TOKEN}"
```

### 3. データベースの作成

```bash
# グループを作成
curl -L -X POST "https://api.turso.tech/v1/organizations/${TURSO_ORG_SLUG}/groups" \
  -H "Authorization: Bearer ${TURSO_API_TOKEN}" \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "default",
    "location": "lhr"
  }'

# データベースを作成
curl -L -X POST "https://api.turso.tech/v1/organizations/${TURSO_ORG_SLUG}/databases" \
  -H "Authorization: Bearer ${TURSO_API_TOKEN}" \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "my-db",
    "group": "default"
  }'
```

## 📖 主要なユースケース

### データベース管理

```typescript
import { createClient } from "@turso/api";

const turso = createClient({
  org: process.env.TURSO_ORG_SLUG!,
  token: process.env.TURSO_API_TOKEN!,
});

// データベースの作成
const db = await turso.databases.create("my-app-db", {
  group: "production"
});

// 使用量の確認
const usage = await turso.databases.getUsage("my-app-db");
console.log(`Storage: ${usage.total.storage_bytes} bytes`);

// 設定の更新
await turso.databases.updateConfiguration("my-app-db", {
  delete_protection: true,
  size_limit: "10gb"
});
```

### グローバルレプリケーション

```typescript
// プロダクショングループの作成
const group = await turso.groups.create("production", "lhr");

// 追加ロケーションへのレプリケーション
await turso.groups.addLocation("production", "nrt");  // 東京
await turso.groups.addLocation("production", "syd");  // シドニー
await turso.groups.addLocation("production", "iad");  // バージニア

// グループ内にデータベースを作成（自動的にすべてのロケーションに複製）
const db = await turso.databases.create("global-db", {
  group: "production"
});
```

### マルチテナントアーキテクチャ

```typescript
// ユーザーごとのデータベース作成
async function provisionUserDatabase(userId: string) {
  const dbName = `user-${userId}`;

  const database = await turso.databases.create(dbName, {
    group: "users",
    size_limit: "100mb"
  });

  const token = await turso.databases.createToken(dbName, {
    expiration: "never",
    authorization: "full-access"
  });

  return {
    hostname: database.Hostname,
    token
  };
}

// 使用例
const userDb = await provisionUserDatabase("user123");
console.log(`Database: libsql://${userDb.hostname}`);
```

## 🔐 セキュリティベストプラクティス

### 1. トークン管理

```typescript
// ✅ 良い例: 環境変数を使用
const token = process.env.TURSO_API_TOKEN;

// ❌ 悪い例: コードにハードコード
const token = "eyJhbGc...";  // 絶対にしない！
```

### 2. 削除保護

```typescript
// 本番データベースには必ず削除保護を設定
await turso.databases.updateConfiguration("production-db", {
  delete_protection: true
});
```

### 3. 読み取り専用アクセス

```typescript
// 分析用には読み取り専用トークンを使用
const readOnlyToken = await turso.databases.createToken("analytics-db", {
  authorization: "read-only",
  expiration: "30d"
});
```

## 🌍 利用可能なロケーション

Tursoは世界中の32以上のロケーションでデータベースをホストできます：

### 北米
- **ボストン** (bos) - Boston, Massachusetts (US)
- **シカゴ** (ord) - Chicago, Illinois (US)
- **ダラス** (dfw) - Dallas, Texas (US)
- **デンバー** (den) - Denver, Colorado (US)
- **ロサンゼルス** (lax) - Los Angeles, California (US)
- **マイアミ** (mia) - Miami, Florida (US)
- **サンノゼ** (sjc) - San Jose, California (US)
- **シアトル** (sea) - Seattle, Washington (US)
- **バージニア** (iad) - Ashburn, Virginia (US)
- **ニュージャージー** (ewr) - Secaucus, NJ (US)

### 欧州
- **アムステルダム** (ams) - Amsterdam, Netherlands
- **ロンドン** (lhr) - London, United Kingdom
- **パリ** (cdg) - Paris, France
- **フランクフルト** (fra) - Frankfurt, Germany
- **マドリード** (mad) - Madrid, Spain
- **ストックホルム** (arn) - Stockholm, Sweden
- **ワルシャワ** (waw) - Warsaw, Poland
- **ブカレスト** (otp) - Bucharest, Romania

### アジア太平洋
- **東京** (nrt) - Tokyo, Japan
- **香港** (hkg) - Hong Kong, Hong Kong
- **シンガポール** (sin) - Singapore, Singapore
- **シドニー** (syd) - Sydney, Australia

### 南米
- **サンパウロ** (gru) - São Paulo, Brazil
- **リオデジャネイロ** (gig) - Rio de Janeiro, Brazil
- **サンティアゴ** (scl) - Santiago, Chile
- **ボゴタ** (bog) - Bogotá, Colombia

### その他
- **ヨハネスブルグ** (jnb) - Johannesburg, South Africa
- **トロント** (yyz) - Toronto, Canada
- **モントリオール** (yul) - Montreal, Canada
- **メキシコシティ** (qro) - Queretaro, Mexico
- **グアダラハラ** (gdl) - Guadalajara, Mexico

## 💡 高度な使用例

### データベースの自動スケーリング

```typescript
async function autoScaleDatabase(dbName: string) {
  const usage = await turso.databases.getUsage(dbName);
  const config = await turso.databases.getConfiguration(dbName);

  const usagePercent = (usage.total.storage_bytes / parseInt(config.size_limit)) * 100;

  if (usagePercent > 80) {
    const newLimit = parseInt(config.size_limit) * 1.5;
    await turso.databases.updateConfiguration(dbName, {
      size_limit: newLimit.toString()
    });
    console.log(`Scaled ${dbName} to ${newLimit} bytes`);
  }
}
```

### マルチリージョンフェイルオーバー

```typescript
async function setupFailover(dbName: string) {
  const instances = await turso.databases.listInstances(dbName);

  // プライマリが利用できない場合のフェイルオーバーロジック
  const primary = instances.find(i => i.type === 'primary');
  const replicas = instances.filter(i => i.type === 'replica');

  console.log(`Primary: ${primary?.hostname}`);
  console.log(`Failover targets: ${replicas.map(r => r.hostname).join(', ')}`);
}
```

### バッチ操作

```typescript
async function batchCreateDatabases(count: number) {
  const promises = Array.from({ length: count }, (_, i) =>
    turso.databases.create(`db-${i}`, { group: "default" })
  );

  const results = await Promise.allSettled(promises);

  const succeeded = results.filter(r => r.status === 'fulfilled').length;
  const failed = results.filter(r => r.status === 'rejected').length;

  console.log(`Created: ${succeeded}, Failed: ${failed}`);
}
```

## 📊 レート制限とベストプラクティス

### レート制限

- APIリクエストにはレート制限が適用される場合があります
- 429エラーの場合は指数バックオフでリトライしてください

```typescript
async function fetchWithRetry(url: string, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.status === 429) {
        const delay = Math.pow(2, i) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }

      return response;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
    }
  }
}
```

## 🔗 関連リソース

- [Turso公式ドキュメント](https://docs.turso.tech/)
- [Turso CLI](https://docs.turso.tech/cli)
- [SDK一覧](https://docs.turso.tech/sdk)
- [コミュニティ](https://discord.gg/turso)

## 📝 変更履歴

このドキュメントは継続的に更新されます。最新情報は公式ドキュメントを参照してください。

---

**作成日**: 2024-01-15
**最終更新**: 2024-01-15
**APIバージョン**: v1
