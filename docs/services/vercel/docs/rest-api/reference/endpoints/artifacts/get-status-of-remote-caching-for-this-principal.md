# リモートキャッシングステータスの取得

リモートキャッシングの現在のステータスを取得します。

## エンドポイント

```
GET /v8/artifacts/status
```

## パラメータ

| パラメータ | 型 | 説明 |
|----------|------|------|
| `teamId` | string | チーム識別子 |
| `slug` | string | チームスラッグ |

## レスポンス

### 成功 (200)

```typescript
interface CachingStatus {
  status: "disabled" | "enabled" | "over_limit" | "paused";
}
```

### エラー
- 400: 不正なリクエスト
- 401: 未認証
- 402: アカウントブロックまたは支払い方法必要
- 403: 権限拒否
