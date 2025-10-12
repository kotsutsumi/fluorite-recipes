# Fluorite Recipes

フルオライト・レシピは、Next.js 15とTailwind CSS v4を使用したモダンなWebアプリケーションです。App Routerとサーバーコンポーネントを活用し、高性能でスケーラブルなWebアプリケーションの構築を目指しています。

## 🚀 技術スタック

- **フレームワーク**: Next.js 15 (App Router)
- **言語**: TypeScript 5 (strict mode)
- **UI**: React 19.1.0
- **スタイリング**: Tailwind CSS v4
- **ビルドツール**: Turbopack
- **リンター・フォーマッター**: Biome
- **パッケージマネージャー**: pnpm

## 📁 プロジェクト構造

```
fluorite-recipes/
├── AGENTS.md                 # エージェント向けガイドライン
├── LICENSE.md               # ライセンス情報
├── README.md               # プロジェクト概要（このファイル）
└── apps/
    └── base/               # メインアプリケーション
        ├── biome.json      # Biome設定
        ├── next.config.ts  # Next.js設定
        ├── package.json    # 依存関係とスクリプト
        ├── pnpm-lock.yaml  # 依存関係ロック
        ├── tsconfig.json   # TypeScript設定
        ├── public/         # 静的アセット
        │   ├── file.svg
        │   ├── globe.svg
        │   ├── next.svg
        │   ├── vercel.svg
        │   └── window.svg
        └── src/
            └── app/        # App Router pages
                ├── globals.css  # グローバルスタイル
                ├── layout.tsx   # ルートレイアウト
                └── page.tsx     # ホームページ
```

## 🛠 開発環境のセットアップ

### 前提条件

- Node.js 18.18+ または 20.x
- pnpm (推奨) または npm

### インストール

1. リポジトリをクローン:

```bash
git clone https://github.com/kotsutsumi/fluorite-recipes.git
cd fluorite-recipes
```

2. ベースディレクトリに移動:

```bash
cd apps/base
```

3. 依存関係をインストール:

```bash
pnpm install
# または
npm ci
```

## 🏃‍♂️ 使用方法

### 開発サーバーの起動

```bash
pnpm dev
# または
npm run dev
```

開発サーバーが `http://localhost:3000` で起動します。

### その他のコマンド

- **ビルド**: `pnpm build` - 本番用ビルドを作成
- **本番サーバー**: `pnpm start` - ビルド後のアプリケーションを起動
- **リント**: `pnpm lint` - Biomeを使用してコードをチェック
- **フォーマット**: `pnpm format` - Biomeを使用してコードをフォーマット

## 🎨 コーディング規約

### TypeScript

- TypeScript 5のstrict modeを使用
- 型定義を明確に記述
- React関数コンポーネントを優先
- サーバーコンポーネントを適切に活用

### スタイリング

- Tailwind CSS v4を使用
- `@/*` エイリアスで `apps/base/src` 以下のファイルを参照
- `globals.css` の CSS変数を色とフォントの基準として使用
- Tailwindユーティリティクラスは論理的順序で配置（layout → spacing → typography）

### コード品質

- 2スペースインデント
- Biomeによる自動フォーマットとリント
- インポート順序の統一
- PRを開く前にlint/formatスクリプトの実行を必須とする

## 🧪 テスト

現在、自動テストは設定されていません。今後の機能追加では以下を導入予定：

- **テストフレームワーク**: Vitest + React Testing Library
- **カバレッジ目標**: 新規コードで80%以上
- **テスト配置**: `*.test.tsx` または `__tests__` フォルダ内

## 📝 コミット規約

Conventional Commitsを使用しています：

- `feat:` - 新機能の追加
- `fix:` - バグ修正
- `chore:` - メンテナンス作業
- `docs:` - ドキュメント更新

例：

```
feat: ユーザー認証機能を追加
fix: レスポンシブデザインの不具合を修正
chore: 依存関係を更新
```

## 🤝 貢献

1. このリポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'feat: 素晴らしい機能を追加'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

### プルリクエストガイドライン

- 変更内容を明確に説明
- 関連するissueをリンク
- UI変更がある場合はスクリーンショットを含める
- 後続作業や技術的負債について言及

## 📄 ライセンス

このプロジェクトは [LICENSE.md](LICENSE.md) で定義されたライセンスの下で公開されています。

## 🔗 関連リンク

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Biome Documentation](https://biomejs.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

---

**開発者向け詳細情報**: [AGENTS.md](AGENTS.md) を参照してください。
