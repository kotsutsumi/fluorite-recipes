# Next.jsでのサーバーサイド認証

このガイドでは、Next.jsアプリケーションでSupabaseを使用したサーバーサイド認証の設定方法を説明します。App RouterとPages Routerの両方をサポートしています。

## 1. パッケージのインストール

必要なパッケージをインストールします：

```bash
npm install @supabase/supabase-js @supabase/ssr
```

## 2. 環境変数の設定

`.env.local`ファイルを作成し、以下の環境変数を設定します：

```
NEXT_PUBLIC_SUPABASE_URL=<your_project_url>
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<your_publishable_key>
```

## 3. Supabaseクライアントユーティリティの作成

2種類のクライアントが必要です：

- **Client Componentクライアント**（ブラウザ用）
- **Server Componentクライアント**（サーバーサイド操作用）

## 4. ミドルウェアの実装

`middleware.ts`を作成して以下を実行します：

- 認証トークンの更新
- Server Componentsへのトークンの受け渡し
- ブラウザCookieの更新

## 5. ログインページの作成

Server Actionsを使用して認証を処理します。

## 6. メール確認の変更

サーバーサイド認証フローをサポートするようにメールテンプレートを更新します。

## 7. Auth確認ルートハンドラーの作成

メール検証とトークン交換を処理します。

## 主な推奨事項

- ページを保護するには、常に`supabase.auth.getUser()`を使用する
- `supabase.auth.getSession()`を信頼しない
- 各ルートで新しいSupabaseクライアントを作成する

## 次のステップ

このガイドは、Next.jsアプリケーションでSupabaseを使用した安全なサーバーサイド認証を実装するための包括的なステップバイステップの手順を提供します。

## リソース

- [Next.js公式ドキュメント](https://nextjs.org/docs)
- [Supabase Auth ドキュメント](https://supabase.com/docs/guides/auth)
