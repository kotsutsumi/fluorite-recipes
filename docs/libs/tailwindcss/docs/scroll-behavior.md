# Scroll Behavior

要素のスクロール動作を制御するためのユーティリティです。

## クイックリファレンス

| クラス | スタイル |
|-------|---------|
| `scroll-auto` | `scroll-behavior: auto;` |
| `scroll-smooth` | `scroll-behavior: smooth;` |

## 基本的な使い方

### スムーズスクロールを使用

`scroll-smooth`を使用して、スムーズなスクロール動作を有効にします。

```html
<html class="scroll-smooth">
  <!-- ... -->
</html>
```

注意: これは、ブラウザによってトリガーされるスクロールイベントにのみ影響します。

### 通常のスクロールを使用

`scroll-auto`を使用して、デフォルトのブラウザスクロール動作を使用します。

```html
<html class="scroll-smooth md:scroll-auto">
  <!-- ... -->
</html>
```

## レスポンシブデザイン

特定のブレークポイントでのみスクロール動作を適用するには、既存のユーティリティクラスの前に`md:`などのレスポンシブプレフィックスを追加します。

```html
<html class="scroll-smooth md:scroll-auto">
  <!-- ... -->
</html>
```

## 使用例

### ページ内リンクでスムーズスクロール

ページ内リンクをクリックしたときにスムーズにスクロールします。

```html
<html class="scroll-smooth">
  <body>
    <nav>
      <a href="#section1">セクション 1</a>
      <a href="#section2">セクション 2</a>
      <a href="#section3">セクション 3</a>
    </nav>

    <section id="section1">
      <h2>セクション 1</h2>
      <p>コンテンツ...</p>
    </section>

    <section id="section2">
      <h2>セクション 2</h2>
      <p>コンテンツ...</p>
    </section>

    <section id="section3">
      <h2>セクション 3</h2>
      <p>コンテンツ...</p>
    </section>
  </body>
</html>
```

### スクロール可能なコンテナ

スクロール可能なコンテナにスムーズなスクロールを適用します。

```html
<div class="h-64 overflow-y-auto scroll-smooth">
  <div class="h-96">
    長いコンテンツ...
  </div>
</div>
```

## アクセシビリティ

一部のユーザーはモーション削減を好む場合があるため、`motion-reduce:`バリアントの使用を検討してください。

```html
<html class="scroll-smooth motion-reduce:scroll-auto">
  <!-- ... -->
</html>
```
