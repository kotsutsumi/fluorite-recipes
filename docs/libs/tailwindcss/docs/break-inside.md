# Break Inside

要素内でカラムまたはページがどのように改行されるべきかを制御するユーティリティです。

## クラスリファレンス

- `break-inside-auto`：`break-inside: auto;`
- `break-inside-avoid`：`break-inside: avoid;`
- `break-inside-avoid-page`：`break-inside: avoid-page;`
- `break-inside-avoid-column`：`break-inside: avoid-column;`

## 使用例

### 基本的な例

`break-inside-column`や`break-inside-avoid-page`などのユーティリティを使用して、カラムまたはページの改行動作を制御します：

```html
<div class="columns-2">
  <p>Well, let me tell you something, ...</p>
  <p class="break-inside-avoid-column">Sure, go ahead, laugh...</p>
  <p>Maybe we can live without...</p>
  <p>Look. If you think this is...</p>
</div>
```

### レスポンシブデザイン

`md:`のようなブレークポイントバリアントを`break-inside`ユーティリティにプレフィックスとして追加して、特定の画面サイズでのみ適用できます：

```html
<div class="break-inside-avoid-column md:break-inside-auto ...">
  <!-- ... -->
</div>
```

関連ユーティリティ：break-before、box-decoration-break
