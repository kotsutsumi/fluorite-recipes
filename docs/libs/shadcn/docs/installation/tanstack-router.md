# TanStack Router

## プロジェクトの作成

TanStack Routerを使用して新しいプロジェクトを作成します：

pnpmnpmyarnbun

```bash
pnpm dlx create-tsrouter-app@latest my-app --template file-router --tailwind --add-ons shadcn
```

## コンポーネントの追加

プロジェクトにコンポーネントを追加できます。

pnpmnpmyarnbun

```bash
pnpm dlx shadcn@canary add button
```

上記のコマンドは、`Button`コンポーネントをプロジェクトに追加します。その後、以下のようにインポートできます：

src/routes/index.tsx

```typescript
import { createFileRoute } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"

export const Route = createFileRoute("/")({
  component: App,
})

function App() {
  return (
    <div>
      <Button>クリック</Button>
    </div>
  )
}
```

## このページについて

- [プロジェクトの作成](#プロジェクトの作成)
- [コンポーネントの追加](#コンポーネントの追加)

## Vercelで shadcn/ui アプリをデプロイ

OpenAI、Sonos、Adobeなどに信頼されています。

Vercelは、アプリと機能を大規模にデプロイするためのツールとインフラストラクチャを提供します。

[今すぐデプロイ](https://vercel.com/new?utm_source=shadcn_site&utm_medium=web&utm_campaign=docs_cta_deploy_now_callout)
