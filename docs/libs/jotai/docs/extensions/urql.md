# URQL

## 概要

[jotai-urql](https://github.com/jotaijs/jotai-urql)は、URQLのためのJotai拡張ライブラリで、GraphQL機能のための統一されたインターフェースを提供し、URQLの機能をJotaiの状態管理と統合することを可能にします。

## インストール

```bash
npm install jotai-urql @urql/core wonka
```

## エクスポートされる関数

- `atomWithQuery`: クライアントクエリ用
- `atomWithMutation`: クライアントミューテーション用
- `atomWithSubscription`: クライアントサブスクリプション用

## 基本的な使い方

### クエリの例

```javascript
import { useAtom } from 'jotai'

const countQueryAtom = atomWithQuery<{ count: number }>({
  query: 'query Count { count }',
  getClient: () => client,
})

const Counter = () => {
  const [operationResult, reexecute] = useAtom(countQueryAtom)

  if (operationResult.error) {
    throw operationResult.error
  }

  return <>{operationResult.data?.count}</>
}
```

### ミューテーションの例

```javascript
import { useAtom } from 'jotai'

const incrementMutationAtom = atomWithMutation<{ increment: number }>({
  query: 'mutation Increment { increment }',
})

const Counter = () => {
  const [operationResult, executeMutation] = useAtom(incrementMutationAtom)

  return (
    <div>
      <button
        onClick={() =>
          executeMutation().then((it) => console.log(it.data?.increment))
        }
      >
        Increment
      </button>
      <div>{operationResult.data?.increment}</div>
    </div>
  )
}
```

## 主な機能

- 様々なクエリタイプをサポート
- 柔軟なクライアント設定
- SuspenseモードとノンSuspenseモード
- エラーハンドリング
- クエリとミューテーションのカスタマイズ可能なオプション

## クライアント設定

一貫したクライアント使用を保証するために、アプリケーションを`UrqlProvider`とJotaiの両方でラップすることを推奨します。
