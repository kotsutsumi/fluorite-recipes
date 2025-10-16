# Bunja

BunjaはJotaiのための軽量なState Lifetime Managerで、Jotai atomにRAII（Resource Acquisition Is Initialization）ラッパーを提供します。

## インストール

```bash
npm install bunja
```

## Bunjaの定義

`bunja`関数を使用してbunjaを定義できます。`useBunja`フックでアクセスすると、bunjaインスタンスが作成され、それを参照するコンポーネントが消えると自動的に破棄されます。

```javascript
import { bunja } from 'bunja'
import { useBunja } from 'bunja/react'

const countBunja = bunja(() => {
  const countAtom = atom(0)

  bunja.effect(() => {
    console.log('mounted')
    return () => console.log('unmounted')
  })

  return { countAtom }
})

function MyComponent() {
  const { countAtom } = useBunja(countBunja)
  const [count, setCount] = useAtom(countAtom)
  // コンポーネントのロジックをここに
}
```

## 依存関係を持つBunjaの定義

ページステートやモーダルステートなど、より広いライフタイムとより狭いライフタイムを持つbunjaを作成できます：

```javascript
const pageBunja = bunja(() => {
  const pageStateAtom = atom({})
  return { pageStateAtom }
})

const childBunja = bunja(() => {
  const { pageStateAtom } = bunja.use(pageBunja)
  const childStateAtom = atom((get) => ({
    ...get(pageStateAtom),
    child: 'state',
  }))
  return { childStateAtom }
})

const modalBunja = bunja(() => {
  const { pageStateAtom } = bunja.use(pageBunja)
  const modalStateAtom = atom((get) => ({
    ...get(pageStateAtom),
    modal: 'state',
  }))
  bunja.effect(() => {
    console.log('modal opened')
    return () => console.log('modal closed')
  })
  return { modalStateAtom }
})
```

## 特徴

- **自動ライフタイム管理**: Bunjaインスタンスは、それを使用するすべてのコンポーネントがアンマウントされると自動的にクリーンアップされます
- **依存関係のサポート**: `bunja.use()`を使用して他のbunjaに依存できます
- **エフェクト管理**: `bunja.effect()`を使用して、ライフタイムに紐付いたセットアップとクリーンアップロジックを実行できます
- **Jotaiとの統合**: Jotai atomとシームレスに連携します
