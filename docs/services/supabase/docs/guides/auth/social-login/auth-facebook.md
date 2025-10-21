# Facebookでログイン

## 概要

Facebook認証のセットアップには、以下の3つの主要なステップがあります：
1. Facebook Developers SiteでFacebookアプリケーションを作成
2. SupabaseプロジェクトにFacebookキーを追加
3. Supabase JSクライアントアプリにログインコードを追加

## 前提条件

- Facebook Developerアカウント
- Supabaseプロジェクト

## 詳細手順

### 1. Facebook Developerアカウントにアクセス

- [developers.facebook.com](https://developers.facebook.com)にアクセス
- アカウントにログイン

### 2. Facebookアプリを作成

- 「My Apps」をクリック
- 「Create App」をクリック
- アプリタイプを選択
- アプリ情報を入力
- 「Add Products to Your App」に移動

### 3. Facebookログインを設定

- 「Facebook Login」の下の「Setup」をクリック
- サイドバーで「Facebook Login」の下の「Settings」をクリック
- 「Valid OAuth Redirect URIs」にコールバックURIを入力
- 変更を保存

### 4. 権限を設定

- 「Build Your App」の下で「Use Cases」をクリック
- 「public_profile」と「email」が「Ready for testing」になっていることを確認

### 5. アプリ認証情報を取得

- 「Settings / Basic」をクリック
- App IDをコピー
- App Secretを表示してコピー

### 6. Supabaseを設定

- Supabaseプロジェクトダッシュボードに移動
- 「Authentication」をクリック
- 「Providers」に移動
- Facebookを有効化
- クライアントIDとクライアントシークレットを入力
- 保存

### 7. ログインコードを追加（JavaScriptの例）

```javascript
async function signInWithFacebook() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'facebook'
  })
}
```

### 8. サインアウト

```javascript
async function signOut() {
  const { error } = await supabase.auth.signOut()
}
```

## 追加の注意事項

- サーバーサイド認証の場合は、コールバックルートを使用してください
- 完全な機能を使用するには、FacebookのApp Reviewプロセスに従ってください

## リソース

- [Supabase](https://supabase.com)
- [Supabase JSクライアント](https://github.com/supabase/supabase-js)
- [Facebook Developers](https://developers.facebook.com)
