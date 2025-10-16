# React Router

## プロジェクトの作成

pnpmnpmyarnbun

```bash
pnpm dlx create-react-router@latest my-app
```

## CLIの実行

プロジェクトをセットアップするために、`shadcn` の初期化コマンドを実行します：

pnpmnpmyarnbun

```bash
pnpm dlx shadcn@latest init
```

## コンポーネントの追加

プロジェクトにコンポーネントを追加できます。

pnpmnpmyarnbun

```bash
pnpm dlx shadcn@latest add button
```

上記のコマンドは、`Button` コンポーネントをプロジェクトに追加します。その後、以下のようにインポートできます：

app/routes/home.tsx

```typescript
import { Button } from "~/components/ui/button"
import type { Route } from "./+types/home"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "新しいReact Routerアプリ" },
    { name: "description", content: "React Routerへようこそ！" },
  ]
}

export default function Home() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center">
      <Button>クリック</Button>
    </div>
  )
}
```

## このページについて

- [プロジェクトの作成](#プロジェクトの作成)
- [CLIの実行](#cliの実行)
- [コンポーネントの追加](#コンポーネントの追加)

## Vercelにshadcn/uiアプリをデプロイ

OpenAI、Sonos、Adobeなどに信頼されています。

Vercelは、アプリと機能を大規模にデプロイするためのツールとインフラストラクチャを提供します。

[今すぐデプロイ](https://vercel.com/new?utm_source=shadcn_site&utm_medium=web&utm_campaign=docs_cta_deploy_now_callout)
