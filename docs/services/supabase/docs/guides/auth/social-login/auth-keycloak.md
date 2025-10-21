# Keycloakでログイン

## 概要

Supabaseプロジェクトで Keycloak Auth を有効にするには、Keycloak OAuthアプリケーションを設定し、認証情報をSupabaseダッシュボードに追加する必要があります。

### Keycloakを始める

DockerコンテナでKeycloakを実行：
```bash
docker run -p 8080:8080 -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin quay.io/keycloak/keycloak:latest start-dev
```

### Keycloak OAuth設定手順

1. 指定したKeycloakレルムで新しいクライアントを作成
2. 「OpenID Endpoint Configuration」から`issuer`を取得
3. クライアントプロトコルが`openid-connect`に設定されていることを確認
4. アクセスタイプを「confidential」に設定
5. 「Client ID」を`client id`として使用
6. 認証情報タブから「Secret」を取得し、`client secret`として使用
7. アプリケーションのコールバックURLを許可リストに追加

## Keycloak管理コンソールにアクセス

- `http://localhost:8080`にアクセスし、「Administration Console」をクリック

## Keycloakレルムの作成

- サイドパネルから新しいレルムを追加
- レルム設定またはOpenID設定エンドポイントから`issuer`を取得

## Keycloakクライアントの作成

「Client ID」が認証の`client_id`として機能します。

## クライアント設定

以下の重要な設定を行います：
1. Client Protocol: `openid-connect`
2. Access Type: 「confidential」
3. Valid Redirect URIs: `https://<project-ref>.supabase.co/auth/v1/callback`

## ログインコードの例

Keycloakバージョン22以降では、`openid`スコープを含める必要があります：

```javascript
async function signInWithKeycloak() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'keycloak',
    options: {
      scopes: 'openid',
    },
  })
}
```

## サインアウト

```javascript
async function signOut() {
  const { error } = await supabase.auth.signOut()
}
```

## リソース

- [Supabase - 無料で始める](https://supabase.com)
- [Supabase JSクライアント](https://github.com/supabase/supabase-js)
- [Keycloak公式ドキュメント](https://www.keycloak.org/documentation)
