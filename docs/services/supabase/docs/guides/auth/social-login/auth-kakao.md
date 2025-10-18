# Kakaoでログイン

## 概要

Kakao OAuthは主に6つのステップで構成されています：
1. Kakao Developer Portalでアプリを作成し設定する
2. `REST API key`（client_id）を取得する
3. `Client secret code`（client_secret）を生成する
4. Kakao Developers Portalで追加設定を行う
5. Supabaseプロジェクトに認証情報を追加する
6. クライアントアプリにログインコードを追加する

## 詳細手順

### Kakao Developer アカウントにアクセス
- [Kakao Developers Portal](https://developers.kakao.com)にアクセス
- 右上の「ログイン」をクリック

### アプリの作成と設定
- 「マイアプリケーション」に移動
- 「アプリケーションを追加」をクリック
- アプリ情報を入力：
  - アプリアイコン
  - アプリ名
  - 会社名
- 「保存」をクリック

### REST API キーの取得
- 「マイアプリケーション」に移動
- 作成したアプリを選択
- 「アプリキー」セクションで「REST APIキー」を確認（これが`client_id`になります）

### コールバックURLの確認
- Supabaseプロジェクトダッシュボードに移動
- サイドバーの「Authentication」アイコンをクリック
- 「Providers」に移動
- Kakaoを選択
- コールバックURLをコピー

### Client Secretの生成
- 「製品設定」>「カカオログイン」>「セキュリティ」に移動
- カカオログインを有効化
- 「Client secret code」を生成
- 「Client secret code」が有効化されていることを確認

### 同意項目の設定
- カカオログインを有効化
- スコープを設定：
  - `account_email`
  - `profile_image`
  - `profile_nickname`

### SupabaseにOAuth認証情報を追加
- Supabaseプロジェクトダッシュボードに移動
- 「Authentication」をクリック
- 「Providers」に移動
- Kakaoを有効化
- Client IDとClient Secretを入力
- 保存

### ログインコードの追加

JavaScriptの例：
```javascript
async function signInWithKakao() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'kakao',
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
- [Kakao Developers Portal](https://developers.kakao.com)
