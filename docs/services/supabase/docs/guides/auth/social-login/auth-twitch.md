# Twitchでログイン

プロジェクトでTwitch認証を有効にするには、Twitchアプリケーションを設定し、アプリケーションのOAuth認証情報をSupabaseダッシュボードに追加する必要があります。

## 概要

アプリケーションにTwitchログインを設定するには、以下の3つのステップがあります：
- [Twitch Developer Console](https://dev.twitch.tv/console)でTwitchアプリケーションを作成・設定する
- [Supabaseプロジェクト](/dashboard)にTwitch OAuthコンシューマーキーを追加する
- [Supabase JSクライアントアプリ](https://github.com/supabase/supabase-js)にログインコードを追加する

## Twitch Developerアカウントにアクセス

- [dev.twitch.tv](https://dev.twitch.tv)にアクセス
- 右上の`Log in with Twitch`をクリックしてログイン
- Twitchアカウントで2要素認証をまだ有効にしていない場合は、続行する前に[Twitch Security Settings](https://www.twitch.tv/settings/security)で有効にする必要があります

![Twitch Developer Page](/docs/img/guides/auth-twitch/twitch-developer.png)

## コールバックURLを確認

次のステップではコールバックURLが必要です。コールバックURLは次のような形式です：`https://<project-ref>.supabase.co/auth/v1/callback`

- [Supabaseプロジェクトダッシュボード](/dashboard)に移動
- 左サイドバーの`Authentication`アイコンをクリック
- Configurationセクションの下にある[`Providers`](/dashboard/project/_/auth/providers)をクリック
- アコーディオンリストから**Twitch**をクリックして展開すると**Callback URL**が表示されます。`Copy`をクリックしてクリップボードにコピーできます

## Twitchアプリケーションを作成

- [Twitch Developer Console](https://dev.twitch.tv/console)に移動
- 右上の`Register Your Application`をクリック（または`Your Console`の下にある`Applications`をクリックしてから`Register Your Application`をクリック）

`Developer Applications`の下で：
- アプリケーションの名前を入力
- コールバックURLを`OAuth Redirect URLs`に追加
- 適切な`Category`を選択
- `I'm not a robot`のチェックボックスをクリック
- `Create`をクリック

`Applications`の下で：
- 作成したアプリケーションエントリの`Manage`をクリック
- `Client ID`をコピーして保存
- `New Secret`をクリックして新しい`Client Secret`を作成
- `Client Secret`をコピーして保存

## Supabaseプロジェクトに認証情報を追加

- Supabaseプロジェクトダッシュボードに移動
- 左サイドバーの`Authentication`アイコンをクリック
- Configurationセクションの下にある`Providers`をクリック
- アコーディオンリストから**Twitch**をクリックして展開
- `Twitch Enabled`をONに切り替え
- 前のステップで保存した`Twitch Client ID`と`Twitch Client Secret`を入力
- `Save`をクリック

## Supabase JSクライアントアプリにログインコードを追加

JavaScriptクライアントライブラリを使用する場合は、[signInWithOAuth()](/docs/reference/javascript/auth-signinwithoauth)メソッドを呼び出します：

```js
async function signInWithTwitch() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'twitch',
  })
}
```

Flutterクライアントライブラリを使用する場合は、[signInWithOAuth()](/docs/reference/dart/auth-signinwithoauth)メソッドを呼び出します：

```dart
Future<void> signInWithTwitch() async {
  await supabase.auth.signInWithOAuth(OAuthProvider.twitch);
}
```

Kotlinクライアントライブラリを使用する場合は、[loginWith(Provider)](/docs/reference/kotlin/auth-signinwithoauth)メソッドを呼び出します：

```kotlin
suspend fun signInWithTwitch() {
	supabase.auth.signInWith(Twitch)
}
```

認証が完了すると、ユーザーはアプリケーションにリダイレクトされ、ログインした状態になります。

## リソース

- [Supabase - はじめに](/docs/guides/auth)
- [Supabase JSクライアント](https://github.com/supabase/supabase-js)
- [Twitch Developer Console](https://dev.twitch.tv/console)
