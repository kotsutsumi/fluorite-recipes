# 上級ガイド：Server-Side Rendering（SSR）認証

## 主な認証の詳細

ユーザーがSupabase Authで認証すると、2つの重要な情報が発行されます：

1. **アクセストークン**：JWT（JSON Web Token）
2. **リフレッシュトークン**：ランダムに生成された文字列

### デフォルトの動作

- SSRなし：トークンはローカルストレージに保存される
- SSRあり：トークンはサーバーがアクセスできるように安全なCookieに保存される必要がある

### PKCEフローの推奨

ドキュメントでは、サーバーサイドレンダリングのために、Implicit FlowからPKCE（Proof Key for Code Exchange）フローへの移行を推奨しています。

## 仕組み

PKCEフローでは：

- URLに認証コードを含むリダイレクトが発生
- `exchangeCodeForSession`メソッドがセッション情報を取得
- トークンはCookieに保存され、クライアントとサーバー間で共有される

## 注目すべき推奨事項

### 1. Next.jsルートプリフェッチングの場合

- サインイン後にユーザーを特定のページにリダイレクト
- トークンが処理される前のルートプリフェッチングを避ける

### 2. トークンストレージ

- トークンはアプリケーションコンポーネント全体でアクセス可能である必要がある
- Supabaseクライアントライブラリでカスタマイズ可能な`storage`オプションを使用

## サポートされている認証フロー

PKCEは現在、以下をサポートしています：

- Magic Link
- OAuth
- サインアップ
- パスワードリカバリー

このガイドでは、サーバーサイドレンダリングシナリオにおける柔軟性と安全なトークン管理を強調しています。

## リソース

- [Supabase Auth ドキュメント](https://supabase.com/docs/guides/auth)
- [PKCEフローについて](https://supabase.com/docs/guides/auth/sessions/pkce-flow)
