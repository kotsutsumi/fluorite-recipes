# Edge Config との統合の使用

## 概要

Edge Config の統合は、[すべてのプランで利用可能](/docs/plans)です。

Vercel は、LaunchDarkly や Statsig などのA/Bテストおよび機能フラグサービスとパートナーシップを結び、Edge Config をワークフローに簡単に統合できるようにしています。これらの統合により、サービスプロバイダーへのネットワークコールを行わずに、エッジで機能フラグを評価できます。

## テンプレートで統合を探索

数分で始められます。

Edge Config 統合を含むテンプレートを探索してください。

### テンプレート例

#### 1. Optimizely 機能実験

Next.js App Router、Vercel 機能フラグ、Optimizely 機能実験を使用した実装例。

#### 2. OpenFeature アダプターを使用した Flags SDK

OpenFeature プロバイダーと Flags SDK の統合。

#### 3. Statsig による実験

エッジでのクライアント読み込み実験の CLS 削減とパフォーマンス改善。

## サポートされている統合

以下の Edge Config 統合を利用できます：

### 1. LaunchDarkly

[LaunchDarkly](/docs/edge-config/edge-config-integrations/launchdarkly-edge-config)は、機能フラグ管理とA/Bテストのためのプラットフォームです。

**主な機能:**
- エッジでの高速な機能フラグ評価
- LaunchDarklyダッシュボードでの管理
- リアルタイム更新

### 2. Statsig

[Statsig](/docs/edge-config/edge-config-integrations/statsig-edge-config)は、実験とフィーチャーフラグのためのプラットフォームです。

**主な機能:**
- A/Bテストとフィーチャーフラグ
- エッジでの低レイテンシー評価
- 詳細な分析とインサイト

### 3. Hypertune

[Hypertune](/docs/edge-config/edge-config-integrations/hypertune-edge-config)は、型安全な機能フラグとA/Bテストのためのプラットフォームです。

**主な機能:**
- TypeScriptの完全な型安全性
- ビジュアルエディタ
- エッジでの高速評価

### 4. Split

[Split](/docs/edge-config/edge-config-integrations/split-edge-config)は、機能デリバリーと実験のためのプラットフォームです。

**主な機能:**
- 高度なターゲティング
- 詳細な分析
- エンタープライズグレードのセキュリティ

### 5. DevCycle

[DevCycle](/docs/edge-config/edge-config-integrations/devcycle-edge-config)は、機能フラグ管理のためのプラットフォームです。

**主な機能:**
- シンプルで使いやすいUI
- エッジでの高速評価
- 開発者フレンドリーなAPI

## 統合のメリット

### パフォーマンスの向上

- サービスプロバイダーへのネットワークコールを排除
- エッジでの機能フラグ評価により、レイテンシーを大幅に削減
- P99レイテンシー15ms以下

### 信頼性の向上

- サードパーティサービスのダウンタイムの影響を軽減
- Edge Configのグローバル配信により高可用性を実現

### コストの最適化

- ネットワークコールの削減によりコストを削減
- Edge Configの効率的なキャッシングを活用

## 統合のセットアップ

### 一般的な手順

1. Vercel統合マーケットプレイスで統合を追加
2. サービスプロバイダーにログイン
3. Edge Configストアを選択または作成
4. 環境変数を設定
5. コードで統合を使用

### 環境変数

通常、以下の環境変数が必要です：

- `EDGE_CONFIG`: Edge Config接続文字列
- `EDGE_CONFIG_ITEM_KEY`: Edge Config項目キー
- サービス固有のAPIキー

## ベストプラクティス

### 適切な統合の選択

プロジェクトの要件に基づいて適切な統合を選択：

- **LaunchDarkly**: エンタープライズグレードの機能フラグ管理
- **Statsig**: 統計的に有意な実験
- **Hypertune**: TypeScript型安全性が重要な場合
- **Split**: 高度なターゲティングと分析
- **DevCycle**: シンプルで使いやすいソリューション

### パフォーマンスの最適化

- Edge Configを使用してネットワークコールを削減
- 適切なキャッシュ戦略を実装
- 必要なデータのみを取得

### セキュリティ

- API キーは環境変数として安全に保管
- 適切なアクセス制御を設定
- 定期的にトークンをローテーション

## トラブルシューティング

### 統合が動作しない

1. 環境変数が正しく設定されているか確認
2. Edge Configが正しく接続されているか確認
3. サービスプロバイダーのダッシュボードで設定を確認

### データが更新されない

- Edge Configの更新には最大10秒かかる場合があります
- サービスプロバイダーで変更が保存されているか確認
- キャッシュをクリアして再試行

## その他のリソース

- [クイックスタート](/docs/edge-config/get-started)
- [SDK での読み取り](/docs/edge-config/edge-config-sdk)
- [制限](/docs/edge-config/edge-config-limits)

## 次のステップ

各統合の詳細なドキュメントを参照して、プロジェクトに最適な統合を選択してください：

- [LaunchDarkly](/docs/edge-config/edge-config-integrations/launchdarkly-edge-config)
- [Statsig](/docs/edge-config/edge-config-integrations/statsig-edge-config)
- [Hypertune](/docs/edge-config/edge-config-integrations/hypertune-edge-config)
- [Split](/docs/edge-config/edge-config-integrations/split-edge-config)
- [DevCycle](/docs/edge-config/edge-config-integrations/devcycle-edge-config)
