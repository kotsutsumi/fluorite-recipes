# リポジトリガイドライン

## プロジェクト構造とモジュール構成

- **`apps/nextjs/base`**: Next.js 15 App Router Webアプリケーション。ルートは `src/app` に配置され、`layout.tsx` が共有レイアウトを定義し、`page.tsx` がデフォルトビューをレンダリングします。Tailwindトークンは `globals.css` に、静的アセットは `public/` に配置します。
- **`apps/expo/base`**: Expo Routerモバイルクライアント。画面は `app/` 配下にあり、共有UIは `components/`、フックは `hooks/`、デバイスアセットは `assets/` に配置します。
- テストハーネスが導入されたら、機能の隣に `*.test.tsx` ファイルとして、または兄弟の `__tests__/` ディレクトリにテストを追加します。

## ビルド、テスト、開発コマンド

- 各アプリ内で `pnpm install`（または `npm install`）を実行して、そのロックファイルを尊重します。
- **Next.js**: `apps/nextjs/base` から `pnpm dev`、`pnpm build`、`pnpm start`、`pnpm lint`、`pnpm format` を実行。Turbopackが `dev`/`build` を強化し、Biomeがlintとフォーマットをサポートします。
- **Expo**: `apps/expo/base` から `pnpm start`、`pnpm ios`、`pnpm android`、`pnpm web`、`pnpm lint` を実行。
- 新しいスクリプトや環境要件は、アプリ固有の `README.md` に記載します。

## コーディングスタイルと命名規則

- TypeScript 5の `strict` モードをデフォルトとします。コンポーネントは型付けし、ルートがサーバーに留まる場合はサーバーコンポーネントを優先します。
- Biomeは Next.js アプリで2スペースインデント、インポート順序、フォーマットを強制します。これを実行せずにコミットしないでください。
- `apps/nextjs/base/src` 配下のインポートには `@/*` エイリアスを使用します。
- Tailwindユーティリティは layout → spacing → typography の順序で配置し、`globals.css` で定義されたトークンに依存します。
- Expoコードは `eslint-config-expo` に従います。フックとコンポーネントには説明的な名前を選択します（`useRecipeFilters`、`RecipeCard`）。

## テストガイドライン

- 自動テストはまだ設定されていません。新しい作業では Vitest + React Testing Library を導入し、80%以上のカバレッジを目指し、実装の隣に仕様を保存する必要があります。
- スイートが存在したら、必要な環境変数とともに `pnpm test` の実行方法を文書化します。
- ナビゲーションフロー（Next.jsルート変更、Expoタブスタック）と非同期データソースの統合スモークチェックを追加します。

## コミットとプルリクエストガイドライン

- 狭いスコープでConventional Commits（`feat:`、`fix:`、`chore:`）を使用します。各コミット前にlintとformatスクリプトを実行します。
- PRには明確な要約、リンクされたissue、UI変更のスクリーンショットまたは録画、フォローアップ項目やリスクのチェックリストが必要です。
- PR本文で環境変更、スキーマ更新、新しいコマンドを強調表示します。

## 環境とツール

- Voltaまたはnvmを介して、両方のアプリでNode 18.18+または20.xをサポートします。
- 依存関係管理にはpnpmを優先し、ロックファイルの混在を避けます。
- シークレットは `.env.local`（Next.js）またはExpo設定サービスに保管します。認証情報を決してコミットしないでください。
