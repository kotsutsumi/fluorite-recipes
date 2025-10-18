# Slackでログイン

プロジェクトでSlack認証を有効にするには、Slack OAuthアプリケーションを設定し、アプリケーションの認証情報をSupabaseダッシュボードに追加する必要があります。

## 概要

> 既存のSlackプロバイダーを新しいSlack (OIDC) プロバイダーに置き換える予定です。2024年6月24日以前に作成されたSlack OAuthアプリケーションを使用している開発者は、新しいアプリケーションを作成し、SlackプロバイダーからSlack (OIDC) プロバイダーに認証情報を移行する必要があります。

アプリケーションにSlackログインを設定するには、以下の3つのステップがあります：
- Slack Developer DashboardでSlackプロジェクトとアプリを作成・設定する
- SupabaseプロジェクトにSlackの`API Key`と`API Secret Key`を追加する
- Supabase JSクライアントアプリにログインコードを追加する

## Slack Developerアカウントにアクセス

- [api.slack.com](https://api.slack.com/apps)にアクセス
- 右上の`Your Apps`をクリックしてログイン

![Slack Developer Portal](/docs/img/guides/auth-slack/slack-portal.png)

## コールバックURLを確認

コールバックURLは次のような形式です：`https://<project-ref>.supabase.co/auth/v1/callback`

- Supabaseプロジェクトダッシュボードに移動
- 左サイドバーの`Authentication`アイコンをクリック
- Configurationセクションの下にある`Providers`をクリック
- アコーディオンリストから**Slack**をクリックして展開し、**Callback URL**を確認

## Slack OAuthアプリを作成

- [api.slack.com](https://api.slack.com/apps)にアクセス
- `Create New App`をクリック

`Create an app...`の下で：
- `From scratch`をクリック
- アプリの名前を入力
- `Slack Workspace`を選択
- `Create App`をクリック

`App Credentials`の下で：
- 新しく生成された`Client ID`をコピーして保存
- 新しく生成された`Client Secret`をコピーして保存

`OAuth & Permissions`の下で、`Redirect URLs`を探します：
- `Add New Redirect URL`をクリック
- `Callback URL`を貼り付けて、`Add`をクリック
- `Save URLs`をクリック

## Supabaseプロジェクトに認証情報を追加

- Supabaseプロジェクトダッシュボードに移動
- 左サイドバーの`Authentication`アイコンをクリック
- Configurationセクションの下にある`Providers`をクリック
- アコーディオンリストから**Slack**をクリックして展開
- `Slack Enabled`をONに切り替え
- 前のステップで保存した`Slack Client ID`と`Slack Client Secret`を入力
- `Save`をクリック

## Supabase JSクライアントアプリにログインコードを追加

JavaScriptクライアントライブラリを使用する場合は、[signInWithOAuth()](/docs/reference/javascript/auth-signinwithoauth)メソッドを呼び出します：

```js
async function signInWithSlack() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'slack',
  })
}
```

Flutterクライアントライブラリを使用する場合は、[signInWithOAuth()](/docs/reference/dart/auth-signinwithoauth)メソッドを呼び出します：

```dart
Future<void> signInWithSlack() async {
  await supabase.auth.signInWithOAuth(OAuthProvider.slack);
}
```

Kotlinクライアントライブラリを使用する場合は、[loginWith(Provider)](/docs/reference/kotlin/auth-signinwithoauth)メソッドを呼び出します：

```kotlin
suspend fun signInWithSlack() {
	supabase.auth.signInWith(Slack)
}
```

認証が完了すると、ユーザーはアプリケーションにリダイレクトされ、ログインした状態になります。

## リソース

- [Supabase - はじめに](/docs/guides/auth)
- [Supabase JSクライアント](https://github.com/supabase/supabase-js)
- [Slack Developer Dashboard](https://api.slack.com/apps)
