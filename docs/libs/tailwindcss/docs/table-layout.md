# Table Layout

テーブルのレイアウトアルゴリズムを制御するためのユーティリティです。

## クイックリファレンス

| クラス | スタイル |
|-------|---------|
| `table-auto` | `table-layout: auto;` |
| `table-fixed` | `table-layout: fixed;` |

## 基本的な使い方

### 列を自動的にサイズ調整する

`table-auto`を使用すると、テーブルがセルの内容に基づいて列の幅を自動的に調整します。

```html
<table class="table-auto border-collapse border border-gray-400">
  <thead>
    <tr>
      <th class="border border-gray-300 px-4 py-2">Title</th>
      <th class="border border-gray-300 px-4 py-2">Author</th>
      <th class="border border-gray-300 px-4 py-2">Views</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="border border-gray-300 px-4 py-2">Intro to CSS</td>
      <td class="border border-gray-300 px-4 py-2">Adam</td>
      <td class="border border-gray-300 px-4 py-2">858</td>
    </tr>
    <tr>
      <td class="border border-gray-300 px-4 py-2">A Long and Winding Tour of the History of UI Frameworks and Tools and the Impact on Design</td>
      <td class="border border-gray-300 px-4 py-2">Adam</td>
      <td class="border border-gray-300 px-4 py-2">112</td>
    </tr>
  </tbody>
</table>
```

### 固定幅の列を使用する

`table-fixed`を使用すると、テーブルが最初の行の列幅に基づいて一定の列幅を設定します。セルの内容は無視されます。

```html
<table class="table-fixed border-collapse border border-gray-400">
  <thead>
    <tr>
      <th class="w-1/2 border border-gray-300 px-4 py-2">Title</th>
      <th class="w-1/4 border border-gray-300 px-4 py-2">Author</th>
      <th class="w-1/4 border border-gray-300 px-4 py-2">Views</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="border border-gray-300 px-4 py-2">Intro to CSS</td>
      <td class="border border-gray-300 px-4 py-2">Adam</td>
      <td class="border border-gray-300 px-4 py-2">858</td>
    </tr>
    <tr>
      <td class="border border-gray-300 px-4 py-2">A Long and Winding Tour of the History of UI Frameworks and Tools and the Impact on Design</td>
      <td class="border border-gray-300 px-4 py-2">Adam</td>
      <td class="border border-gray-300 px-4 py-2">112</td>
    </tr>
  </tbody>
</table>
```

## レスポンシブデザイン

特定のブレークポイントでのみテーブルレイアウトを適用するには、既存のユーティリティクラスの前に`md:`などのレスポンシブプレフィックスを追加します。

```html
<table class="table-auto md:table-fixed">
  <!-- ... -->
</table>
```
