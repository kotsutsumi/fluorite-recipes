# Next.js 12.3

**投稿日**: 2022年9月8日（木曜日）

**著者**:
- Balázs Orbán ([@balazsorban44](https://twitter.com/balazsorban44))
- DongYoon Kang ([@kdy1dev](https://twitter.com/kdy1dev))
- Jiachi Liu ([@huozhi](https://twitter.com/huozhi))
- JJ Kasper ([@_ijjk](https://twitter.com/_ijjk))
- Maia Teegarden ([@padmaia](https://twitter.com/padmaia))
- Shu Ding ([@shuding_](https://twitter.com/shuding_))
- Steven ([@styfle](https://twitter.com/styfle))
- Tim Neutkens ([@timneutkens](https://twitter.com/timneutkens))

## 主な改善点

Next.js 12.3では、いくつかのQOL（生活の質）改善が提供されました：

### 改善されたFast Refresh

`.env`、`jsconfig.json`、`tsconfig.json`ファイルがホットリロードに対応

### TypeScript自動インストール

`.ts`ファイルを追加すると、TypeScriptを自動設定し、依存関係をインストール

### 画像コンポーネント

`next/future/image`が安定版に

### SWCミニファイアー

Next.jsコンパイラーによるミニフィケーションが安定版に

### 新しいルーター + レイアウトアップデート

実装が開始され、新機能が説明されました

## 詳細セクション

### TypeScript自動インストール

Next.jsはTypeScriptファイルを自動的に検出し、必要な依存関係をインストールし、`next dev`と`next build`を実行する際に`tsconfig.json`ファイルを追加します。

### 改善されたFast Refresh

`.env`、`jsconfig.json`、`tsconfig.json`などの設定ファイルをローカル開発サーバーを再起動せずに編集できるようになりました。

### 画像コンポーネント

`next/future/image`コンポーネントが安定版になり、以下の改善が含まれます：
- `fill`レイアウトモードのサポート
- 改善されたブラーアッププレースホルダー
- より良いアクセシビリティ
- 改善されたエラーハンドリング

### SWCミニファイアー

SWCミニファイアーが安定版になり、Terserと比較して7倍高速なミニフィケーションを提供します。

### 新しいルーターとレイアウトアップデート

今後の機能には以下が含まれます：
- ルートグループ
- 即座のローディング状態
- エラーハンドリング
- テンプレート
- ルートのインターセプト
- 並列ルート
- 条件付きルート

## Next.js Conf

10月にコミュニティカンファレンスが発表されました。
