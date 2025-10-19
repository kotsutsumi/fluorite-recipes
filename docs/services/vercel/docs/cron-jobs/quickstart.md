# Cron Jobsのクイックスタート

## 前提条件

- [Vercelアカウント](/signup)
- [Vercel Function](/docs/functions)を含む[プロジェクト](/docs/projects/overview#creating-a-project)

## 1. 関数を作成

この関数には、cron jobによって実行されるコードが含まれます。Next.js(App Router)を使用したシンプルな例:

```typescript
// app/api/hello/route.ts
export function GET(request: Request) {
  return new Response('Hello from Vercel!');
}
```

## 2. `vercel.json`を作成または更新

以下の設定で`vercel.json`ファイルを作成または更新します:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "crons": [
    {
      "path": "/api/hello",
      "schedule": "0 5 * * *"
    }
  ]
}
```

cron設定に関する重要な詳細:

- `path`: `/`で始める必要があります
- `schedule`: cron式(この例は毎日午前5:00 UTCに実行)

## 3. プロジェクトをデプロイ

CLIを使用して本番ドメインにデプロイ:

```bash
vercel deploy --prod
```

**注意**: Vercelは本番デプロイメントに対してのみcron jobsを呼び出し、プレビューデプロイメントには呼び出しません。

## 次のステップ

- [cron jobsの管理について学ぶ](/docs/cron-jobs/manage-cron-jobs)
- [使用量と料金を調べる](/docs/cron-jobs/usage-and-pricing)
