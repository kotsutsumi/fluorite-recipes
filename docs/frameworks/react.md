# React フレームワークドキュメント

React の包括的なドキュメントへようこそ。このドキュメントは、React を学習する開発者と、React コードを生成する LLM の両方に最適化されています。

---

## 📋 クイックアクセス

| セクション | 概要 | 対象者 | リンク |
|----------|------|--------|--------|
| **ドキュメント** | 学習とリファレンス | すべての開発者、LLM | [docs.md](./react/docs.md) |
| **Learn** | React の学習リソース | 初心者〜中級者 | [learn.md](./react/docs/learn.md) |
| **Reference** | 詳細な API リファレンス | 中級者〜上級者、LLM | [reference.md](./react/docs/reference.md) |

---

## React とは

React は、ユーザーインターフェースを構築するための JavaScript ライブラリです。コンポーネントベースのアーキテクチャにより、再利用可能で保守性の高い UI を作成できます。

### 主な特徴

- **コンポーネントベース**: UI を独立した再利用可能な部品に分割
- **宣言的**: UI の最終状態を記述し、React が効率的に更新
- **Learn Once, Write Anywhere**: Web、モバイル、デスクトップで動作
- **高性能**: Virtual DOM と差分レンダリングによる最適化
- **豊富なエコシステム**: 多数のライブラリとツール

### バージョン情報

このドキュメントは **React 19** に基づいています。

---

## ドキュメント構成

### 1. ドキュメントポータル ([docs.md](./react/docs.md))

すべての React ドキュメントへの入り口です。

**内容:**
- Learn セクションの概要
- Reference セクションの概要
- 学習パスの提案
- トピック別ガイド

**対象者:**
- React を初めて使う方
- ドキュメント全体の構造を知りたい方
- 適切な学習リソースを探している方

[ドキュメントポータルを見る →](./react/docs.md)

### 2. Learn セクション ([learn.md](./react/docs/learn.md))

React の基礎から応用まで、段階的に学習できるリソースです。

**主なトピック:**
- **はじめに**: インストール、クイックスタート
- **コンポーネント**: Props、条件分岐、リスト
- **インタラクティビティ**: イベント、State
- **State 管理**: Reducer、Context
- **脱出ハッチ**: Ref、Effect
- **高度なトピック**: カスタムフック、パフォーマンス

**学習の流れ:**
```
インストール
  ↓
クイックスタート
  ↓
コンポーネントの基礎
  ↓
State とイベント
  ↓
Effect と副作用
  ↓
高度なパターン
```

[Learn セクションを見る →](./react/docs/learn.md)

### 3. Reference セクション ([reference.md](./react/docs/reference.md))

React の詳細な API リファレンスです。すべてのフック、コンポーネント、API の完全な仕様が記載されています。

**主要カテゴリ:**

#### React パッケージ
- **フック (18+ API)**: useState、useEffect、useContext など
- **コンポーネント (6 API)**: Fragment、Suspense、StrictMode など
- **API (10+ API)**: createContext、lazy、memo など
- **レガシー (8 API)**: Component、createRef など

#### React DOM パッケージ
- **クライアント API**: createRoot、hydrateRoot
- **サーバ API**: renderToPipeableStream、renderToReadableStream
- **静的 API**: prerender、prerenderToNodeStream
- **フック**: useFormStatus
- **コンポーネント**: HTML/SVG 要素
- **トップレベル API**: createPortal、リソースプリロード

#### React のルール
- コンポーネントとフックを純粋に保つ
- React がコンポーネントとフックを呼び出す
- フックのルール

#### React Server Components
- サーバコンポーネント
- クライアントコンポーネント
- サーバ関数
- ディレクティブ

[Reference セクションを見る →](./react/docs/reference.md)

---

## 使用ガイド

### 開発者向け

#### 初心者の方

1. [docs.md](./react/docs.md) でドキュメント全体の構造を確認
2. [learn.md](./react/docs/learn.md) で基礎から学習
3. 実際にコードを書いて練習
4. [reference.md](./react/docs/reference.md) で API の詳細を確認

#### 経験者の方

1. [reference.md](./react/docs/reference.md) で必要な API を直接参照
2. 新機能は [learn.md](./react/docs/learn.md) で概念を理解
3. ベストプラクティスは React のルールを参照

