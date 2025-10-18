# Aspect Ratio（アスペクト比）

## 概要

Tailwind CSSのアスペクト比ユーティリティは、要素のアスペクト比を制御し、さまざまな画面サイズで一貫した比率を維持できるようにします。

## 主要なクラス

- `aspect-<ratio>`：特定のアスペクト比を設定（例：`aspect-3/2`）
- `aspect-square`：1:1のアスペクト比を作成
- `aspect-video`：16:9のアスペクト比を作成
- `aspect-auto`：デフォルトのアスペクト比に戻す
- `aspect-[<custom-value>]`：カスタムアスペクト比の定義を可能にする

## 使用例

### 1. 基本的なアスペクト比

```html
<img class="aspect-3/2 object-cover ..." src="/img/villas.jpg" />
```

### 2. ビデオのアスペクト比

```html
<iframe class="aspect-video ..." src="https://www.youtube.com/embed/dQw4w9WgXcQ"></iframe>
```

### 3. カスタムアスペクト比

```html
<img class="aspect-[calc(4*3+1)/3] ..." src="/img/villas.jpg" />
```

## レスポンシブデザイン

ブレークポイントバリアントを使用して、さまざまな画面サイズでアスペクト比を変更できます：

```html
<iframe class="aspect-video md:aspect-square ..." src="..."></iframe>
```

## カスタマイズ

テーマ変数を使用してアスペクト比ユーティリティをカスタマイズできます：

```css
@theme {
  --aspect-retro: 4 / 3;
}
```

これにより、`aspect-retro`のようなカスタムアスペクト比クラスを作成できます。
