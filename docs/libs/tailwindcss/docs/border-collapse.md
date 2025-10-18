# Border Collapse

テーブルの境界線を結合するか分離するかを制御するためのユーティリティです。

## クイックリファレンス

| クラス | スタイル |
|-------|---------|
| `border-collapse` | `border-collapse: collapse;` |
| `border-separate` | `border-collapse: separate;` |

## 基本的な使い方

### テーブルの境界線を結合する

隣接するセルの境界線を1つに結合するには、`border-collapse`ユーティリティを使用します。

```html
<table class="border-collapse border border-gray-400">
  <thead>
    <tr>
      <th class="border border-gray-300 px-4 py-2">State</th>
      <th class="border border-gray-300 px-4 py-2">City</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="border border-gray-300 px-4 py-2">Indiana</td>
      <td class="border border-gray-300 px-4 py-2">Indianapolis</td>
    </tr>
    <tr>
      <td class="border border-gray-300 px-4 py-2">Ohio</td>
      <td class="border border-gray-300 px-4 py-2">Columbus</td>
    </tr>
  </tbody>
</table>
```

### テーブルの境界線を分離する

各セルに個別の境界線を持たせるには、`border-separate`ユーティリティを使用します。

```html
<table class="border-separate border border-gray-400">
  <thead>
    <tr>
      <th class="border border-gray-300 px-4 py-2">State</th>
      <th class="border border-gray-300 px-4 py-2">City</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="border border-gray-300 px-4 py-2">Indiana</td>
      <td class="border border-gray-300 px-4 py-2">Indianapolis</td>
    </tr>
    <tr>
      <td class="border border-gray-300 px-4 py-2">Ohio</td>
      <td class="border border-gray-300 px-4 py-2">Columbus</td>
    </tr>
  </tbody>
</table>
```

## レスポンシブデザイン

特定のブレークポイントでのみ境界線の結合を適用するには、既存のユーティリティクラスの前に`md:`などのレスポンシブプレフィックスを追加します。

```html
<table class="border-separate md:border-collapse">
  <!-- ... -->
</table>
```
