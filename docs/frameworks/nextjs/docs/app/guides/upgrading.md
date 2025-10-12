# Next.js アップグレードガイド

Next.js の新しいバージョンへのスムーズなアップグレードをサポートする包括的なガイドです。バージョン間の変更点と移行方法を詳しく説明します。

## アップグレードガイド一覧

### 1. [Codemods](./upgrading/01-codemods.md)

**対象**: 全バージョンのアップグレード時

API の更新や非推奨機能に対応するプログラム的なコード変換ツールです。手動介入なしで大規模なコード変更を自動化できます。

**主な機能**:

- 自動コード変換によるアップグレード支援
- React 19 対応の変換
- 非同期 API への移行
- インポート文の自動修正
- 非推奨機能の置換

**基本使用方法**:

```bash
npx @next/codemod <transform> <path>
```

**主要な変換**:

- **React 19 移行**: `useFormState` → `useActionState`
- **非同期 Request API**: `cookies()`, `headers()` の非同期化
- **Image インポート**: `next/server` → `next/og`
- **フォントインポート**: `@next/font` → `next/font`
- **Link コンポーネント**: `<a>` タグの削除

---

### 2. [Version 14 へのアップグレード](./upgrading/02-version-14.md)

**対象**: Next.js 13.x から 14.x への移行

安定性とパフォーマンスが向上したメジャーバージョンアップです。主要な API 変更と新機能を活用できます。

**主な変更点**:

- **Node.js 最小バージョン**: 18.17 以上が必須
- **`next export` 削除**: `output: 'export'` 設定に移行
- **ImageResponse インポート変更**: `next/server` → `next/og`
- **フォントパッケージ統合**: `@next/font` → `next/font`
- **WASM ターゲット削除**: 内部最適化

**アップグレード手順**:

```bash
# 依存関係の更新
npm i next@14 react@latest react-dom@latest
npm i eslint-config-next@14 -D

# TypeScript 型定義の更新
npm i @types/react@latest @types/react-dom@latest -D

# 自動変換の実行
npx @next/codemod@latest next-og-import .
npx @next/codemod@latest built-in-next-font .
```

**設定変更例**:

```javascript
// next.config.js
const nextConfig = {
  output: "export", // next export の代替
};
```

---

### 3. [Version 15 へのアップグレード](./upgrading/03-version-15.md)

**対象**: Next.js 14.x から 15.x への移行

React 19 への対応と非同期 API の導入により、より現代的な開発体験を提供します。

**主な変更点**:

- **React 19 必須**: 最新の React 機能を活用
- **非同期 Request API**: `cookies()`, `headers()`, `params`, `searchParams` が非同期化
- **fetch キャッシュ変更**: デフォルトでキャッシュされない仕様に変更
- **Route Handlers キャッシュ**: GET メソッドもデフォルトでキャッシュされない

**自動アップグレード**:

```bash
npx @next/codemod@canary upgrade latest
```

**手動アップグレード**:

```bash
npm install next@latest react@latest react-dom@latest
npm install @types/react@latest @types/react-dom@latest
```

**API 使用例の変更**:

#### React 19 対応

```javascript
// 変更前
import { useFormState } from "react-dom";
const [state, formAction] = useFormState(fn, initialState);

// 変更後
import { useActionState } from "react";
const [state, formAction] = useActionState(fn, initialState);
```

#### 非同期 Request API

```javascript
// 変更前
import { cookies } from "next/headers";
const token = cookies().get("token");

// 変更後
import { cookies } from "next/headers";
const cookieStore = await cookies();
const token = cookieStore.get("token");
```

#### コンポーネントの非同期化

```javascript
// 変更前
export default function Page({ params, searchParams }) {
  const { slug } = params
  const { query } = searchParams
  return <div>{slug} - {query}</div>
}

// 変更後
export default async function Page({ params, searchParams }) {
  const { slug } = await params
  const { query } = await searchParams
  return <div>{slug} - {query}</div>
}
```

## バージョン別アップグレード戦略

### 段階的アップグレード戦略

#### 大規模プロジェクトの場合

1. **準備段階**: 依存関係の確認とテスト環境の整備
2. **Codemod 実行**: 自動変換でほぼ全ての変更を適用
3. **手動調整**: 自動変換できない部分の対応
4. **テスト**: 包括的なテストの実行
5. **段階的デプロイ**: カナリアリリースでの検証

#### 小規模プロジェクトの場合

1. **バックアップ**: コード変更前のバックアップ作成
2. **一括アップグレード**: 依存関係とコードの一括更新
3. **動作確認**: 開発・本番環境での動作確認

