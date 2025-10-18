# Spotifyでログイン

プロジェクトでSpotify認証を有効にするには、Spotify OAuthアプリケーションを設定し、アプリケーションの認証情報をSupabaseダッシュボードに追加する必要があります。

## 概要

アプリケーションにSpotifyログインを設定するには、以下の3つのステップがあります：

- [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/)でSpotifyプロジェクトとアプリを作成・設定する
- [Supabaseプロジェクト](/dashboard)にSpotifyの`API Key`と`API Secret Key`を追加する
- [Supabase JSクライアントアプリ](https://github.com/supabase/supabase-js)にログインコードを追加する

## Spotify Developerアカウントにアクセス

- [Spotify](https://spotify.com)にログイン
- [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)にアクセス

![Spotify Developer Portal](/docs/img/guides/auth-spotify/spotify-portal.png)

## コールバックURLを確認

次のステップではコールバックURLが必要です。コールバックURLは次のような形式です：`https://<project-ref>.supabase.co/auth/v1/callback`

- [Supabaseプロジェクトダッシュボード](/dashboard)に移動
- 左サイドバーの`Authentication`アイコンをクリック
- Configurationセクションの下にある[`Providers`](/dashboard/project/_/auth/providers)をクリック
- アコーディオンリストから**Spotify**をクリックして展開すると**Callback URL**が表示されます。`Copy`をクリックしてクリップボードにコピーできます

> Supabase CLIでOAuthをローカルにテストする場合は、[ローカル開発ドキュメント](/docs/guides/cli/local-development#use-auth-locally)を参照してください。

## Spotify OAuthアプリを作成

- [Spotify](https://spotify.com)にログイン
- [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)に移動
- `Create an App`をクリック
- `App name`を入力
- `App description`を入力
- `Developer TOS and Branding Guidelines`に同意するチェックボックスをオン
- `Create`をクリック
- `Client ID`を保存
- `Client Secret`を保存
- `Edit Settings`をクリック

`Redirect URIs`の下で：
- コールバックURLを`Redirect URIs`に追加
- `Add`をクリック
- `Save`をクリック（ページ下部にスクロール）

## Supabaseプロジェクトに認証情報を追加

- Supabaseプロジェクトダッシュボードに移動
- 左サイドバーの`Authentication`アイコンをクリック
- Configurationセクションの下にある`Providers`をクリック
- アコーディオンリストから**Spotify**をクリックして展開
- `Spotify Enabled`をONに切り替え
- 前のステップで保存した`Spotify Client ID`と`Spotify Client Secret`を入力
- `Save`をクリック

## Supabase JSクライアントアプリにログインコードを追加

JavaScriptクライアントライブラリを使用する場合は、[signInWithOAuth()](/docs/reference/javascript/auth-signinwithoauth)メソッドを呼び出します：

```js
async function signInWithSpotify() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'spotify',
  })
}
```

Flutterクライアントライブラリを使用する場合は、[signInWithOAuth()](/docs/reference/dart/auth-signinwithoauth)メソッドを呼び出します：

```dart
Future<void> signInWithSpotify() async {
  await supabase.auth.signInWithOAuth(OAuthProvider.spotify);
}
```

Kotlinクライアントライブラリを使用する場合は、[loginWith(Provider)](/docs/reference/kotlin/auth-signinwithoauth)メソッドを呼び出します：

```kotlin
suspend fun signInWithSpotify() {
	supabase.auth.signInWith(Spotify)
}
```

認証が完了すると、ユーザーはアプリケーションにリダイレクトされ、ログインした状態になります。

## リソース

- [Supabase - はじめに](/docs/guides/auth)
- [Supabase JSクライアント](https://github.com/supabase/supabase-js)
- [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
