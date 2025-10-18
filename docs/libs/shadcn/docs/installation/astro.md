# Astro

## プロジェクトの作成

Astroプロジェクトを作成するには、以下のコマンドを使用します：

pnpmnpmyarnbun

```bash
pnpm dlx create-astro@latest astro-app --template with-tailwindcss --install --add react --git
```

### tsconfig.jsonファイルの編集

パスを解決するために、`tsconfig.json`ファイルに以下のコードを追加します：

tsconfig.json

```json
{
  "compilerOptions": {
    // ...
    "baseUrl": ".",
    "paths": {
      "@/*": [
        "./src/*"
      ]
    }
    // ...
  }
}
```

### CLIの実行

プロジェクトをセットアップするために、`shadcn` initコマンドを実行します：

pnpmnpmyarnbun

```bash
pnpm dlx shadcn@latest init
```

### コンポーネントの追加

プロジェクトにコンポーネントを追加できます。

pnpmnpmyarnbun

```bash
pnpm dlx shadcn@latest add button
```

上記のコマンドは、`Button`コンポーネントをプロジェクトに追加します。その後、以下のように読み込むことができます：

src/pages/index.astro

```astro
---
import { Button } from "@/components/ui/button"
---

<html lang="en">
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width" />
		<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
		<meta name="generator" content={Astro.generator} />
		<title>Astro + TailwindCSS</title>
	</head>
	<body>
		<div className="grid place-items-center h-screen content-center">
			<Button client:load>クリック</Button>
		</div>
	</body>
</html>
```

## 注意事項

Astroでは、Reactコンポーネントをインタラクティブにするために`client:`ディレクティブを使用する必要があります。
