# Googleでログイン

## 概要

Supabaseは以下の環境でGoogle Sign-Inをサポートしています：
- Webアプリケーション
- ネイティブモバイルアプリ（Android、iOS）
- Chrome拡張機能

## 前提条件

### Google Cloud Projectのセットアップ

1. [Google Cloud Platform](https://console.cloud.google.com/home/dashboard)でプロジェクトを作成します
2. Google Auth Platformコンソールで以下を設定します：
   - オーディエンス
   - データアクセス（スコープ）
   - ブランディングと検証

### 必須スコープ

- `openid`（手動で追加）
- `.../auth/userinfo.email`（デフォルト）
- `...auth/userinfo.profile`（デフォルト）

### 同意画面のブランディング

推奨手順：
1. カスタムドメインをセットアップ（例：`auth.example.com`）
2. Googleでブランド情報を検証

## プロジェクト設定

### クライアントIDとシークレットの取得

1. [OAuthクライアントIDを作成](https://console.cloud.google.com/auth/clients/create)
2. 「Webアプリケーション」を選択
3. 承認済みのオリジンとリダイレクトURIを追加
4. クライアントIDとクライアントシークレットを保存

### ローカル開発

```bash
# 環境変数
SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_SECRET="<client-secret>"
```

```toml
# プロバイダー設定
[auth.external.google]
enabled = true
client_id = "<client-id>"
secret = "env(SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_SECRET)"
```

## サインイン

### Webアプリケーションの方法

```javascript
supabase.auth.signInWithOAuth({
  provider: 'google',
})
```

### Googleの事前構築ソリューション

- パーソナライズされたサインインボタン
- One Tap
- 自動サインイン

## 追加の注意事項

- 複数のクライアントIDを連結することが可能です
- ブランド検証には数営業日かかる場合があります
- 信頼性を高めるため、カスタムドメインの設定を推奨します
