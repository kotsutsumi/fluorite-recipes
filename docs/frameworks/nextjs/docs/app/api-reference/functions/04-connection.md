# connection

`connection()` 関数は、レンダリングが受信するユーザーリクエストを待つべきであることを示します。

## リファレンス

### 型

```typescript
function connection(): Promise<void>
```

### パラメータ

- パラメータはありません。

### 戻り値

- 関数は `void` Promiseを返します。消費するためのものではありません。

## 注意点

- `connection` は、`unstable_noStore` を置き換え、Next.jsの将来により適合するものです。
- この関数は、動的レンダリングが必要で、一般的な動的APIが使用されていない場合にのみ必要です。

## 使用例

```typescript
import { connection } from 'next/server'

export default async function Page() {
  await connection()
  // これ以降は事前レンダリングから除外されます
  const rand = Math.random()
  return <span>{rand}</span>
}
```

## バージョン履歴

| バージョン | 変更点 |
|-----------|--------|
| `v15.0.0` | `connection` が安定版になりました |
| `v15.0.0-RC` | `connection` が導入されました |
