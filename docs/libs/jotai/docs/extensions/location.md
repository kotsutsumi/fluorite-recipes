---
title: Location
description: ブラウザのロケーション状態を管理するためのユーティリティ
nav: 4.01
---

# Location

## 概要

Jotaiは、Reactアプリケーションでブラウザのロケーション状態を管理するためのロケーション関連ユーティリティを提供します。

## インストール

```bash
npm install jotai-location
```

## 主要な関数

### `atomWithLocation(options)`

- `window.location` にリンクされたアトムを作成します
- アプリケーションごとに1回のみインスタンス化することを推奨します
- ロケーションの動作をカスタマイズするためのオプションパラメータがあります

#### 例

```javascript
import { useAtom } from 'jotai'
import { atomWithLocation } from 'jotai-location'

const locationAtom = atomWithLocation()

const App = () => {
  const [loc, setLoc] = useAtom(locationAtom)
  // ロケーション状態を操作
}
```

### `atomWithHash(key, initialValue, options)`

- URLハッシュに接続されたアトムを作成します
- アトムの値とハッシュ間の双方向バインディング
- カスタムシリアライゼーション/デシリアライゼーションをサポート

#### 例

```javascript
import { useAtom } from 'jotai'
import { atomWithHash } from 'jotai-location'

const countAtom = atomWithHash('count', 1)

const Counter = () => {
  const [count, setCount] = useAtom(countAtom)
  // ハッシュに保存されたcountと対話
}
```

## 重要な注意事項

- DOMでのみ動作します
- 柔軟なロケーション状態管理を提供します
- カスタムハッシュ変更ハンドリングをサポートします
