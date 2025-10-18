# Prismaドキュメント日本語翻訳

このディレクトリには、Prismaの公式ドキュメントの日本語翻訳が含まれています。

## 📚 翻訳ステータス

**現在の進捗**: 44ファイル完成 (約200ページ中)
**完了率**: 約22%

詳細なステータスについては、[TRANSLATION_STATUS.md](./TRANSLATION_STATUS.md)を参照してください。

## 📁 ディレクトリ構造

```
docs/libs/prisma/
├── README.md (このファイル)
├── TRANSLATION_STATUS.md (詳細なステータスレポート)
└── docs/
    ├── getting-started/
    │   ├── prisma-postgres/
    │   │   ├── from-the-cli.md
    │   │   ├── upgrade-from-early-access.md
    │   │   └── import-from-existing-database-postgresql.md
    │   └── setup-prisma/
    │       ├── add-to-existing-project/
    │       │   ├── relational-databases/
    │       │   │   ├── connect-your-database-typescript-postgresql.md
    │       │   │   ├── introspection-typescript-postgresql.md
    │       │   │   ├── baseline-your-database-typescript-postgresql.md
    │       │   │   ├── install-prisma-client-typescript-postgresql.md
    │       │   │   ├── querying-the-database-typescript-postgresql.md
    │       │   │   ├── evolve-your-schema-typescript-postgresql.md
    │       │   │   └── next-steps.md
    │       │   └── mongodb/
    │       │       ├── connect-your-database-typescript-mongodb.md
    │       │       ├── introspection-typescript-mongodb.md
    │       │       ├── install-prisma-client-typescript-mongodb.md
    │       │       ├── querying-the-database-typescript-mongodb.md
    │       │       └── next-steps.md
    │       └── start-from-scratch/
    │           ├── relational-databases/ (既存の翻訳)
    │           └── mongodb/ (既存の翻訳)
    └── postgres/
        ├── postgres.md
        ├── introduction/
        │   ├── getting-started.md
        │   ├── npx-create-db.md
        │   ├── import-from-existing-database.md
        │   ├── management-api.md
        │   └── overview.md
        └── database/
            ├── caching.md
            ├── connection-pooling.md
            ├── backups.md
            ├── postgres-extensions.md
            └── local-development.md
```

## ✅ 完了したセクション

### 1. Getting Started - Setup Prisma
#### Existing Project - Relational Databases
- ✅ データベースへの接続
- ✅ イントロスペクション
- ✅ データベースのベースライン化
- ✅ Prisma Clientのインストール
- ✅ データベースのクエリ
- ✅ スキーマの進化
- ✅ 次のステップ

#### Existing Project - MongoDB
- ✅ データベースへの接続
- ✅ イントロスペクション
- ✅ Prisma Clientのインストール
- ✅ データベースのクエリ
- ✅ 次のステップ

### 2. Prisma Postgres
#### Getting Started
- ✅ CLIから始める
- ✅ Early Accessからのアップグレード
- ✅ 既存のデータベースからのインポート

#### Introduction
- ✅ はじめに
- ✅ npx create-db
- ✅ 既存のデータベースからのインポート
- ✅ Management API
- ✅ 概要

#### Database
- ✅ キャッシング
- ✅ コネクションプーリング
- ✅ バックアップ
- ✅ PostgreSQL拡張機能
- ✅ ローカル開発

## ⏳ 翻訳待ちのセクション

### 高優先度
1. **ORM Overview** (約12ページ)
   - Prismaとは
   - なぜPrismaなのか
   - Prismaを使うべきか
   - データモデリング

2. **ORM Prisma Client** (約60ページ)
   - クライアントAPI
   - CRUD操作
   - リレーション
   - トランザクション

### 中優先度
3. **Query Optimization** (約30ページ)
   - セットアップ
   - レコーディング
   - 推奨事項

4. **ORM Prisma Schema** (約25ページ)
   - スキーマの構文
   - データモデル
   - リレーション

### 低優先度
5. **Platform** (約7ページ)
6. **ORM Databases** (約16ページ)

## 🎯 翻訳ガイドライン

### 専門用語の処理
以下の専門用語はカタカナで表記します:
- query → クエリ
- migration → マイグレーション
- schema → スキーマ
- model → モデル
- relation → リレーション
- introspection → イントロスペクション
- transaction → トランザクション
- connection pooling → コネクションプーリング
- caching → キャッシング

### コードブロック
- すべてのコードブロックは**元のまま保持**します
- コメント内の英語も変更しません

### フォーマット
- Markdown形式を維持します
- 見出しレベルを保持します
- リストのインデントを保持します

## 🚀 次のステップ

残りの約160ページを翻訳するには、以下のアプローチを推奨します:

### オプション1: バッチ処理（推奨）
10-20ページのバッチで段階的に翻訳します:
```bash
# 次のバッチ: URLs 44-58
# Claude Codeで実行:
# "Prismaドキュメントのバッチ2（URLs 44-58）を翻訳してください"
```

### オプション2: 優先度ベース
最重要セクションから始めます:
1. ORM Overview → 基本概念
2. ORM Prisma Client → 最頻使用
3. Query Optimization → パフォーマンス

### オプション3: 自動化
Node.jsスクリプトで翻訳を自動化します。

## 📖 使用方法

翻訳されたドキュメントを参照するには:

```bash
# ディレクトリ構造を確認
ls -la docs/libs/prisma/docs/

# 特定のファイルを表示
cat docs/libs/prisma/docs/getting-started/prisma-postgres/from-the-cli.md
```

## 🤝 貢献

このプロジェクトへの貢献を歓迎します:
1. 誤訳の修正
2. 表現の改善
3. 新しいページの翻訳

## 📝 ライセンス

元のPrismaドキュメントは、Prisma社によって提供されています。
この翻訳は、fluorite-recipesプロジェクトの一部として提供されています。

## 🔗 リンク

- [Prisma公式ドキュメント](https://www.prisma.io/docs)
- [Prisma GitHub](https://github.com/prisma/prisma)
- [翻訳ステータス](./TRANSLATION_STATUS.md)

---

**最終更新**: 2025-10-17
**メンテナー**: kotsutsumi
