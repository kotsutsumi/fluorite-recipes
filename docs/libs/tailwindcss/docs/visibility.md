# Visibility

## 利用可能なクラス

1. `visible`：`visibility: visible;`を設定
2. `invisible`：`visibility: hidden;`を設定
3. `collapse`：`visibility: collapse;`を設定

## 主要概念

### 要素を非表示にする

- `invisible`ユーティリティは、ドキュメントレイアウト内での位置を維持しながら要素を非表示にします
- 例：

```html
<div class="grid grid-cols-3 gap-4">
  <div>01</div>
  <div class="invisible ...">02</div>
  <div>03</div>
</div>
```

### 要素を折りたたむ

- `collapse`ユーティリティは特にテーブルに役立ち、テーブルレイアウトに影響を与えずに行/列を非表示にします
- ドキュメントフローから完全に要素を削除する`hidden`とは異なります

### 要素を表示する

- `visible`ユーティリティは主に以前の非表示設定をオーバーライドするために使用されます
- レスポンシブデザインのシナリオで役立ちます

## レスポンシブデザイン

`md:invisible`のようなブレークポイントバリアントを使用して、特定の画面サイズで表示の変更を適用できます。

## 重要な注意事項

ドキュメントから要素を完全に削除するには、`invisible`の代わりに[display](/docs/display#hidden)プロパティを使用してください。
