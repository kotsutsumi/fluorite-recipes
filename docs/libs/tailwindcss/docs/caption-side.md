# Caption Side

テーブル内のキャプション要素の配置を制御するためのユーティリティです。

## クイックリファレンス

| クラス | スタイル |
|-------|---------|
| `caption-top` | `caption-side: top;` |
| `caption-bottom` | `caption-side: bottom;` |

## 基本的な使い方

### テーブルの上部に配置する

`caption-top`ユーティリティを使用して、キャプションをテーブルの上部に配置します。

```html
<table>
  <caption class="caption-top">
    表3.1: プロレスラーと彼らの必殺技
  </caption>
  <thead>
    <tr>
      <th>レスラー</th>
      <th>必殺技</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>"ストーンコールド" スティーブ・オースチン</td>
      <td>ストーンコールド・スタナー、ルー・テーズ・プレス</td>
    </tr>
    <tr>
      <td>ブレット・"ザ・ヒットマン"・ハート</td>
      <td>シャープシューター</td>
    </tr>
  </tbody>
</table>
```

### テーブルの下部に配置する

`caption-bottom`ユーティリティを使用して、キャプションをテーブルの下部に配置します。

```html
<table>
  <caption class="caption-bottom">
    表3.1: プロレスラーと彼らの必殺技
  </caption>
  <thead>
    <tr>
      <th>レスラー</th>
      <th>必殺技</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>"ストーンコールド" スティーブ・オースチン</td>
      <td>ストーンコールド・スタナー、ルー・テーズ・プレス</td>
    </tr>
    <tr>
      <td>ブレット・"ザ・ヒットマン"・ハート</td>
      <td>シャープシューター</td>
    </tr>
  </tbody>
</table>
```

## レスポンシブデザイン

特定のブレークポイントでのみキャプションの配置を適用するには、既存のユーティリティクラスの前に`md:`などのレスポンシブプレフィックスを追加します。

```html
<table>
  <caption class="caption-top md:caption-bottom">
    表3.1: プロレスラーと彼らの必殺技
  </caption>
  <!-- ... -->
</table>
```
