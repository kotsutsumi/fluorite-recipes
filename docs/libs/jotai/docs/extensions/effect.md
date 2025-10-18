# Effect

## はじめに

Jotai Effectは、Jotaiでリアクティブな副作用を実現するためのユーティリティパッケージで、Reactのためのプリミティブで柔軟な状態管理を提供します。

## インストール

```bash
npm install jotai-effect
```

## 主要なユーティリティ

### `observe`

Jotaiの`store`で状態変化を監視する`effect`をマウントする関数です。

#### シグネチャ

```typescript
function observe(effect: Effect, store?: Store): Unobserve
```

#### 例

```javascript
const unobserve = observe((get, set) => {
  set(logAtom, `someAtom changed: ${get(someAtom)}`)
})
```

### `atomEffect`

マウントされたときに状態変化に反応する副作用を宣言するためのアトムを作成します。

#### シグネチャ

```typescript
function atomEffect(effect: Effect): Atom<void>
```

#### 例

```javascript
const logEffect = atomEffect((get, set) => {
  set(logAtom, get(someAtom))

  return () => {
    set(logAtom, 'unmounting')
  }
})
```

### `withAtomEffect`

ターゲットアトムのクローンにエフェクトをバインドします。

#### シグネチャ

```typescript
function withAtomEffect<T>(targetAtom: Atom<T>, effect: Effect): Atom<T>
```

#### 例

```javascript
const valuesAtom = withAtomEffect(atom(null), (get, set) => {
  set(valuesAtom, get(countAtom))
})
```

## 依存関係の管理

- 同期的な`get`呼び出しはアトムを依存関係として追加します
- 非同期的な`get`呼び出しは依存関係を追加しません
- 依存関係は実行ごとに再計算されます

## エフェクトの動作

- 同期的に実行されます
- 複数の更新をバッチ処理します
- 無限ループを防ぎます
- クリーンアップ関数をサポートします
- 冪等的に実行されます
- 条件付きマウントをサポートします
- サブスクリプションなしでのピーク（peek）を許可します
- 再帰的な更新をサポートします

## 主な特徴

- プリミティブな状態管理
- 柔軟な副作用ハンドリング
- React向けの設計
- 最小限のオーバーヘッド
- 予測可能な状態変更
