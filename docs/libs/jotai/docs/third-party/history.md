---
title: History
description: アトムの状態履歴管理
nav: 6.01
---

# History

## インストール

```bash
npm install jotai-history
```

## `withHistory`

```javascript
import { withHistory } from 'jotai-history'

const targetAtom = atom(0)
const limit = 2
const historyAtom = withHistory(targetAtom, limit)

function Component() {
  const [current, previous] = useAtomValue(historyAtom)
  // ...
}
```

### 説明

`withHistory` は、指定された `targetAtom` の状態の履歴を追跡するアトムを作成します。最新の `limit` 個の状態が保持されます。

### アクションシンボル

- **RESET**: 履歴全体をクリアします

```javascript
import { RESET } from 'jotai-history'

setHistoryAtom(RESET)
```

- **UNDO** と **REDO**: 履歴を前後に移動します

```javascript
import { REDO, UNDO } from 'jotai-history'

setHistoryAtom(UNDO)
setHistoryAtom(REDO)
```

### インジケーター

- **canUndo** と **canRedo**: undo/redoの可否を示すブール値フラグ

```javascript
function Component() {
  const history = useAtomValue(historyAtom)
  return (
    <>
      <button disabled={!history.canUndo}>Undo</button>
      <button disabled={!history.canRedo}>Redo</button>
    </>
  )
}
```

## メモリ管理

> 合理的な `limit` を設定してメモリ使用量に注意してください。頻繁な状態更新はメモリ消費を大幅に増加させる可能性があります。
