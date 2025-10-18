# Object Fit

## 概要

`object-fit`ユーティリティは、置換された要素のコンテンツがそのコンテナ内でどのようにリサイズされるかを制御します。

## 利用可能なクラス

- `object-contain`：`object-fit: contain;`
- `object-cover`：`object-fit: cover;`
- `object-fill`：`object-fit: fill;`
- `object-none`：`object-fit: none;`
- `object-scale-down`：`object-fit: scale-down;`

## 使用例

### 1. カバーするようにリサイズ

`object-cover`を使用してコンテンツをコンテナを完全にカバーするようにリサイズ：

```html
<img class="h-48 w-96 object-cover ..." src="/img/mountains.jpg" />
```

### 2. 含めるようにリサイズ

`object-contain`を使用してコンテンツをコンテナ内に完全に収まるようにリサイズ：

```html
<img class="h-48 w-96 object-contain ..." src="/img/mountains.jpg" />
```

### 3. フィットするように引き伸ばす

`object-fill`を使用してコンテンツをコンテナに正確にフィットするように引き伸ばす：

```html
<img class="h-48 w-96 object-fill ..." src="/img/mountains.jpg" />
```

### 4. スケールダウン

`object-scale-down`を使用してコンテンツを元のサイズで表示し、必要に応じてスケールダウン：

```html
<img class="h-48 w-96 object-scale-down ..." src="/img/mountains.jpg" />
```

### 5. 元のサイズ

`object-none`を使用してコンテンツを元のサイズで表示し、コンテナの寸法を無視：

```html
<img class="h-48 w-96 object-none ..." src="/img/mountains.jpg" />
```

## レスポンシブデザイン

`md:`のようなブレークポイントバリアントを使用して、特定の画面サイズで異なる`object-fit`スタイルを適用できます：

```html
<img class="object-contain md:object-cover" src="/img/mountains.jpg" />
```
