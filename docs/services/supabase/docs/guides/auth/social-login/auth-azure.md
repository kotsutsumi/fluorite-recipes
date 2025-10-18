# Azure（Microsoft）でログイン

## 概要

Azure OAuthのセットアップには、以下の4つの主要なステップがあります：
1. Azure Entra IDの下でOAuthアプリケーションを作成
2. アプリケーションにシークレットを追加
3. 許可リストにSupabase AuthコールバックURLを追加
4. Supabase AuthダッシュボードでクライアントIDとシークレットを設定

## 前提条件

- Azure Developerアカウント
- Supabaseプロジェクト

## 詳細な設定手順

### Azure Developerアカウントにアクセス

- [portal.azure.com](https://portal.azure.com/#home)にアクセス
- ログインして「Microsoft Entra ID」を選択

### アプリケーションを登録

- 「App registrations」>「New registration」を選択
- 名前とサポートされるアカウントタイプを選択
- WebリダイレクトURIを指定：`https://<project-ref>.supabase.co/auth/v1/callback`
- 「Register」を選択

### クライアントIDとシークレットを取得

- アプリ登録リストでクライアントIDを見つける
- アプリの概要で「Add a certificate or secret」を選択
- 新しいクライアントシークレットを作成
- 有効期限を選択
- 「Value」をコピーしてSupabase Authダッシュボードに貼り付ける

### ログインコードの例（JavaScript）

```javascript
async function signInWithAzure() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'azure',
    options: {
      scopes: 'email',
    },
  })
}
```

### オプション：テナントURL設定

- デフォルト：`https://login.microsoftonline.com/common`
- 個人アカウントの場合：`https://login.microsoftonline.com/consumers`を使用
- 組織アカウントの場合：特定のテナントURLを使用

### セキュリティに関する考慮事項

- オプションの`xms_edov`クレームを設定して、メールドメインを検証
- 未検証のメールドメインの脆弱性に注意

## リソース

- [Azure Developerアカウント](https://portal.azure.com)
- [GitHubディスカッション](https://github.com/supabase/gotrue/pull/54#issuecomment-757043573)
