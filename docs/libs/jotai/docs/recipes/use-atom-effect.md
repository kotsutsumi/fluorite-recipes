# useAtomEffect

> `useAtomEffect`は、[atomEffect](../extensions/effect.mdx)を使用して、atomやpropsの変更に応じて副作用を実行します。

effectFnは、依存するatomが変更されたとき、またはeffectFn自体が変更されたときに再実行されます。コンポーネント内で定義された関数の場合は、必ずeffectFnをメモ化してください。

⚠️ 注意: 余分なatomEffectの再計算を避けるために、常に[useMemoとuseCallbackの安定版](https://github.com/alexreardon/use-memo-one)を使用することを推奨します。useMemoをパフォーマンス最適化として使用することはできますが、セマンティックな保証としては使用できません。将来的に、Reactは以前にメモ化された値を「忘れ」、次のレンダリング時に再計算することを選択する可能性があります。例えば、オフスクリーンコンポーネントのメモリを解放するためなどです。

```ts
import { useMemoOne as useStableMemo } from 'use-memo-one'
import { useAtomValue } from 'jotai/react'
import { atomEffect } from 'jotai-effect'

type EffectFn = Parameters<typeof atomEffect>[0]

export function useAtomEffect(effectFn: EffectFn) {
  useAtomValue(useStableMemo(() => atomEffect(effectFn), [effectFn]))
}
```

### 使用例

```tsx
import { useCallbackOne as useStableCallback } from 'use-memo-one'
import { atom, useAtom } from 'jotai'
import { atomFamily } from 'jotai/utils'
import { useAtomEffect } from './useAtomEffect'

const channelSubscriptionAtomFamily = atomFamily<Channel>(
  (channelId: string) => {
    return atom(new Channel(channelId))
  },
)
const messagesAtom = atom<Message[]>([])

function Messages({ channelId }: { channelId: string }) {
  const [messages] = useAtom(messagesAtom)
  useAtomEffect(
    useStableCallback(
      (get, set) => {
        const channel = get(channelSubscriptionAtomFamily(channelId))
        const unsubscribe = channel.subscribe((message) => {
          set(messagesAtom, (prev) => [...prev, message])
        })
        return unsubscribe
      },
      [channelId],
    ),
  )
  return (
    <>
      <h1>あなたには{messages.length}件のメッセージがあります</h1>
      <hr />
      {messages.map((message) => (
        <div key={message.id}>{message.text}</div>
      ))}
    </>
  )
}
```
