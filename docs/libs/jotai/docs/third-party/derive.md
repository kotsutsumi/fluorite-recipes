# Derive

## いつ有用か？

- キャッシュへのローカル更新がマイクロサスペンションを引き起こす場合
- 不要な再計算がパフォーマンスの問題を引き起こす場合

Jotaiは、Webフレームワークの外で非同期データを扱うための強力なプリミティブを提供します。多くのデータフェッチング統合は、atomを介してクライアント側のキャッシュを覗き見る機能を提供します。キャッシュがまだ入力されていない場合、atomは値のPromiseに解決されます。しかし、値がすでにキャッシュに存在し、楽観的な更新を行う場合、値は下流で即座に利用可能にすることができます。

これらの二重性を持つ（時には非同期、時には同期）atomでデータグラフを構築すると、慎重に扱わないと、不要な再レンダリング、古い値、マイクロサスペンションにつながる可能性があります。

**jotai-derive**は、値が利用可能になり次第それに作用する非同期データグラフを構築するためのプリミティブを提供します。

### インストール

```bash
npm install jotai-derive
```

### Derive

時には値がわからず（例：データフェッチ中）、他の時にはローカルで更新して即座に値を知ることができる、_二重性を持つ_ atomを考えてみましょう。

```javascript
// jotai-deriveを使わない場合
import { atom } from 'jotai'

const uppercaseNameAtom = atom(async (get) => {
  const user = await get(userAtom)
  return user.name.toUppercase()
})

// jotai-deriveを使う場合
import { derive } from 'jotai-derive'

const uppercaseNameAtom = derive(
  [userAtom],
  (user) => user.name.toUppercase(),
)
```

### 複数の非同期依存関係

```javascript
import { derive } from 'jotai-derive'

const welcomeMessageAtom = derive(
  [userAtom, serverNameAtom],
  (user, serverName) => `Welcome ${user.name} to ${serverName}!`,
)
```

## Soon

条件付き依存関係のような高度な使用法には、`soon`と`soonAll`関数を使用できます。

### 条件付き依存関係

```javascript
import { pipe } from 'remeda'
import { soon } from 'jotai-derive'

const conditionalAtom = atom(async (get) => {
  const condition = await get(conditionAtom)
  if (condition) {
    return pipe(
      soon(get, dependentAtom),
      (value) => value.toUpperCase(),
    )
  }
  return 'default'
})
```
