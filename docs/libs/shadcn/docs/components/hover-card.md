# ホバーカード

## 概要

ホバーカードは、サイトのリンクやコンテンツの上にマウスをホバーすると、追加情報をプレビューできるコンポーネントです。視覚的なユーザーに対して、リンクの背後にあるコンテンツをプレビューする機能を提供します。

## インストール

CLIを使用してホバーカードコンポーネントをインストールします：

```
pnpm dlx shadcn@latest add hover-card
```

## 使用方法

```jsx
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

<HoverCard>
  <HoverCardTrigger>Hover</HoverCardTrigger>
  <HoverCardContent>
    The React Framework – created and maintained by @vercel.
  </HoverCardContent>
</HoverCard>
```

## 説明

このコンポーネントは、ユーザーエクスペリエンスを向上させ、コンテキストをすばやく提供するのに役立ちます。マウスをホバーするだけで、追加の詳細情報やコンテキストを表示できます。

## 特徴

- マウスホバーでコンテンツを表示
- カスタマイズ可能なトリガーとコンテンツ
- アクセシビリティに対応
- スムーズなアニメーション
