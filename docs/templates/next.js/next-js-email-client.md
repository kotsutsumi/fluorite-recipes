# Next.js Email Client

## 概要

Next.jsで構築されたメールクライアントテンプレートで、高度なApp Router機能を実証し、洗練されたメール閲覧体験を実現します。

**デモ**: https://next-email-client.vercel.app/f/inbox
**GitHub**: https://github.com/leerob/next-email-client

## 主な機能

- カラムレイアウトでルート間を移動しながらスクロール位置を維持
- JavaScriptなしでフォームを送信
- ルート間の高速ナビゲーション
- リロード時にUI位置を保持
- メール検索
- スレッド表示
- メール作成
- メール削除

## 技術スタック

- **フレームワーク**: Next.js
- **データベース**: Postgres
- **ORM**: Drizzle
- **スタイリング**: Tailwind CSS
- **UIライブラリ**: shadcn/ui

## 実装済み機能

- ✅ 検索機能
- ✅ プロフィールサイドバー
- ✅ スレッドとメール表示
- ✅ 作成ビュー
- ✅ メール削除

## 今後の改善予定

- サイドプロフィールの動的化
- Markdownサポート
- キーボードショートカット実装
- 日付フォーマットの改善
- ダークモードスタイルの追加

## 開発

### 依存関係のインストール

```bash
pnpm install
```

### 開発サーバーの起動

```bash
pnpm dev
```

### 環境変数の設定

データベース接続には、`.env.local`ファイルに以下の環境変数を設定してください:

```
DATABASE_URL=your_postgres_connection_string
```

## 使用例

- メールクライアントアプリケーション
- 受信トレイ管理システム
- メールマーケティングプラットフォーム

## リソース

- [Next.js Documentation](https://nextjs.org/docs)
- [Drizzle ORM](https://orm.drizzle.team/)
- [shadcn/ui](https://ui.shadcn.com/)

## デプロイ

Vercelでの簡単なデプロイが可能です。

## 注意事項

このテンプレートは、Next.js App Routerの高度な機能を学習したい開発者に最適です。
