# Notionでログイン

## 概要

アプリケーションにNotionログインを設定するには、3つのパートがあります：
1. [Notion Developer Portal](https://www.notion.so/my-integrations)でNotionアプリケーションを作成・設定
2. OAuth client IDとclient secretを取得し、Supabaseプロジェクトに追加
3. Supabase JSクライアントアプリにログインコードを追加

## Notion Integrationの作成

手順：
1. [developers.notion.com](https://developers.notion.com/)にアクセス
2. 「View my integrations」をクリックしてログイン
3. [notion.so/my-integrations](https://notion.so/my-integrations)に移動
4. 新しいintegrationを作成
5. 「Public integration」と「Read user information including email addresses」を選択
6. リダイレクトURIを追加
7. 「Submit」をクリック

## リダイレクトURIの追加

- integrationを作成後、「Redirect URIs」を追加
- コールバックURLは次のような形式です：`https://<project-ref>.supabase.co/auth/v1/callback`
- 具体的なコールバックURLは、Supabaseプロジェクトダッシュボードの Authentication > Providers > Notion で確認できます

## SupabaseにNotion認証情報を追加

1. NotionからOAuth client IDとclient secretを取得
2. Supabaseプロジェクトダッシュボードに移動
3. Authentication > Providersをクリック
4. Notionを有効化
5. Client IDとClient Secretを入力
6. 保存

## クライアントアプリにログインコードを追加

サインインのJavaScript例：
```javascript
async function signInWithNotion() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'notion'
  })
}
```

サーバーサイド認証の場合、`signInWithOAuth`を呼び出す際に`redirectTo`URLを指定します。

## サインアウト

```javascript
async function signOut() {
  const { error } = await supabase.auth.signOut()
}
```

## リソース

- [Supabase - 無料で始める](https://supabase.com)
- [Supabase JSクライアント](https://github.com/supabase/supabase-js)
- [Notion Developers](https://developers.notion.com/)
