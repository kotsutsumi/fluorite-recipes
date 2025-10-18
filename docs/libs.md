# ライブラリドキュメント集

このディレクトリには、Fluorite Recipesプロジェクトで使用する主要なライブラリとフレームワークの日本語ドキュメントが含まれています。

## 📚 収録ライブラリ一覧

### 🎨 UI・スタイリング

#### [Tailwind CSS](./libs/tailwindcss.md)
**ユーティリティファーストCSSフレームワーク**
- **総ドキュメント数**: 169ファイル
- **カバー範囲**: レイアウト、タイポグラフィ、エフェクト、トランジション、アニメーション、インタラクティビティ
- **主な機能**: Flexbox、Grid、レスポンシブデザイン、ダークモード、カスタムスタイル
- **ドキュメント**: [docs/libs/tailwindcss.md](./libs/tailwindcss.md)

#### [shadcn/ui](./libs/shadcn.md)
**再利用可能なReactコンポーネント集**
- **総ドキュメント数**: 50+コンポーネント
- **特徴**: コピー&ペーストで使用、完全なカスタマイズ性、アクセシビリティ対応
- **技術スタック**: Radix UI、Tailwind CSS、TypeScript
- **主なコンポーネント**: Form、Dialog、Command、Data Table、Toast
- **ドキュメント**: [docs/libs/shadcn.md](./libs/shadcn.md)

#### [Kibo UI](./libs/kibo-ui.md)
**shadcn/ui拡張コンポーネントライブラリ**
- **総コンポーネント数**: 50+コンポーネント + 6ブロック
- **特徴**: テーブル、ファイルドロップゾーン、エディタなどの高度なコンポーネント
- **カテゴリ**: データ表示、フォーム、メディア、コラボレーション、開発ツール
- **主なコンポーネント**: Gantt、Kanban、Calendar、Editor、Dropzone、Stories
- **ドキュメント**: [docs/libs/kibo-ui.md](./libs/kibo-ui.md)

### 🗄️ データベース・ORM

#### [Drizzle ORM](./libs/drizzle.md)
**TypeScript向け型安全ORM**
- **総ドキュメント数**: 100+ページ
- **対応DB**: PostgreSQL、MySQL、SQLite
- **特徴**: 完全な型推論、マイグレーション、リレーショナルクエリ
- **主な機能**: スキーマ定義、クエリビルダー、Drizzle Kit、トランザクション
- **ドキュメント**: [docs/libs/drizzle.md](./libs/drizzle.md)

#### [Prisma](./libs/prisma.md)
**次世代TypeScript ORM**
- **総ドキュメント数**: 70+ページ
- **特徴**: 直感的なデータモデル、自動マイグレーション、Prisma Studio
- **主な機能**: スキーマ定義、Prisma Client、マイグレーション、型安全性
- **ツール**: Prisma Studio（GUIデータベースブラウザ）、Prisma Migrate
- **ドキュメント**: [docs/libs/prisma.md](./libs/prisma.md)

### 🔄 状態管理

#### [Zustand](./libs/zustand.md)
**シンプルで高速な状態管理ライブラリ**
- **総ドキュメント数**: 30+ページ
- **特徴**: 最小限のボイラープレート、TypeScript完全対応、Redux DevTools統合
- **主な機能**: ストア作成、セレクター、ミドルウェア、永続化
- **ユースケース**: グローバル状態、非同期アクション、状態のスライス化
- **ドキュメント**: [docs/libs/zustand.md](./libs/zustand.md)

#### [Jotai](./libs/jotai.md)
**プリミティブで柔軟な状態管理**
- **総ドキュメント数**: 60+ページ
- **特徴**: アトミックアプローチ、Suspense対応、スケーラブル
- **主な機能**: atom、useAtom、非同期処理、SSR対応
- **拡張機能**: tRPC、TanStack Query、XState、Immer統合
- **ドキュメント**: [docs/libs/jotai.md](./libs/jotai.md)

