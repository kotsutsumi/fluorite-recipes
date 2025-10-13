# EAS Workflowsでプレビューアップデートを公開

## 概要
このドキュメントは、EAS Workflowsを使用してプレビューアップデートを公開する方法を説明し、チームが最新のコードをローカルでプルすることなく変更をレビューできるようにします。

## 前提条件
1. EAS Updateのセットアップ
   - コマンドで設定：`eas update:configure`

2. 開発ビルドの作成
   - 各プラットフォーム用の新しい開発ビルドを作成

## ワークフローの例
```yaml
name: Publish preview update
on:
  push:
    branches: ['*']
jobs:
  publish_preview_update:
    name: Publish preview update
    type: update
    params:
      branch: ${{ github.ref_name || 'test' }}
```

## 主な利点
- チームとプレビューアップデートを共有
- ローカルコードのプルなしで変更をレビュー
- 以下を通じてプレビューにアクセス：
  - 開発ビルドUI
  - EASダッシュボード上のスキャン可能なQRコード

## 追加のコンテキスト
このワークフローは、すべてのブランチの各コミットに対してプレビューアップデートを公開し、継続的なプレビュー共有を可能にします。

## リソース
- [EAS Updateドキュメント](/eas-update/introduction)
- [開発ビルドガイド](/develop/development-builds/create-a-build)