### LLM 向け

#### コード生成時

1. **Reference セクションを優先**: 正確な API 仕様と使用例
2. **クイックリファレンステーブルを活用**: 素早く API を特定
3. **使用例を参考に**: 一般的なパターンを確認

#### 推奨される参照順序

```
1. reference.md - API の特定
2. react.md または react-dom.md - カテゴリ詳細
3. 個別 API ドキュメント - 完全な仕様
```

#### 注意事項

- **レガシー API を避ける**: 代替手段を使用
- **React 19 の変更を考慮**: 削除された API に注意
- **フックのルールを遵守**: 条件分岐やループ内で呼び出さない

---

## 主要トピック別ガイド

### State 管理

**Learn:**
- State の基礎
- State の構造化
- Reducer パターン
- Context による共有

**Reference:**
- [`useState`](./react/docs/reference/react/useState.md)
- [`useReducer`](./react/docs/reference/react/useReducer.md)
- [`createContext`](./react/docs/reference/react/createContext.md)
- [`useContext`](./react/docs/reference/react/useContext.md)

### 副作用管理

**Learn:**
- Effect の基本
- 依存関係の管理
- クリーンアップ
- カスタムフックへの抽出

**Reference:**
- [`useEffect`](./react/docs/reference/react/useEffect.md)
- [`useLayoutEffect`](./react/docs/reference/react/useLayoutEffect.md)
- [`useInsertionEffect`](./react/docs/reference/react/useInsertionEffect.md)

### パフォーマンス最適化

**Learn:**
- 最適化の必要性
- プロファイリング
- React Compiler

**Reference:**
- [`memo`](./react/docs/reference/react/memo.md)
- [`useMemo`](./react/docs/reference/react/useMemo.md)
- [`useCallback`](./react/docs/reference/react/useCallback.md)
- [`useTransition`](./react/docs/reference/react/useTransition.md)
- [`useDeferredValue`](./react/docs/reference/react/useDeferredValue.md)

### サーバサイドレンダリング

**Learn:**
- SSR の概念
- ハイドレーション
- フレームワーク統合

**Reference:**
- [クライアント API](./react/docs/reference/react-dom/client.md)
- [サーバ API](./react/docs/reference/react-dom/server.md)
- [静的 API](./react/docs/reference/react-dom/static.md)

### React Server Components

**Learn:**
- RSC の概念
- サーバとクライアントの分離
- データフェッチパターン

**Reference:**
- [RSC 概要](./react/docs/reference/rsc.md)
- [サーバコンポーネント](./react/docs/reference/rsc/server-components.md)
- [`'use client'`](./react/docs/reference/rsc/use-client.md)
- [`'use server'`](./react/docs/reference/rsc/use-server.md)

---

## クイックリファレンス

### よく使う API

| API | カテゴリ | 用途 | リンク |
|-----|---------|------|--------|
| `useState` | State | ローカル状態管理 | [詳細](./react/docs/reference/react/useState.md) |
| `useEffect` | Effect | 副作用の実行 | [詳細](./react/docs/reference/react/useEffect.md) |
| `useContext` | Context | グローバル状態アクセス | [詳細](./react/docs/reference/react/useContext.md) |
| `useRef` | Ref | DOM 参照、値の保持 | [詳細](./react/docs/reference/react/useRef.md) |
| `useMemo` | パフォーマンス | 計算のメモ化 | [詳細](./react/docs/reference/react/useMemo.md) |
| `useCallback` | パフォーマンス | 関数のメモ化 | [詳細](./react/docs/reference/react/useCallback.md) |
| `createRoot` | React DOM | クライアントレンダリング | [詳細](./react/docs/reference/react-dom/client.md) |
| `hydrateRoot` | React DOM | SSR ハイドレーション | [詳細](./react/docs/reference/react-dom/client.md) |

### React の基本パターン

#### コンポーネントの定義

```javascript
function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}
```

#### State の使用

```javascript
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```

#### Effect の使用

```javascript
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, [userId]);

  return <div>{user?.name}</div>;
}
```

#### Context の使用

```javascript
const ThemeContext = createContext('light');

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Page />
    </ThemeContext.Provider>
  );
}

function Page() {
  const theme = useContext(ThemeContext);
  return <div className={theme}>Content</div>;
}
```

