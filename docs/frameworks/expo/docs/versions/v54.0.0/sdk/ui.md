# Expo UI

## リンクサマリ

- [Jetpack Compose コンポーネント](./ui/jetpack-compose.md) — Android で Compose を使ってネイティブ UI を構築するための API と使用例。
- [SwiftUI コンポーネント](./ui/swift-ui.md) — iOS／tvOS で SwiftUI を活用する際のコンポーネント、ライフサイクル、デザイン指針。

`@expo/ui`は、Jetpack ComposeとSwiftUIを使用して、Reactから直接ネイティブインターフェースを構築するためのネイティブ入力コンポーネントのライブラリです。

## バージョン

- **バンドルバージョン**: ~0.2.0-beta.7

## プラットフォームの互換性

- Android（Jetpack Compose）
- iOS（SwiftUI）
- tvOS

## 概要

`@expo/ui`は、Jetpack ComposeとSwiftUIを使用して完全にネイティブなインターフェースを構築できるネイティブ入力コンポーネントのセットです。

## 目的

このライブラリにより、開発者はReactコードから直接、AndroidのJetpack ComposeとiOSのSwiftUIを使用してネイティブなUIコンポーネントを作成できます。

## 利用可能なプラットフォーム

### 1. Jetpack Compose
ネイティブなAndroidインターフェースコンポーネントを提供します。

[Jetpack Composeドキュメント](./ui/jetpack-compose/)を参照してください。

### 2. SwiftUI
ネイティブなiOSインターフェースコンポーネントを提供します。

[SwiftUIドキュメント](./ui/swift-ui/)を参照してください。

## インストール

```bash
npx expo install @expo/ui
```

## 重要な注意事項

- このライブラリは現在ベータ版です
- Expo Goでは利用できません
- 開発ビルドが必要です
- 頻繁に破壊的な変更が発生する可能性があります

## 主な特徴

- **ネイティブパフォーマンス**: 完全にネイティブなコンポーネントを使用
- **プラットフォーム固有のUI**: 各プラットフォームのデザインガイドラインに準拠
- **React統合**: React Nativeから直接使用可能
- **最新のUI技術**: Jetpack ComposeとSwiftUIの最新機能を活用

## 使用シナリオ

`@expo/ui`は以下のような場合に最適です:

1. プラットフォーム固有のネイティブUIが必要な場合
2. 最新のネイティブUIフレームワークを活用したい場合
3. 高いパフォーマンスが要求される場合
4. 各プラットフォームのネイティブなルック&フィールが重要な場合

## リソース

- [GitHubリポジトリ](https://github.com/expo/expo)
- [Changelog](https://github.com/expo/expo/blob/main/packages/@expo/ui/CHANGELOG.md)
- [npmパッケージ](https://www.npmjs.com/package/@expo/ui)
- [Expoフォーラム](https://forums.expo.dev/)

## ステータス

このライブラリは現在アルファ/ベータステージにあり、一部のコンポーネントはまだ開発中です。本番環境で使用する前に、十分なテストを行ってください。

## 次のステップ

- [Jetpack Composeドキュメント](./ui/jetpack-compose/)でAndroidコンポーネントを確認
- [SwiftUIドキュメント](./ui/swift-ui/)でiOSコンポーネントを確認

最終更新日: 2025年9月24日
