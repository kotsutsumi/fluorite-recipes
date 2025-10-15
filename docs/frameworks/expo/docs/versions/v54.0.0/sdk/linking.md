# Expo Linking

## 概要

`expo-linking`は、モバイルおよびWebアプリケーションでのディープリンクのためのユーティリティを提供するライブラリです。React NativeのLinking APIを拡張し、以下のためのメソッドを提供します：

- ディープリンクの作成と解析
- 他のアプリでURLを開く
- アプリへの着信リンクの処理

## インストール

```bash
npx expo install expo-linking
```

## 主な機能

### フック

- `useLinkingURL()`: 現在のリンクURLを返す
- `useURL()`: 初期URLとその後の変更を返す

### 主要なメソッド

- `Linking.canOpenURL(url)`: URLを開けるかどうかを確認
- `Linking.createURL(path)`: アプリへのディープリンクを構築
- `Linking.openURL(url)`: 特定のURLを開こうとする
- `Linking.parse(url)`: ディープリンク情報を解析

### URL作成オプション

- カスタムスキームをサポート
- クエリパラメータを追加可能
- プラットフォーム間（Android、iOS、Web）で動作

## プラットフォームサポート

- Android
- iOS
- tvOS
- Web

## 使用例

- アプリ固有のディープリンクの作成
- 外部アプリナビゲーションの処理
- 着信リンクパラメータの解析

このドキュメントは、Expoアプリケーションでディープリンクを実装する開発者のために、包括的な型定義と詳細なメソッド説明を提供します。
