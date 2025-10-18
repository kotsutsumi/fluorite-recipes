# Jotai ドキュメント

## 概要

Jotaiは「Primitiveで柔軟なReact状態管理ライブラリ」であり、最小限のコアAPI（2kb）で、シンプルな状態管理から複雑な状態管理までスケールします。

## 主な機能

- 最小限のコアAPI
- TypeScript指向
- 様々なReactフレームワークで動作
- Next.js、Waku、Remix、React Nativeをサポート

## コアエクスポート

### 主なカテゴリ

1. Core
   - `atom`
   - `useAtom`
   - `Store`
   - `Provider`

2. Utilities
   - Storage
   - SSR
   - Async
   - Lazy
   - Resettable
   - Family

3. Extensions
   - tRPC
   - Query
   - URQL
   - Effect
   - Immer
   - XState
   - Location
   - Cache
   - Scope
   - Optics

## ガイドとレシピ

以下のようなトピックをカバーしています:

- TypeScript統合
- フレームワーク固有の実装
- パフォーマンス
- テスト
- 永続化
- 高度な状態管理パターン

## ツール

- SWCコンパイラプラグイン
- Babelプラグイン
- デバッグ用のDevtools

## ユニークなアプローチ

Jotaiは「グローバルなReact状態管理へのアトミックなアプローチ」を採用しており、シンプルな要件から複雑な要件まで対応できます。

このドキュメントは、Reactアプリケーションで柔軟な状態管理を実装したい開発者向けに包括的なガイダンスを提供します。
