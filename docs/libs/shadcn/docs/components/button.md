# ボタン

ボタンは、ボタンまたはボタンのように見えるコンポーネントを表示します。

**更新:** 新しいサイズ `icon-sm` と `icon-lg` をボタンコンポーネントに追加しました。詳細は[変更履歴](/docs/components/button#changelog)を参照してください。プロジェクトを更新するには、指示に従ってください。

## インストール

CLIを使用してボタンコンポーネントをインストールできます：

```
pnpm dlx shadcn@latest add button
```

## 使用方法

```jsx
import { Button } from "@/components/ui/button"

<Button variant="outline">Button</Button>
```

## カーソル

Tailwind v4では、ボタンコンポーネントのカーソルが `cursor: pointer` から `cursor: default` に変更されました。

以前の `cursor: pointer` の動作を維持したい場合は、CSSファイルに以下のコードを追加してください：

```css
@layer base {
  button:not(:disabled),
  [role="button"]:not(:disabled) {
    cursor: pointer;
  }
}
```

## 例

### サイズ

小、デフォルト、大のボタンサイズの例が提供されています。

### バリアント

- デフォルト
- アウトライン
- セカンダリ
- ゴースト
- デストラクティブ
- リンク

### アイコン付きボタン

アイコンとテキストを組み合わせたボタンの例が示されています。

### その他の機能

- 丸いボタン
- スピナー付きボタン
- ボタングループ

## APIリファレンス

`Button`コンポーネントは、さまざまなプロパティをサポートしています。