#### [Valtio](./libs/valtio.md)
**プロキシベース状態管理**
- **総ドキュメント数**: 25+ページ
- **特徴**: ミュータブルな状態管理、自動レンダリング最適化
- **主な機能**: proxy、useSnapshot、派生状態、履歴管理
- **ユーティリティ**: proxyWithHistory、proxyMap、proxySet、devtools
- **ドキュメント**: [docs/libs/valtio.md](./libs/valtio.md)

### ⚡ ビルドツール

#### [Turborepo](./libs/turborepo.md)
**モノレポ向け高速ビルドシステム**
- **総ドキュメント数**: 35+ページ
- **特徴**: インクリメンタルビルド、リモートキャッシング、並列実行
- **主な機能**: タスクパイプライン、キャッシング、ワークスペース管理
- **ユースケース**: モノレポ、複数パッケージ管理、CI/CD最適化
- **ドキュメント**: [docs/libs/turborepo.md](./libs/turborepo.md)

## 🎯 カテゴリ別ライブラリ選択ガイド

### UIコンポーネントが必要な場合
1. **基本的なUI**: shadcn/ui（50+コンポーネント）
2. **高度なUI**: Kibo UI（データテーブル、エディタ、カレンダーなど）
3. **スタイリング**: Tailwind CSS（完全なユーティリティクラス）

### データベース操作が必要な場合
1. **軽量・高速**: Drizzle ORM（型安全、パフォーマンス重視）
2. **開発者体験重視**: Prisma（直感的なAPI、GUIツール）

### 状態管理が必要な場合
1. **シンプルさ重視**: Zustand（最小限のAPI）
2. **柔軟性重視**: Jotai（アトミックアプローチ）
3. **ミュータブル**: Valtio（プロキシベース）

### モノレポ管理が必要な場合
- **Turborepo**: 高速ビルド、キャッシング、並列実行

## 📊 統計情報

| ライブラリ | ドキュメント数 | 主な用途 | 学習難易度 |
|-----------|---------------|---------|-----------|
| Tailwind CSS | 169 | スタイリング | ⭐⭐ |
| shadcn/ui | 50+ | UIコンポーネント | ⭐⭐ |
| Kibo UI | 50+ | 高度なUI | ⭐⭐⭐ |
| Drizzle ORM | 100+ | データベース | ⭐⭐⭐ |
| Prisma | 70+ | データベース | ⭐⭐ |
| Zustand | 30+ | 状態管理 | ⭐ |
| Jotai | 60+ | 状態管理 | ⭐⭐ |
| Valtio | 25+ | 状態管理 | ⭐⭐ |
| Turborepo | 35+ | ビルドツール | ⭐⭐⭐ |

**合計**: 600+ページの日本語ドキュメント

## 🚀 クイックスタート推奨パス

### 1. フロントエンド開発を始める
```
Tailwind CSS → shadcn/ui → Kibo UI（必要に応じて）
```

### 2. データベースを使い始める
```
Drizzle ORM または Prisma → スキーマ定義 → マイグレーション
```

### 3. 状態管理を追加する
```
Zustand（シンプル）または Jotai（柔軟）→ ストア/atom作成 → コンポーネントで使用
```

### 4. モノレポ構成にする
```
Turborepo → ワークスペース設定 → パイプライン構成 → キャッシング
```

## 💡 LLM向けドキュメント参照ガイド

### 初心者向けの学習順序
1. **Tailwind CSS**: `tailwindcss.md` → 基礎コンセプト → レイアウト
2. **shadcn/ui**: `shadcn.md` → インストール → 基本コンポーネント
3. **Zustand**: `zustand.md` → 基本的な使い方 → ストア作成

### 実装時のよくあるタスク

#### UIを構築したい
- **基本レイアウト**: `tailwindcss.md` → Flexbox/Grid
- **フォーム**: `shadcn.md` → Form → Kibo UI → Editor/Dropzone
- **データ表示**: `shadcn.md` → Table → Kibo UI → Gantt/Kanban