### アップグレード前チェックリスト

#### 準備事項

- [ ] Node.js バージョンの確認（最小要件の満足）
- [ ] 現在の依存関係の記録
- [ ] カスタム設定の文書化
- [ ] テストスイートの実行確認

#### リスク評価

- [ ] 破壊的変更の影響範囲の特定
- [ ] サードパーティライブラリの互換性確認
- [ ] カスタムコンポーネントの影響評価

#### 実行環境の準備

- [ ] 開発環境のバックアップ
- [ ] ステージング環境での検証計画
- [ ] ロールバック戦略の策定

## 共通の移行パターン

### 1. インポート文の更新

```bash
# 自動変換
npx @next/codemod@latest next-og-import .
npx @next/codemod@latest built-in-next-font .
```

### 2. 非同期 API への対応

```bash
# 非同期 Request API への変換
npx @next/codemod@canary next-async-request-api .
```

### 3. React 関連の更新

```bash
# React 19 への移行
npx @next/codemod@canary react-19 .

# 不要な React インポートの削除
npx @next/codemod@latest remove-react-import .
```

### 4. 設定ファイルの更新

```javascript
// next.config.js の段階的更新例
const nextConfig = {
  // v14: next export の代替
  output: "export",

  // v15: fetch キャッシュの明示的設定
  experimental: {
    serverComponentsExternalPackages: [],
  },
};
```

## トラブルシューティング

### よくある問題と解決方法

#### 1. Node.js バージョンエラー

```bash
Error: Next.js requires Node.js 18.17 or later
```

**解決方法**: Node.js 18.17 以上にアップグレード

#### 2. React 型定義エラー

```
Type 'Element' is not assignable to type 'ReactNode'
```

**解決方法**: TypeScript 型定義の更新

```bash
npm install @types/react@latest @types/react-dom@latest
```

#### 3. 非同期 API エラー

```
Error: cookies() can only be called in async context
```

**解決方法**: コンポーネントまたは関数を非同期に変更

```javascript
// 修正前
export default function Page() {
  const cookieStore = cookies()
  return <div>Content</div>
}

// 修正後
export default async function Page() {
  const cookieStore = await cookies()
  return <div>Content</div>
}
```

#### 4. fetch キャッシュの問題

```
Warning: fetch() is not cached by default
```

**解決方法**: 明示的なキャッシュ設定

```javascript
// キャッシュを有効化
fetch("https://api.example.com", { cache: "force-cache" });

// または設定で指定
export const fetchCache = "default-cache";
```

### 段階的移行のための一時的対応

#### 同期的な cookies アクセス（非推奨）

```javascript
import { cookies, type UnsafeUnwrappedCookies } from 'next/headers'

// 一時的な対応（推奨されません）
const cookieStore = cookies() as unknown as UnsafeUnwrappedCookies
const token = cookieStore.get('token')
```

## パフォーマンスとベストプラクティス

### アップグレード後の最適化

#### 1. キャッシュ戦略の見直し

```javascript
// 適切なキャッシュ設定
export const revalidate = 3600; // 1時間
export const dynamic = "force-static";
```

#### 2. 非同期コンポーネントの活用

```javascript
// サーバーコンポーネントでの非同期データ取得
export default async function UserProfile({ userId }) {
  const user = await fetchUser(userId);
  return <ProfileCard user={user} />;
}
```

#### 3. 新機能の活用

```javascript
// React 19 の新機能を活用
import { useActionState } from "react";

function ContactForm() {
  const [state, formAction] = useActionState(submitForm, null);
  return <form action={formAction}>...</form>;
}
```

## 追加リソース

### 公式ドキュメント

- [Next.js Upgrade Guide](https://nextjs.org/docs/app/building-your-application/upgrading)
- [Codemods Documentation](https://nextjs.org/docs/app/building-your-application/upgrading/codemods)
- [React 19 Migration Guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)

### コミュニティリソース

- [Next.js GitHub Discussions](https://github.com/vercel/next.js/discussions)
- [Next.js Discord Community](https://nextjs.org/discord)
- [Vercel Community](https://vercel.com/guides)

### 移行支援ツール

- [Next.js Codemod Repository](https://github.com/vercel/next.js/tree/canary/packages/next-codemod)
- [jscodeshift Documentation](https://github.com/facebook/jscodeshift)

---

各アップグレードガイドには、具体的なコード例、詳細な手順、およびトラブルシューティング情報が含まれています。プロジェクトの現在のバージョンと要件に応じて、適切なアップグレードパスを選択してください。
