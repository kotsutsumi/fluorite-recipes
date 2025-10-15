# react-native-svg

`react-native-svg` は、React NativeアプリケーションでSVGを使用するためのライブラリです。

## 主な機能

- Android、iOS、macOS、tvOS、Web全体でSVGレンダリングをサポート
- Circle、Rect、Path、ClipPath、Polygonなどの描画プリミティブを提供
- SVGのインタラクティビティとアニメーションを有効化

## インストール

```bash
npx expo install react-native-svg
```

## 基本的な使用例

```javascript
import Svg, { Circle, Rect } from 'react-native-svg';

export default function SvgComponent(props) {
  return (
    <Svg height="50%" width="50%" viewBox="0 0 100 100" {...props}>
      <Circle
        cx="50"
        cy="50"
        r="45"
        stroke="blue"
        strokeWidth="2.5"
        fill="green"
      />
      <Rect
        x="15"
        y="15"
        width="70"
        height="70"
        stroke="red"
        strokeWidth="2"
        fill="yellow"
      />
    </Svg>
  );
}
```

## 主な描画プリミティブ

### Circle（円）

円を描画します。

```javascript
<Circle cx="50" cy="50" r="45" fill="blue" />
```

### Rect（矩形）

矩形を描画します。

```javascript
<Rect x="10" y="10" width="80" height="80" fill="red" />
```

### Path（パス）

複雑な形状を描画します。

```javascript
<Path d="M10 80 Q 95 10 180 80" stroke="black" fill="transparent" />
```

### ClipPath（クリップパス）

クリッピング領域を定義します。

### Polygon（ポリゴン）

多角形を描画します。

```javascript
<Polygon points="40,5 70,80 25,95" fill="lime" />
```

## 便利なツールとリソース

### SVGの検索と作成

- [The Noun Project](https://thenounproject.com/) - SVGアイコンを検索
- [Figma](https://www.figma.com/) - SVGの作成と編集

### SVGの最適化と変換

- [SVGOMG](https://jakearchibald.github.io/svgomg/) - SVGの最適化
- [SVGR](https://react-svgr.com/playground/) - SVGをReactコンポーネントに変換

## ドキュメント

- [公式GitHub Repository](https://github.com/software-mansion/react-native-svg) - 詳細なドキュメントとAPIリファレンス
- [npm Package](https://www.npmjs.com/package/react-native-svg) - パッケージ情報

## 高度な機能

### アニメーション

React Native Reanimatedと組み合わせてSVGアニメーションを作成できます。

### インタラクティビティ

タッチイベントを処理し、インタラクティブなSVGグラフィックスを作成できます。

## 概要

`react-native-svg` は、React Nativeアプリケーションで高品質なベクターグラフィックスを作成するための包括的なソリューションを提供します。
