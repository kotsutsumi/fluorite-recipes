# Hyphens

単語のハイフネーション（分綴）を制御するためのユーティリティ。

## クイックリファレンス

| クラス | スタイル |
|-------|--------|
| `hyphens-none` | `hyphens: none;` |
| `hyphens-manual` | `hyphens: manual;` |
| `hyphens-auto` | `hyphens: auto;` |

## 基本的な使い方

### ハイフネーションを防止

`hyphens-none` を使用して、単語のハイフネーションを防ぎます。

```html
<p class="hyphens-none" lang="de">
  Kraftfahrzeughaftpflichtversicherung is a 36 letter word for a type of
  automobile insurance in German.
</p>
```

### 手動のハイフネーション

`hyphens-manual` を使用して、特定のポイントでのみハイフネーションを行います。ソフトハイフン（`&shy;`）を使用して、分割ポイントを示します。

```html
<p class="hyphens-manual" lang="de">
  Kraftfahrzeug&shy;haftpflicht&shy;versicherung is a 36 letter word for a type of
  automobile insurance in German.
</p>
```

### 自動のハイフネーション

`hyphens-auto` を使用して、ブラウザベースのハイフネーションを許可します。ブラウザは適切な分割ポイントを自動的に決定します。

```html
<p class="hyphens-auto" lang="de">
  Kraftfahrzeughaftpflichtversicherung is a 36 letter word for a type of
  automobile insurance in German.
</p>
```

**注意:** 自動ハイフネーションを正しく機能させるには、`lang` 属性で言語を指定する必要があります。

## レスポンシブデザイン

`md:` のようなブレークポイントバリアントをプレフィックスとして付けることで、特定の画面サイズで適用できます。

```html
<p class="hyphens-none md:hyphens-auto" lang="de">
  Lorem ipsum dolor sit amet...
</p>
```

利用可能なすべてのブレークポイントオプションについては、[レスポンシブデザイン](/docs/responsive-design)のドキュメントを参照してください。
