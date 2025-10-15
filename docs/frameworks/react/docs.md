# React ドキュメント

React の包括的なドキュメントです。学習リソースと詳細なリファレンスを提供しています。

---

## 📋 クイックナビゲーション

| セクション | 概要 | 対象者 | 詳細リンク |
|----------|------|--------|-----------|
| **Learn** | React の学習リソース | 初心者〜中級者 | [learn.md](./docs/learn.md) |
| **Reference** | 詳細な API リファレンス | 中級者〜上級者、LLM | [reference.md](./docs/reference.md) |

---

## 1. Learn - React を学ぶ

React の基礎から応用まで、段階的に学習できるリソースです。

### 対象者

- React を初めて学ぶ方
- React の基本概念を理解したい方
- 実践的なパターンを学びたい方

### 主な学習トピック

#### はじめに

- **インストール**: React プロジェクトのセットアップ
- **クイックスタート**: 最初の React アプリを作成
- **React の流儀**: React の考え方を理解

#### React の基礎

1. **コンポーネント**
   - コンポーネントの作成
   - Props による データの受け渡し
   - 条件付きレンダリング
   - リストのレンダリング

2. **インタラクティビティ**
   - イベント処理
   - State の追加
   - レンダーとコミット
   - State as a Snapshot

3. **State の管理**
   - State の構造選択
   - コンポーネント間での State 共有
   - State の保持とリセット
   - Reducer による State 抽出

4. **脱出ハッチ**
   - Ref による値の参照
   - Ref による DOM 操作
   - Effect による同期
   - Effect の依存関係

#### 高度なトピック

- **Context** による深いデータ受け渡し
- **カスタムフック** によるロジックの再利用
- **パフォーマンス最適化**
- **React Compiler** による自動最適化

### 学習の進め方

```
1. インストール → 環境セットアップ
2. クイックスタート → 基本概念の理解
3. コンポーネント → UI の構築方法
4. State とイベント → インタラクティビティの追加
5. Effect → 副作用の管理
6. 高度なパターン → 実践的なテクニック
```

[Learn セクションの詳細 →](./docs/learn.md)

---

## 2. Reference - API リファレンス

React の詳細な API ドキュメントです。すべての関数、フック、コンポーネントの仕様が記載されています。

### 対象者

- 特定の API の詳細を知りたい方
- React の内部動作を理解したい方
- LLM が React コードを生成する際の参照用

### リファレンスの構成

#### React パッケージ

**フック (18+ API)**
- State: `useState`, `useReducer`
- Context: `useContext`
- Ref: `useRef`, `useImperativeHandle`
- Effect: `useEffect`, `useLayoutEffect`, `useInsertionEffect`
- パフォーマンス: `useMemo`, `useCallback`, `useTransition`, `useDeferredValue`
- リソース: `use`
- その他: `useDebugValue`, `useId`, `useSyncExternalStore`
- サーバ: `useActionState`, `useOptimistic`

**コンポーネント (6 API)**
- `<Fragment>`, `<Profiler>`, `<Suspense>`
- `<StrictMode>`, `<Activity>`, `<ViewTransition>`

**API (10+ API)**
- `createContext`, `lazy`, `memo`, `startTransition`
- `cache`, `use`, `act`
- セキュリティ: `experimental_taintObjectReference`, `experimental_taintUniqueValue`

**レガシー (8 API)**
- `Children`, `cloneElement`, `Component`, `createElement`
- `createRef`, `forwardRef`, `isValidElement`, `PureComponent`

#### React DOM パッケージ

**クライアント API**
- `createRoot` - CSR 用
- `hydrateRoot` - SSR 用

**サーバ API**
- ストリーミング: `renderToPipeableStream`, `renderToReadableStream`
- レガシー: `renderToString`, `renderToStaticMarkup`

**静的 API**
- `prerender`, `prerenderToNodeStream`

**フック**
- `useFormStatus`

**コンポーネント**
- フォーム: `<input>`, `<select>`, `<textarea>`, `<form>`
- リソース: `<link>`, `<meta>`, `<script>`, `<style>`, `<title>`
- HTML/SVG: すべての標準要素

