# Valtio ドキュメント

Valtio は、プロキシベースのシンプルで強力な React 向けの状態管理ライブラリです。このドキュメントは、Valtio の使い方、API、ベストプラクティスを網羅しています。

## 📚 ドキュメント構造

### 🚀 Introduction（はじめに）

- **[Overview](./valtio/docs.md)** - Valtioの概要
- **[Introduction](./valtio/docs/introduction.md)** - Valtioの紹介と特徴
- **[Getting Started](./valtio/docs/introduction/getting-started.md)** - クイックスタートガイド

### 🔧 API

#### Basic（基本API）
- **[proxy](./valtio/docs/api/basic/proxy.md)** - プロキシの作成
- **[useSnapshot](./valtio/docs/api/basic/useSnapshot.md)** - スナップショットフックの使用

#### Advanced（高度なAPI）
- **[ref](./valtio/docs/api/advanced/ref.md)** - 参照オブジェクトの作成
- **[snapshot](./valtio/docs/api/advanced/snapshot.md)** - スナップショットの取得
- **[subscribe](./valtio/docs/api/advanced/subscribe.md)** - 変更のサブスクライブ

#### Utils（ユーティリティ）
- **[derive](./valtio/docs/api/utils/derive.md)** - 派生プロキシの作成
- **[devtools](./valtio/docs/api/utils/devtools.md)** - Redux DevTools統合
- **[proxyMap](./valtio/docs/api/utils/proxyMap.md)** - Mapプロキシの作成
- **[proxySet](./valtio/docs/api/utils/proxySet.md)** - Setプロキシの作成
- **[proxyWithHistory](./valtio/docs/api/utils/proxyWithHistory.md)** - 履歴機能付きプロキシ
- **[subscribeKey](./valtio/docs/api/utils/subscribeKey.md)** - キー単位のサブスクライブ
- **[unstable_deepProxy](./valtio/docs/api/utils/unstable_deepProxy.md)** - 深いプロキシ（実験的）
- **[watch](./valtio/docs/api/utils/watch.md)** - プロキシの監視

#### Hacks（内部API）
- **[getVersion](./valtio/docs/api/hacks/getVersion.md)** - バージョン番号の取得
- **[internals](./valtio/docs/api/hacks/internals.md)** - 内部API（上級者向け）

### 📖 Guides（ガイド）

- **[Async](./valtio/docs/guides/async.md)** - 非同期処理とPromise、Suspenseの使用
- **[Component State](./valtio/docs/guides/component-state.md)** - コンポーネント単位の状態管理
- **[Computed Properties](./valtio/docs/guides/computed-properties.md)** - 計算プロパティの使用
- **[Migrating to v2](./valtio/docs/guides/migrating-to-v2.md)** - v1からv2への移行

### 💡 How-tos（ハウツー）

- **[How to Avoid Rerenders Manually](./valtio/docs/how-tos/how-to-avoid-rerenders-manually.md)** - 手動で再レンダリングを回避する方法
- **[How to Easily Access the State from Anywhere](./valtio/docs/how-tos/how-to-easily-access-the-state-from-anywhere-in-the-application.md)** - アプリケーションのどこからでも状態にアクセス
- **[How to Organize Actions](./valtio/docs/how-tos/how-to-organize-actions.md)** - アクションの整理方法
- **[How to Persist States](./valtio/docs/how-tos/how-to-persist-states.md)** - 状態の永続化
- **[How to Reset State](./valtio/docs/how-tos/how-to-reset-state.md)** - 状態のリセット方法
- **[How to Split and Compose States](./valtio/docs/how-tos/how-to-split-and-compose-states.md)** - 状態の分割と合成
- **[How to Use with Context](./valtio/docs/how-tos/how-to-use-with-context.md)** - React Contextとの併用
- **[How Valtio Works](./valtio/docs/how-tos/how-valtio-works.md)** - Valtioの仕組み
- **[Some Gotchas](./valtio/docs/how-tos/some-gotchas.md)** - よくある落とし穴と注意点

### 📚 Resources（リソース）

- **[Community](./valtio/docs/resources/community.md)** - コミュニティリソース
- **[Learn](./valtio/docs/resources/learn.md)** - 学習リソース
- **[Libraries](./valtio/docs/resources/libraries.md)** - サードパーティライブラリ

## 🎯 主な特徴

1. **プロキシベース**: ES6 Proxyを使用した直感的な状態更新
2. **ミュータブル**: 直接変更可能なシンプルなAPI
3. **自動最適化**: 使用した部分だけを追跡して効率的な再レンダリング
4. **TypeScript対応**: 完全な型安全性
5. **軽量**: 最小限のバンドルサイズ
6. **柔軟性**: VanillaJS、React、その他のフレームワークで使用可能

## 📝 クイックスタート

```typescript
import { proxy, useSnapshot } from 'valtio'

// ステートを作成
const state = proxy({ count: 0 })

// コンポーネントで使用
function Counter() {
  const snap = useSnapshot(state)
  return (
    <div>
      <p>Count: {snap.count}</p>
      <button onClick={() => state.count++}>Increment</button>
    </div>
  )
}

// Reactの外でも直接変更可能
state.count++
```

## 🔗 関連リンク

- 公式サイト: https://valtio.pmnd.rs/
- GitHub: https://github.com/pmndrs/valtio
- npm: https://www.npmjs.com/package/valtio

## 💡 LLM向けの参照ガイド

このドキュメント群を参照する際は、以下のように目的別に参照してください：

- **初学者**: `introduction.md` → `introduction/getting-started.md` → `api/basic/proxy.md`
- **基本的な使用**: `api/basic/proxy.md` → `api/basic/useSnapshot.md`
- **非同期処理**: `guides/async.md`
- **計算プロパティ**: `guides/computed-properties.md`
- **パフォーマンス**: `how-tos/how-to-avoid-rerenders-manually.md`
- **永続化**: `how-tos/how-to-persist-states.md`
- **コンポーネント状態**: `guides/component-state.md` → `how-tos/how-to-use-with-context.md`
- **内部の仕組み**: `how-tos/how-valtio-works.md`
- **トラブルシューティング**: `how-tos/some-gotchas.md`
- **移行**: `guides/migrating-to-v2.md`

全34ページのドキュメントが日本語で利用可能です。
