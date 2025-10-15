# Expo LivePhoto

## 概要

- iOSでライブフォトを表示するためのライブラリ
- Expo SDKバージョン54の一部
- 互換性のあるデバイスでライブフォトアセットとの対話が可能

## 主な機能

- ライブフォトの選択と表示をサポート
- 再生コントロール（ヒントとフル再生）を提供
- `expo-image-picker`と連携

## インストール

```bash
npx expo install expo-live-photo
```

## 使用例のハイライト

- `expo-live-photo`と`expo-image-picker`から必要なモジュールをインポート
- `LivePhotoView`コンポーネントを使用してライブフォトをレンダリング
- `startPlayback()`と`stopPlayback()`などのメソッドでビデオ再生を制御
- `LivePhotoView.isAvailable()`でデバイスの互換性を確認

## 主要なAPIコンポーネント

- `LivePhotoView`: ライブフォトをレンダリングするためのメインコンポーネント
- Propsには`contentFit`、`isMuted`、さまざまなイベントハンドラが含まれる
- 再生スタイルをサポート：'hint'（短いプレビュー）と'full'（完全なビデオ）

## プラットフォームサポート

- iOSのみ
- 写真とビデオのメタデータが保持されたライブフォトファイルが必要

このドキュメントは、Expo/React Native iOSアプリケーションでライブフォト機能を実装したい開発者のための包括的なガイドを提供します。
