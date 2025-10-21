# フラグとVercel Web Analyticsの統合

## 概要

フィーチャーフラグのWeb Analytics統合は、すべてのVercelプランでベータ版として利用可能です。

## クライアントサイドトラッキング

### フィーチャーフラグの発行

フィーチャーフラグをWeb Analyticsと共有するには、フィーチャーフラグリファレンスで説明されているように、フラグ値をDOMに発行する必要があります。

### クライアントサイドイベントのトラッキング

- クライアントサイドイベントは自動的にフラグ情報を含む
- 特定のイベントのトラッキングされるフラグを手動でオーバーライド：

```typescript
import { track } from '@vercel/analytics';

track('My Event', {}, { flags: ['summer-sale'] });
```

注意：フラグ値が暗号化されている場合、暗号化された文字列全体がイベントペイロードの一部になります。

## サーバーサイドトラッキング

### フラグ値の報告

1. `reportValue`を使用してRuntime Logsにフィーチャーフラグ値を記録：

```typescript
import { reportValue } from 'flags';

export async function GET() {
  reportValue('summer-sale', false);
  return Response.json({ ok: true });
}
```

2. 特定のリクエスト中にフラグを使用してイベントをトラッキング：

```typescript
import { track } from '@vercel/analytics/server';
import { reportValue } from 'flags';

export async function GET() {
  reportValue('summer-sale', false);
  track('My Event', {}, { flags: ['summer-sale'] });

  return Response.json({ ok: true });
}
```

ヒント：フィーチャーフラグパターンを使用している場合、`reportValue`は自動的に呼び出されます。
