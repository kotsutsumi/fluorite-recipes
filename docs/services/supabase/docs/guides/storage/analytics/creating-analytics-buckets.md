# Analyticsバケットの作成

## 概要

この機能は**プライベートアルファ版**です。このドキュメントでは、以下の重要なポイントを含むAnalyticsバケットの作成と使用に関するガイダンスを提供します:

### 主な詳細
- [Apache Iceberg](https://iceberg.apache.org/)を使用。これは大規模な分析データセット用のオープンテーブルフォーマットです
- 以下を使用して操作できます:
  - PyIceberg
  - Apache Spark
  - Iceberg REST Catalog APIをサポートするクライアント

### 作成方法

#### Supabase SDKの使用
```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient('https://your-project.supabase.co', 'your-service-key')

supabase.storage.createBucket('my-analytics-bucket', {
 type: 'ANALYTICS',
})
```

#### Supabaseダッシュボードの使用
1. Storageセクションに移動
2. "Create Bucket"をクリック
3. バケット名を入力(例: my-analytics-bucket)
4. タイプとして"Analytics Bucket"を選択

### 次のステップ
Analyticsバケットを作成した後、PyIcebergやApache SparkなどのIcebergクライアントを使用して接続できます。

### 重要な注意事項
「この機能は**プライベートアルファ版**です。APIの安定性と後方互換性は現段階では保証されません。」

## ベストプラクティス

### バケット命名
- 説明的で意味のある名前を使用
- 小文字と ハイフンを使用(例: `user-analytics`, `sales-data`)
- プロジェクト内でバケット名はユニークでなければなりません

### バケット構成
- データアクセスパターンに基づいて適切なバケットタイプを選択
- 分析ワークロードには必ず`type: 'ANALYTICS'`を指定
- 組織的なニーズに応じて複数のバケットの作成を検討

### セキュリティ考慮事項
- サービスキーを安全に保管
- 本番環境では環境変数を使用
- クライアントサイドのコードでサービスキーを公開しない

## トラブルシューティング

### 一般的な問題

**バケット作成の失敗**
- プロジェクトのバケット制限を確認(プライベートアルファでは2バケット)
- サービスキーに適切な権限があることを確認
- バケット名が既に存在しないことを確認

**権限エラー**
- 有効なサービスキーを使用していることを確認
- プロジェクト参照が正しいことを確認
- アカウントにAnalyticsバケット機能へのアクセス権があることを確認
