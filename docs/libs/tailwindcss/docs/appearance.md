# Appearance

ネイティブのフォームコントロールのスタイリングを抑制または復元するためのユーティリティです。

## クイックリファレンス

| クラス | スタイル |
|-------|---------|
| `appearance-none` | `appearance: none;` |
| `appearance-auto` | `appearance: auto;` |

## 基本的な使い方

### デフォルトの外観を削除する

`appearance-none`を使用して、デフォルトのブラウザスタイリングを削除します。これは通常、カスタムフォームコンポーネントを作成する際に使用されます。

```html
<select class="appearance-none bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 dark:bg-gray-800">
  <option>Yes</option>
  <option>No</option>
  <option>Maybe</option>
</select>
```

### デフォルトの外観を復元する

`appearance-auto`を使用して、標準的なブラウザコントロールに戻します。特定のアクセシビリティモードで役立ちます。

```html
<input type="checkbox" class="appearance-none forced-colors:appearance-auto" />
```

## レスポンシブデザイン

特定のブレークポイントでのみ外観を適用するには、既存のユーティリティクラスの前に`md:`などのレスポンシブプレフィックスを追加します。

```html
<select class="appearance-none md:appearance-auto">
  <!-- ... -->
</select>
```

## 使用例

カスタムセレクトボックスを作成する際によく使用されます。

```html
<div class="relative">
  <select class="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 w-full">
    <option>オプション 1</option>
    <option>オプション 2</option>
    <option>オプション 3</option>
  </select>
  <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
    <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
    </svg>
  </div>
</div>
```

## 関連ユーティリティ

- [Accent Color](/docs/accent-color)
- [Caret Color](/docs/caret-color)
