# React Native Skia

`@shopify/react-native-skia`は、React NativeでSkiaを使用してグラフィックスを作成するためのライブラリです。

## プラットフォームの互換性

| Android | iOS | tvOS | Web |
|---------|-----|------|-----|
| ✅ | ✅ | ✅ | ✅ |

## バージョン情報

バンドルされているバージョン: **2.2.12**

## インストール

```bash
npx expo install @shopify/react-native-skia
```

## Skiaとは？

Skiaは、Chrome、Android、Flutter、Firefox、その他多くの製品で使用されているグラフィックスエンジンです。高性能で豊富な機能を持つ2Dグラフィックスライブラリで、React Nativeに高度なグラフィックス機能を提供します。

## 主な特徴

- **高性能グラフィックス**: 業界標準のSkiaエンジンを使用
- **豊富な機能**: 複雑な描画、アニメーション、エフェクトをサポート
- **クロスプラットフォーム**: Android、iOS、tvOS、Webで一貫した動作
- **React Native統合**: React Nativeコンポーネントとして使いやすいAPI

## Web環境での追加セットアップ

Web環境で使用する場合、CanvasKitを読み込むための追加手順が必要です。開発者は、特定のWeb向けインストール手順に従ってください。

### Web セットアップの要件

- CanvasKitの読み込み設定
- Web専用の初期化手順
- パフォーマンス最適化の考慮事項

## 使用例

React Native Skiaは以下のような高度なグラフィックス機能を実現できます:

- カスタム描画とシェイプ
- 複雑なアニメーション
- グラデーションとブレンドモード
- 画像フィルターとエフェクト
- SVGレンダリング
- カスタムチャートとビジュアライゼーション

## 重要な注意事項

- 既存のReact Nativeアプリの場合は、ライブラリのREADMEで詳細なインストール手順を確認してください
- Web環境での使用には追加の設定が必要です
- パフォーマンスを最適化するためのベストプラクティスを理解してください

## ドキュメントとリソース

- [公式ドキュメント](https://shopify.github.io/react-native-skia/)
- [GitHub リポジトリ](https://github.com/shopify/react-native-skia)
- [npm パッケージ](https://www.npmjs.com/package/@shopify/react-native-skia)

## パフォーマンスに関する考慮事項

Skiaは高性能ですが、複雑なグラフィックス操作はリソースを消費する可能性があります。パフォーマンスを最適化するために:

- 不要な再描画を避ける
- メモ化を適切に使用する
- 複雑な計算をキャッシュする
- プラットフォーム固有の最適化を検討する

このライブラリを使用して、React Nativeアプリケーションに業界標準のグラフィックス機能を追加できます。
