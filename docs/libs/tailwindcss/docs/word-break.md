# Word Break

要素内で単語がどのように分割されるかを制御するためのユーティリティ。

## クイックリファレンス

| クラス | スタイル |
|-------|--------|
| `break-normal` | `word-break: normal;` |
| `break-all` | `word-break: break-all;` |
| `break-keep` | `word-break: keep-all;` |

## 基本的な使い方

### 通常の分割

`break-normal` を使用して、標準的な単語分割ポイントを使用します。

```html
<p class="break-normal">
  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Blanditiisitaquequodpraesentiumexplicaboincidunt?
  Dolores beatae nam at sed dolorum ratione dolorem nisi velit cum.
</p>
```

### すべて分割

`break-all` を使用して、必要に応じて単語の途中でも分割します。

```html
<p class="break-all">
  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Blanditiisitaquequodpraesentiumexplicaboincidunt?
  Dolores beatae nam at sed dolorum ratione dolorem nisi velit cum.
</p>
```

### 分割を保持

`break-keep` を使用して、中国語/日本語/韓国語のテキストでの改行を防ぎます。

```html
<p class="break-keep">
  抗衡不屈不挠坚毅刚强百折不挠奋勇向前勇往直前
</p>
```

## レスポンシブデザイン

`md:` のようなブレークポイントバリアントをプレフィックスとして付けることで、特定の画面サイズで適用できます。

```html
<p class="break-normal md:break-all">Lorem ipsum dolor sit amet...</p>
```

利用可能なすべてのブレークポイントオプションについては、[レスポンシブデザイン](/docs/responsive-design)のドキュメントを参照してください。
