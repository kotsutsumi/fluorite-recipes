# Field Sizing

フォームコントロールのサイズ調整を制御するためのユーティリティです。

## クイックリファレンス

| クラス | スタイル |
|-------|---------|
| `field-sizing-fixed` | `field-sizing: fixed;` |
| `field-sizing-content` | `field-sizing: content;` |

## 基本的な使い方

### コンテンツに基づくサイズ調整

`field-sizing-content`を使用して、フォームコントロールがコンテンツに基づいてサイズを調整できるようにします。

```html
<textarea class="field-sizing-content" rows="2">
  Latex Salesman, Vanderlay Industries
</textarea>
```

これにより、テキストエリアはコンテンツに応じて自動的にサイズを調整します。

### 固定サイズを使用

`field-sizing-fixed`を使用して、フォームコントロールを固定サイズに保ちます（デフォルトの動作）。

```html
<textarea class="field-sizing-fixed w-80" rows="2">
  Latex Salesman, Vanderlay Industries
</textarea>
```

これにより、テキストエリアはコンテンツに関係なく固定サイズを維持します。

## レスポンシブデザイン

特定のブレークポイントでのみフィールドサイジングを適用するには、既存のユーティリティクラスの前に`md:`などのレスポンシブプレフィックスを追加します。

```html
<input class="field-sizing-content md:field-sizing-fixed" />
```

## 使用例

### 自動拡張テキストエリア

ユーザーが入力するにつれて拡張するテキストエリアを作成します。

```html
<textarea
  class="field-sizing-content w-full rounded-md border border-gray-300 px-4 py-2"
  rows="2"
  placeholder="メッセージを入力してください...">
</textarea>
```

### 固定幅の入力フィールド

特定の幅を維持する入力フィールド。

```html
<input
  type="text"
  class="field-sizing-fixed w-64 rounded-md border border-gray-300 px-4 py-2"
  placeholder="名前"
/>
```

## ブラウザサポート

`field-sizing`プロパティは比較的新しいCSS機能であり、すべてのブラウザでサポートされているわけではありません。使用前にブラウザの互換性を確認してください。
