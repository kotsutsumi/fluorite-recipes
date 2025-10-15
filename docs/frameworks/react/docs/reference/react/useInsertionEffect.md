# useInsertionEffect

`useInsertionEffect` は、レイアウト Effect が発火する前にスタイルを DOM に挿入できるようにする React フックです。

## リファレンス

```javascript
useInsertionEffect(setup, dependencies?)
```

### パラメータ

- **`setup`**: Effect のロジックを含む関数。オプションでクリーンアップ関数を返すことができる
- **`dependencies`** (オプション): `setup` 内で参照されるすべてのリアクティブな値のリスト

### 返り値

`useInsertionEffect` は `undefined` を返します。

## 使用法

### CSS-in-JS ライブラリから動的スタイルを注入

従来、React コンポーネントをスタイリングする方法は3つあります:

1. コンパイラによる静的な CSS ファイルへの抽出
2. インラインスタイル(例: `<div style={{ opacity: 1 }}>`)
3. ランタイムでの `<style>` タグの注入

CSS-in-JS を使用する場合、上記の最初の2つのアプローチの組み合わせを推奨します。**ランタイムでの `<style>` タグ注入は推奨しません**が、時に必要な場合があります。

```javascript
function useCSS(rule) {
  useInsertionEffect(() => {
    // レイアウト Effect の前に <style> タグを注入
    if (!isInserted.has(rule)) {
      isInserted.add(rule);
      document.head.appendChild(getStyleForRule(rule));
    }
  });
  return rule;
}

function Button() {
  const className = useCSS('...');
  return <div className={className} />;
}
```

## 主な特性

### クライアントサイドのみ

- サーバレンダリング中は実行されない
- サーバから必要なスタイルを検出する必要がある場合は、レンダリング中に行う必要がある

### Effect 内で state を更新できない

- `useInsertionEffect` が実行される時点では、ref はまだアタッチされておらず、state を更新できない

### DOM の更新タイミングは不定

- `useInsertionEffect` が実行される時点で、React はまだ DOM を更新していない可能性がある

## 利点

- 他の Effect が実行される前に `<style>` タグが確実に挿入される
- レンダリング中の不要なスタイル再計算を防ぐ

## 重要な注意事項

### 対象ユーザ

このフックは **CSS-in-JS ライブラリの作成者向け** です。通常のアプリケーション開発では、`useEffect` または `useLayoutEffect` を使用すべきです。

### いつ使うべきか

スタイルを注入する必要があり、かつスタイルがどこで注入されているか重要な場合のみ使用してください。

## ベストプラクティス

- CSS-in-JS ライブラリの開発に限定して使用
- 通常は `useEffect` または `useLayoutEffect` を使用
- スタイル注入の高度なユースケースに推奨
