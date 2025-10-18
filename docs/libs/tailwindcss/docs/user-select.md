# User Select

ユーザーが要素内のテキストを選択できるかどうかを制御するためのユーティリティです。

## クイックリファレンス

| クラス | スタイル |
|-------|---------|
| `select-none` | `user-select: none;` |
| `select-text` | `user-select: text;` |
| `select-all` | `user-select: all;` |
| `select-auto` | `user-select: auto;` |

## 基本的な使い方

### テキスト選択を無効にする

`select-none`を使用して、ユーザーがテキストを選択できないようにします。

```html
<div class="select-none">
  The quick brown fox jumps over the lazy dog.
</div>
```

### テキスト選択を許可する

`select-text`を使用して、ユーザーがテキストを選択できるようにします。

```html
<div class="select-text">
  The quick brown fox jumps over the lazy dog.
</div>
```

### 1クリックですべてのテキストを選択

`select-all`を使用して、1クリックですべてのテキストを選択します。

```html
<div class="select-all">
  The quick brown fox jumps over the lazy dog.
</div>
```

### デフォルトのブラウザ動作を使用

`select-auto`を使用して、デフォルトのブラウザ選択動作を使用します。

```html
<div class="select-auto">
  The quick brown fox jumps over the lazy dog.
</div>
```

## レスポンシブデザイン

特定のブレークポイントでのみユーザー選択を適用するには、既存のユーティリティクラスの前に`md:`などのレスポンシブプレフィックスを追加します。

```html
<div class="select-none md:select-all">
  <!-- ... -->
</div>
```

## 使用例

### コードスニペット

1クリックでコピーできるコードスニペット。

```html
<pre class="select-all bg-gray-100 rounded-lg p-4">
  <code>npm install tailwindcss</code>
</pre>
```

### UIコントロール

選択できないボタンやラベル。

```html
<button class="select-none bg-blue-500 text-white px-4 py-2 rounded">
  クリックしてください
</button>
```

### コピー可能なテキスト

簡単にコピーできるテキストブロック。

```html
<div class="select-all bg-gray-50 border border-gray-200 rounded p-4">
  api-key-1234-5678-9012-3456
</div>
```

### インタラクティブUI要素

ドラッグ可能な要素でテキスト選択を防ぐ。

```html
<div class="select-none cursor-move bg-white border rounded-lg p-4 shadow">
  <h3 class="font-semibold">ドラッグ可能なカード</h3>
  <p>このカードをドラッグできます</p>
</div>
```

## アクセシビリティ

テキスト選択を無効にすると、ユーザーエクスペリエンスに影響を与える可能性があります。重要なコンテンツには`select-none`を使用しないでください。主に、ボタン、ラベル、その他のUIコントロールに使用してください。