#### データベース操作
- **スキーマ設計**: `drizzle.md`/`prisma.md` → スキーマ定義
- **クエリ作成**: `drizzle.md` → SELECT/INSERT/UPDATE/DELETE
- **マイグレーション**: `drizzle.md` → Drizzle Kit → generate/migrate

#### 状態管理
- **グローバル状態**: `zustand.md` → ストア作成
- **フォーム状態**: `jotai.md` → atom → useAtom
- **リアクティブ**: `valtio.md` → proxy → useSnapshot

#### パフォーマンス最適化
- **ビルド時間**: `turborepo.md` → キャッシング → 並列実行
- **データベース**: `drizzle.md` → クエリ最適化 → バッチAPI
- **状態管理**: `jotai.md` → パフォーマンス → セレクター

## 🔗 外部リソース

### 公式サイト
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Kibo UI](https://www.kibo-ui.com/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Prisma](https://www.prisma.io/)
- [Zustand](https://github.com/pmndrs/zustand)
- [Jotai](https://jotai.org/)
- [Valtio](https://github.com/pmndrs/valtio)
- [Turborepo](https://turbo.build/repo)

### コミュニティ
各ライブラリのDiscord、GitHub Discussions、Stack Overflowコミュニティが利用可能です。詳細は各ライブラリのドキュメントを参照してください。

## 📝 ドキュメントの使い方

### 各ライブラリのドキュメント構成
1. **概要**: ライブラリの目的と特徴
2. **インストール**: セットアップ手順
3. **基本的な使い方**: クイックスタートとコード例
4. **API リファレンス**: 詳細な機能説明
5. **ガイド**: 実践的なユースケース
6. **ベストプラクティス**: 推奨パターンとアンチパターン

### LLMによる効率的な参照方法
1. **タスク特定**: 何を実装したいか明確にする
2. **ライブラリ選択**: 上記のカテゴリ別ガイドを参照
3. **ドキュメント参照**: 該当ライブラリの目次から必要なページへ
4. **コード例確認**: 実装パターンを理解
5. **カスタマイズ**: プロジェクト要件に合わせて調整

## 🔄 ドキュメントの更新状況

- **最終更新日**: 2025-10-18
- **Tailwind CSS**: v4対応（169ファイル）
- **その他**: 各ライブラリの最新安定版に基づく

## 📦 プロジェクト固有の情報

### Fluorite Recipesでの使用例
```
apps/
├── nextjs/base/        # Next.js + Tailwind CSS + shadcn/ui
├── expo/base/          # React Native + Expo
packages/
├── ui/                 # 共有UIコンポーネント（shadcn/ui + Kibo UI）
├── database/           # Drizzle ORM スキーマ
└── state/              # Zustand/Jotai ストア
```

### 推奨される組み合わせ
- **UI層**: Tailwind CSS + shadcn/ui + Kibo UI
- **データ層**: Drizzle ORM
- **状態管理**: Zustand（グローバル）+ Jotai（フォーム）
- **ビルド**: Turborepo（モノレポ管理）

## 🎓 学習リソース

### 初心者向け
1. Tailwind CSS基礎（2-3時間）
2. shadcn/uiコンポーネント（1-2時間）
3. Zustand基本（1時間）
4. Drizzle ORM基礎（2-3時間）

### 中級者向け
1. Tailwind CSSカスタマイズ
2. Kibo UI高度なコンポーネント
3. Jotaiアトミックパターン
4. Drizzle ORMマイグレーション

### 上級者向け
1. Turborepoパイプライン最適化
2. Drizzle ORMパフォーマンスチューニング
3. カスタムshadcn/uiコンポーネント作成
4. 状態管理パターンの組み合わせ

---

**このドキュメントについて**: Fluorite Recipesプロジェクトで使用する全ライブラリの日本語ドキュメントへの包括的なインデックスです。LLMが効率的に参照できるよう構造化されています。
