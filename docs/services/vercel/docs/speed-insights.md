# Speed Insights概要

## 概要

Speed InsightsはすべてのVercelプランで利用可能な機能で、以下を提供します：

- 詳細なWebサイトパフォーマンスメトリクス
- Core Web Vitalsに基づくインサイト
- プレビューおよび本番環境全体のパフォーマンスデータ

## ダッシュボードビュー機能

Speed Insightsダッシュボードでは以下が可能：

- モバイルとデスクトップビュー間の切り替え
- 環境別フィルタリング（プレビュー、本番、すべて）
- カスタム時間範囲の選択
- パフォーマンスメトリクスの分析：
  - Real Experience Score（RES）
  - First Contentful Paint（FCP）
  - Largest Contentful Paint（LCP）

### ダッシュボードビュー

#### 1. 時間ベースの折れ線グラフ

- P75パーセンタイルデータを表示
- オプションでP90、P95、P99パーセンタイル

#### 2. かんばんボード

- 改善が必要なルート/パスをハイライト
- 訪問数の0.5%未満のURLを除外

#### 3. 地理的マップ

- 国別の体験メトリックを表示
- 色の濃さがデータポイント量を示す

## 開始方法

Speed Insightsを使用するには：

1. [Speed Insightsを有効化](/docs/speed-insights/quickstart)
2. Vercelプロジェクトを通じてダッシュボードにアクセス
3. パフォーマンスメトリクスを分析

## 主な機能

### リアルユーザーモニタリング

- 実際のユーザーデータに基づく
- シミュレートされたテストではない
- リアルタイムのインサイト

### Core Web Vitals追跡

- LCP（Largest Contentful Paint）
- CLS（Cumulative Layout Shift）
- INP（Interaction to Next Paint）
- FCP（First Contentful Paint）
- その他のメトリクス

### 複数の可視化

- 折れ線チャート
- かんばんボード
- 地理的マップ
- 詳細なテーブル

## パフォーマンスメトリクス

### Real Experience Score（RES）

実際のユーザーデバイスから収集されたデータに基づく総合スコア。

### Core Web Vitals

Googleとウェブパフォーマンスワーキンググループによって定義された主要メトリクス：

- **LCP**: 2.5秒以下が目標
- **CLS**: 0.1以下が目標
- **INP**: 200ミリ秒以下が目標
- **FCP**: 1.8秒以下が目標

## 使用例

### パフォーマンスの追跡

1. デプロイメント前後のメトリクスを比較
2. 時間経過に伴う傾向を監視
3. パフォーマンスの低下を特定

### 最適化の優先順位付け

1. スコアの低いページを特定
2. 影響の大きい問題に焦点を当てる
3. 改善を測定

### 地理的分析

1. リージョン別のパフォーマンスを確認
2. 地理的な問題を特定
3. グローバルなユーザー体験を最適化

## ベストプラクティス

### 定期的な監視

- ダッシュボードを定期的に確認
- パフォーマンスアラートを設定
- 傾向を追跡

### データ駆動型の最適化

- メトリクスに基づいて優先順位を付ける
- 変更の影響を測定
- 継続的に改善

### チームコラボレーション

- インサイトを共有
- 共通の目標を設定
- 定期的にレビュー

## 次のステップ

- [Speed Insightsクイックスタート](/docs/speed-insights/quickstart)
- [メトリクスについて学ぶ](/docs/speed-insights/metrics)
- [パッケージを探索](/docs/speed-insights/package)
- [料金と制限を確認](/docs/speed-insights/limits-and-pricing)

## 追加リソース

- [Core Web VitalsとSEOへの影響（動画）](https://www.youtube.com/watch?v=qIyEwOEKnE0)
- [Speed Insightsの使用](/docs/speed-insights/using-speed-insights)
- [トラブルシューティング](/docs/speed-insights/troubleshooting)

*注意: Speed Insightsはすべての Vercelプランで利用可能*
