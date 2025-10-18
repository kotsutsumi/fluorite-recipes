# WorkOSでSSOとソーシャルログイン

## WorkOSでソーシャルログインを使用

### ステップ1. WorkOS organizationを作成

WorkOSダッシュボードにログインし、Organizationsタブにアクセスして組織を作成します。

あるいは、[WorkOS APIを使用して組織を作成](https://workos.com/docs/reference/organization/create)することもできます。

### ステップ2. `Client ID`と`WORKOS_API_KEY`の値を取得

[WorkOS Dashboard](https://dashboard.workos.com/get-started)のはじめにページにアクセスします。Quickstartパネルから以下の値をコピーします：

- `WORKOS_CLIENT_ID`
- `WORKOS_API_KEY`

> これらの値を表示するにはサインインしている必要があります。

### ステップ3. WorkOSの認証情報をSupabaseプロジェクトに追加

1. Supabaseプロジェクトダッシュボードに移動
2. 左サイドバーでAuthenticationアイコンをクリック（上部付近）
3. ConfigurationセクションのProvidersをクリック
4. アコーディオンリストからWorkOSをクリックして展開
5. `WorkOS Enabled`スイッチをONに切り替え
6. WorkOS URLフィールドに`https://api.workos.com`を入力
7. 前のステップで保存したWorkOS Client IDとWorkOS Client Secretを入力
8. フォームから`Callback URL (for OAuth)`の値をコピーして、どこかに保存
9. Saveをクリック

Management APIを使用してWorkOS認証プロバイダーを設定することもできます：

```bash
# https://supabase.com/dashboard/account/tokensからアクセストークンを取得
export SUPABASE_ACCESS_TOKEN="your-access-token"
export PROJECT_REF="your-project-ref"

# WorkOS認証プロバイダーを設定
curl -X PATCH "https://api.supabase.com/v1/projects/$PROJECT_REF/config/auth" \
  -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "external_workos_enabled": true,
    "external_workos_url": "https://api.workos.com",
    "external_workos_client_id": "your-workos-client-id",
    "external_workos_secret": "your-workos-secret"
  }'
```

### ステップ4. WorkOSにリダイレクトURIを追加

1. WorkOSダッシュボードの[Redirects](https://dashboard.workos.com/redirects)セクションに移動
2. ステップ3で保存した`Callback URL`を追加
3. Saveをクリック

### ステップ5. Supabase JSクライアントアプリにログインコードを追加

WorkOS認証プロバイダーを使用してログインするには、組織IDを指定する必要があります。組織IDは、ステップ1で作成した組織のIDです。

JavaScriptクライアントライブラリを使用する場合は、[signInWithOAuth()](/docs/reference/javascript/auth-signinwithoauth)メソッドを呼び出します：

```js
async function signInWithWorkOS() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'workos',
    options: {
      queryParams: {
        organization: 'org_id_from_step_1',
      },
    },
  })
}
```

また、`connection`パラメータを使用して特定の接続を指定することもできます：

```js
async function signInWithWorkOS() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'workos',
    options: {
      queryParams: {
        connection: 'connection_id',
      },
    },
  })
}
```

`provider`パラメータを使用して特定のプロバイダーを指定することもできます：

```js
async function signInWithWorkOS() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'workos',
    options: {
      queryParams: {
        provider: 'GoogleOAuth', // または他のWorkOSプロバイダー
      },
    },
  })
}
```

認証が完了すると、ユーザーはアプリケーションにリダイレクトされ、ログインした状態になります。

## リソース

- [Supabase - はじめに](/docs/guides/auth)
- [Supabase JSクライアント](https://github.com/supabase/supabase-js)
- [WorkOS Documentation](https://workos.com/docs)
- [WorkOS Dashboard](https://dashboard.workos.com)
