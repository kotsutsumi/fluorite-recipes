# Next.js コミュニティ

Next.jsのコミュニティ貢献ガイドとツールに関する包括的な文書です。

## 📚 目次

1. [コントリビューションガイド](#コントリビューションガイド)
2. [コミュニティツール](#コミュニティツール)
3. [関連リンク](#関連リンク)

---

## コントリビューションガイド

Next.jsドキュメントへの貢献のための包括的なガイドライン。

### 📖 [ドキュメント貢献ガイド](./community/01-contribution-guide.md)

#### ファイル構造とナビゲーション

```
docs/
├── 01-app/          # App Router セクション
├── 02-pages/        # Pages Router セクション
└── community/
    ├── 01-contribution-guide.md
    └── 02-rspack.md
```

**ナビゲーション順序システム**

- **2桁の数字プレフィックス**: `01-`, `02-`, `03-` など
- **理由**: 10個を超えるページがある場合のソート問題を防ぐ
- **例**: `01-defining-routes.md`, `02-creating-layouts.md`

#### セクション構造

**App Router セクション**

- `/app` サブフォルダに属するファイル
- Next.jsの最新機能のドキュメント
- 推奨アプローチ

**Pages Router セクション**

- `/pages` サブフォルダに属するファイル
- Pages Router 固有の機能
- レガシー互換性

#### メタデータ要件

```yaml
---
title: ページタイトル（60文字以下、SEO最適化）
description: ページの説明（160文字以下、SEO最適化）
related:
  description: 関連ページの説明（20文字未満が理想）
  links:
    - app/building-your-application/routing/defining-routes
    - app/building-your-application/data-fetching/caching
---
```

### 文章スタイルガイドライン

#### ページタイプ

1. **ドキュメントページ**
   - 概念や機能を説明
   - 教育的アプローチ
   - ステップバイステップの説明
   - 例: [Layouts and Templates](./app/building-your-application/routing/layouts-and-templates.md)

2. **参照ページ**
   - API説明とリファレンス
   - 関数、メソッド、パラメータの詳細
   - 実用的で簡潔
   - 例: [`<Link>` API Reference](./app/api-reference/components/link.md)

#### 推奨声とトーン

```markdown
✅ 良い例:

- 簡潔: "Node.jsをインストールしてください"
- 具体的: "メタデータオブジェクトを使用: export const metadata = { title: '...', description: '...' }"
- アクティブボイス: "サーバーはメタデータオブジェクトを使用します"
- 直接的: "あなたは..."
- 命令的: "次のコマンドを実行してください"

❌ 避けるべき:

- 冗長: "Nextjsを使用するためには、Node.jsがインストールされていることを確認する必要があります"
- あいまい: "最近"、"いくつか"、"多くの"
- 受動態: "ページはサーバーによってレンダリングされます"
- 否定的: "使用すべきではありません"
```

### コードブロック標準

#### 基本構文

````markdown
```tsx filename="app/page.tsx" highlight={1,3}
import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```
````

#### ルーター固有コード

````markdown
<AppOnly>
```tsx filename="app/page.tsx"
export default function Page() {
  return <h1>Hello, Next.js!</h1>
}
````

</AppOnly>

<Tabs>
<TabItem value="app" label="App Router">
```tsx filename="app/page.tsx"
export default function Page() {
  return <h1>Hello, Next.js!</h1>
}
```
</TabItem>
<TabItem value="pages" label="Pages Router">
```tsx filename="pages/index.tsx"
export default function Page() {
  return <h1>Hello, Next.js!</h1>
}
```
</TabItem>
</Tabs>
```

### 注意事項とアイコン

#### 注意事項タイプ

```markdown
> **知っておくと良いこと**: 読者が知るべき有用な情報

> **例**: 前述の情報を示す例

> **警告**: 重要な情報（壊れる可能性がある変更など）
```

#### アイコン使用

```mdx
import { ArrowUpCircleIcon } from "@heroicons/react/outline";

<ArrowUpCircleIcon className="h-6 w-6" />
```

### VS Code 設定

#### 推奨拡張機能

1. [MDX VS Code extension](https://marketplace.visualstudio.com/items?itemName=unifiedjs.vscode-mdx)
2. [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

#### カスタムスニペット

````json
{
  "CodeBlock": {
    "prefix": "```",
    "scope": "mdx",
    "body": [
      "\\`\\`\\`${1:lang} filename=\"${2:filename}\"",
      "${3:code}",
      "\\`\\`\\`"
    ]
  },
  "GoodToKnow": {
    "prefix": "> Good",
    "scope": "mdx",
    "body": ["> **知っておくと良いこと**: ${1:text}"]
  }
}
````

### GitHub ワークフロー

#### プルリクエストライフサイクル

1. **Open**: PRテンプレートに記入
2. **Triage**: Next.jsチームによるレビュー
3. **Approval and Merge**: 承認後、数分以内にデプロイ

#### 貢献ガイドライン

- [ドキュメント文章スタイル](#文章スタイルガイドライン)に従う
- [Google Developer Documentation Style Guide](https://developers.google.com/style)を参照
- [Grammarly](https://grammarly.com/)で文法チェック
- [Vercel Design resources](https://vercel.com/design)でメディア作成
- `pnpm dev`でローカルテスト（`localhost:3000/docs`）

---

## コミュニティツール

Next.jsエコシステムの実験的およびコミュニティ主導のツール。

### 🦀 [Rspack Integration](./community/02-rspack.md)

#### 概要

- **技術**: Rustベースの高性能JavaScriptバンドラー
- **ステータス**: 実験的（本番環境非推奨）
- **パートナーシップ**: Rspackチームとの協力
- **パフォーマンス**: Rustベースによる高速化

#### 特徴

```javascript
// Rspack設定例
module.exports = {
  experimental: {
    rspack: true,
  },
};
```

#### 制限事項

> **警告**: この機能は現在実験的であり、変更される可能性があります

- 本番環境での使用は推奨されない
- 機能セットが限定的
- API安定性が保証されない

#### リソース

- [Rspackドキュメント](https://rspack.rs/guide/tech/next)
- [例のプロジェクト](https://github.com/vercel/next.js/tree/canary/examples/with-rspack)
- [ディスカッションスレッド](https://github.com/vercel/next.js/discussions/77800)

### 実験的ツールの使用指針

#### 開発環境での使用

```bash
# 実験的機能の有効化
npm install next@canary
```

#### フィードバック提供

1. [GitHub Discussions](https://github.com/vercel/next.js/discussions)
2. [Discord コミュニティ](https://discord.com/invite/bUG2bvbtHy)
3. [問題報告](https://github.com/vercel/next.js/issues)

---

## 関連リンク

### 公式リソース

- [Next.js GitHubリポジトリ](https://github.com/vercel/next.js)
- [Next.js公式ドキュメント](https://nextjs.org/docs)
- [Vercel Design System](https://vercel.com/geist/introduction)

### コミュニティプラットフォーム

- [Discord サーバー](https://discord.com/invite/bUG2bvbtHy)
- [GitHub Discussions](https://github.com/vercel/next.js/discussions)
- [初回貢献者向けIssue](https://github.com/vercel/next.js/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22)

### 開発者ツール

- [MDX プレビュー](https://mdxjs.com/playground/)
- [Google Developer Documentation Style Guide](https://developers.google.com/style)
- [Grammarly](https://grammarly.com/)

### 設計リソース

- [Vercel Design resources](https://vercel.com/design)
- [React Icons](https://react-icons.github.io/react-icons/)
- [Heroicons](https://heroicons.com/)

---

## 実装例

### 新機能の提案プロセス

```markdown
1. GitHub Discussionで議論開始
2. RFC（Request for Comments）作成
3. コミュニティフィードバック収集
4. プロトタイプ実装
5. Pull Request作成
6. コードレビューとテスト
7. ドキュメント更新
8. リリース
```

### ドキュメント改善のワークフロー

```bash
# 1. リポジトリのフォーク
git clone https://github.com/[username]/next.js.git

# 2. ブランチ作成
git checkout -b improve-docs-[feature]

# 3. 変更実装
# docs/ ディレクトリで編集

# 4. ローカルテスト
pnpm dev
# localhost:3000/docs で確認

# 5. コミットとプッシュ
git commit -m "docs: improve [feature] documentation"
git push origin improve-docs-[feature]

# 6. Pull Request作成
```

このドキュメントは、Next.jsコミュニティへの貢献と実験的ツールの活用に関する包括的なガイドを提供します。貢献を検討している場合は、まず[初回貢献者向けIssue](https://github.com/vercel/next.js/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22)から始めることをお勧めします。