**トップレベル API**
- DOM: `createPortal`, `flushSync`
- リソース: `preconnect`, `prefetchDNS`, `preload`, `preloadModule`, `preinit`, `preinitModule`

#### React のルール

- コンポーネントとフックを純粋に保つ
- React がコンポーネントとフックを呼び出す
- フックのルール

#### React Server Components

- サーバコンポーネント
- クライアントコンポーネント (`'use client'`)
- サーバ関数 (`'use server'`)
- ディレクティブ

[Reference セクションの詳細 →](./docs/reference.md)

---

## 使用ガイド

### Learn と Reference の使い分け

| 状況 | 使用するセクション | 理由 |
|------|------------------|------|
| React を初めて学ぶ | Learn | 段階的な学習に最適 |
| 特定の API の詳細を知りたい | Reference | 完全な仕様と使用例 |
| コンポーネントの設計方法を学ぶ | Learn | パターンとベストプラクティス |
| フックの正確な動作を確認 | Reference | 詳細な動作説明 |
| プロジェクトのセットアップ | Learn | 環境構築ガイド |
| エラーのトラブルシューティング | Reference | API の詳細と制約 |
| LLM がコードを生成 | Reference | 正確な API 仕様 |

### 学習パス

#### 初心者向け

```
1. Learn: インストール
   ↓
2. Learn: クイックスタート
   ↓
3. Learn: コンポーネントとProps
   ↓
4. Learn: State とイベント
   ↓
5. Reference: useState, useEffect (詳細確認)
```

#### 中級者向け

```
1. Learn: State の管理パターン
   ↓
2. Learn: Context と Reducer
   ↓
3. Learn: カスタムフック
   ↓
4. Reference: useReducer, useContext (詳細確認)
   ↓
5. Learn: パフォーマンス最適化
```

#### 上級者向け

```
1. Reference: 全 API の理解
   ↓
2. Learn: React Compiler
   ↓
3. Reference: React Server Components
   ↓
4. Reference: React のルール (深い理解)
```

---

## トピック別ガイド

### State 管理

#### 学習リソース (Learn)
- State の選択と構造化
- コンポーネント間での共有
- Reducer への抽出
- Context による深い受け渡し

#### API リファレンス (Reference)
- `useState` - シンプルな state
- `useReducer` - 複雑な state ロジック
- `createContext` + `useContext` - グローバル state
- `useOptimistic` - 楽観的更新

### 副作用とライフサイクル

#### 学習リソース (Learn)
- Effect が必要な場合
- Effect の依存関係
- Effect が不要な場合
- カスタムフックへの抽出

#### API リファレンス (Reference)
- `useEffect` - 基本的な副作用
- `useLayoutEffect` - レイアウト測定
- `useInsertionEffect` - CSS-in-JS
- クリーンアップ関数の仕様

### パフォーマンス最適化

#### 学習リソース (Learn)
- 最適化が必要な場合
- プロファイリング方法
- 一般的なパターン
- React Compiler の活用

#### API リファレンス (Reference)
- `memo` - コンポーネントメモ化
- `useMemo` - 計算のメモ化
- `useCallback` - 関数のメモ化
- `useTransition` - 非ブロッキング更新
- `useDeferredValue` - 値の遅延

### サーバサイドレンダリング

#### 学習リソース (Learn)
- SSR の基本概念
- フレームワークとの統合
- ハイドレーションの理解

#### API リファレンス (Reference)
- クライアント: `createRoot`, `hydrateRoot`
- サーバ: `renderToPipeableStream`, `renderToReadableStream`
- 静的: `prerender`, `prerenderToNodeStream`
- トラブルシューティング

### React Server Components

#### 学習リソース (Learn)
- RSC の概念
- サーバとクライアントの分離
- データフェッチパターン

#### API リファレンス (Reference)
- サーバコンポーネント
- `'use client'` ディレクティブ
- `'use server'` ディレクティブ
- セキュリティベストプラクティス

---

## よくある質問

### Q1: どちらから始めればよいですか?

