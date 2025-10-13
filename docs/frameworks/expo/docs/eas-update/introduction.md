# EAS Updateの紹介

EAS Updateは、`expo-updates`ライブラリを使用するモバイルアプリ向けのホスト型サービスで、JavaScript、スタイリング、画像などのネイティブ以外のアプリコンポーネントのOTA（Over-The-Air）アップデートを可能にします。

## 主な機能

### 1. アップデート管理用のJS API

アップデートプロセスを制御するためのReact API:

- **`useUpdates()`** React Hook
- **`checkForUpdateAsync()`** メソッド
- **`fetchUpdateAsync()`** メソッド
- アップデートプロセスの追跡とデバッグ機能

### 2. インサイト追跡

- デプロイメントダッシュボード
- アップデート採用率の追跡
- EAS Insightsとの統合

### 3. アップデートの再公開

- 以前の安定バージョンへの復帰機能
- バージョン管理の「コミット」機能に類似
- 問題のあるアップデートからの迅速な回復

## はじめに

EAS Updateを始めるためのオプション：

- [初期セットアップ](/frameworks/expo/docs/eas-update/getting-started)
- [アップデートの公開](/frameworks/expo/docs/eas-update/deployment)
- [変更のプレビュー](/frameworks/expo/docs/eas-update/preview)
- [GitHub Actionsの使用](/frameworks/expo/docs/eas-update/github-actions)
- [CodePushからの移行](/frameworks/expo/docs/eas-update/codepush)

## EAS Updateの利点

### アプリストアの送信を待たずに修正を配信

- バグ修正を即座にプッシュ
- 小規模な改善を迅速にデプロイ
- ユーザーエクスペリエンスの向上

### 柔軟なデプロイメント戦略

- 段階的ロールアウト
- 環境ベースのデプロイメント（staging、production）
- ロールバック機能

### 包括的なモニタリング

- アップデート採用メトリクス
- デプロイメントダッシュボード
- エラートラッキング

## 仕組み

EAS Updateは以下を可能にします：

1. **アップデートの公開**: JavaScriptコードとアセットをEASサーバーにアップロード
2. **配信**: アプリは起動時に新しいアップデートをチェック
3. **適用**: 互換性のあるアップデートをダウンロードして適用
4. **監視**: ダッシュボードで採用率とパフォーマンスを追跡

## 次のステップ

- [セットアップガイド](/frameworks/expo/docs/eas-update/getting-started)
- [デプロイメント戦略](/frameworks/expo/docs/eas-update/deployment-patterns)
- [動作原理](/frameworks/expo/docs/eas-update/how-it-works)
