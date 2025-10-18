# Resize

要素のサイズ変更方法を制御するためのユーティリティです。

## クイックリファレンス

| クラス | スタイル |
|-------|---------|
| `resize-none` | `resize: none;` |
| `resize` | `resize: both;` |
| `resize-y` | `resize: vertical;` |
| `resize-x` | `resize: horizontal;` |

## 基本的な使い方

### すべての方向にサイズ変更

`resize`を使用して、要素を垂直方向と水平方向の両方にサイズ変更できるようにします。

```html
<textarea class="resize rounded-md border border-gray-300 px-4 py-2"></textarea>
```

### 垂直方向にサイズ変更

`resize-y`を使用して、要素を垂直方向にのみサイズ変更できるようにします。

```html
<textarea class="resize-y rounded-md border border-gray-300 px-4 py-2"></textarea>
```

### 水平方向にサイズ変更

`resize-x`を使用して、要素を水平方向にのみサイズ変更できるようにします。

```html
<textarea class="resize-x rounded-md border border-gray-300 px-4 py-2"></textarea>
```

### サイズ変更を防ぐ

`resize-none`を使用して、要素のサイズ変更を防ぎます。

```html
<textarea class="resize-none rounded-md border border-gray-300 px-4 py-2"></textarea>
```

## レスポンシブデザイン

特定のブレークポイントでのみサイズ変更を適用するには、既存のユーティリティクラスの前に`md:`などのレスポンシブプレフィックスを追加します。

```html
<div class="resize-none md:resize">
  <!-- ... -->
</div>
```

## 使用例

### カスタムテキストエリア

サイズ変更可能なテキストエリアを作成します。

```html
<textarea
  class="resize-y w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
  rows="5"
  placeholder="コメントを入力してください...">
</textarea>
```

### 固定サイズのテキストエリア

サイズ変更できないテキストエリアを作成します。

```html
<textarea
  class="resize-none w-full h-32 rounded-md border border-gray-300 px-4 py-2"
  placeholder="固定サイズのテキストエリア">
</textarea>
```

## 注意事項

`resize`プロパティは、`overflow`が`visible`以外の要素にのみ適用されます。通常、テキストエリアやその他のフォーム要素に使用されます。