**A:** React が初めての場合は **Learn** から始めてください。基本概念を理解してから Reference で詳細を確認するのが効率的です。

### Q2: Reference だけで学習できますか?

**A:** Reference は API の仕様書なので、Learn で概念を学んでから使用することを推奨します。ただし、経験者は Reference から始めても問題ありません。

### Q3: どのようにドキュメントを検索すればよいですか?

**A:**
- **概念を学ぶ**: Learn セクションで検索
- **API 名が分かっている**: Reference セクションで直接参照
- **エラーメッセージから**: Reference で該当 API を確認

### Q4: LLM がコードを生成する際はどちらを参照しますか?

**A:** **Reference** を参照してください。正確な API 仕様、パラメータ、返り値、使用例が記載されています。

### Q5: フレームワークを使用する場合もこのドキュメントは必要ですか?

**A:** はい。Next.js、Remix などのフレームワークは React 上に構築されているため、React の基本概念と API の理解が重要です。

---

## ドキュメントの特徴

### Learn セクションの特徴

✅ **段階的な学習**
- 基礎から応用まで順序立てて学習
- 実践的なコード例
- インタラクティブなデモ

✅ **コンセプト重視**
- React の考え方を理解
- デザインパターン
- ベストプラクティス

✅ **初心者フレンドリー**
- 分かりやすい説明
- 豊富な図解
- よくある間違いと解決策

### Reference セクションの特徴

✅ **完全な API 仕様**
- すべてのパラメータ
- 返り値の型
- 詳細な動作説明

✅ **LLM フレンドリー**
- 構造化された情報
- クイックリファレンステーブル
- 明確なカテゴリ分け

✅ **実用的な例**
- 一般的な使用パターン
- エッジケース
- トラブルシューティング

---

## ドキュメントの更新

このドキュメントは React の最新バージョン (React 19) に基づいています。

### 最近の変更

- ✅ React 19 の新機能を反映
- ✅ React Server Components の詳細追加
- ✅ React Compiler のドキュメント追加
- ✅ 削除された API の代替手段を明記

### 注意事項

- **レガシー API**: 非推奨の API には代替手段が記載されています
- **実験的機能**: 実験的な API には明示的に記載されています
- **フレームワーク統合**: 多くの API はフレームワークが自動処理します

---

## 関連リソース

### 公式リソース

- **React 公式サイト**: https://react.dev
- **React GitHub**: https://github.com/facebook/react
- **React RFC**: https://github.com/reactjs/rfcs

### フレームワーク

- **Next.js**: https://nextjs.org
- **Remix**: https://remix.run
- **Gatsby**: https://www.gatsbyjs.com

### ツール

- **Create React App**: クイックスタート
- **Vite**: 高速な開発環境
- **React DevTools**: デバッグツール
- **ESLint Plugin**: コード品質チェック

### コミュニティ

- **React Discord**: コミュニティサポート
- **Stack Overflow**: 技術的な質問
- **GitHub Discussions**: フィードバックと議論

---

## 次のステップ

### 学習を始める

1. [Learn セクション](./docs/learn.md) - React の基礎から学ぶ
2. [インストール](./docs/learn/installation.md) - 環境をセットアップ
3. [クイックスタート](./docs/learn/quick-start.md) - 最初のアプリを作成

### API を参照する

1. [Reference セクション](./docs/reference.md) - API リファレンス
2. [React パッケージ](./docs/reference/react.md) - フックと API
3. [React DOM](./docs/reference/react-dom.md) - DOM 関連 API

### 実践する

1. チュートリアルを完了する
2. 小さなプロジェクトを作成する
3. 公式ドキュメントを読み返す
4. コミュニティに参加する

---

## サポート

### 質問がある場合

- **概念的な質問**: Learn セクションを参照
- **API の詳細**: Reference セクションを参照
- **バグ報告**: React GitHub Issues
- **機能リクエスト**: React RFC

### ドキュメントの改善

このドキュメントへのフィードバックや改善提案は歓迎します。不明な点や誤りを見つけた場合は、Issue を作成してください。

---

React の学習と開発を楽しんでください!
