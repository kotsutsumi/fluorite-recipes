# Zoomでログイン

プロジェクトでZoom認証を有効にするには、Zoom OAuthアプリケーションを設定し、アプリケーションの認証情報をSupabaseダッシュボードに追加する必要があります。

## 概要

アプリケーションにZoomログインを設定するには、以下の3つのステップがあります：
- [Zoom App Marketplace](https://marketplace.zoom.us/)でZoom OAuthアプリを作成・設定する
- [Supabaseプロジェクト](/dashboard)にZoom OAuthキーを追加する
- [Supabase JSクライアントアプリ](https://github.com/supabase/supabase-js)にログインコードを追加する

## Zoom Developerアカウントにアクセス

- [marketplace.zoom.us](https://marketplace.zoom.us/)にアクセス
- 右上の`Sign In`をクリックしてログイン

![Zoom Developer Portal](/docs/img/guides/auth-zoom/zoom-portal.png)

## コールバックURLを確認

次のステップではコールバックURLが必要です。コールバックURLは次のような形式です：`https://<project-ref>.supabase.co/auth/v1/callback`

- [Supabaseプロジェクトダッシュボード](/dashboard)に移動
- 左サイドバーの`Authentication`アイコンをクリック
- Configurationセクションの下にある[`Providers`](/dashboard/project/_/auth/providers)をクリック
- アコーディオンリストから**Zoom**をクリックして展開すると**Callback URL**が表示されます

## Zoom OAuthアプリを作成

- [marketplace.zoom.us](https://marketplace.zoom.us/)にアクセス
- 右上の`Sign In`をクリックしてログイン
- `Build App`をクリック（Developドロップダウンから）
- OAuthカードで`Create`をクリック
- アプリの名前を入力
- アプリタイプを選択
- `Create`をクリック

`App credentials`の下で：
- `Client ID`をコピーして保存
- `Client secret`をコピーして保存
- OAuth許可リストに`Callback URL`を追加

`Redirect URL for OAuth`の下で：
- `Callback URL`を貼り付け

`Scopes`の下で：
- `Add scopes`をクリック
- `User`をクリック
- `user:read`を選択（または必要な他のスコープ）
- `Done`をクリック
- `Continue`をクリック

## Supabaseプロジェクトに認証情報を追加

- Supabaseプロジェクトダッシュボードに移動
- 左サイドバーの`Authentication`アイコンをクリック
- Configurationセクションの下にある`Providers`をクリック
- アコーディオンリストから**Zoom**をクリックして展開
- `Zoom Enabled`をONに切り替え
- 前のステップで保存した`Zoom Client ID`と`Zoom Client Secret`を入力
- `Save`をクリック

## Supabase JSクライアントアプリにログインコードを追加

JavaScriptクライアントライブラリを使用する場合は、[signInWithOAuth()](/docs/reference/javascript/auth-signinwithoauth)メソッドを呼び出します：

```js
async function signInWithZoom() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'zoom',
  })
}
```

Flutterクライアントライブラリを使用する場合は、[signInWithOAuth()](/docs/reference/dart/auth-signinwithoauth)メソッドを呼び出します：

```dart
Future<void> signInWithZoom() async {
  await supabase.auth.signInWithOAuth(OAuthProvider.zoom);
}
```

Kotlinクライアントライブラリを使用する場合は、[loginWith(Provider)](/docs/reference/kotlin/auth-signinwithoauth)メソッドを呼び出します：

```kotlin
suspend fun signInWithZoom() {
	supabase.auth.signInWith(Zoom)
}
```

認証が完了すると、ユーザーはアプリケーションにリダイレクトされ、ログインした状態になります。

## リソース

- [Supabase - はじめに](/docs/guides/auth)
- [Supabase JSクライアント](https://github.com/supabase/supabase-js)
- [Zoom App Marketplace](https://marketplace.zoom.us/)
