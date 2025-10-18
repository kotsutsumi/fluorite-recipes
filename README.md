# 🧪 Fluorite Recipes

フルオライト・レシピは、モダンなWeb・モバイル開発フレームワークとライブラリの包括的な日本語ドキュメント集です。LLMと開発者の両方が効率的に参照できるよう構造化されたドキュメントインデックスを提供しています。

## 📖 概要

このプロジェクトは、最新のWeb・モバイル開発技術に関する包括的な日本語ドキュメントを収集・整理し、LLM（大規模言語モデル）が効率的に解析・参照できる形式で提供することを目的としています。

### 主な特徴

- 📚 **包括的なカバレッジ**: 850+ページの詳細な日本語ドキュメント
- 🤖 **LLM最適化**: TypeScriptインターフェース形式、構造化された情報設計
- 🎯 **実践的な内容**: 実装例、ベストプラクティス、学習パス
- 🔄 **最新技術対応**: React 19、Next.js 15、最新のエコシステム
- 📊 **カテゴリ別整理**: フレームワーク、ライブラリ、用途別の選択ガイド
- 💡 **段階的学習**: 初心者から上級者まで対応した学習リソース

## 🗂️ ドキュメント構成

### フレームワーク（850+ページ）

#### [React](./docs/frameworks/react.md)
**UI構築のための JavaScript ライブラリ**
- **ドキュメント数**: 142ファイル
- **カバー範囲**: Learn、Reference、API仕様
- **主な内容**: フック、コンポーネント、Server Components、Suspense
- **バージョン**: React 19

#### [Next.js](./docs/frameworks/nextjs.md)
**React フルスタックフレームワーク**
- **ドキュメント数**: 310ファイル
- **カバー範囲**: Learn、公式ドキュメント、技術ブログ
- **主な内容**: App Router、Server Components、Server Actions、Turbopack
- **バージョン**: Next.js 15

#### [Expo](./docs/frameworks/expo.md)
**React Native モバイル開発フレームワーク**
- **ドキュメント数**: 398ファイル
- **カバー範囲**: Expo Router、EAS Platform、開発ワークフロー
- **主な内容**: Expo Router、EAS Build、EAS Update、OTA更新
- **対応**: iOS、Android、Web

#### [Tauri](./docs/frameworks/tauri/)
**デスクトップアプリフレームワーク**（準備中）

### ライブラリ（600+ページ）

#### UI・スタイリング
- **[Tailwind CSS](./docs/libs/tailwindcss.md)**: 169ファイル - ユーティリティファーストCSS
- **[shadcn/ui](./docs/libs/shadcn.md)**: 50+コンポーネント - 再利用可能なReactコンポーネント集
- **[Kibo UI](./docs/libs/kibo-ui.md)**: 50+コンポーネント - shadcn/ui拡張ライブラリ

#### データベース・ORM
- **[Drizzle ORM](./docs/libs/drizzle.md)**: 100+ページ - TypeScript向け型安全ORM
- **[Prisma](./docs/libs/prisma.md)**: 70+ページ - 次世代TypeScript ORM

#### 状態管理
- **[Zustand](./docs/libs/zustand.md)**: 30+ページ - シンプルで高速な状態管理
- **[Jotai](./docs/libs/jotai.md)**: 60+ページ - プリミティブで柔軟な状態管理
- **[Valtio](./docs/libs/valtio.md)**: 25+ページ - プロキシベース状態管理

#### ビルドツール
- **[Turborepo](./docs/libs/turborepo.md)**: 35+ページ - モノレポ向け高速ビルドシステム

## 📁 プロジェクト構造

