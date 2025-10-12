# Styled JSXでNext.jsをスタイリング

**投稿日**: 2019年3月28日（木曜日）

[Styled JSX](https://github.com/vercel/styled-jsx)は、カプセル化されスコープ化されたCSSを記述してコンポーネントをスタイリングできるCSS-in-JSライブラリです。1つのコンポーネントに導入したスタイルは他のコンポーネントに影響を与えないため、意図しない副作用を心配することなく、スタイルを追加、変更、削除できます。

## はじめに

Next.jsにはデフォルトでStyled JSXが含まれています。Reactコンポーネントで`<style jsx>`タグを使用してスタイルを追加できます：

```javascript
function Home() {
  return (
    <div className="container">
      <h1>Hello Next.js</h1>
      <p>Let's explore different ways to style Next.js apps</p>
      <style jsx>{`
        .container {
          margin: 50px;
        }
        p {
          color: blue;
        }
      `}</style>
    </div>
  );
}
```

スタイルは自動的にコンポーネントにスコープされ、他のコンポーネントには影響しません。

## グローバルスタイルの追加

グローバルスタイルを追加するには、`<style jsx global>`を使用します：

```javascript
function Home() {
  return (
    <div className="container">
      <h1>Hello Next.js</h1>
      <p>Let's explore different ways to style Next.js apps</p>
      <style jsx global>{`
        p {
          font-size: 20px;
        }
      `}</style>
    </div>
  );
}
```

## グローバルスタイルのためのレイアウトコンポーネント

ページ全体にグローバルスタイルを適用するためのレイアウトコンポーネントを作成：

```javascript
function Layout(props) {
  return (
    <div className="page-layout">
      {props.children}
      <style jsx global>{`
        body {
          margin: 0;
          padding: 0;
          font-size: 18px;
          font-weight: 400;
          line-height: 1.8;
          color: #333;
          font-family: sans-serif;
        }
      `}</style>
    </div>
  );
}
```

## まとめ

Styled JSXは、Next.jsアプリケーションでスコープ化されたスタイルを簡単に作成できる強力なツールです。コンポーネントごとのスタイリングとグローバルスタイリングの両方をサポートし、スタイルの衝突を心配することなく、保守性の高いCSSを書くことができます。
