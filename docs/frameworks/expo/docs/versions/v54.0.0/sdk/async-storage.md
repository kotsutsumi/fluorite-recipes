# Async Storage

`@react-native-async-storage/async-storage`は、非同期で暗号化されていない永続的なキーバリューストレージAPIを提供するライブラリです。

## プラットフォームの互換性

| Android | iOS | macOS | tvOS | Web |
|---------|-----|-------|------|-----|
| ✅ | ✅ | ✅ | ✅ | ✅ |

## バージョン情報

バンドルされているバージョン: **2.2.0**

## インストール

```bash
npx expo install @react-native-async-storage/async-storage
```

## 主な特徴

- **非同期**: 非ブロッキングな操作でパフォーマンスを維持
- **暗号化なし**: データは暗号化されずに保存されます（機密情報には注意）
- **永続的**: アプリを閉じてもデータが保持されます
- **キーバリュー型**: シンプルなキーバリューペアでのデータ管理

## 重要な注意事項

- 既存のReact Nativeアプリの場合は、`expo`がインストールされていることを確認してください
- プラットフォーム固有の追加のインストール手順については、ライブラリのREADMEに従ってください

## 使用方法

包括的なAPIと使用方法の詳細については、[公式ドキュメント](https://react-native-async-storage.github.io/async-storage/docs/usage)を参照してください。

## 推奨事項

高度な実装の詳細とベストプラクティスについては、完全なライブラリドキュメントを参照してください。

## さらに詳しく

- [GitHub リポジトリ](https://github.com/react-native-async-storage/async-storage)
- [npm パッケージ](https://www.npmjs.com/package/@react-native-async-storage/async-storage)
- [公式ドキュメント](https://react-native-async-storage.github.io/async-storage/)
