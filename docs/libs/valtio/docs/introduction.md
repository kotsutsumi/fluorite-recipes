---
title: 'Introduction'
section: 'Introduction'
description: 'Valtioの紹介 - プロキシステートをシンプルにするReactとバニラJavaScript向けの状態管理ライブラリ'
---

# Introduction

Valtioは、ReactとバニラJavaScriptのためのプロキシベースの状態管理ライブラリです。JavaScriptプロキシを使用して任意のオブジェクトをリアクティブにし、シンプルで直感的なAPIで強力な状態管理を実現します。

## Valtioとは？

Valtioは「プロキシステートをシンプルに」するために設計された、最小限で柔軟、そして少し魔法のような状態管理ライブラリです。通常のJavaScriptオブジェクトのように状態を変更でき、フレームワークが自動的に変更を追跡し、必要なコンポーネントのみを再レンダリングします。

### 主な特徴

- **最小限のAPI**: `proxy()` と `useSnapshot()` の2つの主要な関数だけで始められます
- **直接的な変更**: `setState` や reducer のような複雑なパターンは不要です
- **最適化されたレンダリング**: アクセスされた状態の部分のみを追跡し、必要な時だけ再レンダリング
- **TypeScript完全サポート**: 型安全性を保ちながら優れた開発者体験を提供
- **フレームワーク非依存**: ReactでもバニラJavaScriptでも動作します
- **モダンReact機能**: React 18、React 19、Suspenseと完全に互換性があります

## なぜValtioを使うのか？

### シンプルさ

複雑なボイラープレートやパターンを学ぶ必要はありません。通常のJavaScriptオブジェクトのように状態を変更するだけです:

```javascript
import { proxy } from 'valtio'

const state = proxy({ count: 0, text: 'hello' })

// どこからでも直接変更可能
state.count++
state.text = 'world'
```

### パフォーマンス

Valtioは自動的にレンダリングを最適化します。コンポーネントは実際にアクセスした状態の部分が変更された時のみ再レンダリングされます:

```jsx
import { useSnapshot } from 'valtio'

function Counter() {
  const snap = useSnapshot(state)
  // state.count が変更された時のみ再レンダリング
  // state.text の変更では再レンダリングされません
  return <div>{snap.count}</div>
}
```

### 柔軟性

- **グローバル状態**: モジュールレベルで状態を定義
- **ローカル状態**: コンポーネント内で状態を作成
- **React外での使用**: `subscribe` を使ってReactコンポーネント外で状態の変更を監視
- **コンテキストとの統合**: Reactコンテキストと組み合わせて使用可能

### TypeScript完全サポート

Valtioは完全な型推論と型安全性を提供します:

```typescript
type State = {
  count: number
  text: string
}

const state = proxy<State>({ count: 0, text: 'hello' })

// TypeScriptが型をチェック
state.count = 'invalid' // エラー
```

## 基本的な使い方

### 1. インストール

```bash
npm install valtio
```

### 2. 状態の作成

```javascript
import { proxy } from 'valtio'

const state = proxy({
  count: 0,
  text: 'hello'
})
```

### 3. Reactで使用

```jsx
import { useSnapshot } from 'valtio'

function MyComponent() {
  const snap = useSnapshot(state)

  return (
    <div>
      <p>{snap.count}</p>
      <button onClick={() => state.count++}>
        Increment
      </button>
    </div>
  )
}
```

### 4. React外で使用

```javascript
import { subscribe } from 'valtio'

subscribe(state, () => {
  console.log('State changed:', state)
})

// どこからでも変更可能
state.count++
```

## Valtioに適したユースケース

- **中規模から大規模のアプリケーション**: シンプルさを保ちながらスケール可能
- **TypeScriptプロジェクト**: 優れた型推論と型安全性
- **パフォーマンスが重要な場面**: 自動最適化された再レンダリング
- **段階的な採用**: 既存のプロジェクトに少しずつ導入可能
- **React Native**: モバイルアプリケーションでも動作

## 次のステップ

- [Getting Started](./introduction/getting-started.md) - 実践的なTodoアプリの例で学ぶ
- [Basic API](../api/basic/proxy.md) - コアAPIの詳細
- [Guides](../guides/async.md) - 高度な使用パターン

Valtioは、シンプルさとパワーのバランスを取りながら、開発者に優れた体験を提供します。今すぐ始めて、プロキシステートがいかにシンプルかを体験してください！