---

## React のルール

### 重要なルール

1. **コンポーネントとフックを純粋に保つ**
   - レンダー中に外部の値を変更しない
   - 同じ入力には同じ出力を返す

2. **フックはトップレベルでのみ呼び出す**
   - ループ、条件分岐、ネストした関数内では呼び出さない
   - React 関数内でのみ呼び出す

3. **React がコンポーネントを呼び出す**
   - コンポーネントを直接関数として呼び出さない
   - JSX として使用する

[詳細なルール →](./react/docs/reference/rules.md)

---

## 最新情報

### React 19 の主な変更

- ✅ **新機能**: React Compiler、Activity、ViewTransition
- ✅ **改善**: Suspense、Server Components の安定化
- ✅ **削除**: findDOMNode、render、hydrate などの古い API
- ✅ **非推奨**: クラスコンポーネント関連の API

### 移行ガイド

**削除された API の代替:**

| 削除された API | 代替手段 |
|--------------|---------|
| `render` | `createRoot` |
| `hydrate` | `hydrateRoot` |
| `findDOMNode` | `ref` を使用 |
| `renderToNodeStream` | `renderToPipeableStream` |

---

## エコシステム

### フレームワーク

- **Next.js**: フルスタック React フレームワーク
- **Remix**: Web 標準ベースのフレームワーク
- **Gatsby**: 静的サイトジェネレータ
- **Expo**: React Native フレームワーク

### 状態管理

- **Redux**: グローバル状態管理
- **Zustand**: 軽量な状態管理
- **Jotai**: アトミックな状態管理
- **TanStack Query**: サーバ状態管理

### スタイリング

- **Tailwind CSS**: ユーティリティファーストCSS
- **CSS Modules**: スコープ付き CSS
- **Styled Components**: CSS-in-JS
- **Emotion**: パフォーマンス重視の CSS-in-JS

### テスト

- **Jest**: テストランナー
- **React Testing Library**: コンポーネントテスト
- **Playwright**: E2E テスト
- **Vitest**: 高速なテストランナー

---

## サポートとコミュニティ

### 質問がある場合

- **概念的な質問**: [Learn セクション](./react/docs/learn.md)
- **API の詳細**: [Reference セクション](./react/docs/reference.md)
- **バグ報告**: [React GitHub Issues](https://github.com/facebook/react/issues)
- **機能リクエスト**: [React RFC](https://github.com/reactjs/rfcs)

### コミュニティリソース

- **React Discord**: コミュニティサポート
- **Stack Overflow**: 技術的な質問
- **Twitter**: @reactjs
- **ブログ**: React 公式ブログ

---

## 次のステップ

### 学習を始める

1. [ドキュメントポータル](./react/docs.md) で全体像を把握
2. [Learn セクション](./react/docs/learn.md) で基礎から学習
3. [インストールガイド](./react/docs/learn/installation.md) で環境構築
4. [クイックスタート](./react/docs/learn/quick-start.md) で最初のアプリを作成

### API を探索する

1. [Reference セクション](./react/docs/reference.md) で API 一覧を確認
2. [React パッケージ](./react/docs/reference/react.md) でフックと API を学ぶ
3. [React DOM](./react/docs/reference/react-dom.md) で DOM 関連 API を学ぶ
4. [React Server Components](./react/docs/reference/rsc.md) で最新機能を学ぶ

### 実践する

1. 小さなプロジェクトを作成
2. コミュニティのコードを読む
3. オープンソースに貢献
4. ベストプラクティスを学ぶ

---

## ドキュメントの特徴

### 開発者フレンドリー

- ✅ 段階的な学習パス
- ✅ 実践的なコード例
- ✅ よくある間違いと解決策
- ✅ ベストプラクティス

### LLM フレンドリー

- ✅ 構造化された情報
- ✅ クイックリファレンステーブル
- ✅ 完全な API 仕様
- ✅ 使用例とパターン

### 最新の情報

- ✅ React 19 対応
- ✅ React Server Components
- ✅ React Compiler
- ✅ 最新のベストプラクティス

---

React の学習と開発を楽しんでください!

詳細なドキュメントは [docs.md](./react/docs.md) からアクセスできます。
