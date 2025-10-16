# Jotai ドキュメント

Jotai は、React のためのプリミティブで柔軟な状態管理ライブラリです。アトミックアプローチにより、ボトムアップで状態を構築します。このドキュメントは、Jotai の使い方、API、ベストプラクティスを網羅しています。

## 📚 ドキュメント構造

### 🚀 Introduction（はじめに）

- **[Overview](./jotai/docs.md)** - Jotaiの概要

### 🎯 Basics（基礎）

- **[Concepts](./jotai/docs/basics/concepts.md)** - Jotaiのコンセプト
- **[Comparison](./jotai/docs/basics/comparison.md)** - 他のライブラリとの比較
- **[Showcase](./jotai/docs/basics/showcase.md)** - デモとサンプル
- **[Functional Programming and Jotai](./jotai/docs/basics/functional-programming-and-jotai.md)** - 関数型プログラミングとJotai

### 🔧 Core API

- **[atom](./jotai/docs/core/atom.md)** - atomの作成
- **[useAtom](./jotai/docs/core/use-atom.md)** - atomを使用するフック
- **[Store](./jotai/docs/core/store.md)** - ストアAPI
- **[Provider](./jotai/docs/core/provider.md)** - Providerコンポーネント

### 🛠️ Utilities（ユーティリティ）

- **[storage](./jotai/docs/utilities/storage.md)** - localStorage/sessionStorage統合
- **[ssr](./jotai/docs/utilities/ssr.md)** - サーバーサイドレンダリング
- **[async](./jotai/docs/utilities/async.md)** - 非同期処理（loadable、unwrap、atomWithObservable）
- **[lazy](./jotai/docs/utilities/lazy.md)** - 遅延初期化
- **[resettable](./jotai/docs/utilities/resettable.md)** - リセット可能なatom
- **[family](./jotai/docs/utilities/family.md)** - atomファミリー

### 🔌 Extensions（拡張機能）

#### データフェッチング
- **[tRPC](./jotai/docs/extensions/trpc.md)** - tRPC統合
- **[Query](./jotai/docs/extensions/query.md)** - TanStack Query統合
- **[URQL](./jotai/docs/extensions/urql.md)** - URQL GraphQL統合

#### 状態管理
- **[Effect](./jotai/docs/extensions/effect.md)** - リアクティブな副作用
- **[Immer](./jotai/docs/extensions/immer.md)** - Immer統合
- **[XState](./jotai/docs/extensions/xstate.md)** - XStateステートマシン統合

#### その他
- **[Location](./jotai/docs/extensions/location.md)** - ブラウザ位置状態
- **[Cache](./jotai/docs/extensions/cache.md)** - キャッシング
- **[Scope](./jotai/docs/extensions/scope.md)** - atomのスコープ管理
- **[Optics](./jotai/docs/extensions/optics.md)** - レンズ操作

### 🧩 Third-party（サードパーティ）

- **[History](./jotai/docs/third-party/history.md)** - 履歴管理（undo/redo）
- **[Derive](./jotai/docs/third-party/derive.md)** - 派生atom（jotai-derive）
- **[Bunja](./jotai/docs/third-party/bunja.md)** - 状態ライフタイム管理

### 🔨 Tools（開発ツール）

- **[SWC](./jotai/docs/tools/swc.md)** - SWCプラグイン
- **[Babel](./jotai/docs/tools/babel.md)** - Babelプラグイン
- **[DevTools](./jotai/docs/tools/devtools.md)** - デバッグツール

### 📖 Guides（ガイド）

#### 移行とTypeScript
- **[Migrating to v2 API](./jotai/docs/guides/migrating-to-v2-api.md)** - v1からv2への移行
- **[TypeScript](./jotai/docs/guides/typescript.md)** - TypeScript ガイド

#### フレームワーク統合
- **[Next.js](./jotai/docs/guides/nextjs.md)** - Next.js統合
- **[Waku](./jotai/docs/guides/waku.md)** - Waku統合
- **[Remix](./jotai/docs/guides/remix.md)** - Remix統合
- **[React Native](./jotai/docs/guides/react-native.md)** - React Native統合

#### 開発とデバッグ
- **[Debugging](./jotai/docs/guides/debugging.md)** - デバッグ方法
- **[Performance](./jotai/docs/guides/performance.md)** - パフォーマンス最適化
- **[Testing](./jotai/docs/guides/testing.md)** - テスト

