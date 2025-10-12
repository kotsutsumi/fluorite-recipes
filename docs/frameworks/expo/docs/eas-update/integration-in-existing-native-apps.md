# 既存のネイティブアプリへのEAS Updateの統合

## 概要

既存のネイティブコンポーネントを持つブラウンフィールドReact Nativeアプリ向けです。

## 要件

- Expo SDK 52+ および React Native 0.76+
- AndroidとiOSのネイティブプロジェクト設定の変更が必要

## 前提条件

### 1. 既存のアップデートライブラリの削除
### 2. Expoモジュールがインストールされていることを確認
### 3. metroとbabel設定の構成
### 4. ターゲットプラットフォーム向けに`npx expo export`が正常に実行されることを確認

## 主な統合手順

### 1. `eas-cli`のインストールと認証
### 2. `expo-updates`のインストール
### 3. EASプロジェクトの初期化
### 4. AndroidとiOS用の自動セットアップの無効化
### 5. `expo-updates`を使用するようネイティブプロジェクトを設定

## プラットフォーム固有の設定

### Android

`MainActivity.kt`を変更してアップデートを初期化：

```kotlin
// アップデート初期化コードをMainActivityに追加
```

### iOS

`AppDelegate.swift`を更新してカスタムビューコントローラーを作成：

```swift
// カスタムビューコントローラーコードをAppDelegateに追加
```

## 詳細なコード例

ドキュメントでは、異なるSDKバージョンに対するAndroid（Kotlin）とiOS（Swift）実装の両方について詳細なコード例を提供しています。

## 推奨

既存のネイティブReact Nativeアプリにover-the-airアップデート機能を追加したい開発者向けです。
