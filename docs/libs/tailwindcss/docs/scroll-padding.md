# Scroll Padding

スナップコンテナ内の要素のスクロールオフセットを制御するためのユーティリティです。

## クイックリファレンス

| クラス | スタイル |
|-------|---------|
| `scroll-p-<number>` | `scroll-padding: <spacing>;` |
| `scroll-px-<number>` | `scroll-padding-inline: <spacing>;` |
| `scroll-py-<number>` | `scroll-padding-block: <spacing>;` |
| `scroll-ps-<number>` | `scroll-padding-inline-start: <spacing>;` |
| `scroll-pe-<number>` | `scroll-padding-inline-end: <spacing>;` |
| `scroll-pt-<number>` | `scroll-padding-top: <spacing>;` |
| `scroll-pr-<number>` | `scroll-padding-right: <spacing>;` |
| `scroll-pb-<number>` | `scroll-padding-bottom: <spacing>;` |
| `scroll-pl-<number>` | `scroll-padding-left: <spacing>;` |

## 基本的な使い方

### スクロールパディングを設定する

`scroll-p*`ユーティリティを使用して、スナップコンテナのスクロールパディングを制御します。

```html
<div class="snap-x scroll-pl-6 overflow-x-auto">
  <div class="flex gap-4">
    <div class="snap-start shrink-0">
      <img src="/img/vacation-01.jpg" class="w-80 h-60 object-cover rounded-lg" />
    </div>
    <div class="snap-start shrink-0">
      <img src="/img/vacation-02.jpg" class="w-80 h-60 object-cover rounded-lg" />
    </div>
    <div class="snap-start shrink-0">
      <img src="/img/vacation-03.jpg" class="w-80 h-60 object-cover rounded-lg" />
    </div>
  </div>
</div>
```

### 水平方向のスクロールパディング

`scroll-px-*`を使用して、水平方向のスクロールパディングを設定します。

```html
<div class="snap-x scroll-px-8 overflow-x-auto">
  <!-- ... -->
</div>
```

### 垂直方向のスクロールパディング

`scroll-py-*`を使用して、垂直方向のスクロールパディングを設定します。

```html
<div class="snap-y scroll-py-8 overflow-y-auto h-64">
  <!-- ... -->
</div>
```

### 論理プロパティ

`scroll-ps-*`と`scroll-pe-*`を使用して、異なるテキスト方向をサポートします。

```html
<div class="snap-x scroll-ps-6 overflow-x-auto">
  <!-- LTRとRTLの両方のレイアウトで動作 -->
</div>
```

## カスタム値の適用

任意の値を使用する必要がある場合は、角括弧を使用してその場でプロパティを生成します。

```html
<div class="scroll-pl-[2.75rem]">
  <!-- ... -->
</div>
```

## レスポンシブデザイン

特定のブレークポイントでのみスクロールパディングを適用するには、既存のユーティリティクラスの前に`md:`などのレスポンシブプレフィックスを追加します。

```html
<div class="scroll-pl-4 md:scroll-pl-8">
  <!-- ... -->
</div>
```

## 使用例

### 画像カルーセル

左側にパディングを持つ画像カルーセルを作成します。

```html
<div class="snap-x snap-mandatory scroll-pl-6 overflow-x-auto flex gap-4">
  <div class="snap-start shrink-0">
    <img src="/img/1.jpg" class="w-80 h-60 object-cover rounded-lg" />
  </div>
  <div class="snap-start shrink-0">
    <img src="/img/2.jpg" class="w-80 h-60 object-cover rounded-lg" />
  </div>
  <div class="snap-start shrink-0">
    <img src="/img/3.jpg" class="w-80 h-60 object-cover rounded-lg" />
  </div>
</div>
```

## テーマのカスタマイズ

`--spacing`変数を使用してスクロールパディングスケールをカスタマイズできます。

```css
@theme {
  --spacing-custom: 3.5rem;
}
```
