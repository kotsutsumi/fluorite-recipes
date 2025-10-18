# Laravel

## プロジェクトの作成

Laravel Inertia と React を使用して新しいプロジェクトを作成するには、Laravel インストーラーで以下のコマンドを実行します：

```bash
laravel new my-app --react
```

## コンポーネントの追加

プロジェクトにコンポーネントを追加できます。

```bash
pnpm dlx shadcn@latest add switch
```

上記のコマンドは、`resources/js/components/ui/switch.tsx` に `Switch` コンポーネントを追加します。その後、以下のように使用できます：

```tsx
import { Switch } from "@/components/ui/switch"

const MyPage = () => {
  return (
    <div>
      <Switch />
    </div>
  )
}

export default MyPage
```

## 概要

このドキュメントは、Laravel プロジェクトに shadcn/ui をインストールし、コンポーネントを追加する方法を説明しています。Laravel は Inertia.js と React を使用してモダンなフロントエンドを構築することができます。
