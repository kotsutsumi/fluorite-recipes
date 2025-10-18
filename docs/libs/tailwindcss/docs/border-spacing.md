# Border Spacing

テーブルの境界線間の間隔を制御するためのユーティリティです。

## クイックリファレンス

| クラス | スタイル |
|-------|---------|
| `border-spacing-<number>` | `border-spacing: <spacing-value>;` |
| `border-spacing-x-<number>` | `border-spacing: <spacing-value> var(--tw-border-spacing-y);` |
| `border-spacing-y-<number>` | `border-spacing: var(--tw-border-spacing-x) <spacing-value>;` |
| `border-spacing-(<custom-property>)` | `border-spacing: var(<custom-property>);` |
| `border-spacing-[<value>]` | `border-spacing: <value>;` |

## 基本的な使い方

### 境界線の間隔を設定する

`border-spacing-*`ユーティリティを使用して、テーブルセル間の間隔を制御します。

```html
<table class="border-separate border-spacing-2 border border-gray-400">
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

### 水平方向の間隔を設定する

`border-spacing-x-*`ユーティリティを使用して、テーブルセル間の水平方向の間隔を制御します。

```html
<table class="border-separate border-spacing-x-4 border border-gray-400">
  <!-- ... -->
</table>
```

### 垂直方向の間隔を設定する

`border-spacing-y-*`ユーティリティを使用して、テーブルセル間の垂直方向の間隔を制御します。

```html
<table class="border-separate border-spacing-y-2 border border-gray-400">
  <!-- ... -->
</table>
```

## カスタム値の適用

任意の値を使用する必要がある場合は、角括弧を使用してその場でプロパティを生成します。

```html
<table class="border-spacing-[0.5rem]">
  <!-- ... -->
</table>
```

CSS変数を使用することもできます。

```html
<table class="border-spacing-(--my-spacing)">
  <!-- ... -->
</table>
```

## レスポンシブデザイン

特定のブレークポイントでのみ境界線の間隔を適用するには、既存のユーティリティクラスの前に`md:`などのレスポンシブプレフィックスを追加します。

```html
<table class="border-spacing-2 md:border-spacing-4">
  <!-- ... -->
</table>
```

## テーマのカスタマイズ

テーマの`--spacing`変数を使用して、境界線の間隔スケールをカスタマイズできます。

```css
@theme {
  --spacing-custom: 1.75rem;
}
```
