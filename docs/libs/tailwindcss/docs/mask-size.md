# Mask Size

要素のマスク画像のサイズを制御するためのユーティリティ。

## クイックリファレンス

| クラス | スタイル |
|--------|---------|
| `mask-auto` | `mask-size: auto;` |
| `mask-cover` | `mask-size: cover;` |
| `mask-contain` | `mask-size: contain;` |
| `mask-size-(<custom-property>)` | `mask-size: var(<custom-property>);` |
| `mask-size-[<value>]` | `mask-size: <value>;` |

## 基本的な使い方

### コンテナの塗りつぶし

`mask-cover`を使用して、マスク画像をスケーリングしてマスクレイヤーを塗りつぶします。必要に応じて画像がトリミングされる可能性があります。

```html
<div class="mask-cover mask-[url(/img/scribble.png)] bg-[url(/img/mountains.jpg)] ..."></div>
```

マスク画像は、アスペクト比を維持しながら、コンテナ全体をカバーするようにスケーリングされます。画像がコンテナより大きい場合は、端が切り取られることがあります。

### トリミングなしの塗りつぶし

`mask-contain`を使用して、マスク画像をトリミングまたは引き伸ばさずに外側の端に収まるようにスケーリングします。

```html
<div class="mask-contain mask-[url(/img/scribble.png)] bg-[url(/img/mountains.jpg)] ..."></div>
```

マスク画像は、アスペクト比を維持しながら、コンテナ内に完全に収まるようにスケーリングされます。コンテナを完全に埋めない場合があります。

### デフォルトサイズ

`mask-auto`を使用して、マスク画像をデフォルトサイズで表示します。

```html
<div class="mask-auto mask-[url(/img/scribble.png)] bg-[url(/img/mountains.jpg)] ..."></div>
```

マスク画像は元のサイズで表示され、スケーリングされません。

## カスタム値の適用

### 任意の値

テーマに含まれていないマスクサイズ値を使用する必要がある場合は、角括弧を使用して任意の値でプロパティを生成します。

```html
<div class="mask-size-[auto_100px] ...">
  <!-- 幅は自動、高さは100px -->
</div>
```

### CSS変数の使用

CSS変数を使用してマスクサイズをカスタマイズできます。

```html
<div class="mask-size-(--my-mask-size) ...">
  <!-- ... -->
</div>
```

## レスポンシブデザイン

特定のブレークポイントでのみマスクサイズユーティリティを適用するには、`md:`のようなブレークポイント修飾子をプレフィックスとして追加します。

```html
<div class="mask-cover md:mask-contain ...">
  <!-- ... -->
</div>
```

## 関連ユーティリティ

- [Mask Repeat](/docs/mask-repeat)
- [Mask Position](/docs/mask-position)