```
fluorite-recipes/
├── 📄 README.md                # プロジェクト概要（このファイル）
├── 📄 CLAUDE.md                # Claude AI向けガイドライン
├── 📄 AGENTS.md                # エージェント向け詳細ガイド
├── 📄 LICENSE.md               # ライセンス情報
├── 📁 docs/                    # メインコンテンツ: 技術ドキュメント集
│   ├── 📄 frameworks.md        # フレームワーク一覧・選択ガイド
│   ├── 📄 libs.md              # ライブラリ一覧・選択ガイド
│   ├── 📁 frameworks/          # フレームワーク別ドキュメント
│   │   ├── 📁 nextjs/          # Next.js (310ファイル)
│   │   │   ├── nextjs.md       # マスタードキュメント
│   │   │   ├── learn.md        # 学習コース
│   │   │   ├── docs.md         # 公式ドキュメント
│   │   │   ├── blog.md         # 技術ブログ
│   │   │   ├── 📁 learn/       # 学習プラットフォーム詳細
│   │   │   ├── 📁 docs/        # 公式ドキュメント詳細
│   │   │   └── 📁 blog/        # 技術ブログ記事
│   │   ├── 📁 react/           # React (142ファイル)
│   │   │   ├── react.md        # マスタードキュメント
│   │   │   └── 📁 docs/        # Learn & Reference
│   │   ├── 📁 expo/            # Expo (398ファイル)
│   │   │   ├── expo.md         # インデックス
│   │   │   └── 📁 docs/        # 詳細ドキュメント
│   │   └── 📁 tauri/           # Tauri (準備中)
│   └── 📁 libs/                # ライブラリ別ドキュメント
│       ├── 📁 tailwindcss/     # Tailwind CSS (169ファイル)
│       ├── 📁 shadcn/          # shadcn/ui
│       ├── 📁 kibo-ui/         # Kibo UI
│       ├── 📁 drizzle/         # Drizzle ORM
│       ├── 📁 prisma/          # Prisma
│       ├── 📁 zustand/         # Zustand
│       ├── 📁 jotai/           # Jotai
│       ├── 📁 valtio/          # Valtio
│       └── 📁 turborepo/       # Turborepo
├── 📁 tools/                   # 開発ツール
│   └── 📁 indexer/             # ドキュメントインデックス生成ツール
└── 📁 packs/                   # パッケージ管理
```

## 🎯 使用方法

### ドキュメントの参照

#### 開発者向け

1. **フレームワーク選択**: [docs/frameworks.md](./docs/frameworks.md) で用途に応じたフレームワークを選択
2. **ライブラリ選択**: [docs/libs.md](./docs/libs.md) で必要なライブラリを選択
3. **学習**: 各ドキュメントの学習パスに従って段階的に学習
4. **実装**: APIリファレンスとコード例を参照して実装

#### LLM向け

1. **エントリーポイント**: `docs/frameworks.md` または `docs/libs.md` から開始
2. **構造化データ**: TypeScriptインターフェース形式で情報を取得
3. **段階的参照**: マスタードキュメント → カテゴリ別 → 詳細ドキュメント
4. **クロスリファレンス**: 相互リンクを活用した関連情報の取得

### ドキュメントインデックスの生成

```bash
# tools/indexer を使用してドキュメントインデックスを生成
cd tools/indexer
# インデックス生成スクリプトを実行（詳細はtools/indexer/README.mdを参照）
```

## 📊 統計情報

### 総合統計

- **総ドキュメント数**: 1,450+ ファイル
- **フレームワーク**: 4種類（850+ページ）
- **ライブラリ**: 9種類（600+ページ）
- **言語**: 日本語
- **対象**: 開発者、LLM

### カテゴリ別統計

| カテゴリ | ドキュメント数 | 主な内容 |
|---------|--------------|---------|
| **フレームワーク** | 850+ | React、Next.js、Expo、Tauri |
| **UI・スタイリング** | 270+ | Tailwind CSS、shadcn/ui、Kibo UI |
| **データベース・ORM** | 170+ | Drizzle ORM、Prisma |
| **状態管理** | 115+ | Zustand、Jotai、Valtio |
| **ビルドツール** | 35+ | Turborepo |

## 💡 ドキュメント活用ガイド

### 初心者向け学習パス

1. **React基礎** (2-3週間)
   - `docs/frameworks/react.md` → Learn セクション
   - コンポーネント、State、Effect の理解

2. **Next.js入門** (3-4週間)
   - `docs/frameworks/nextjs.md` → React基礎講座 → Dashboard App
   - フルスタック開発の実践

