# Cron Jobsの管理

Cron JobsはすべてのVercelプランで利用可能です。

## Cron Jobsの表示

アクティブなcron jobsを表示するには:

1. Vercelダッシュボードからプロジェクトを選択
2. Settingsタブを選択
3. 左サイドバーからCron Jobsタブを選択

## Cron Jobsのメンテナンス

- **Cron Jobsの更新**: `vercel.json`ファイルまたは関数設定で式を変更し、再デプロイ
- **Cron Jobsの削除**: `vercel.json`ファイルまたは関数設定から設定を削除し、再デプロイ
- **Cron Jobsの無効化**: Cron Jobsタブに移動し、「Disable Cron Jobs」ボタンをクリック

*注意*: 無効化されたcron jobsも、cron jobsの制限にカウントされます。

## Cron Jobsのセキュリティ保護

少なくとも16文字のランダムな文字列を持つ環境変数`CRON_SECRET`を追加します。この値は、Vercelがcron jobを呼び出すときに`Authorization`ヘッダーとして送信されます。

Next.js(App Router)の実装例:

```typescript
export function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', {
      status: 401,
    });
  }

  return Response.json({ success: true });
}
```

## Cron Jobの継続時間

継続時間の制限は、Vercel Functionsと同じです。詳細については、`maxDuration`のドキュメントを参照してください。

## Cron Jobのエラー処理

- Vercelは失敗したcron job呼び出しを再試行しません
- Cron Jobsタブの「View Log」ボタンを通じてエラーログを確認

## 動的ルートを使用したCron Jobs

cron jobsは動的ルート用に作成できます:

```json
{
  "crons": [
    {
      "path": "/api/sync-slack-team/T0CAQ10TZ",
      "schedule": "0 5 * * *"
    },
    {
      "path": "/api/sync-slack-team/T4BOE34OP",
      "schedule": "0 5 * * *"
    }
  ]
}
```
