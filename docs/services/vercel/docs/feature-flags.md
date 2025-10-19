# Vercel Feature Flags - フィーチャーフラグ

## 概要

フィーチャーフラグは、アプリケーションでの機能の可視性を制御するツールで、開発者が「自信を持って機能を出荷、テスト、実験できる」ようにします。Vercelは、フィーチャーフラグを実装するための複数のアプローチを提供します。

## フラグを使用する方法

### 1. コードベースでのフラグ実装

- LaunchDarkly、Optimizely、Statsig、Hypertune、Splitなどのプロバイダーと互換性がある
- Next.jsとSvelteKit用の無料オープンソース[Flags SDK](/docs/feature-flags/feature-flags-pattern)を提供

### 2. Vercel Toolbarを介したフラグ管理

- すべてのプランで利用可能
- フィーチャーフラグの表示、オーバーライド、共有が可能
- ローカル開発、プレビュー、本番環境で動作

### 3. フラグの監視

- Vercelの観測可能性機能と統合
- フィーチャーフラグデータを以下に送信可能：
  - Runtime Logs
  - Web Analytics

### 4. フィーチャーフラグの最適化

- Edge Configをグローバルデータストアとして使用
- 以下を可能にする：
  - 実験
  - A/Bテスト
  - 重要なリダイレクト
- ほぼ瞬時のデータ読み取りを提供（ほとんどが15ms未満）

## 主な統合オプション

- コード内で直接Flags SDKを使用
- Vercel Toolbarを通じて管理
- Vercel Integrations経由で外部プロバイダーと接続
- パフォーマンスのためにEdge Configを活用

## 関連ドキュメント

- [Flags SDK](/docs/feature-flags/feature-flags-pattern)
- [Flags Explorer](/docs/feature-flags/flags-explorer)
- [Edge Config](/docs/edge-config)
