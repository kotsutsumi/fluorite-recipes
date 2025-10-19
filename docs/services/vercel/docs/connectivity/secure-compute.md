# Secure Compute

## 概要

Secure Computeは、Enterprise向けのプランで利用可能な機能で、以下の特徴を持っています：

- [Vercel Functions](/docs/functions)とバックエンドインフラストラクチャ間のプライベート接続を作成
- デフォルトのデプロイメントIPアドレスから、専用の静的IPアドレスへの移行
- デプロイメントと構築コンテナ専用のネットワークを提供
- 完全なネットワーク分離とVPCピアリング

Secure Computeは、[Enterprise プラン](/docs/plans/enterprise)でのみ利用可能です。

## 主な機能

### 専用ネットワーク

- 顧客ごとに専用のVPC（Virtual Private Cloud）
- 他の顧客とのネットワーク共有なし
- 完全なネットワーク分離とセキュリティ

### 静的IPアドレス

- 変更されない専用の静的IPアドレス
- NAT ゲートウェイによる一貫した出力IP
- IP許可リストへの追加が容易

### VPCピアリング

- 既存のAWS VPCと直接接続
- プライベートIPアドレス空間での通信
- インターネットを経由しないセキュアな接続

## Secure Computeの仕組み

Secure Computeでは以下を提供します：

1. **専用のプライベートネットワーク**
   - 顧客専用のVPC
   - カスタマイズ可能なCIDRブロック
   - 独立したサブネットとルーティング

2. **静的IPアドレスペア**
   - 複数の静的IPアドレス（冗長性のため）
   - 各リージョンに個別のIPペア
   - 自動フェイルオーバー

3. **VPCピアリング接続**
   - AWS VPCとの直接ピアリング
   - 低レイテンシーの接続
   - セキュアなプライベート通信

## 有効化

Secure Computeを利用するには：

1. **セールスチームに連絡**
   - [Vercelセールスチーム](https://vercel.com/contact/sales)に連絡
   - 要件とアーキテクチャを相談
   - 見積もりを取得

2. **ネットワーク情報を提供**
   - AWSリージョンを指定
   - 希望するCIDRブロック（オプション）
   - VPCピアリングが必要な場合、以下を提供：
     - AWSアカウントID
     - VPC ID
     - VPC CIDRブロック

3. **設定と展開**
   - Vercelが専用ネットワークを設定
   - 静的IPアドレスを受け取る
   - VPCピアリング接続を確立（必要に応じて）

4. **検証とテスト**
   - 接続をテスト
   - パフォーマンスを確認
   - セキュリティ設定を検証

## サポートされるランタイム

以下のランタイムがサポートされています：

- **Node.js**: すべてのバージョン
- **Python**: 3.9以降
- **Go**: 1.x
- **Ruby**: 3.2以降

**注意**: Edge Runtimeはサポートされていません。Edge Runtimeは世界中に分散されているため、専用VPCとの統合ができません。

## 価格

- **基本料金**: 年間$6,500から（カスタム見積もり）
- **データ転送**: $0.15/GB（プライベートデータ転送）
- **VPCピアリング**: 基本料金に含まれる
- **追加リージョン**: カスタム価格

価格は、以下の要因によって異なります：
- 使用するリージョン数
- 予想されるデータ転送量
- VPCピアリング接続の数
- サポートレベル

## 制限

### ビルド時の遅延

- ビルド時に最大5秒の遅延が発生する可能性
- 初回ビルド時のネットワーク初期化によるもの
- 後続のビルドでは遅延が減少

### VPCピアリング接続数

- 1ネットワークあたり最大50接続
- 追加接続が必要な場合は、Vercelサポートに連絡

### リージョン制限

- 指定したリージョンでのみ動作
- グローバルEdge Runtimeは使用不可
- リージョンの追加には追加料金が発生

## VPCピアリングの設定

VPCピアリングを設定するには：

### 1. 必要情報の収集

以下の情報を準備：
- AWSアカウントID
- AWS リージョン
- VPC ID
- VPC CIDRブロック
- ルートテーブルID（オプション）

### 2. Vercelに情報を提供

Vercelサポートまたはセールスチームに以下を提供：
- 上記の必要情報
- ピアリング接続の用途
- セキュリティ要件

### 3. ピアリングリクエストの承認

1. AWSコンソールでピアリングリクエストを確認
2. リクエストを承認
3. ルートテーブルを更新してVercel VPCへのルートを追加

### 4. セキュリティグループの設定

1. バックエンドリソースのセキュリティグループを更新
2. Vercel VPCのCIDRブロックからのインバウンドトラフィックを許可
3. 必要なポート（例：PostgreSQL 5432、MySQL 3306）を開く

### 5. 接続の検証

```bash
# Vercel Functionから接続テスト
curl https://your-project.vercel.app/api/test-connection
```

## 使用例

### プライベートデータベースへの接続

```typescript
// app/api/data/route.ts
import { Pool } from 'pg';

const pool = new Pool({
  host: 'private-db.internal', // プライベートIPまたはホスト名
  port: 5432,
  database: 'mydb',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
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

### 内部APIへのアクセス

```typescript
// app/api/internal/route.ts
export async function POST(request: Request) {
  const data = await request.json();

  // プライベートネットワーク経由で内部APIにアクセス
  const response = await fetch('http://internal-api.internal/endpoint', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return response;
}
```

## ベストプラクティス

1. **CIDRブロックの計画**: 既存のネットワークと重複しないCIDRブロックを選択
2. **セキュリティグループ**: 最小権限の原則に従ってアクセスを制限
3. **監視**: CloudWatchやVercelの分析でトラフィックを監視
4. **冗長性**: 複数のAZ（Availability Zone）でリソースを配置
5. **ドキュメント化**: ネットワーク構成を明確にドキュメント化

## トラブルシューティング

### 接続タイムアウト

1. VPCピアリング接続が確立されているか確認
2. ルートテーブルが正しく設定されているか確認
3. セキュリティグループでトラフィックが許可されているか確認
4. ネットワークACLを確認

### DNS解決の失敗

1. プライベートホスト名が正しいか確認
2. Route 53 プライベートホストゾーンを使用している場合、設定を確認
3. IPアドレスで直接接続を試す

### パフォーマンスの問題

1. リージョンがバックエンドに近いか確認
2. ネットワークレイテンシーを測定
3. データ転送量を最適化

## サポート

Secure Computeに関する質問やサポートが必要な場合：

- [Vercelサポート](https://vercel.com/support)に連絡
- Enterpriseプランのお客様は専用のサポートチャネルを利用可能
- アーキテクチャレビューやベストプラクティスの相談も可能

## 関連ドキュメント

- [Connectivity](/docs/connectivity)
- [Static IPs](/docs/connectivity/static-ips)
- [Functions](/docs/functions)
- [Environment Variables](/docs/projects/environment-variables)
- [Security](/docs/security)
