# Box Sizing

ブラウザが要素の合計サイズをどのように計算するかを制御するユーティリティです。

## クイックリファレンス

| クラス | スタイル |
|-------|--------|
| `box-border` | `box-sizing: border-box;` |
| `box-content` | `box-sizing: content-box;` |

## 主要概念

### ボーダーとパディングを含める

`box-border`ユーティリティは`box-sizing`を`border-box`に設定し、要素の幅または高さを指定する際にボーダーとパディングを含めるようブラウザに指示します。

例：

```html
<div class="box-border size-32 border-4 p-4 ...">  <!-- ... --></div>
```

2pxのボーダーと4pxのパディングを持つ100px × 100pxの要素は、100px × 100pxとしてレンダリングされ、内部コンテンツ領域は88px × 88pxになります。

### ボーダーとパディングを除外する

`box-content`ユーティリティは`box-sizing`を`content-box`に設定し、指定された幅または高さの上にボーダーとパディングを追加します。

例：

```html
<div class="box-content size-32 border-4 p-4 ...">  <!-- ... --></div>
```

2pxのボーダーと4pxのパディングを持つ100px × 100pxの要素は、112px × 112pxとしてレンダリングされ、内部コンテンツ領域は100px × 100pxになります。

## レスポンシブデザイン

ブレークポイントバリアントを使用して、特定の画面サイズで`box-sizing`ユーティリティを適用できます：

```html
<div class="box-content md:box-border ...">  <!-- ... --></div>
```

注意：Tailwindは、preflightベーススタイルで`box-border`をデフォルトにしています。
