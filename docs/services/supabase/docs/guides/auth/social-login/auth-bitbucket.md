# Bitbucketでログイン | Supabase ドキュメント

## 概要

SupabaseプロジェクトにBitbucket認証を設定するには、主に3つのステップがあります。

1. Bitbucket OAuth Consumerを作成・設定する
2. SupabaseプロジェクトにBitbucket OAuth Consumerキーを追加する
3. Supabase JSクライアントアプリにログインコードを追加する

## Bitbucketアカウントにアクセスする

- [bitbucket.org](https://bitbucket.org/)にアクセス
- 右上の「Login」をクリック

## コールバックURLを確認する

コールバックURLは次のような形式になります: `https://<project-ref>.supabase.co/auth/v1/callback`

確認手順:
- Supabaseプロジェクトダッシュボードにアクセス
- 「Authentication」アイコンをクリック
- 「Providers」をクリック
- Bitbucketを選択
- コールバックURLをコピー

## Bitbucket OAuth Appを作成する

1. 左下のプロフィールアイコンをクリック
2. 「All Workspaces」をクリック
3. ワークスペースを選択
4. 「Settings」をクリック
5. 「OAuth consumers」をクリック
6. 「Add Consumer」をクリック
7. アプリ名を入力
8. コールバックURLを入力
9. 必要な権限にチェック（Email、Read推奨）
10. 保存して、Key（client_key）とSecret（client_secret）をコピー

## Supabaseに認証情報を追加する

- Supabaseプロジェクトダッシュボードにアクセス
- Authenticationをクリック
- Providersをクリック
- Bitbucketを有効化
- Client IDとClient Secretを入力
- 保存

## ログインコードを追加する

サインイン用のJavaScriptの例:

```javascript
async function signInWithBitbucket() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'bitbucket'
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
- [Bitbucketアカウント](https://bitbucket.org)
