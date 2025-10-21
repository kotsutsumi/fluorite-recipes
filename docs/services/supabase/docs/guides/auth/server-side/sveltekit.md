# SvelteKitでのサーバーサイド認証

このガイドでは、SvelteKitアプリケーションでSupabaseを使用したサーバーサイド認証を実装するためのステップバイステップのチュートリアルを提供します。

## 1. パッケージのインストール

必要なパッケージをインストールします：

```bash
npm install @supabase/supabase-js @supabase/ssr
```

## 2. 環境変数の設定

`.env.local`ファイルを作成し、以下の環境変数を設定します：

```
PUBLIC_SUPABASE_URL=<your_supabase_project_url>
PUBLIC_SUPABASE_PUBLISHABLE_KEY=<publishable_key>
```

## 3. サーバーサイドフックの設定

`hooks.server.ts`ファイルは以下の目的で重要です：

- リクエスト固有のSupabaseクライアントの作成
- ユーザー認証の確認
- 保護されたページのガード

## 4. TypeScript定義の追加

`app.d.ts`を更新して、`event.locals`のSupabase固有の型を含めます。

## 5. ルートレイアウトでSupabaseクライアントを作成

`+layout.ts`と`+layout.server.ts`でサーバーサイドとクライアントサイドの両方の対話用にクライアントをセットアップします。

## 6. 認証イベントのリッスン

`+layout.svelte`でイベントリスナーを実装して、セッションの更新とサインアウトを処理します。

## 7. 認証ルートの作成

- ログイン/サインアップページ
- メール確認ルート
- プライベートルートの保護

## まとめ

このガイドでは、SvelteKitとSupabaseの統合を包括的にカバーし、安全なサーバーサイド認証フローの作成を重点的に説明しています。

## リソース

- [SvelteKit公式ドキュメント](https://kit.svelte.dev/docs)
- [Supabase Auth ドキュメント](https://supabase.com/docs/guides/auth)
