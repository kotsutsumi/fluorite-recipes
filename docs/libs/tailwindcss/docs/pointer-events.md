# Pointer Events

要素がポインターイベントに応答するかどうかを制御するためのユーティリティです。

## クイックリファレンス

| クラス | スタイル |
|-------|---------|
| `pointer-events-auto` | `pointer-events: auto;` |
| `pointer-events-none` | `pointer-events: none;` |

## 基本的な使い方

### ポインターイベントを無視する

`pointer-events-none`ユーティリティを使用して、要素がホバーやクリックイベントに応答しないようにします。

```html
<div class="relative">
  <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
    <svg class="absolute h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
      <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
    </svg>
  </div>
  <input type="text" placeholder="検索" class="pl-10 pr-4 py-2 border rounded-md w-full" />
</div>
```

### ポインターイベントを復元する

`pointer-events-auto`ユーティリティを使用して、デフォルトのブラウザ動作に戻します。

```html
<div class="pointer-events-none md:pointer-events-auto">
  <!-- ... -->
</div>
```

## レスポンシブデザイン

特定のブレークポイントでのみポインターイベントを適用するには、既存のユーティリティクラスの前に`md:`などのレスポンシブプレフィックスを追加します。

```html
<div class="pointer-events-none md:pointer-events-auto">
  <!-- ... -->
</div>
```

## 重要な動作

ポインターイベントは、子要素に対しては引き続きトリガーされます。イベントは、ターゲット要素の「下」にある要素に渡されます。

## 使用例

### オーバーレイアイコン

入力フィールド内にクリックできないアイコンを配置します。

```html
<div class="relative">
  <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
    <svg class="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
      <!-- アイコン -->
    </svg>
  </div>
  <input type="email" class="w-full pr-10 px-4 py-2 border rounded-md" />
</div>
```

### ローディングオーバーレイ

コンテンツ上にクリックできないローディングオーバーレイを表示します。

```html
<div class="relative">
  <div class="pointer-events-none absolute inset-0 bg-gray-100 bg-opacity-50 flex items-center justify-center">
    <div class="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
  </div>
  <div class="p-8">
    コンテンツ
  </div>
</div>
```
