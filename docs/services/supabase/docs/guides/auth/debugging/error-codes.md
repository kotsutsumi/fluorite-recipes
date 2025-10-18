# エラーコード

## 認証エラーコード

Supabase認証では、APIを使用する際に様々なエラーが返される可能性があります。このガイドでは、異なるプログラミング言語でこれらのエラーを効果的に処理する方法を説明します。

### エラータイプ

Supabase認証のエラーは、主に2つのタイプに分類されます：

- **APIエラー**：Supabase認証APIから発生
- **クライアントエラー**：クライアントライブラリの状態から発生

クライアントエラーは言語によって異なるため、適切なセクションを参照してください。

### HTTPステータスコード

Supabase認証のコンテキストで最も一般的なHTTPステータスコードは以下の通りです：

#### 403 Forbidden
ユーザーに特定の認証機能が利用できない稀な状況で送信されます。

#### 422 Unprocessable Entity
APIリクエストは受け入れられましたが、ユーザーまたは認証サーバーの状態によりリクエストを処理できない場合に送信されます。

#### 429 Too Many Requests
APIのレート制限を超えた場合に送信されます。特にユーザー認証機能では、このステータスコードを頻繁に処理する必要があります。

#### 500 Internal Server Error
認証サーバーのサービスが低下していることを示します。多くの場合、データベース設定の問題を指します。

#### 501 Not Implemented
認証サーバーで有効になっていない機能を使用しようとした場合に送信されます。

## エラー処理のベストプラクティス

### JavaScriptでのエラー処理

```javascript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'example@email.com',
  password: 'example-password',
})

if (error) {
  // エラーコードに基づいて処理
  switch (error.status) {
    case 400:
      console.error('無効なリクエストです')
      break
    case 422:
      console.error('リクエストを処理できません')
      break
    case 429:
      console.error('リクエスト数が多すぎます。後でもう一度お試しください')
      break
    default:
      console.error('エラーが発生しました:', error.message)
  }
}
```

### エラーメッセージの活用

各エラーには、問題の詳細を説明するメッセージが含まれています。これらのメッセージをユーザーに表示したり、ログに記録したりして、デバッグに活用できます。

### レート制限への対応

429エラーが返された場合は、リトライロジックを実装することを検討してください。指数バックオフを使用して、サーバーへの負荷を軽減できます。

```javascript
async function retryWithBackoff(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    const { data, error } = await fn()

    if (!error) return { data, error }

    if (error.status === 429) {
      // 指数バックオフで待機
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000))
    } else {
      return { data, error }
    }
  }
}
```

## 一般的なエラーコード

### 認証関連

- **invalid_grant**: 無効な認証情報が提供されました
- **invalid_request**: リクエストパラメータが不正または欠落しています
- **unauthorized_client**: クライアントは認証されていません
- **access_denied**: アクセスが拒否されました

### セッション関連

- **session_not_found**: セッションが見つかりません
- **refresh_token_not_found**: リフレッシュトークンが見つかりません
- **invalid_refresh_token**: リフレッシュトークンが無効です

### ユーザー関連

- **user_not_found**: ユーザーが見つかりません
- **email_exists**: メールアドレスは既に使用されています
- **weak_password**: パスワードが弱すぎます
- **email_not_confirmed**: メールアドレスが確認されていません

## デバッグのヒント

1. **詳細なログ記録**: エラーオブジェクト全体をログに記録して、すべての関連情報を確認する
2. **ネットワークタブの確認**: ブラウザの開発者ツールでネットワークリクエストを確認する
3. **認証設定の確認**: Supabaseダッシュボードで認証設定が正しく構成されているか確認する
4. **環境変数の確認**: APIキーやURLなどの環境変数が正しく設定されているか確認する

## 関連リンク

- [認証トラブルシューティング](/docs/services/supabase/docs/guides/auth/troubleshooting.md)
- [Supabase認証ドキュメント](https://supabase.com/docs/guides/auth)
