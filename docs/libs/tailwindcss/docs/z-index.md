# Z-Index

要素のスタック順序を制御するユーティリティです。

## クイックリファレンス

| クラス | スタイル |
|-------|--------|
| `z-<number>` | `z-index: <number>;` |
| `z-auto` | `z-index: auto;` |
| `z-[<value>]` | `z-index: <value>;` |
| `z-(<custom-property>)` | `z-index: var(<custom-property>);` |

## 使用例

### 基本的な例

`z-10`や`z-50`のような`z-<number>`ユーティリティを使用して、要素のスタック順序を制御します：

```html
<div class="z-40 ...">05</div>
<div class="z-30 ...">04</div>
<div class="z-20 ...">03</div>
<div class="z-10 ...">02</div>
<div class="z-0 ...">01</div>
```

### 負の値の使用

負のz-indexを使用するには、クラスの前にダッシュを付けます：

```html
<div class="-z-10 ...">03</div>
```

### カスタム値の使用

カスタムスタック順序には`z-[<value>]`を使用します：

```html
<div class="z-[calc(var(--index)+1)] ...">  <!-- ... --></div>
```

CSS変数の場合、`z-(<custom-property>)`構文を使用できます：

```html
<div class="z-(--my-z) ...">  <!-- ... --></div>
```

## レスポンシブデザイン

特定のブレークポイントでz-indexユーティリティを適用します：

```html
<div class="z-0 md:z-50 ...">  <!-- ... --></div>
```
