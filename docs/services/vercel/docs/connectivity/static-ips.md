# Static IPs

## 概要

Static IPsは、[Enterprise](/docs/plans/enterprise)および[Pro](/docs/plans/pro)プランで利用可能な機能です。

静的IPを使用することで、IPアドレスの許可リストを必要とするバックエンドサービスにアクセスできます。Pro およびEnterprise チーム向けに設計されており、高度なネットワークやセキュリティ機能を必要としない場合に適しています。

## 利用シーン

Static IPsは、以下のような場合に最適です：

### データベース接続

- Amazon RDS
- Google Cloud SQL
- Azure SQL Database
- MongoDB Atlas
- PostgreSQL / MySQL / その他のデータベース

### API統合

- Auth0
- PayPal
- Stripe
- 社内API
- パートナーAPI

### レガシーシステム

- オンプレミスデータベース
- ファイアウォールの内側にあるシステム
- 企業のイントラネット

### コンプライアンス

- IP許可リストを要求するビジネス要件
- セキュリティポリシーの遵守
- 監査要件の満たし

## Static IPsとSecure Computeの比較

| 機能 | Static IPs (Pro & Enterprise) | Secure Compute (Enterprise のみ) |
|------|-------------------------------|----------------------------------|
| **IPタイプ** | 共有仮想プライベートクラウド(VPC)の静的IP | 専用VPCの静的IP |
| **ネットワーク分離** | サブネットレベルの分離された少数の顧客用の共有VPC | 顧客ごとに専用のVPCとサブネット |
| **VPCピアリング** | 不可 | 可能 |
| **セットアップの複雑さ** | シンプル | 中程度 |
| **月額料金** | $100/プロジェクト | $6,500+/年 |
| **データ転送** | $0.15/GB | $0.15/GB |
| **ユースケース** | IPアドレス許可リスト、データベースアクセス | IPアドレス許可リスト、VPCピアリング、完全な分離 |

## 仕組み

Static IPsを有効にすると、以下のように動作します：

### 1. リージョン選択

- 最大3つのAWSリージョンを選択
- バックエンドサービスに近いリージョンを選択することを推奨
- 各リージョンに固有の静的IPが割り当てられる

### 2. IPアドレスの割り当て

- 選択した各リージョンに1つまたは複数の静的IPアドレスが割り当てられる
- これらのIPアドレスは変更されない
- 共有VPC内で他の少数の顧客とサブネットレベルで分離

### 3. トラフィックのルーティング

- Vercel Functionsからの送信トラフィックが静的IPを経由
- Edge Runtimeは除外（グローバルに分散されているため）
- Node.js、Python、Go、Rubyランタイムで動作

### 4. バックエンドアクセス

- バックエンドサービスの許可リストに静的IPを追加
- Vercel Functionsから安全にアクセス可能

## 料金

- **基本料金**: $100/月（プロジェクトごと）
- **データ転送**: $0.15/GB（プライベートデータ転送）
- **無料枠**: なし
- **リージョン追加**: 追加料金なし（最大3リージョン）

### 課金例

月間100GBのプライベートデータ転送がある場合：
- 基本料金: $100
- データ転送: 100GB × $0.15 = $15
- **合計**: $115/月

## サポートされるリージョン

Static IPsは、以下のAWSリージョンで利用可能です：

### 北米
- us-east-1（バージニア北部）
- us-east-2（オハイオ）
- us-west-1（北カリフォルニア）
- us-west-2（オレゴン）

### ヨーロッパ
- eu-west-1（アイルランド）
- eu-west-2（ロンドン）
- eu-central-1（フランクフルト）

### アジア太平洋
- ap-southeast-1（シンガポール）
- ap-southeast-2（シドニー）
- ap-northeast-1（東京）
- ap-south-1（ムンバイ）

### その他
- sa-east-1（サンパウロ）

## サポートされるランタイム

Static IPsは以下のランタイムをサポートします：

