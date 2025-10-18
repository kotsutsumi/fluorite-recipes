# XState

## 概要

Jotaiはプリミティブで柔軟な状態管理アプローチを提供しますが、XStateはより洗練された安全な状態管理の抽象化を提供します。

## インストール

```bash
npm install xstate jotai-xstate
```

## 主な機能: `atomWithMachine`

### 説明

`atomWithMachine`は、XStateマシンを持つアトムを作成します。新しいマシンを作成する`getMachine`関数を受け取り、初回使用時に呼び出されます。

### コード例

```javascript
import { useAtom } from 'jotai'
import { atomWithMachine } from 'jotai-xstate'
import { assign, createMachine } from 'xstate'

const createEditableMachine = (value: string) =>
  createMachine({
    id: 'editable',
    initial: 'reading',
    context: { value },
    states: {
      reading: {
        on: { dblclick: 'editing' }
      },
      editing: {
        on: {
          cancel: 'reading',
          commit: {
            target: 'reading',
            actions: assign({
              value: (_, { value }) => value
            })
          }
        }
      }
    }
  })

const defaultTextAtom = atom('edit me')
const editableMachineAtom = atomWithMachine((get) =>
  createEditableMachine(get(defaultTextAtom))
)
```

## グローバルプロバイダーでの再起動可能なマシン

マシンが最終状態に到達した場合、`RESTART`イベントを送信することで再起動できます:

```javascript
import { RESTART } from 'jotai-xstate'

const YourComponent = () => {
  const [current, send] = useAtom(yourMachineAtom)
  const isFinalState = current.matches('myFinalState')

  useEffect(() => {
    return () => {
      if (isFinalState) send(RESTART)
    }
  }, [isFinalState])
}
```

## 学習リソース

- [ReactにおけるJotaiとXStateを使った複雑な状態管理](https://egghead.io/courses/complex-state-management-in-react-with-jotai-and-xstate)のEgghead.ioコース
