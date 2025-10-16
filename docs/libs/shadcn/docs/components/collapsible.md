# コラプシブル (Collapsible)

## 概要

コラプシブルは、パネルを展開/折りたたむことができるインタラクティブなコンポーネントです。

## インストール

CLIを使用してコラプシブルをインストールします：

```
pnpm dlx shadcn@latest add collapsible
```

## 使用方法

コンポーネントをインポートし、以下のように使用します：

```jsx
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

<Collapsible>
  <CollapsibleTrigger>Can I use this in my project?</CollapsibleTrigger>
  <CollapsibleContent>
    はい。個人および商用プロジェクトで自由に使用できます。帰属表示は不要です。
  </CollapsibleContent>
</Collapsible>
```

## デモ例

デモでは、@peduarteが3つのリポジトリを星付けした状況を示しています。トリガーボタンをクリックすることで、追加のリポジトリ情報を表示/非表示にできます。

## 注意点

- クライアントサイドコンポーネントです
- Radix UIのプリミティブを使用しています
- 柔軟なカスタマイズが可能
