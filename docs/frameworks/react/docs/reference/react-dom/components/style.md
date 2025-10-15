# `<style>`

ブラウザ組み込みの `<style>` コンポーネントを利用することで、ドキュメントにインラインの CSS スタイルシートを追加できます。

```jsx
<style>{`p { color: red; }`}</style>
```

## リファレンス

### `<style>`

ドキュメントにインラインスタイルを追加するには、ブラウザ組み込みの `<style>` コンポーネントをレンダーします。コンポーネントの任意の場所から `<style>` をレンダーでき、React は DOM 要素を適切な場所に配置し、重複を排除します。

```jsx
<style>{`p { color: red; }`}</style>
```

#### Props

`<style>` は、すべての一般的な要素の props をサポートしています。

**`children`**: 文字列、必須。スタイルシートの内容です。

**推奨される Props:**

- **`precedence`**: 文字列。ドキュメント `<head>` 内で `<style>` DOM ノードを他のノードに対してどこにランク付けするかを React に伝えます。これにより、どのスタイルシートが他のスタイルシートを上書きできるかが決まります。値は `"reset"`、`"low"`、`"medium"`、`"high"` のいずれかです。同じ precedence を持つスタイルシートは、`<link>` または `<style>` タグであるか、`preload` または `preinit` 関数でロードされたかにかかわらず、一緒にグループ化されます。

- **`href`**: 文字列。React が同じスタイルを持つ複数の `<style>` タグを重複排除できるようにします。提供する場合は、一意の識別子として機能する必要があります。

- **`media`**: 文字列。スタイルシートを特定のメディアクエリに制限します。

- **`nonce`**: 文字列。厳格なコンテンツセキュリティポリシーを使用する際にリソースを許可するための暗号化 nonce です。

- **`title`**: 文字列。代替スタイルシートの名前を指定します。

#### 特別なレンダリング動作

React は `<style>` コンポーネントを React ツリー内のどこにレンダーしても、常にドキュメントの `<head>` 内に対応する DOM 要素を配置します。

`<style>` は以下の特別な動作をサポートします:

- **ヘッドへの移動**: `precedence` prop を指定すると、React は自動的に `<style>` をドキュメントの `<head>` に移動します
- **重複排除**: 同じ `href` を持つスタイルタグは重複排除されます
- **Suspense 統合**: `precedence` prop を使用すると、スタイルシートのロード中にコンポーネントをサスペンドできます

#### 注意点

- `precedence` prop を提供する場合、React はスタイルシートの管理を最適化します
- `href` prop は重複排除のための一意の識別子として機能します
- スタイルがレンダーされた後に props が変更されても、React は DOM を更新しません
- コンポーネントがアンマウントされた後も、React はスタイルを DOM に残すことがあります
- 同じ `href` を持つ異なるスタイルシートをレンダーしないでください

## 使用法

### インラインスタイルシートをレンダーする

コンポーネントが特定のスタイルに依存している場合、そのコンポーネント内でインラインスタイルシートをレンダーできます。

`precedence` と `href` props を提供すると、React はスタイルシートのロード中にコンポーネントをサスペンドします。

```jsx
function ComponentRequiringStyle() {
  return (
    <>
      <style
        href="component-styles"
        precedence="medium"
      >{`
        .component {
          color: blue;
          font-size: 16px;
        }
      `}</style>
      <div className="component">スタイル付きコンテンツ</div>
    </>
  );
}
```

### 動的スタイルの生成

`useId` フックと組み合わせて、コンポーネント固有の動的スタイルを生成できます:

```jsx
import { useId } from 'react';

function PieChart({data, colors}) {
  const id = useId();
  const stylesheet = colors.map((color, index) =>
    `#${id} .color-${index} { color: ${color}; }`
  ).join('\n');

  return (
    <>
      <style
        href={`PieChart-${JSON.stringify(colors)}`}
        precedence="medium"
      >
        {stylesheet}
      </style>
      <svg id={id}>
        {data.map((value, index) => (
          <text key={index} className={`color-${index}`}>
            {value}
          </text>
        ))}
      </svg>
    </>
  );
}
```

### メディアクエリを使用したレスポンシブスタイル

特定の画面サイズやデバイスに対してスタイルを適用:

```jsx
function ResponsiveComponent() {
  return (
    <>
      {/* デスクトップ用スタイル */}
      <style
        href="desktop-styles"
        precedence="medium"
        media="(min-width: 768px)"
      >{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
        }
      `}</style>

      {/* モバイル用スタイル */}
      <style
        href="mobile-styles"
        precedence="medium"
        media="(max-width: 767px)"
      >{`
        .container {
          padding: 10px;
        }
      `}</style>

      <div className="container">
        レスポンシブコンテンツ
      </div>
    </>
  );
}
```

### スタイルの優先順位の管理

`precedence` prop を使用して、スタイルの適用順序を制御:

```jsx
export default function App() {
  return (
    <>
      {/* リセットスタイル - 最も低い優先順位 */}
      <style href="reset" precedence="reset">{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
      `}</style>

      {/* 基本スタイル */}
      <style href="base" precedence="low">{`
        body {
          font-family: sans-serif;
          line-height: 1.6;
        }
      `}</style>

      {/* コンポーネントスタイル */}
      <style href="components" precedence="medium">{`
        .button {
          padding: 10px 20px;
          border: none;
          cursor: pointer;
        }
      `}</style>

      {/* ユーティリティスタイル - 最も高い優先順位 */}
      <style href="utilities" precedence="high">{`
        .text-center { text-align: center; }
        .mt-4 { margin-top: 1rem; }
      `}</style>

      <HomePage />
    </>
  );
}
```

### テーマスタイルの切り替え

動的にテーマを切り替える例:

```jsx
import { useState } from 'react';

