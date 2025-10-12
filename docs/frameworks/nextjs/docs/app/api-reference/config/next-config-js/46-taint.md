# taint

`taint`オプションは、機密データが誤ってクライアントに渡されるのを防ぐための実験的なReact機能です。有効にすると、以下を使用できるようになります：

- `experimental_taintObjectReference`
- `experimental_taintUniqueValue`

## 設定

`next.config.js`でtaintを有効にするには、以下を追加します：

```typescript filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    taint: true,
  },
}

export default nextConfig
```

## 主な機能

- 機密データがServer-Client境界を越えるのを防ぎます
- taintされたデータが不適切に渡された場合にエラーをスローします
- データ読み取りメソッドが制御外にあるシナリオで役立ちます

## 注意事項

- Taintは参照によってオブジェクトのみを追跡します
- taintされたオブジェクトをコピーすると、taintされていないバージョンが作成されます
- taintされた値から派生したデータを追跡することはできません

## 例：オブジェクト参照のTaint

```typescript
import { experimental_taintObjectReference } from 'react'

async function getUserDetails(id: string): Promise<UserDetails> {
  const user = await db.queryUserById(id)

  experimental_taintObjectReference(
    'ユーザー情報オブジェクト全体を使用しないでください',
    user
  )

  return user
}
```

この例では、`user`オブジェクト全体がtaintされます。このオブジェクトをクライアントコンポーネントに渡そうとすると、エラーがスローされます。

## 例：一意の値のTaint

```typescript
import { experimental_taintUniqueValue } from 'react'

async function getSystemConfig(): Promise<SystemConfig> {
  const config = await config.getConfigDetails()

  experimental_taintUniqueValue(
    '設定トークンをクライアントに渡さないでください',
    config,
    config.SERVICE_API_KEY
  )

  return config
}
```

この例では、`config`オブジェクト内の特定の値（`SERVICE_API_KEY`）がtaintされます。この値をクライアントに送信しようとすると、エラーがスローされます。

## 警告

> **重要**: Taintは、データの露出を防ぐ唯一のメカニズムであってはなりません。データとAPIをモデル化して、機密データの送信を最小限に抑えることをお勧めします。

## バージョン履歴

| バージョン | 変更内容 |
|-----------|---------|
| `v15.0.0` | `experimental.taint`が導入されました |

## 関連項目

- [React Taint API ドキュメント](https://react.dev/reference/react/experimental_taintObjectReference)
- [Server Actions](/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
