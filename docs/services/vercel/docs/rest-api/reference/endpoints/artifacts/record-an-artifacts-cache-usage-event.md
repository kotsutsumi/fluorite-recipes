# アーティファクトキャッシュ使用イベントの記録

キャッシュイベントを記録します。

## エンドポイント

```
POST /v8/artifacts/events
```

## パラメータ

### クエリ
| パラメータ | 型 | 説明 |
|----------|------|------|
| `teamId` | string | チーム識別子 |
| `slug` | string | チームスラッグ |

### ヘッダー
| ヘッダー | 説明 |
|---------|------|
| `x-artifact-client-ci` | CI/CD環境名（最大50文字） |
| `x-artifact-client-interactive` | インタラクティブシェル（0または1） |

### リクエストボディ
```typescript
interface CacheEvent {
  sessionId: string;        // UUID
  source: "LOCAL" | "REMOTE";
  event: "HIT" | "MISS";
  hash: string;
  duration?: number;        // HITイベントのみ
}
```

## レスポンス

**成功 (200)**: イベント記録確認

**エラー**:
- 400: 無効なリクエスト
- 401: 未認証
- 402: 支払い問題
- 403: キャッシュ無効化または制限超過
