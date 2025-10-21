# Twitterでログイン

## 概要

Supabaseプロジェクト用のTwitter認証のセットアップには、以下の3つの主要なステップがあります：

1. Twitter Developer DashboardでTwitterプロジェクトとアプリを作成
2. Supabaseプロジェクトにtwitter認証情報を追加
3. クライアントアプリケーションにログインコードを追加

## 前提条件

- Twitter Developerアカウント
- Supabaseプロジェクト

## 詳細手順

### 1. Twitter Developerアカウントにアクセス

- [developer.twitter.com](https://developer.twitter.com)にアクセス
- アカウントにサインイン

### 2. コールバックURLを見つける

- Supabaseプロジェクトダッシュボードに移動
- Authentication > Providersに移動
- 「Callback URL」を見つけてコピー

### 3. Twitter OAuthアプリを作成

- 「+ Create Project」をクリック
- プロジェクトの詳細を入力
- アプリを作成
- 以下を保存：
  - API Key（client_id）
  - API Secret Key（client_secret）

### 4. Twitterアプリ設定を構成

- 「Request email from users」を有効化
- アプリタイプを「Web App」に設定
- 以下を設定：
  - コールバックURL
  - WebサイトURL
  - 利用規約URL
  - プライバシーポリシーURL

### 5. Supabaseに認証情報を追加

- Supabaseプロジェクトダッシュボードに移動
- Authentication > Providers
- Twitterを有効化
- クライアントIDとクライアントシークレットを入力

### 6. ログインコードを追加（JavaScriptの例）

```javascript
async function signInWithTwitter() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'twitter'
  })
}
```

### 7. サインアウト

```javascript
async function signOut() {
  const { error } = await supabase.auth.signOut()
}
```

## リソース

- [Supabase](https://supabase.com)
- [Supabase JSクライアント](https://github.com/supabase/supabase-js)
- [Twitter Developer Dashboard](https://developer.twitter.com/en/portal/dashboard)
