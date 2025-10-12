# default.js

`default.js`ファイルは、並行ルート（Parallel Routes）内でフォールバックをレンダリングするために使用される特別なファイルです。Next.jsがフルページロード後にスロットのアクティブな状態を復元できない場合に使用されます。

## 目的

`default.js`は以下のような状況で使用されます：

- ハードナビゲーション時に特定のルートセグメントがマッチしない場合
- 正確なルートが利用できないときにデフォルトのレンダリングオプションを提供する
- 明示的なスロットと暗黙的な`children`スロットの両方に適用される

## 使用例シナリオ

以下のようなフォルダ構造を考えてみましょう：

```
app/
├── @team/
│   └── page.tsx
├── @analytics/
│   └── page.tsx
├── settings/
│   └── page.tsx
└── layout.tsx
```

この場合、`/settings`に移動したときに`@analytics`スロットにマッチするルートがない場合、`default.js`がフォールバックをレンダリングします。

## パラメータ

`default.js`は以下のパラメータを受け取ることができます：

### `params`（オプション）

動的ルートパラメータにアクセスするために使用できます。

- **バージョン15以降**: `params`はPromiseとして提供され、`async/await`またはReactの`use`関数を使用してアクセスする必要があります

## 実装例

```typescript
// app/@analytics/default.tsx
export default async function Default({
  params,
}: {
  params: Promise<{ artist: string }>
}) {
  const { artist } = await params

  return (
    <div>
      <h2>デフォルトのアナリティクスビュー</h2>
      <p>アーティスト: {artist}</p>
    </div>
  )
}
```

## 重要な注意点

- `default.js`ファイルがない場合、マッチしないルートに対して404がレンダリングされます
- ナビゲーション中にレイアウトの一貫性を維持するのに役立ちます
- Next.jsのApp Routerにおける高度なルーティング機能の一部です
- 並行ルートを使用する際の必須ファイルではありませんが、より良いユーザーエクスペリエンスを提供します

## ベストプラクティス

1. **一貫性のあるUI**: ユーザーがどのルートにいても一貫したUIエクスペリエンスを提供します
2. **エラー回避**: 404エラーの代わりに意味のあるフォールバックコンテンツを表示します
3. **スロット管理**: すべてのスロットに対して適切な`default.js`を提供することを検討してください

## 関連機能

- [並行ルート（Parallel Routes）](/docs/frameworks/nextjs/docs/app/building-your-application/routing/parallel-routes)
- [レイアウト（Layouts）](/docs/frameworks/nextjs/docs/app/api-reference/file-conventions/layout)
- [スロット](/docs/frameworks/nextjs/docs/app/building-your-application/routing/parallel-routes#slots)
