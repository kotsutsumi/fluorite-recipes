# Figmaでログイン | Supabase 認証ガイド

## 概要
アプリケーションにFigma認証を設定するには、主に3つのステップがあります。
1. Figma Developersページでfigmaアプリを作成・設定する
2. Supabaseプロジェクトにfigmaの`client_id`と`client_secret`を追加する
3. Supabase JSクライアントアプリにログインコードを追加する

## 詳細手順

### Figma Developersページにアクセスする
- [Figma Developersページ](https://www.figma.com/developers)にアクセス
- 右上の「My apps」をクリック
- 必要に応じてログイン

### コールバックURLを確認する
- コールバックURLの形式: `https://<project-ref>.supabase.co/auth/v1/callback`
- 場所: Supabaseプロジェクトダッシュボード > Authentication > Providers > Figma

### Figma OAuth Appを作成する
- App nameとWebsite URLを入力
- アプリロゴをアップロード
- コールバックURLを追加
- 保存して以下をコピー:
  - Client ID
  - Client Secret

### Supabaseプロジェクトを設定する
- Supabaseプロジェクトダッシュボードにアクセス
- Authentication > Providersに移動
- Figmaを有効化
- Client IDとClient Secretを入力
- 設定を保存

### ログインコードを追加する（JavaScriptの例）
```javascript
async function signInWithFigma() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'figma'
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
- [Supabase](https://supabase.com)
- [Supabase JSクライアント](https://github.com/supabase/supabase-js)
- [Figma Developersページ](https://www.figma.com/developers)
