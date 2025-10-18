# Auth HelpersからSSRパッケージへの移行

このドキュメントでは、Supabase Auth Helpersから新しいSSRパッケージへの移行ガイドを提供します。

## 概要

「新しい`ssr`パッケージは、Auth Helpersのコアコンセプトを取り入れ、任意のサーバー言語やフレームワークで利用できるようにします。」

## Supabaseパッケージの置き換え

このガイドでは、さまざまなフレームワークのパッケージアンインストール手順を提供しています：

### Next.js

```bash
npm uninstall @supabase/auth-helpers-nextjs
```

### SvelteKit

```bash
npm uninstall @supabase/auth-helpers-sveltekit
```

### Remix

```bash
npm uninstall @supabase/auth-helpers-remix
```

## クライアントの作成

「新しい`ssr`パッケージは、Supabaseクライアントを作成するための2つの関数をエクスポートします：

- `createBrowserClient`（クライアントで使用）
- `createServerClient`（サーバーで使用）」

## 次のステップ

1. メールとパスワードを使用した認証の実装
2. OAuthを使用した認証の実装
3. Server-Side Rendering（SSR）の詳細な学習

フレームワーク固有の例については、「クライアントの作成」ページを確認することをドキュメントは推奨しています。

## リソース

- [Supabase SSRドキュメント](https://supabase.com/docs/guides/auth/server-side)
- [Auth Helpers移行ガイド](https://supabase.com/docs/guides/auth/server-side/migrating-to-ssr-from-auth-helpers)
