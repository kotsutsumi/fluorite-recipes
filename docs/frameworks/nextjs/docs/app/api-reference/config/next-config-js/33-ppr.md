# Partial Prerendering (PPR)

Partial Prerendering (PPR) は、同じルート内で静的コンポーネントと動的コンポーネントを組み合わせることができる機能です。

## ステータス

- 現在 canary チャンネルで利用可能
- 変更される可能性があります
- Next.js 14 で導入、バージョン 15 で段階的採用

## next.config.js での設定

```typescript
const nextConfig: NextConfig = {
  experimental: {
    ppr: 'incremental',
  },
}
```

## 実装例

```typescript
export const experimental_ppr = true

export default function Page() {
  return (
    <>
      <StaticComponent />
      <Suspense fallback={<Fallback />}>
        <DynamicComponent />
      </Suspense>
    </>
  );
}
```

## 重要な注意事項

- `experimental_ppr` を持たないルートはデフォルトで `false` になります
- 各ルートで PPR を明示的にオプトインする必要があります
- `experimental_ppr` はルートセグメントのすべての子に適用されます
- `experimental_ppr` を `false` に設定することで、子セグメントの PPR を無効にできます

## バージョン履歴

- **v14.0.0**: 実験的 PPR が導入されました
- **v15.0.0**: 実験的 `incremental` 値が追加されました

ドキュメントは、これが実験的機能であることを強調しており、開発者が GitHub でフィードバックを提供することを推奨しています。
