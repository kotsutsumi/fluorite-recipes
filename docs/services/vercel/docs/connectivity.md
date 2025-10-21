# Connectivity

プロジェクトをIP許可リストや非公開ネットワークアクセスを必要とするバックエンドサービスに接続します。

## 接続オプション

Vercelは、バックエンドサービスとの安全な接続を確立するための2つの主要なオプションを提供しています：

### Static IPs（共有プール）

データベースやAPIが既知のIPアドレスからのトラフィックを必要とする場合、Static IPsは変更されない共有の静的出力IPを提供します。Pro and Enterpriseチームに最適で、複雑さを伴わずにIP許可リストを実現できます。

#### 主な特徴

- **ユースケース**: データベース、API、レガシーシステムのIP許可リスト
- **ネットワーク**: サブネットレベルの分離を持つ共有VPC
- **料金**: プロジェクトごとに月額$100 + $0.15/GB プライベートデータ転送
- **対象プラン**: Pro および Enterprise

[Static IPsの詳細を見る](/docs/connectivity/static-ips)

### Secure Compute

独自のプライベート仮想プライベートクラウド（VPC）が必要な場合、Secure Computeは専用ネットワークとVPCピアリングを提供し、インフラストラクチャを他の顧客から完全に分離します。

#### 主な特徴

- **ユースケース**: 完全なネットワーク分離とVPCピアリング
- **ネットワーク**: 顧客ごとの専用VPC
- **料金**: 年間$6,500から（カスタム価格）
- **対象プラン**: Enterprise のみ

[Secure Computeの詳細を見る](/docs/connectivity/secure-compute)

## 機能比較

| 機能 | Static IPs (Pro & Enterprise) | Secure Compute (Enterprise) |
|------|-------------------------------|----------------------------|
| **IPタイプ** | 共有VPCの静的IP | 専用VPCの静的IP |
| **ネットワーク分離** | サブネットレベルの分離 | 完全に専用のVPC |
| **VPCピアリング** | 不可 | 可能 |
| **セットアップの複雑さ** | シンプル | 中程度 |
| **月額料金** | $100/プロジェクト | $6,500+（年間契約） |
| **データ転送** | $0.15/GB | $0.15/GB |
| **最適な用途** | IP許可リスト、データベースアクセス | 完全な分離、VPCピアリング、規制要件 |

## 料金

両方の接続オプションは、[地域別料金ドキュメント](/docs/pricing/regional-pricing)に基づいたプライベートデータ転送で課金されます。

### Static IPs

- **基本料金**: $100/月（プロジェクトごと）
- **データ転送**: $0.15/GB（プライベート転送）
- **無料枠**: なし

### Secure Compute

- **基本料金**: 年間$6,500から（カスタム見積もり）
- **データ転送**: $0.15/GB（プライベート転送）
- **追加オプション**: VPCピアリング、専用サポート

## 使用例

### Static IPsの使用例

- **データベース接続**: Amazon RDS、Google Cloud SQL、MongoDB Atlasなどのマネージドデータベース
- **API統合**: Auth0、Stripe、PayPalなどのサードパーティAPI
- **レガシーシステム**: オンプレミスのデータベースやファイアウォールの内側にあるシステム
- **コンプライアンス**: IP許可リストを要求するビジネス要件

### Secure Computeの使用例

- **規制産業**: 金融、医療、政府機関などの厳格なコンプライアンス要件
- **VPCピアリング**: 既存のAWS VPCとの直接接続が必要な場合
- **完全な分離**: 他の顧客とのネットワーク共有を避けたい場合
- **大規模エンタープライズ**: 複雑なネットワークアーキテクチャを持つ組織

## 選択ガイド

### Static IPsを選択すべき場合

- IP許可リストが必要だが、完全なVPC分離は不要
- セットアップの簡単さとコスト効率を優先
- Pro プランを使用している
- 中小規模のプロジェクト

### Secure Computeを選択すべき場合

- 完全なネットワーク分離が必要
- VPCピアリングが必要
- 厳格なコンプライアンス要件がある
- Enterprise プランを使用している
- 大規模なエンタープライズプロジェクト

## はじめに

### Static IPs

1. [Getting Started ガイド](/docs/connectivity/static-ips/getting-started)を参照
2. プロジェクト設定で Static IPs を有効化
3. リージョンを選択（最大3つ）
4. 割り当てられたIPアドレスをバックエンドサービスの許可リストに追加
5. プロジェクトを再デプロイ

### Secure Compute

1. Vercelのセールスチームに連絡
2. 要件とアーキテクチャを相談
3. AWSリージョンとCIDRブロックを指定
4. VPCピアリングの設定（必要に応じて）
5. 専用ネットワークの展開

## サポートされる機能

### ランタイムサポート

両方のオプションは、以下のランタイムをサポートしています：

- Node.js
- Python
- Go
- Ruby

**注意**: Edge Runtimeは、グローバルに分散されているため、Static IPsやSecure Computeをサポートしていません。

### リージョンサポート

Static IPsは、以下のAWSリージョンで利用可能です：

- us-east-1（バージニア北部）
- us-west-2（オレゴン）
- eu-west-1（アイルランド）
- ap-southeast-1（シンガポール）
- その他多数

Secure Computeは、すべてのAWSリージョンをサポートします。

## セキュリティ

両方の接続オプションは、以下のセキュリティ機能を提供します：

- **暗号化**: すべてのデータ転送はTLSで暗号化
- **認証**: IPアドレスまたはVPCピアリングによる認証
- **監査**: 接続ログとアクセスログ
- **コンプライアンス**: SOC 2、ISO 27001準拠

## トラブルシューティング

### Static IPs

- IPアドレスが正しく設定されているか確認
- バックエンドサービスの許可リストを確認
- プロジェクトが正しいリージョンにデプロイされているか確認

### Secure Compute

- VPCピアリング接続が確立されているか確認
- セキュリティグループとネットワークACLを確認
- ルートテーブルが正しく設定されているか確認

詳細については、[Vercelサポート](https://vercel.com/support)にお問い合わせください。

## 関連ドキュメント

- [Static IPs](/docs/connectivity/static-ips)
- [Static IPs Getting Started](/docs/connectivity/static-ips/getting-started)
- [Secure Compute](/docs/connectivity/secure-compute)
- [Environment Variables](/docs/projects/environment-variables)
- [Functions](/docs/functions)