- **Node.js**: すべてのバージョン
- **Python**: 3.9以降
- **Go**: 1.x
- **Ruby**: 3.2以降

**注意**: Edge Runtimeはサポートされていません。

## Static IPsの管理

### 有効化

1. プロジェクトダッシュボードに移動
2. プロジェクト設定 > Connectivity
3. 「Enable Static IPs」をクリック
4. リージョンを選択（最大3つ）
5. 確認して有効化

### IPアドレスの確認

1. プロジェクト設定 > Connectivity
2. 「Static IPs」セクションで割り当てられたIPアドレスを確認
3. IPアドレスをコピーしてバックエンドサービスの許可リストに追加

### リージョンの変更

1. プロジェクト設定 > Connectivity
2. 「Manage Active Regions」をクリック
3. リージョンを追加または削除
4. 変更を保存

### 無効化

1. プロジェクト設定 > Connectivity
2. 「Disable Static IPs」をクリック
3. 確認して無効化
4. バックエンドサービスの許可リストから IPアドレスを削除

## 使用例

### PostgreSQLデータベース接続

```typescript
// app/api/data/route.ts
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST,
  port: 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: {
    rejectUnauthorized: false,
  },
});

export async function GET() {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT NOW()');
    return Response.json({ time: result.rows[0] });
  } finally {
    client.release();
  }
}
```

### MongoDB Atlas接続

```typescript
// lib/mongodb.ts
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI!;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
```

### 外部APIへのアクセス

```typescript
// app/api/external/route.ts
export async function POST(request: Request) {
  const data = await request.json();

  // Static IPを使用して外部APIにアクセス
  const response = await fetch('https://api.example.com/endpoint', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.API_KEY}`,
    },
    body: JSON.stringify(data),
  });

  return response;
}
```

## ベストプラクティス

1. **リージョン選択**: バックエンドサービスに最も近いリージョンを選択してレイテンシーを最小化
2. **複数リージョン**: 冗長性のために複数のリージョンを設定
3. **セキュリティ**: IPアドレスのホワイトリスト登録に加えて、認証とTLSを使用
4. **監視**: 接続エラーやパフォーマンスの問題を監視
5. **ドキュメント化**: 使用しているIPアドレスとその用途をドキュメント化

## トラブルシューティング

### 接続タイムアウト

1. バックエンドサービスの許可リストにIPアドレスが追加されているか確認
2. ファイアウォールルールが正しく設定されているか確認
3. データベースまたはAPIが正常に動作しているか確認
4. 接続文字列が正しいか確認

### 誤ったIPアドレスからの接続

1. プロジェクトが正しいリージョンにデプロイされているか確認
2. Edge Runtimeを使用していないか確認（Edge Runtimeは Static IPs を使用しない）
3. Vercel Functionsを使用しているか確認

### パフォーマンスの問題

1. バックエンドサービスとリージョンの距離を確認
2. より近いリージョンを追加することを検討
3. 接続プーリングを使用して接続オーバーヘッドを削減

## FAQ

### Q: Static IPsはすべてのリクエストに適用されますか？

A: いいえ、Static IPsはVercel Functionsからの送信リクエストにのみ適用されます。Edge Runtimeやクライアント側のリクエストには適用されません。

### Q: Static IPsを無効にするとどうなりますか？

A: 無効にすると、Functionsは通常の動的IPアドレスを使用するようになります。バックエンドサービスの許可リストから Static IPを削除する必要があります。

### Q: 複数のプロジェクトで同じ Static IPを共有できますか？

A: いいえ、各プロジェクトには個別の Static IP が割り当てられます。

### Q: Static IPsはいつ変更されますか？

A: Static IPsは変更されません。ただし、プロジェクトを削除して再作成した場合、新しいIPアドレスが割り当てられます。

詳細については、[Getting Started ガイド](/docs/connectivity/static-ips/getting-started)を参照してください。
