# Vercel Edge Config

## 概要

Edge Configは、[すべてのプランで利用可能](/docs/plans)なグローバルデータストアです。以下のような用途に使用できます：

- フィーチャーフラグ
- A/Bテスト
- 重要なリダイレクト
- IPブロッキング

## 主な特徴

- エッジでデータを読み取る際、外部データベースやアップストリームサーバーに問い合わせる必要がない
- 読み取りレイテンシーは非常に低く、P99で15ms以下、多くの場合1ms未満
- Middleware and Vercel Functionsで使用可能

## 使用事例

Edge Configは、頻繁にアクセスされ、めったに更新されないデータに最適です：

### 1. フィーチャーフラグとA/Bテスト

データベースからの取得と比較して、ページ読み込み時間を数百ミリ秒短縮可能です。

### 2. 重要なリダイレクト

Middlewareを使用して、誤ったURLへのアクセスをすぐにリダイレクト可能です。

### 3. 悪意のあるIPとユーザーエージェントのブロック

アップストリームサーバーに問い合わせることなく、悪意のあるIPセットを保存してブロック可能です。

## 利用方法

Edge Configは、以下の方法で作成・管理できます：

- [Vercel REST API](/docs/edge-config/vercel-api)
- [ダッシュボード](/docs/edge-config/edge-config-dashboard)

## データの読み書き

- **読み取り**: [Edge Config SDK](/docs/edge-config/edge-config-sdk)を使用
- **書き込み**: [Vercel REST API](/docs/edge-config/vercel-api)を使用

## プランと制限

- Hobbyチームまたは[チーム](/docs/accounts/create-a-team)で利用可能
- プランごとに異なる制限があります（詳細は[制限](/docs/edge-config/edge-config-limits)を参照）

## 統合

以下のサードパーティサービスとの統合が利用可能です：

- [LaunchDarkly](/docs/edge-config/edge-config-integrations/launchdarkly-edge-config)
- [Statsig](/docs/edge-config/edge-config-integrations/statsig-edge-config)
- [Hypertune](/docs/edge-config/edge-config-integrations/hypertune-edge-config)
- [Split](/docs/edge-config/edge-config-integrations/split-edge-config)
- [DevCycle](/docs/edge-config/edge-config-integrations/devcycle-edge-config)

## 次のステップ

- [クイックスタート](/docs/edge-config/get-started)でEdge Configの使用を開始
- [Edge Config SDK](/docs/edge-config/edge-config-sdk)でデータを読み取る方法を学ぶ
- [統合](/docs/edge-config/edge-config-integrations)でサードパーティサービスとの連携を確認
