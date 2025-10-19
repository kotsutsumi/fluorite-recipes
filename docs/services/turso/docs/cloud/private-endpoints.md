# Turso - プライベートエンドポイント

AWS上でTurso Databaseのプライベートエンドポイントを設定する方法を説明します。

## 概要

- AWS VPCエンドポイントを使用してTurso Databaseにアクセス
- AWS PrivateLinkを活用
- すべてのトラフィックをAWSプライベートネットワーク内に保持

## 前提条件

### 必要な要件

1. **既存のVPC**: ターゲットAWSリージョンに存在
2. **サブネット**: サポートされているアベイラビリティゾーン内
3. **IAM権限**: VPCエンドポイントの作成とセキュリティグループの変更
4. **Tursoアカウント**: 設定済みのデータベース

## サポートリージョン

現在、以下のAWSリージョンでプライベートエンドポイントをサポートしています：

1. **us-east-1** (米国東部 - バージニア北部)
2. **us-west-2** (米国西部 - オレゴン)
3. **eu-west-1** (欧州 - アイルランド)
4. **ap-south-1** (アジアパシフィック - ムンバイ)
5. **ap-northeast-1** (アジアパシフィック - 東京)

## us-east-1の設定手順

### 1. VPCエンドポイントの作成

AWS Management Consoleで：

1. VPC → エンドポイント → 「エンドポイントを作成」
2. 「その他のエンドポイントサービス」を選択
3. サービス名を入力：
   ```
   com.amazonaws.vpce.us-east-1.vpce-svc-XXXXX
   ```
4. DNS名を有効化
5. IPv4 DNSレコードタイプを選択
6. サブネットを選択（対応AZ内）
7. セキュリティグループを設定

### 2. セキュリティグループの設定

インバウンドルール：

```
タイプ: HTTPS
プロトコル: TCP
ポート範囲: 443
ソース: 0.0.0.0/0 または特定のCIDR
```

### 3. アプリケーション接続の更新

接続URLフォーマット：

```bash
https://<database-name>.us-east-1.turso.io
```

Hostヘッダーの設定：

```bash
curl -H "Host: <database-name>.turso.io" \
  https://<database-name>.us-east-1.turso.io
```

### 4. セットアップの検証

```bash
# 接続テスト
curl -v https://<your-database-name>.us-east-1.turso.io

# プライベートルーティングの確認
traceroute -T <your-database-name>.us-east-1.turso.io
```

## us-west-2の設定手順

### VPCエンドポイント設定

サービス名：
```
com.amazonaws.vpce.us-west-2.vpce-svc-XXXXX
```

接続URL：
```
https://<database-name>.us-west-2.turso.io
```

## eu-west-1の設定手順

### VPCエンドポイント設定

サービス名：
```
com.amazonaws.vpce.eu-west-1.vpce-svc-XXXXX
```

接続URL：
```
https://<database-name>.eu-west-1.turso.io
```

## ap-south-1の設定手順

### VPCエンドポイント設定

サービス名：
```
com.amazonaws.vpce.ap-south-1.vpce-svc-XXXXX
```

接続URL：
```
https://<database-name>.ap-south-1.turso.io
```

## ap-northeast-1の設定手順

### VPCエンドポイント設定

サービス名：
```
com.amazonaws.vpce.ap-northeast-1.vpce-svc-XXXXX
```

接続URL：
```
https://<database-name>.ap-northeast-1.turso.io
```

## アプリケーションコード例

### JavaScript/TypeScript

```typescript
import { createClient } from "@libsql/client";

const client = createClient({
  url: `https://${process.env.DB_NAME}.us-east-1.turso.io`,
  authToken: process.env.TURSO_AUTH_TOKEN,
});
```

### Python

```python
import libsql_experimental as libsql
import os

conn = libsql.connect(
    f"https://{os.getenv('DB_NAME')}.us-east-1.turso.io",
    auth_token=os.getenv('TURSO_AUTH_TOKEN')
)
```

### Go

```go
import (
    "database/sql"
    "fmt"
    "os"

    _ "github.com/tursodatabase/libsql-client-go/libsql"
)

dbName := os.Getenv("DB_NAME")
authToken := os.Getenv("TURSO_AUTH_TOKEN")
url := fmt.Sprintf("https://%s.us-east-1.turso.io?authToken=%s", dbName, authToken)

db, err := sql.Open("libsql", url)
```

## 料金

### AWSの料金

- 標準のAWS VPCエンドポイント料金が適用されます
- データ転送料金
- 時間単位の料金

### Tursoの料金

- プライベートエンドポイント使用による追加料金なし
- 標準のTurso料金プランが適用

## ネットワークトラフィック

### 利点

1. **プライベート接続**: トラフィックがインターネットを経由しない
2. **セキュリティ**: VPC内でトラフィックを保持
3. **低レイテンシー**: AWS内部ネットワークを使用
4. **コンプライアンス**: データガバナンス要件への対応

### トラフィックフロー

```
Application (VPC)
  → VPC Endpoint
  → AWS PrivateLink
  → Turso Database
```

## セキュリティのベストプラクティス

### 1. セキュリティグループの最小権限

```
# アプリケーションのCIDRのみ許可
ソース: 10.0.0.0/16
```

### 2. ネットワークACL

- VPCレベルでの追加制御
- アウトバウンドトラフィックの制限

### 3. モニタリング

- VPC Flow Logsの有効化
- CloudWatch でメトリクスを監視
- 異常なトラフィックパターンを検出

## トラブルシューティング

### 接続できない

**確認事項**:
1. VPCエンドポイントが「available」状態か
2. セキュリティグループのインバウンドルールが正しいか
3. DNSが有効になっているか
4. サブネットが正しいAZ内にあるか

### DNS解決の問題

```bash
# DNS解決をテスト
nslookup <database-name>.us-east-1.turso.io

# プライベートIPアドレスが返されることを確認
```

### パフォーマンス問題

- VPCエンドポイントのメトリクスを確認
- ネットワーク帯域幅をチェック
- アプリケーションとVPCエンドポイント間のレイテンシーを測定

## マルチリージョン構成

### 複数リージョンでのセットアップ

各リージョンで個別のVPCエンドポイントを作成：

```
us-east-1: vpce-xxxxx
us-west-2: vpce-yyyyy
eu-west-1: vpce-zzzzz
```

### フェイルオーバー

アプリケーションで複数のエンドポイントを設定：

```typescript
const primaryUrl = `https://${dbName}.us-east-1.turso.io`;
const fallbackUrl = `https://${dbName}.us-west-2.turso.io`;
```

## 関連リンク

- [Turso公式サイト](https://turso.tech/)
- [AWS PrivateLink Documentation](https://docs.aws.amazon.com/vpc/latest/privatelink/)
- [AWS VPC Endpoints](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-endpoints.html)
- [Turso Documentation](https://docs.turso.tech/)
