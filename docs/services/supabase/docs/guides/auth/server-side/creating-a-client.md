# SSR用のSupabaseクライアントの作成

## 概要

このドキュメントでは、JavaScript/TypeScriptアプリケーション向けに`@supabase/ssr`パッケージを使用してServer-Side Rendering（SSR）用のSupabaseクライアントを設定する方法を説明します。

## 主な手順

### 1. インストール

必要なパッケージをインストールします：

```bash
npm install @supabase/ssr @supabase/supabase-js
```

### 2. 環境変数

環境変数にSupabase URLとキーを設定します：

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_key
```

### 3. クライアントの作成

ドキュメントでは、Cookieベースの認証用にSupabaseクライアントを設定するユーティリティコードの作成を強調しています。

### サポートされているフレームワーク

このガイドでは、以下のフレームワークに対する具体的な実装の詳細を提供しています：

- Next.js
- SvelteKit
- Astro
- Remix
- React Router
- Express
- Hono

### 主な推奨事項

- クライアントサイドコードにはブラウザクライアントを使用
- サーバーサイドコードにはサーバークライアントを使用
- Cookie更新を処理するためのミドルウェアを設定

## 次のステップ

ドキュメントでは以下を提案しています：

- メール/パスワード認証の実装
- OAuth認証の実装
- Server-Side Renderingの詳細な学習

## まとめ

このガイドは包括的で、SSRアプリケーションでSupabaseを統合するためのフレームワーク固有の実装の詳細を提供しています。

## リソース

- [Supabase公式ドキュメント](https://supabase.com/docs)
- [SSRに関する詳細](https://supabase.com/docs/guides/auth/server-side)
