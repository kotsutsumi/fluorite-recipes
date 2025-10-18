# Scroll Margin

スナップコンテナ内のアイテムの周りのスクロールオフセットを制御するためのユーティリティです。

## クイックリファレンス

| クラス | スタイル |
|-------|---------|
| `scroll-m-<number>` | `scroll-margin: <spacing>;` |
| `scroll-mx-<number>` | `scroll-margin-inline: <spacing>;` |
| `scroll-my-<number>` | `scroll-margin-block: <spacing>;` |
| `scroll-ms-<number>` | `scroll-margin-inline-start: <spacing>;` |
| `scroll-me-<number>` | `scroll-margin-inline-end: <spacing>;` |
| `scroll-mt-<number>` | `scroll-margin-top: <spacing>;` |
| `scroll-mr-<number>` | `scroll-margin-right: <spacing>;` |
| `scroll-mb-<number>` | `scroll-margin-bottom: <spacing>;` |
| `scroll-ml-<number>` | `scroll-margin-left: <spacing>;` |

## 基本的な使い方

### スクロールマージンを設定する

スナップコンテナ内のアイテムにスクロールマージンを適用します。

```html
<div class="snap-x overflow-x-auto">
  <div class="flex gap-4">
    <div class="snap-start scroll-ml-6 shrink-0">
      <img src="/img/vacation-01.jpg" class="w-80 h-60 object-cover rounded-lg" />
    </div>
    <div class="snap-start scroll-ml-6 shrink-0">
      <img src="/img/vacation-02.jpg" class="w-80 h-60 object-cover rounded-lg" />
    </div>
    <div class="snap-start scroll-ml-6 shrink-0">
      <img src="/img/vacation-03.jpg" class="w-80 h-60 object-cover rounded-lg" />
    </div>
  </div>
</div>
```

### 負の値

負のスクロールマージンには、`-scroll-ml-6`のように値の前にダッシュを付けます。

```html
<div class="snap-start -scroll-ml-6">
  <!-- ... -->
</div>
```

### 論理プロパティ

`scroll-ms-*`と`scroll-me-*`を使用して、レスポンシブなテキスト方向の処理を行います。

```html
<div class="snap-start scroll-ms-6">
  <!-- LTRとRTLの両方のレイアウトで動作 -->
</div>
```

## カスタム値の適用

任意の値を使用する必要がある場合は、角括弧を使用してその場でプロパティを生成します。

```html
<div class="scroll-ml-[3.23rem]">
  <!-- ... -->
</div>
```

## レスポンシブデザイン

特定のブレークポイントでのみスクロールマージンを適用するには、既存のユーティリティクラスの前に`md:`などのレスポンシブプレフィックスを追加します。

```html
<div class="scroll-ml-4 md:scroll-ml-8">
  <!-- ... -->
</div>
```

## テーマのカスタマイズ

`--spacing`テーマ変数を使用してスクロールマージンスケールをカスタマイズできます。

```css
@theme {
  --spacing-custom: 3.75rem;
}
```
