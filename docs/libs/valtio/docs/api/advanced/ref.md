---
title: 'ref'
section: 'API'
subSection: 'Advanced'
description: 'ref オブジェクトを作成する'
---

# `ref`

## `ref` を使用すると、Valtio proxy 内でプロキシ化されていない状態を保持できます

`ref` は、`proxy` 内にオブジェクトをネストする必要があるが、内部プロキシでラップせず、したがって追跡されないようにする必要がある稀なケースで役立ちます。

```js
const store = proxy({
    users: [
        { id: 1, name: 'Juho', uploads: ref([]) },
    ]
  })
})
```

オブジェクトを `ref` でラップした後は、オブジェクトを再割り当てしたり、新しい `ref` で再ラップすることなく、ミューテート（変更）する必要があります。

```js
// ✅ ミューテートする
store.users[0].uploads.push({ id: 1, name: 'Juho' })
// ✅ リセットする
store.users[0].uploads.splice(0)

// ❌ 再割り当てしない
store.users[0].uploads = []
```

また、`ref` を proxy 内の唯一の状態として使用すべきではありません。そうすると proxy を使用する意味がなくなります。

## Codesandbox デモ

https://codesandbox.io/s/valtio-file-load-demo-oo2yzn
