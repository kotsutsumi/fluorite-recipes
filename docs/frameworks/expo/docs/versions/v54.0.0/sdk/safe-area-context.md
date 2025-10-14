# react-native-safe-area-context

`react-native-safe-area-context` は、プラットフォーム間（Android、iOS、tvOS、Web）でデバイスのセーフエリアインセット情報にアクセスするための柔軟なライブラリです。

## 主な機能

- ノッチ、ステータスバー、ホームインジケーターなどのデバイスインターフェース要素を処理するAPIを提供
- ビューに自動的にインセットを適用する `SafeAreaView` コンポーネントを提供
- クロスプラットフォームでのセーフエリア処理をサポート

## インストール

```bash
npx expo install react-native-safe-area-context
```

## 主なコンポーネントとフック

### 1. SafeAreaView

セーフエリアのエッジがパディングとして適用されたViewコンポーネント。

### 2. SafeAreaProvider

セーフエリアコンテキストを提供するためのラッパー。

### 3. useSafeAreaInsets()

セーフエリアインセット情報にアクセスするためのフック。

## 使用例

```javascript
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView>
        {/* コンテンツをここに配置 */}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
```

### useSafeAreaInsetsフックの使用例

```javascript
function MyComponent() {
  const insets = useSafeAreaInsets();

  return (
    <View style={{
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
      paddingLeft: insets.left,
      paddingRight: insets.right,
    }}>
      {/* コンテンツ */}
    </View>
  );
}
```

## 主な型

### Edge

可能なエッジ値: `'top'` | `'right'` | `'bottom'` | `'left'`

### EdgeInsets

各エッジのインセット値を表すオブジェクト:

```typescript
type EdgeInsets = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};
```

## 最適化のヒント

- **ネイティブパフォーマンス**: ネイティブパフォーマンスのために `SafeAreaView` を優先使用
- **初期レンダリングの高速化**: より高速な初期レンダリングのために `initialWindowMetrics` を使用
- **Web SSR**: Webサーバーサイドレンダリングでは、初期セーフエリアインセットを提供

## リソース

- [公式ドキュメント](https://github.com/th3rdwave/react-native-safe-area-context) - 詳細な使用方法とAPIリファレンス
- [GitHub Repository](https://github.com/th3rdwave/react-native-safe-area-context) - ソースコードとissue
- [npm Package](https://www.npmjs.com/package/react-native-safe-area-context) - パッケージ情報

## 概要

このライブラリは、異なるデバイスやプラットフォーム間でセーフエリアを処理するための一貫したアプローチを提供し、画面レイアウトの管理を簡素化します。
