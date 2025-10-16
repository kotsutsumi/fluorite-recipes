# 大きなオブジェクト

> 以下の例と説明は、この[codesandbox](https://codesandbox.io/s/zealous-sun-f2qnl?file=/src/App.tsx)に基づいているため、これらの例と一緒に確認するとより理解が深まります。

atomに保存する必要があるネストされたデータがある場合があり、そのデータを異なるレベルで変更する必要があったり、すべての変更をリッスンせずにデータの一部を使用する必要がある場合があります。

次の例を考えてみましょう:

```js
const initialData = {
  people: [
    {
      name: 'Luke Skywalker',
      information: { height: 172 },
      siblings: ['John Skywalker', 'Doe Skywalker'],
    },
    {
      name: 'C-3PO',
      information: { height: 167 },
      siblings: ['John Doe', 'Doe John'],
    },
  ],
  films: [
    {
      title: 'A New Hope',
      planets: ['Tatooine', 'Alderaan'],
    },
    {
      title: 'The Empire Strikes Back',
      planets: ['Hoth'],
    },
  ],
  info: {
    tags: ['People', 'Films', 'Planets', 'Titles'],
  },
}
```

## focusAtom

> `focusAtom`は、渡されたフォーカスに基づいて新しいatomを作成します。[jotai-optics](../extensions/optics.mdx#focusatom)

このユーティリティを使用して、atomにフォーカスし、データの特定の部分からatomを作成します。例えば、上記のデータのpeopleプロパティを使用する必要がある場合、次のようにします:

```js
import { atom } from 'jotai'
import { focusAtom } from 'jotai-optics'

const dataAtom = atom(initialData)

const peopleAtom = focusAtom(dataAtom, (optic) => optic.prop('people'))
```

`focusAtom`は`WritableAtom`を返します。つまり、`peopleAtom`のデータを変更することが可能です。

上記のデータ例のfilmsプロパティを変更しても、`peopleAtom`は再レンダリングを引き起こしません。これが`focusAtom`を使用する利点の一つです。

## splitAtom

> `splitAtom`ユーティリティは、リスト内の各要素のatomを取得したい場合に便利です。[jotai/utils](../utilities/split.mdx)

このユーティリティは、値として配列を返すatomに使用します。例えば、上で作成した`peopleAtom`はpeople配列プロパティを返すため、その配列の各アイテムのatomを返すことができます。配列atomが書き込み可能な場合、`splitAtom`が返すatomも書き込み可能になります。配列atomが読み取り専用の場合、返されるatomも読み取り専用になります。

```js
import { splitAtom } from 'jotai/utils'

const peopleAtomsAtom = splitAtom(peopleAtom)
```

そして、これがコンポーネントでの使用方法です。

```jsx
const People = () => {
  const [peopleAtoms] = useAtom(peopleAtomsAtom)
  return (
    <div>
      {peopleAtoms.map((personAtom) => (
        <Person personAtom={personAtom} key={`${personAtom}`} />
      ))}
    </div>
  )
}
```

## selectAtom

> この関数は、元のatomの値の関数である派生atomを作成します。[jotai/utils](../utilities/select.mdx)

このユーティリティは`focusAtom`に似ていますが、常に読み取り専用のatomを返します。

infoデータを使用したい場合で、そのデータが常に変更不可能だと仮定しましょう。そこから読み取り専用atomを作成し、その作成されたatomを選択できます。

```js
// まず、initialData.infoに基づいて派生atomを作成します
const infoAtom = atom((get) => get(dataAtom).info)
```

次に、コンポーネントで使用します:

```jsx
import { atom, useAtom } from 'jotai'
import { selectAtom, splitAtom } from 'jotai/utils'

const tagsSelector = (s) => s.tags
const Tags = () => {
  const tagsAtom = selectAtom(infoAtom, tagsSelector)
  const tagsAtomsAtom = splitAtom(tagsAtom)
  const [tagAtoms] = useAtom(tagsAtomsAtom)
  return (
    <div>
      {tagAtoms.map((tagAtom) => (
        <Tag key={`${tagAtom}`} tagAtom={tagAtom} />
      ))}
    </div>
  )
}
```
