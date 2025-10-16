# Next.js

## プロジェクトの作成

`init` コマンドを実行して、新しい Next.js プロジェクトをセットアップするか、既存のプロジェクトを設定します：

pnpmnpmyarnbun

```bash
pnpm dlx shadcn@latest init
```

Next.js プロジェクトまたはモノレポから選択します。

## コンポーネントの追加

プロジェクトにコンポーネントを追加できます。

pnpmnpmyarnbun

```bash
pnpm dlx shadcn@latest add button
```

上記のコマンドは、プロジェクトに `Button` コンポーネントを追加します。その後、以下のようにインポートできます：

app/page.tsx

```typescript
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div>
      <Button>クリック</Button>
    </div>
  )
}
```

## Vercel で shadcn/ui アプリをデプロイ

OpenAI、Sonos、Adobe などに信頼されています。

Vercel は、アプリと機能を大規模にデプロイするためのツールとインフラストラクチャを提供します。

[今すぐデプロイ](https://vercel.com/new?utm_source=shadcn_site&utm_medium=web&utm_campaign=docs_cta_deploy_now_callout)

---

[shadcn](https://twitter.com/shadcn) が [Vercel](https://vercel.com/new?utm_source=shadcn_site&utm_medium=web&utm_campaign=docs_cta_deploy_now_callout) で作成。ソースコードは [GitHub](https://github.com/shadcn-ui/ui) で利用可能。
