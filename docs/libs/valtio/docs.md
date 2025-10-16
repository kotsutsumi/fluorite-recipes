# Valtio ドキュメント

## 概要

Valtioは「プロキシステートをシンプルに」するReactおよびバニラJavaScript向けの状態管理ライブラリです。最小限で柔軟、そして少し魔法のようなAPIを提供し、JavaScriptプロキシを使用して任意のオブジェクトをリアクティブにします。

## 主な機能

- 最小限で柔軟なAPI
- 直接的な状態の変更が可能
- きめ細かいサブスクリプションとリアクティビティ
- ReactとバニラJavaScriptで動作
- React 18、React 19、Suspenseと互換性あり
- 最適化されたレンダリング

## コアAPI

### 基本

1. **proxy**
   - オブジェクトをリアクティブなプロキシに変換
   - ネストされたオブジェクトの変更を追跡
   - 変更時にリスナーに通知

2. **useSnapshot**
   - Reactコンポーネントでのリアクティブなレンダリング
   - アクセスされたプロパティのみを追跡
   - 特定のプロパティが更新された時のみ再レンダリング

### 高度な機能

1. **subscribe**
   - 状態全体または特定のキーへのサブスクリプション
   - モジュールレベルでの状態変更の監視
   - ローカルストレージへの永続化などに使用可能

2. **ref**
   - 追跡されないオブジェクトを保持
   - 特殊なオブジェクト（DOM要素、Reactコンポーネントなど）の保存

3. **snapshot**
   - プロキシ状態の不変なスナップショットを作成
   - デバッグやテストに便利

### ユーティリティ

- **subscribeKey**: 特定のキーの変更をサブスクライブ
- **watch**: より柔軟な状態の監視
- **derive**: 派生状態の作成
- **devtools**: Redux DevToolsとの統合
- **proxyWithHistory**: 履歴機能付きプロキシ
- **proxyMap**: Mapオブジェクト用のプロキシ
- **proxySet**: Setオブジェクト用のプロキシ
- **unstable_deepProxy**: 深いプロキシ化

## ガイドとHow-To

### ガイド

- **async**: プロミスと非同期状態の処理
- **component-state**: コンポーネントレベルでの状態管理

### How-Tos

- 再レンダリングを手動で回避する方法
- アプリケーションのどこからでも状態に簡単にアクセスする方法
- アクションを整理する方法
- 状態を永続化する方法
- 状態をリセットする方法

## リソース

- **Community**: コミュニティリソースとプロジェクト
- **Learn**: 学習リソースとチュートリアル
- **Libraries**: Valtioの機能を拡張するコミュニティライブラリ

## ユニークなアプローチ

Valtioは、JavaScriptプロキシを活用してシンプルで直感的な状態管理を実現します。グローバル状態からコンポーネントローカル状態まで、様々なユースケースに対応できる柔軟性を持ちながら、最小限のボイラープレートで動作します。

## インストール

```bash
npm install valtio
```

## 基本的な使用例

```typescript
import { proxy, useSnapshot } from 'valtio'

// 状態の作成
const state = proxy({ count: 0, text: 'hello' })

// Reactコンポーネントでの使用
function Counter() {
  const snap = useSnapshot(state)
  return (
    <div>
      <p>{snap.count}</p>
      <button onClick={() => state.count++}>+1</button>
    </div>
  )
}
```

このドキュメントは、Reactアプリケーションでシンプルかつ強力な状態管理を実装したい開発者向けに包括的なガイダンスを提供します。
