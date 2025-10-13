# 配信：概要

アプリストアへの送信または内部配信を使用したアプリの配信の概要。

## 主要な配信方法

### はじめに

アプリを配信するには、次のことができます：

1. 自動的にビルドして送信：
```bash
# CLIをインストール
npm i -g eas-cli

# アプリをビルドして送信
eas build --auto-submit

# または -- 既存のバイナリを送信
eas submit
```

### 配信オプション

- [Google Play Storeに送信](/submit/android)
- [Apple App Storeに送信](/submit/ios)
- [内部配信](/build/internal-distribution)
- [Webサイトを公開](/guides/publishing-websites)
- [OTA更新](/eas-update/introduction)

### 主要な機能

- AndroidとiOSのネイティブコード署名を自動的に管理
- 支払い、通知、ユニバーサルリンクなどの高度な機能をサポート
- [config plugins](/config-plugins/introduction)を通じて設定可能

## 推奨される次のステップ

1. ターゲットプラットフォーム（Android/iOS）を選択
2. 送信のためのアプリの準備
3. EAS CLIを使用してビルドと送信
4. 必要なネイティブ設定を構成

*最終更新日：2025年3月10日*
