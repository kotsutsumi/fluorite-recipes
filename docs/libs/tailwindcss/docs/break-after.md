# Break After

要素の後にカラムまたはページがどのように改行されるべきかを制御するユーティリティです。

## クイックリファレンスクラス

- `break-after-auto`：`break-after: auto;`
- `break-after-avoid`：`break-after: avoid;`
- `break-after-all`：`break-after: all;`
- `break-after-avoid-page`：`break-after: avoid-page;`
- `break-after-page`：`break-after: page;`
- `break-after-left`：`break-after: left;`
- `break-after-right`：`break-after: right;`
- `break-after-column`：`break-after: column;`

## 使用例

### 基本的な例

`break-after-column`や`break-after-page`などのユーティリティを使用して、カラムまたはページの改行動作を制御します：

```html
<div class="columns-2">
  <p>Well, let me tell you something, ...</p>
  <p class="break-after-column">Sure, go ahead, laugh...</p>
  <p>Maybe we can live without...</p>
  <p>Look. If you think this is...</p>
</div>
```

### レスポンシブデザイン

`md:`のようなブレークポイントバリアントを`break-after`ユーティリティにプレフィックスとして追加して、特定の画面サイズでのみ適用できます：

```html
<div class="break-after-column md:break-after-auto ...">
  <!-- ... -->
</div>
```

関連ドキュメント：columns、break-before
