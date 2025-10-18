# GitHubでログイン | Supabase ドキュメント

## 概要

アプリケーションにGitHub認証を設定するには、主に3つのステップがあります。

1. GitHub上でGitHub OAuth Appを作成・設定する
2. SupabaseプロジェクトにGitHub OAuthキーを追加する
3. Supabase JSクライアントアプリにログインコードを追加する

## コールバックURLを確認する

- Supabaseプロジェクトダッシュボードにアクセス
- 左サイドバーの「Authentication」をクリック
- Configurationの下の「Providers」をクリック
- 「GitHub」をクリックして展開し、コールバックURLを確認

> Supabase CLIを使用してローカルでOAuthをテストする場合は、[ローカル開発ドキュメント](https://supabase.com/docs/guides/cli/local-development#use-auth-locally)を参照してください。

## GitHubで新しいOAuthアプリケーションを登録する

1. [OAuth appsページ](https://github.com/settings/developers)に移動
2. 「Register a new application」をクリック
3. 以下を入力:
   - Application name（アプリケーション名）
   - Homepage URL（ホームページURL）
   - Authorization callback URL（認証コールバックURL）
4. 「Enable Device Flow」はチェックを外したままにする
5. 「Register Application」をクリック

## OAuth認証情報をコピーする

- Client IDをコピーして保存
- 新しいclient secretを生成して保存

## SupabaseにGitHub認証情報を入力する

1. Supabaseプロジェクトダッシュボードにアクセス
2. 「Authentication」をクリック
3. 「Providers」をクリック
4. GitHubを有効化
5. Client IDとClient Secretを入力
6. 「Save」をクリック

## クライアントアプリにログインコードを追加する

### JavaScriptの例

```javascript
async function signInWithGithub() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
  })
}
```

### サインアウト

```javascript
async function signOut() {
  const { error } = await supabase.auth.signOut()
}
```

## リソース

- [Supabase - 無料で始める](https://supabase.com)
- [Supabase JSクライアント](https://github.com/supabase/supabase-js)
- [GitHub開発者設定](https://github.com/settings/developers)