function ThemeSelector() {
  const [theme, setTheme] = useState('light');

  return (
    <>
      <style
        href={`theme-${theme}`}
        precedence="medium"
      >{theme === 'light' ? `
        body {
          background-color: white;
          color: black;
        }
      ` : `
        body {
          background-color: #1a1a1a;
          color: white;
        }
      `}</style>

      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        テーマを切り替え
      </button>
    </>
  );
}
```

### CSS 変数を使用したテーマ

CSS 変数を使用してより柔軟なテーマシステムを構築:

```jsx
function ThemedApp() {
  const [primaryColor, setPrimaryColor] = useState('#007bff');

  return (
    <>
      <style
        href="theme-variables"
        precedence="low"
      >{`
        :root {
          --primary-color: ${primaryColor};
          --secondary-color: #6c757d;
          --text-color: #212529;
          --background-color: #ffffff;
        }

        .btn-primary {
          background-color: var(--primary-color);
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
        }
      `}</style>

      <div>
        <button className="btn-primary">プライマリボタン</button>
        <input
          type="color"
          value={primaryColor}
          onChange={(e) => setPrimaryColor(e.target.value)}
        />
      </div>
    </>
  );
}
```

### アニメーションとトランジション

コンポーネント固有のアニメーションを定義:

```jsx
function AnimatedComponent() {
  return (
    <>
      <style
        href="animations"
        precedence="medium"
      >{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animated-box {
          animation: fadeIn 0.5s ease-out;
          padding: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 8px;
        }
      `}</style>

      <div className="animated-box">
        アニメーション付きコンテンツ
      </div>
    </>
  );
}
```

### スタイルの重複排除

同じ `href` を持つスタイルは自動的に重複排除されます:

```jsx
function ComponentA() {
  return (
    <>
      <style href="shared-styles" precedence="medium">{`
        .shared { color: blue; }
      `}</style>
      <div className="shared">コンポーネント A</div>
    </>
  );
}

function ComponentB() {
  return (
    <>
      <style href="shared-styles" precedence="medium">{`
        .shared { color: blue; }
      `}</style>
      <div className="shared">コンポーネント B</div>
    </>
  );
}

// 両方のコンポーネントがレンダーされても、スタイルは一度だけ適用されます
export default function App() {
  return (
    <>
      <ComponentA />
      <ComponentB />
    </>
  );
}
```

### プリントスタイル

印刷時に適用される特別なスタイル:

```jsx
function PrintableDocument() {
  return (
    <>
      <style
        href="print-styles"
        precedence="medium"
        media="print"
      >{`
        @page {
          margin: 2cm;
        }

        .no-print {
          display: none;
        }

        .content {
          font-size: 12pt;
          line-height: 1.5;
        }

        a::after {
          content: " (" attr(href) ")";
        }
      `}</style>

      <div className="content">
        <h1>印刷可能なドキュメント</h1>
        <p>このコンテンツは印刷に最適化されています。</p>
        <button className="no-print">印刷</button>
      </div>
    </>
  );
}
```

### Content Security Policy (CSP) 対応

nonce を使用してセキュアなインラインスタイルを実装:

```jsx
function SecureStyledComponent({ nonce }) {
  return (
    <>
      <style
        href="secure-styles"
        precedence="medium"
        nonce={nonce}
      >{`
        .secure-content {
          padding: 20px;
          background: #f8f9fa;
          border: 1px solid #dee2e6;
        }
      `}</style>

      <div className="secure-content">
        CSP 対応のスタイル付きコンテンツ
      </div>
    </>
  );
}
```

## 重要な注意事項

### パフォーマンスのベストプラクティス

- `href` prop を使用して重複を避ける
- 適切な `precedence` を設定してスタイルの順序を最適化
- 大きなスタイルシートは外部ファイルとして `<link>` を使用することを検討
- 頻繁に変更されるスタイルには動的生成を避ける

### スタイルの組織化

スタイルを整理するための推奨パターン:

```
precedence="reset"   - リセット/ノーマライズスタイル
precedence="low"     - 基本的なテーマとタイポグラフィ
precedence="medium"  - コンポーネントスタイル(デフォルト)
precedence="high"    - ユーティリティクラスと上書き
```

### デバッグのヒント

スタイルが適用されない場合:

1. ブラウザの開発者ツールで `<head>` 内のスタイルタグを確認
2. 同じ `href` を持つ重複したスタイルがないか確認
3. `precedence` の順序を確認
4. CSS セレクタの特異性を確認
5. ブラウザコンソールで構文エラーを確認

### 代替手段

インラインの `<style>` タグの代わりに検討すべき選択肢:

- **外部スタイルシート**: 再利用可能で大きなスタイルには `<link rel="stylesheet">` を使用
- **CSS-in-JS ライブラリ**: styled-components や emotion などのライブラリ
- **CSS モジュール**: コンポーネントスコープの CSS のためのビルドツール統合
- **Tailwind CSS**: ユーティリティファーストの CSS フレームワーク
