# ExpoネイティブアプリでReact DOMを使用

## 概要

`'use dom'`ディレクティブを使用すると、開発者はExpoネイティブアプリで直接Webコンポーネントをレンダリングでき、Webコンテンツのユニバーサルアプリケーションへの段階的な移行が可能になります。

## 前提条件

### Expo CLIの使用

最新のExpo CLIを使用してください。

### 必要なパッケージのインストール

```bash
npx expo install @expo/metro-runtime react-dom react-native-webview
```

## コア機能

### 1. 統一されたバンドラー設定

Webとネイティブプラットフォーム間で共有されるバンドラー設定。

### 2. React、TypeScript、CSSのサポート

React、TypeScript、CSSをネイティブアプリで使用できます。

### 3. Fast RefreshとHot Module Replacement

開発中の高速な更新とホットリロードをサポート。

### 4. ランタイムエラーオーバーレイ

開発中のエラーを視覚的に表示。

### 5. Expo Goサポート

Expo Goアプリでもテスト可能。

## 使用例

### ネイティブコンポーネント（App.tsx）

```typescript
import { StyleSheet, View } from 'react-native';
import DOMComponent from './my-component';

export default function App() {
  return (
    <View style={styles.container}>
      <DOMComponent name="Europa" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
```

### Webコンポーネント（my-component.tsx）

```typescript
'use dom';

import './styles.css';

export default function DOMComponent({ name }: { name: string }) {
  return (
    <div>
      <h1>Hello, {name}</h1>
      <p>これはDOMコンポーネントです</p>
    </div>
  );
}
```

### CSSスタイル（styles.css）

```css
div {
  font-family: system-ui, -apple-system, sans-serif;
  padding: 20px;
  background-color: #f0f0f0;
  border-radius: 8px;
}

h1 {
  color: #333;
  margin: 0 0 10px 0;
}

p {
  color: #666;
  margin: 0;
}
```

## Propsの渡し方

### サポートされる型

DOMコンポーネントには以下のpropsを渡すことができます：

- **プリミティブ型**: string、number、boolean
- **オブジェクト**: JSON形式でシリアライズ可能なオブジェクト
- **配列**: JSON形式でシリアライズ可能な配列
- **関数**: コールバック関数（非同期）

### 例

```typescript
<DOMComponent
  name="Europa"
  age={25}
  isActive={true}
  data={{ city: 'Tokyo', country: 'Japan' }}
  items={['item1', 'item2', 'item3']}
  onPress={(value) => console.log(value)}
/>
```

## 主な制限事項

### 1. childrenを渡せない

DOMコンポーネントに`children`を渡すことはできません。

```typescript
// ❌ サポートされていません
<DOMComponent>
  <Text>これは動作しません</Text>
</DOMComponent>

// ✅ propsとして渡します
<DOMComponent content="これは動作します" />
```

### 2. 非同期データ転送

ネイティブとWebコンポーネント間のデータ転送は非同期です。

### 3. パフォーマンス

ネイティブビューに比べてパフォーマンスが遅くなります。

### 4. 静的レンダリングなし

静的レンダリングやReact Server Componentsのサポートはありません。

## 推奨される使用例

DOMコンポーネントは以下の場合に適しています：

### 1. リッチテキストレンダリング

複雑なHTMLコンテンツの表示。

```typescript
'use dom';

export default function RichText({ html }: { html: string }) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
```

### 2. Markdownコンテンツ

Markdownを HTML にレンダリング。

```typescript
'use dom';
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt();

export default function MarkdownViewer({ markdown }: { markdown: string }) {
  const html = md.render(markdown);
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
```

### 3. ブログ記事

長文コンテンツの表示。

### 4. ヘルプページ

ドキュメントやFAQページ。

### 5. 設定インターフェース

フォームやコントロールを含む設定画面。

## ベストプラクティス

### 1. 可能な限りネイティブビューを使用

ドキュメントでは、「**可能な限り真のネイティブビューを使用**」することを強調しています。

### 2. 適切な使用例を選択

パフォーマンスが重要でないコンテンツ表示にDOMコンポーネントを使用してください。

### 3. CSSでスタイリング

ネイティブスタイルではなく、CSSでスタイリングしてください。

### 4. エラーハンドリング

非同期データ転送のため、適切なエラーハンドリングを実装してください。

## デバッグ

### React DevTools

React DevToolsを使用してDOMコンポーネントをデバッグできます。

### コンソールログ

DOMコンポーネント内で`console.log()`を使用できます。

### エラーオーバーレイ

開発中のエラーは自動的に表示されます。

## まとめ

`'use dom'`ディレクティブは、ExpoネイティブアプリでWebコンポーネントを使用できる強力な機能です。リッチテキスト、Markdownコンテンツ、ブログ記事、ヘルプページなどに適していますが、パフォーマンスが重要な場合は、可能な限りネイティブビューを使用してください。
