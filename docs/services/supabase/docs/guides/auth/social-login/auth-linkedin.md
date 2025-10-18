# LinkedInでログイン

## 概要

アプリケーションにLinkedInログインを設定するには、3つのパートがあります：
1. LinkedIn Developer DashboardでLinkedInプロジェクトとアプリを作成・設定
2. LinkedIn（OIDC）の`client_id`と`client_secret`をSupabaseプロジェクトに追加
3. Supabase JSクライアントアプリにログインコードを追加

## LinkedIn Developer アカウントにアクセス

1. [LinkedIn Developer Dashboard](https://www.linkedin.com/developers/apps)にアクセス
2. ログイン

## コールバックURLの確認

コールバックURLは次のような形式です：`https://<project-ref>.supabase.co/auth/v1/callback`

手順：
1. Supabaseプロジェクトダッシュボードに移動
2. 「Authentication」アイコンをクリック
3. 「Providers」をクリック
4. 「LinkedIn」をクリックして展開し、コールバックURLを確認

## LinkedIn OAuthアプリの作成

1. LinkedIn Developer Dashboardに移動
2. 「Create App」をクリック
3. LinkedInページとアプリロゴを入力
4. アプリを保存
5. 上部メニューから「Products」をクリック
6. 「Sign In with LinkedIn using OpenID Connect」へのアクセスをリクエスト
7. 上部メニューから「Auth」をクリック
8. リダイレクトURLを追加
9. Client IDとClient Secretをコピーして保存

## Supabaseプロジェクトの設定

1. Supabaseプロジェクトダッシュボードに移動
2. Authentication > Providersをクリック
3. LinkedIn（OIDC）を有効化
4. Client IDとClient Secretを入力
5. 保存

## ログインコードの追加

JavaScriptの例：
```javascript
async function signInWithLinkedIn() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'linkedin_oidc',
  })
}
```

## サインアウト

```javascript
async function signOut() {
  const { error } = await supabase.auth.signOut()
}
```

## LinkedIn Open ID Connect (OIDC) アップデート

Supabaseは、最近のOAuth API変更に対応するため、元のLinkedInプロバイダーを新しいLinkedIn（OIDC）プロバイダーに置き換えています。既存のOAuthアプリケーションを持つ開発者は、新しいアプリケーションを作成するか、既存のアプリケーションを更新する必要があります。

## リソース

- [Supabase - 無料で始める](https://supabase.com)
- [Supabase JSクライアント](https://github.com/supabase/supabase-js)
- [LinkedIn Developer Portal](https://www.linkedin.com/developers/)
