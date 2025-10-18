# Zustand ドキュメント

Zustand は、シンプルで軽量な React 向けの状態管理ライブラリです。このドキュメントは、Zustand の使い方、API、ベストプラクティスを網羅しています。

## 📚 ドキュメント構造

### 🚀 Getting Started（はじめに）

- **[Introduction & Installation](./zustand/docs.md)** - Zustandの概要とインストール方法
- **[Comparison](./zustand/docs/getting-started/comparison.md)** - Redux、Valtio、Jotai、Recoilとの比較

### 📖 Guides（ガイド）

#### 基礎
- **[Tutorial: Tic-Tac-Toe](./zustand/docs/guides/tutorial-tic-tac-toe.md)** - 三目並べゲームで学ぶZustand入門
- **[Updating State](./zustand/docs/guides/updating-state.md)** - 状態の更新方法
- **[Immutable State and Merging](./zustand/docs/guides/immutable-state-and-merging.md)** - 不変な状態とマージ

#### パターンとベストプラクティス
- **[Flux Inspired Practice](./zustand/docs/guides/flux-inspired-practice.md)** - Fluxにインスパイアされたプラクティス
- **[Auto-generating Selectors](./zustand/docs/guides/auto-generating-selectors.md)** - セレクターの自動生成
- **[Practice with No Store Actions](./zustand/docs/guides/practice-with-no-store-actions.md)** - ストア外でのアクション定義
- **[Slices Pattern](./zustand/docs/guides/slices-pattern.md)** - スライスパターン

#### 開発環境
- **[TypeScript](./zustand/docs/guides/typescript.md)** - TypeScript ガイド
- **[Testing](./zustand/docs/guides/testing.md)** - テスト

#### パフォーマンス最適化
- **[Prevent Rerenders with useShallow](./zustand/docs/guides/prevent-rerenders-with-use-shallow.md)** - useShallowで再レンダリングを防ぐ
- **[Event Handler in Pre-React 18](./zustand/docs/guides/event-handler-in-pre-react-18.md)** - React 18以前でのイベントハンドラ外でのアクション呼び出し

#### データ構造
- **[Maps and Sets Usage](./zustand/docs/guides/maps-and-sets-usage.md)** - MapとSetの使用方法

#### 高度な使い方
- **[Connect to State with URL Hash](./zustand/docs/guides/connect-to-state-with-url-hash.md)** - URLで状態に接続する
- **[How to Reset State](./zustand/docs/guides/how-to-reset-state.md)** - 状態をリセットする方法
- **[Initialize State with Props](./zustand/docs/guides/initialize-state-with-props.md)** - propsで状態を初期化する

#### フレームワーク統合
- **[SSR and Hydration](./zustand/docs/guides/ssr-and-hydration.md)** - サーバーサイドレンダリングとハイドレーション
- **[Next.js](./zustand/docs/guides/nextjs.md)** - Next.js統合ガイド

### 🔌 Integrations（統合）

- **[Immer Middleware](./zustand/docs/integrations/immer-middleware.md)** - Immerミドルウェアの使用
- **[Persisting Store Data](./zustand/docs/integrations/persisting-store-data.md)** - ストアデータの永続化
- **[Third-party Libraries](./zustand/docs/integrations/third-party-libraries.md)** - サードパーティライブラリ

### 🔧 APIs

- **[create](./zustand/docs/apis/create.md)** - メインのcreate関数
- **[createStore](./zustand/docs/apis/create-store.md)** - vanillaストアの作成
- **[createWithEqualityFn](./zustand/docs/apis/create-with-equality-fn.md)** - カスタム等価性関数付きストアの作成
- **[shallow](./zustand/docs/apis/shallow.md)** - 浅い比較関数

### 🪝 Hooks

- **[useStore](./zustand/docs/hooks/use-store.md)** - vanillaストアをReactで使用
- **[useStoreWithEqualityFn](./zustand/docs/hooks/use-store-with-equality-fn.md)** - カスタム等価性チェック付きuseStore
- **[useShallow](./zustand/docs/hooks/use-shallow.md)** - 浅い比較でメモ化

### ⚙️ Middlewares（ミドルウェア）

- **[combine](./zustand/docs/middlewares/combine.md)** - 複数のストアスライスを結合
- **[devtools](./zustand/docs/middlewares/devtools.md)** - Redux DevTools統合
- **[immer](./zustand/docs/middlewares/immer.md)** - Immer統合
- **[persist](./zustand/docs/middlewares/persist.md)** - 状態の永続化
- **[redux](./zustand/docs/middlewares/redux.md)** - Redux風のアクションとリデューサー
- **[subscribeWithSelector](./zustand/docs/middlewares/subscribe-with-selector.md)** - セレクター付きサブスクリプション

### 🔄 Migrations（移行ガイド）

- **[Migrating to v4](./zustand/docs/migrations/migrating-to-v4.md)** - v3からv4への移行
- **[Migrating to v5](./zustand/docs/migrations/migrating-to-v5.md)** - v4からv5への移行

### 📜 Previous Versions（旧バージョン）

- **[Zustand v3 createContext](./zustand/docs/previous-versions/zustand-v3-create-context.md)** - v3のcreateContext（非推奨）

## 🎯 主な特徴

1. **シンプルなAPI**: 最小限のボイラープレートで状態管理
2. **React統合**: フック ベースのシンプルな統合
3. **TypeScript対応**: 完全な型安全性
4. **ミドルウェアサポート**: persist、devtools、immerなど
5. **パフォーマンス**: 効率的な再レンダリング制御
6. **フレームワーク対応**: Next.js、SSRをサポート

## 📝 クイックスタート

```typescript
import { create } from 'zustand'

interface BearState {
  bears: number
  increase: () => void
}

const useBearStore = create<BearState>((set) => ({
  bears: 0,
  increase: () => set((state) => ({ bears: state.bears + 1 })),
}))

function BearCounter() {
  const bears = useBearStore((state) => state.bears)
  return <h1>{bears} around here...</h1>
}

function Controls() {
  const increase = useBearStore((state) => state.increase)
  return <button onClick={increase}>one up</button>
}
```

## 🔗 関連リンク

- 公式サイト: https://zustand.docs.pmnd.rs/
- GitHub: https://github.com/pmndrs/zustand
- npm: https://www.npmjs.com/package/zustand

## 💡 LLM向けの参照ガイド

このドキュメント群を参照する際は、以下のように目的別に参照してください：

- **初学者**: `docs.md` → `tutorial-tic-tac-toe.md` → `typescript.md`
- **状態更新**: `updating-state.md` → `immutable-state-and-merging.md`
- **パフォーマンス**: `prevent-rerenders-with-use-shallow.md` → `auto-generating-selectors.md`
- **永続化**: `integrations/persisting-store-data.md` → `middlewares/persist.md`
- **Next.js統合**: `guides/nextjs.md` → `guides/ssr-and-hydration.md`
- **テスト**: `guides/testing.md`
- **移行**: `migrations/migrating-to-v5.md`（最新版）

全40ページのドキュメントが日本語で利用可能です。