#### 高度なパターン
- **[Core Internals](./jotai/docs/guides/core-internals.md)** - 内部実装の理解
- **[Composing Atoms](./jotai/docs/guides/composing-atoms.md)** - atomの組み合わせ
- **[Atoms in Atom](./jotai/docs/guides/atoms-in-atom.md)** - atom内でatomを管理
- **[Initialize Atom on Render](./jotai/docs/guides/initialize-atom-on-render.md)** - レンダリング時のatom初期化
- **[Persistence](./jotai/docs/guides/persistence.md)** - 永続化戦略

### 🍳 Recipes（レシピ）

#### データ構造
- **[Large Objects](./jotai/docs/recipes/large-objects.md)** - 大きなオブジェクトの扱い

#### カスタムフック
- **[Custom useAtom Hooks](./jotai/docs/recipes/custom-useatom-hooks.md)** - カスタムuseAtomフック
- **[useAtomEffect](./jotai/docs/recipes/use-atom-effect.md)** - atom副作用フック
- **[useReducerAtom](./jotai/docs/recipes/use-reducer-atom.md)** - リデューサーパターン

#### カスタムAtom
- **[atomWithToggle](./jotai/docs/recipes/atom-with-toggle.md)** - トグル機能付きatom
- **[atomWithCompare](./jotai/docs/recipes/atom-with-compare.md)** - カスタム比較関数付きatom
- **[atomWithToggleAndStorage](./jotai/docs/recipes/atom-with-toggle-and-storage.md)** - トグル+永続化
- **[atomWithRefresh](./jotai/docs/recipes/atom-with-refresh.md)** - リフレッシュ機能付きatom
- **[atomWithRefreshAndDefault](./jotai/docs/recipes/atom-with-refresh-and-default.md)** - リフレッシュ+デフォルト値
- **[atomWithListeners](./jotai/docs/recipes/atom-with-listeners.md)** - リスナー機能付きatom
- **[atomWithBroadcast](./jotai/docs/recipes/atom-with-broadcast.md)** - BroadcastChannel統合
- **[atomWithDebounce](./jotai/docs/recipes/atom-with-debounce.md)** - デバウンス機能付きatom

## 🎯 主な特徴

1. **プリミティブ**: 最小限のAPIで最大限の柔軟性
2. **アトミック**: ボトムアップでアプリケーションの状態を構築
3. **TypeScript**: 完全な型推論
4. **非同期対応**: Promise、Suspenseをネイティブサポート
5. **スケーラブル**: 小規模から大規模まで対応
6. **React統合**: Reactのベストプラクティスに準拠

## 📝 クイックスタート

```typescript
import { atom, useAtom } from 'jotai'

// atomを作成
const countAtom = atom(0)

// コンポーネントで使用
function Counter() {
  const [count, setCount] = useAtom(countAtom)
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
    </div>
  )
}

// 派生atomの作成
const doubleCountAtom = atom((get) => get(countAtom) * 2)

function DoubleCounter() {
  const [doubleCount] = useAtom(doubleCountAtom)
  return <p>Double: {doubleCount}</p>
}
```

## 🔗 関連リンク

- 公式サイト: https://jotai.org/
- GitHub: https://github.com/pmndrs/jotai
- npm: https://www.npmjs.com/package/jotai

## 💡 LLM向けの参照ガイド

このドキュメント群を参照する際は、以下のように目的別に参照してください：

- **初学者**: `docs.md` → `basics/concepts.md` → `core/atom.md` → `core/use-atom.md`
- **基本的な使用**: `core/atom.md` → `core/use-atom.md`
- **TypeScript**: `guides/typescript.md`
- **非同期処理**: `utilities/async.md`
- **永続化**: `utilities/storage.md` → `guides/persistence.md`
- **SSR/Next.js**: `utilities/ssr.md` → `guides/nextjs.md`
- **パフォーマンス**: `guides/performance.md`
- **デバッグ**: `guides/debugging.md` → `tools/devtools.md`
- **テスト**: `guides/testing.md`
- **高度なパターン**: `guides/composing-atoms.md` → `guides/atoms-in-atom.md`
- **データフェッチング**: `extensions/query.md`（TanStack Query）、`extensions/trpc.md`
- **状態機械**: `extensions/xstate.md`
- **内部実装**: `guides/core-internals.md`
- **移行**: `guides/migrating-to-v2-api.md`

全60ページのドキュメントが日本語で利用可能です。
