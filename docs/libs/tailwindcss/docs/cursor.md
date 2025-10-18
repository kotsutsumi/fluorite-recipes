# Cursor

要素にホバーしたときのカーソルスタイルを制御するためのユーティリティです。

## クイックリファレンス

| クラス | スタイル |
|-------|---------|
| `cursor-auto` | `cursor: auto;` |
| `cursor-default` | `cursor: default;` |
| `cursor-pointer` | `cursor: pointer;` |
| `cursor-wait` | `cursor: wait;` |
| `cursor-text` | `cursor: text;` |
| `cursor-move` | `cursor: move;` |
| `cursor-help` | `cursor: help;` |
| `cursor-not-allowed` | `cursor: not-allowed;` |
| `cursor-none` | `cursor: none;` |
| `cursor-context-menu` | `cursor: context-menu;` |
| `cursor-progress` | `cursor: progress;` |
| `cursor-cell` | `cursor: cell;` |
| `cursor-crosshair` | `cursor: crosshair;` |
| `cursor-vertical-text` | `cursor: vertical-text;` |
| `cursor-alias` | `cursor: alias;` |
| `cursor-copy` | `cursor: copy;` |
| `cursor-no-drop` | `cursor: no-drop;` |
| `cursor-grab` | `cursor: grab;` |
| `cursor-grabbing` | `cursor: grabbing;` |
| `cursor-all-scroll` | `cursor: all-scroll;` |
| `cursor-col-resize` | `cursor: col-resize;` |
| `cursor-row-resize` | `cursor: row-resize;` |
| `cursor-n-resize` | `cursor: n-resize;` |
| `cursor-e-resize` | `cursor: e-resize;` |
| `cursor-s-resize` | `cursor: s-resize;` |
| `cursor-w-resize` | `cursor: w-resize;` |
| `cursor-ne-resize` | `cursor: ne-resize;` |
| `cursor-nw-resize` | `cursor: nw-resize;` |
| `cursor-se-resize` | `cursor: se-resize;` |
| `cursor-sw-resize` | `cursor: sw-resize;` |
| `cursor-ew-resize` | `cursor: ew-resize;` |
| `cursor-ns-resize` | `cursor: ns-resize;` |
| `cursor-nesw-resize` | `cursor: nesw-resize;` |
| `cursor-nwse-resize` | `cursor: nwse-resize;` |
| `cursor-zoom-in` | `cursor: zoom-in;` |
| `cursor-zoom-out` | `cursor: zoom-out;` |

## 基本的な使い方

### 基本的な使用例

`cursor-*`ユーティリティを使用して、要素のカーソルスタイルを制御します。

```html
<button class="cursor-pointer">送信</button>
<button class="cursor-progress">保存中...</button>
<button class="cursor-not-allowed" disabled>確認</button>
```

### インタラクティブ要素

クリック可能な要素にポインターカーソルを使用します。

```html
<div class="cursor-pointer" onclick="handleClick()">
  クリックしてください
</div>
```

### 待機状態

処理中にwaitカーソルを表示します。

```html
<div class="cursor-wait">
  読み込み中...
</div>
```

### ドラッグ可能な要素

ドラッグ可能な要素にgrabカーソルを使用します。

```html
<div class="cursor-grab active:cursor-grabbing">
  ドラッグしてください
</div>
```

## カスタム値の適用

任意の値を使用する必要がある場合は、角括弧を使用してその場でプロパティを生成します。

```html
<button class="cursor-[url(hand.cur),_pointer]">
  <!-- ... -->
</button>
```

CSS変数を使用することもできます。

```html
<button class="cursor-(--my-cursor)">
  <!-- ... -->
</button>
```

## レスポンシブデザイン

特定のブレークポイントでのみカーソルを適用するには、既存のユーティリティクラスの前に`md:`などのレスポンシブプレフィックスを追加します。

```html
<button class="cursor-not-allowed md:cursor-auto">
  <!-- ... -->
</button>
```

## ホバー、フォーカス、その他の状態

`hover:`などの状態バリアントを使用して、異なる状態でカーソルを条件付きで適用します。

```html
<button class="cursor-default hover:cursor-pointer">
  ホバーしてください
</button>
```
