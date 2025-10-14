# Masked View

`@react-native-masked-view/masked-view`は、React Native用のマスクビューコンポーネントを提供するライブラリです。

## プラットフォームの互換性

| Android | iOS | tvOS |
|---------|-----|------|
| ✅ | ✅ | ✅ |

## バージョン情報

バンドルされているバージョン: **0.3.2**

## インストール

```bash
npx expo install @react-native-masked-view/masked-view
```

## 概要

Masked Viewは、マスク要素と重なるピクセルのみを表示する特殊なビューコンポーネントです。これにより、複雑な視覚効果やカスタムシェイプのビューを作成できます。

## 重要な注意事項

### パッケージの互換性

**重要**: `@react-native-community/masked-view`（非推奨）または`@react-native-masked-view/masked-view`のいずれか1つのみをインストールできます。両方を同時にインストールすることはできません。

### React Navigationとの互換性

React Navigation v6以降を使用している場合は、このパッケージ（`@react-native-masked-view/masked-view`）を使用してください。

### Androidサポート

Androidのサポートは実験的であり、クロスプラットフォームでの動作に不一致がある可能性があります。問題が発生した場合は、ライブラリのGitHubリポジトリに報告してください。

## 推奨事項

- 完全なAPIの詳細と使用方法については、[公式ドキュメント](https://github.com/react-native-masked-view/masked-view)を参照してください
- 既存のReact Nativeアプリの場合は、`expo`がインストールされていることを確認してください

## リソース

- [GitHub リポジトリ](https://github.com/react-native-masked-view/masked-view)
- [npm パッケージ](https://www.npmjs.com/package/@react-native-masked-view/masked-view)

## 使用例

マスクビューを使用すると、テキストにグラデーション効果を適用したり、画像を特定の形状でマスクしたりするなど、高度な視覚効果を実現できます。
