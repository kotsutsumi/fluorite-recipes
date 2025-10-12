# after

`after` は、レスポンス（またはプリレンダリング）が完了した後に実行される作業をスケジュールできる関数です。ログやアナリティクスなど、レスポンスをブロックしない副作用のタスクに便利です。

## リファレンス

### パラメータ

- レスポンス完了後に実行されるコールバック関数

### 期間

`after` は、プラットフォームのデフォルトまたは設定された最大ルート継続時間で実行されます。

## 使用可能な場所

- サーバーコンポーネント
- サーバーアクション
- ルートハンドラー
- ミドルウェア

## 例

### リクエストAPIとの使用

```typescript
import { after } from 'next/server'
import { cookies, headers } from 'next/headers'
import { logUserAction } from '@/app/utils'

export async function POST(request: Request) {
  // ミューテーションを実行
  // ...

  // アナリティクスのためにユーザーアクティビティをログ
  after(async () => {
    const userAgent = (await headers().get('user-agent')) || 'unknown'
    const sessionCookie =
      (await cookies().get('session-id'))?.value || 'anonymous'

    logUserAction({ sessionCookie, userAgent })
  })

  return new Response(JSON.stringify({ status: 'success' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
```

## プラットフォームサポート

| デプロイメントオプション | サポート状況 |
| --- | --- |
| Node.jsサーバー | ✓ |
| Dockerコンテナ | ✓ |
| 静的エクスポート | ✗ |

## バージョン履歴

| バージョン | 変更点 |
| --- | --- |
| `v15.1.0` | `after` が安定版になりました |
| `v15.0.0-rc` | `after` が導入されました |
