---
title: Cache
description: アトム値のキャッシング機能
nav: 4.02
---

# Cache

## 概要

Jotaiは、再レンダリングを最適化するためのプリミティブ関数を提供しており、「現在の」アトム値の保持に焦点を当てています。キャッシングはサードパーティライブラリ [jotai-cache](https://github.com/jotai-labs/jotai-cache) を通じてサポートされています。

## インストール

```bash
npm install jotai-cache
```

## `atomWithCache`

### 説明

`atomWithCache(read, options)` は、キャッシング機能を持つ読み取り専用アトムを作成します。

### パラメータ

- **read**: 読み取り専用アトムを定義する関数
- **options** (オプション):
  - `size`: キャッシュアイテムの最大サイズ
  - `shouldRemove`: キャッシュアイテムの削除をチェックする関数
  - `areEqual`: アトム値を比較する関数

### 例

```javascript
import { atom, useAtom } from 'jotai'
import { atomWithCache } from 'jotai-cache'

const idAtom = atom(1)

const cachedAtom = atomWithCache(async (get) => {
  const id = get(idAtom)
  const response = await fetch(`https://reqres.in/api/users/${id}?delay=1`)
  return response.json()
})
```

この例では、ユーザーデータをフェッチするためのキャッシュされたアトムを作成しています。これにより、以前のレスポンスを保存することでネットワークリクエストを最適化できます。

## 主な違い

- 通常のアトムは各リクエストでデータを再フェッチします
- キャッシュされたアトムは以前のネットワークレスポンスを保存して再利用できます
