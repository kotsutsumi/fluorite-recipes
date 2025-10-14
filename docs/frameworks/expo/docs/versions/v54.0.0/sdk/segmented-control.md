# Segmented Control

`@react-native-segmented-control/segmented-control`は、UISegmentedControlをレンダリングするためのReact Nativeライブラリです。

## プラットフォームの互換性

| Android | iOS | Web |
|---------|-----|-----|
| ✅ | ✅ | ✅ |

## バージョン情報

バンドルされているバージョン: **2.5.7**

## インストール

```bash
npx expo install @react-native-segmented-control/segmented-control
```

## 概要

Segmented Controlは、複数のセグメントで構成される水平方向のコントロールで、各セグメントが個別のボタンとして機能します。高機能なラジオボタンのようなものと考えることができます。

## 主な特徴

- **マルチセグメント**: 複数のオプションを1つのコンポーネントで表示
- **ボタン機能**: 各セグメントが独立したボタンとして動作
- **クロスプラットフォーム**: プラットフォーム固有のUIを自動的にレンダリング

## プラットフォーム別のレンダリング

- **iOS**: ネイティブの`UISegmentedControl`としてレンダリング
- **Android**: iOS UIと同等のコントロールを作成
- **Web**: Web環境向けに最適化されたコントロールを作成

## 重要な注意事項

- 既存のReact Nativeアプリの場合は、まず`expo`をインストールしてください
- 完全なインストール手順については、ライブラリのGitHub READMEを参照してください

## 使用例

Segmented Controlは以下のような場合に最適です:
- 表示モードの切り替え（リスト/グリッド）
- フィルターオプションの選択
- カテゴリ間の切り替え
- 相互排他的なオプションの選択

## 追加リソース

- [GitHub リポジトリ](https://github.com/react-native-segmented-control/segmented-control)
- [npm パッケージ](https://www.npmjs.com/package/@react-native-segmented-control/segmented-control)
- 公式ドキュメント
- Expoフォーラムでのサポート
- GitHubイシュートラッカー

このドキュメントは、ライブラリの目的、インストールプロセス、およびプラットフォーム互換性の簡単な概要を提供します。
