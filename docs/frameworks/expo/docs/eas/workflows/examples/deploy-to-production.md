# EAS Workflowsで本番環境にデプロイ

## 概要
このドキュメントは、ExpoのEAS（Expo Application Services）Workflowsを使用してモバイルアプリケーションをデプロイする自動化ワークフローを説明します。ワークフローの目的：
- 新しいビルドが必要かどうかを検出
- 必要に応じてアプリストアにビルドして提出
- ビルドが不要な場合はOTAアップデートを送信

## 前提条件
3つの主要な要件：
1. EAS Buildのセットアップ
2. EAS Submitのセットアップ
3. EAS Updateのセットアップ（`eas update:configure`で設定）

## ワークフローの詳細
ワークフローは`main`ブランチへの各プッシュで実行され、以下のステップを実行します：
- ネイティブプロジェクト特性のハッシュを生成
- 既存のビルドをチェック
- ビルドが存在しない場合、アプリストアにビルドして提出
- ビルドが既に存在する場合、OTAアップデートを公開

## ワークフロー設定の例
```yaml
name: Deploy to production
on:
  push:
    branches: ['main']
jobs:
  fingerprint:
    name: Fingerprint
    type: fingerprint

  get_android_build:
    name: Check for existing android build
    needs: [fingerprint]
    type: get-build
    params:
      fingerprint_hash: ${{ needs.fingerprint.outputs.android_fingerprint_hash }}
      profile: production

  # AndroidとiOS用の追加ジョブ設定、ビルド、提出
```

## 主な機能
- 自動化されたビルドとデプロイプロセス
- AndroidおよびiOSプラットフォームの両方をサポート
- インテリジェントなビルド検出
- OTAアップデート機能
