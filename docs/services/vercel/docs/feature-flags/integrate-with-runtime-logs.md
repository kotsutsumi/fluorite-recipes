# フラグとRuntime Logsの統合

## 概要

Runtime Logs統合は、すべてのプランでベータ版として利用可能です。この機能により、リクエスト処理中に評価されたフィーチャーフラグをダッシュボードのLogsタブに表示できます。

## 統合方法

### フラグ値の報告

Runtime Logsにフィーチャーフラグを認識させるには、`reportValue(name, value)`メソッドを使用します：

```typescript
import { reportValue } from 'flags';

export async function GET() {
  reportValue('summer-sale', false);
  return Response.json({ ok: true });
}
```

### 重要な注意事項

- [フィーチャーフラグパターン](/docs/feature-flags/feature-flags-pattern)を使用している場合、`reportValue()`は自動的に呼び出されるため、手動実装は不要です。

## 制限

報告される値には以下の制限が適用されます：

- キーは256文字に切り詰められる
- 値は256文字に切り詰められる
- JSONシリアライズ可能な値のみが受け入れられる。それ以外は無視される

## ビジュアル例

ドキュメントには、Runtime Logsでのフィーチャーフラグを示すライトモードとダークモードのスクリーンショットが含まれています。

## 関連ドキュメント

- [フィーチャーフラグパターン](/docs/feature-flags/feature-flags-pattern)
- [Vercelプラットフォームとの統合](/docs/feature-flags/integrate-vercel-platform)
