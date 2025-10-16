---
title: 'devtools'
section: 'API'
subSection: 'Utils'
description: 'ValtioでRedux DevTools拡張機能を使用'
---

# devtools

#### 開発ツール

プレーンオブジェクトと配列に [Redux DevTools Extension](https://github.com/reduxjs/redux-devtools) を使用できます。

```jsx
import { devtools } from 'valtio/utils'

const state = proxy({ count: 0, text: 'hello' })
const unsub = devtools(state, { name: 'state name', enabled: true })
```

**Redux DevToolsで状態を操作**

以下のスクリーンショットは、Redux DevToolsを使用して状態を操作する方法を示しています。まず、インスタンスのドロップダウンからオブジェクトを選択します。次に、ディスパッチするJSONオブジェクトを入力します。次に、「Dispatch」をクリックします。状態がどのように変化するかに注目してください。

![image](https://user-images.githubusercontent.com/6372489/141134955-26e9ffce-1e2a-4c8c-a9b3-d9da739610fe.png)

#### vanilla JSで使用

ValtioはReactに縛られていません。vanillaJSで使用できます。

```jsx
import { proxy, subscribe, snapshot } from 'valtio/vanilla'

const state = proxy({ count: 0, text: 'hello' })

subscribe(state, () => {
  console.log('state is mutated')
  const obj = snapshot(state) // スナップショットはイミュータブルなオブジェクト
})
```

#### TypeScriptで使用

型を正しく取得するには、`@redux-devtools/extension` から型をインストールしてインポートすることをお勧めします。

```ts
import type {} from '@redux-devtools/extension'
import { devtools } from 'valtio/utils'
```
