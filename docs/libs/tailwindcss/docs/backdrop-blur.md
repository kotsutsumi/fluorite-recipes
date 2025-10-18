# Backdrop Filter: Blur

要素に背景ぼかしフィルタを適用するためのユーティリティ。

## クイックリファレンス

| クラス | スタイル |
|--------|---------|
| `backdrop-blur-xs` | `backdrop-filter: blur(var(--blur-xs)); /* 4px */` |
| `backdrop-blur-sm` | `backdrop-filter: blur(var(--blur-sm)); /* 8px */` |
| `backdrop-blur-md` | `backdrop-filter: blur(var(--blur-md)); /* 12px */` |
| `backdrop-blur-lg` | `backdrop-filter: blur(var(--blur-lg)); /* 16px */` |
| `backdrop-blur-xl` | `backdrop-filter: blur(var(--blur-xl)); /* 24px */` |
| `backdrop-blur-2xl` | `backdrop-filter: blur(var(--blur-2xl)); /* 40px */` |
| `backdrop-blur-3xl` | `backdrop-filter: blur(var(--blur-3xl)); /* 64px */` |
| `backdrop-blur-none` | `backdrop-filter: ;` |
| `backdrop-blur-(<custom-property>)` | `backdrop-filter: blur(var(<custom-property>));` |
| `backdrop-blur-[<value>]` | `backdrop-filter: blur(<value>);` |

## 基本的な使い方

### 背景ぼかしの適用

`backdrop-blur-{size}`ユーティリティを使用して、要素の背後にある背景にぼかし効果を適用します。

```html
<div class="bg-[url(/img/mountains.jpg)]">
  <div class="bg-white/30 backdrop-blur-sm ..."></div>
</div>
<div class="bg-[url(/img/mountains.jpg)]">
  <div class="bg-white/30 backdrop-blur-md ..."></div>
</div>
<div class="bg-[url(/img/mountains.jpg)]">
  <div class="bg-white/30 backdrop-blur-lg ..."></div>
</div>
```

ガラスモーフィズム効果を作成する場合に特に効果的です。

### 背景ぼかしの削除

`backdrop-blur-none`を使用して、背景ぼかしフィルタを削除します。

```html
<div class="backdrop-blur-md md:backdrop-blur-none ...">
  <!-- ... -->
</div>
```

## カスタム値の適用

### 任意の値

テーマに含まれていない背景ぼかし値を使用する必要がある場合は、角括弧を使用して任意の値でプロパティを生成します。

```html
<div class="backdrop-blur-[2px] ...">
  <!-- カスタムぼかし -->
</div>
```

### CSS変数の使用

CSS変数を使用して背景ぼかし値をカスタマイズできます。

```html
<div class="backdrop-blur-(--my-backdrop-blur) ...">
  <!-- ... -->
</div>
```

## レスポンシブデザイン

特定のブレークポイントでのみ背景ぼかしユーティリティを適用するには、`md:`のようなブレークポイント修飾子をプレフィックスとして追加します。

```html
<div class="backdrop-blur-none md:backdrop-blur-lg ...">
  <!-- ... -->
</div>
```

## テーマのカスタマイズ

`@theme`ディレクティブを使用して、ぼかしのスケールをカスタマイズできます。

```css
@theme {
  --blur-2xs: 2px;
}
```

## 実践例

### ガラスモーフィズムカード

```html
<div class="bg-white/20 backdrop-blur-lg rounded-lg p-6 border border-white/30">
  <!-- カードコンテンツ -->
</div>
```

### モーダルオーバーレイ

```html
<div class="fixed inset-0 bg-black/50 backdrop-blur-sm">
  <!-- モーダルコンテンツ -->
</div>
```

## 関連ユーティリティ

- [Blur](/docs/blur)
- [Backdrop Brightness](/docs/backdrop-brightness)