3. **ライブラリ活用** (継続的)
   - `docs/libs.md` → 用途別ライブラリ選択
   - 実践的なアプリケーション構築

### 中級者向け

- **Next.js App Router詳細**: Server Components、Server Actions
- **状態管理パターン**: Zustand、Jotai の使い分け
- **データベース設計**: Drizzle ORM、Prisma の選択

### 上級者向け

- **パフォーマンス最適化**: React Compiler、Turbopack
- **アーキテクチャ設計**: モノレポ、マイクロフロントエンド
- **技術深掘り**: Next.js Blog記事、技術解説

## 🤖 LLM最適化

### 構造化情報設計

```typescript
interface DocumentStructure {
  masterDocument: {
    format: "TypeScript interface形式";
    purpose: "全体概要と構造の把握";
    links: "詳細ドキュメントへのリンク";
  };
  categoryDocuments: {
    format: "カテゴリ別索引";
    purpose: "用途別の選択ガイド";
    statistics: "統計情報と比較表";
  };
  detailDocuments: {
    format: "段階的詳細度";
    purpose: "具体的な実装パターン";
    examples: "実践的なコード例";
  };
}
```

### 効率的な参照方法

1. **タスク特定**: 実装したい機能を明確化
2. **カテゴリ選択**: frameworks.md または libs.md で選択
3. **詳細参照**: 該当ドキュメントで具体的な実装パターンを取得
4. **コード生成**: 実装例を基にカスタマイズ

## 🔗 外部リソース

### 公式ドキュメント

- [React](https://react.dev/)
- [Next.js](https://nextjs.org/)
- [Expo](https://expo.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Prisma](https://www.prisma.io/)

### コミュニティ

各フレームワーク・ライブラリのDiscord、GitHub Discussions、Stack Overflowコミュニティが利用可能です。

## 🚀 今後の展開

### 追加予定のドキュメント

- [ ] **フレームワーク**: Remix、Astro、SvelteKit
- [ ] **ライブラリ**: TanStack Query、React Hook Form、Zod
- [ ] **サービス**: Supabase、Turso、Vercel
- [ ] **ツール**: Vite、Bun、Biome

### 機能改善

- [ ] ドキュメント検索機能
- [ ] バージョン管理・更新追跡
- [ ] インタラクティブな学習パス
- [ ] コード例のプレイグラウンド

## 📝 コントリビューション

### ドキュメント追加・改善

1. **新規ドキュメント**: 新しいフレームワーク・ライブラリのドキュメント追加
2. **既存ドキュメント改善**: 誤字修正、情報更新、例示追加
3. **翻訳品質向上**: より分かりやすい日本語表現

### プルリクエストガイドライン

```bash
# 1. リポジトリをフォーク
git clone https://github.com/kotsutsumi/fluorite-recipes.git

# 2. ブランチ作成
git checkout -b docs/add-new-framework

# 3. ドキュメント追加・編集
# docs/ 配下に追加・編集

# 4. コミット
git commit -m "docs: Add documentation for XXX framework"

# 5. プッシュ
git push origin docs/add-new-framework

# 6. プルリクエスト作成
```

### ドキュメント品質基準

- ✅ 構造化された情報設計（TypeScriptインターフェース形式推奨）
- ✅ 実践的なコード例の提供
- ✅ 段階的な学習パス（初心者 → 中級 → 上級）
- ✅ クロスリファレンス（関連ドキュメントへのリンク）
- ✅ 最新バージョンへの対応

## 📄 ライセンス

このプロジェクトは [LICENSE.md](LICENSE.md) で定義されたライセンスの下で公開されています。

## 🙋‍♂️ サポート・コミュニティ

### 質問・議論

- **GitHub Issues**: バグレポート・機能リクエスト
- **GitHub Discussions**: 質問・アイデア共有

### メンテナー

- **[@kotsutsumi](https://github.com/kotsutsumi)** - プロジェクトオーナー

---

**🧪 Fluorite Recipes** - モダンなWeb・モバイル開発のための包括的な日本語ドキュメント集

LLMと開発者の学習・開発を加速する、構造化されたドキュメントリソースです。
