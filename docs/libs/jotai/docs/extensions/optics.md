---
title: Optics
description: optics-tsとの統合によるアトムのフォーカス
nav: 4.04
---

# Optics

## インストール

```bash
npm install optics-ts jotai-optics
```

## focusAtom

### 説明

`focusAtom` は、ベースアトムの特定の部分にフォーカスした派生アトムを作成し、ネストされたプロパティの取得と設定の両方を可能にします。

### 主な機能

- フォーカスに基づいて新しいアトムを作成します
- `Lens`、`Prism`、`Isomorphism` などの様々なオプティクスをサポートします
- ベースアトムに通知しながらネストされたプロパティの更新を可能にします

### コード例

```javascript
import { atom } from 'jotai'
import { focusAtom } from 'jotai-optics'

const objectAtom = atom({ a: 5, b: 10 })

const aAtom = focusAtom(objectAtom, (optic) => optic.prop('a'))
const bAtom = focusAtom(objectAtom, (optic) => optic.prop('b'))

const Controls = () => {
  const [a, setA] = useAtom(aAtom)
  const [b, setB] = useAtom(bAtom)

  return (
    <div>
      <span>Value of a: {a}</span>
      <span>Value of b: {b}</span>
      <button onClick={() => setA((oldA) => oldA + 1)}>Increment a</button>
      <button onClick={() => setB((oldB) => oldB + 1)}>Increment b</button>
    </div>
  )
}
```

### 追加リソース

- [optics-ts GitHub](https://github.com/akheron/optics-ts)
