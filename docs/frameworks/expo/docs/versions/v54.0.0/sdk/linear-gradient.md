# Expo LinearGradient

## 概要

グラデーションビューをレンダリングするユニバーサルReactコンポーネントで、Android、iOS、tvOS、Webプラットフォームをサポートしています。

## 主な機能

- 複数の色間を線形に遷移するネイティブReactビューを提供
- カスタマイズ可能なカラーストップとグラデーション方向をサポート
- `npx expo install expo-linear-gradient`で簡単インストール

## インストール

```bash
npx expo install expo-linear-gradient
```

## 基本的な使用例

```javascript
import { LinearGradient } from 'expo-linear-gradient';

export default function App() {
  return (
    <LinearGradient
      colors={['#4c669f', '#3b5998', '#192f6a']}
      style={styles.button}
    >
      <Text>Facebookでサインイン</Text>
    </LinearGradient>
  );
}
```

## 主要なProps

- `colors`: グラデーションの色の配列（最小2色）
- `start`: グラデーションの開始点（オプション）
- `end`: グラデーションの終了点（オプション）
- `locations`: カラーストップの位置（オプション）
- `dither`: Android固有のオプションで、カラーバンディングを軽減

## プラットフォーム

Android、iOS、tvOS、Web

## バンドルバージョン

~15.0.7

このドキュメントは、Expo LinearGradientコンポーネントを使用する開発者のために、インストール、使用方法、APIリファレンス、型定義に関する包括的な詳細を提供します。
