# 認証トラブルシューティング

このページでは、Supabase認証に関する一般的な問題のトラブルシューティングガイドを提供します。ログインの問題、セッション管理、プロバイダの設定などに関する解決策を検索または参照できます。

## よくある問題

### 1. ログインできない

#### 症状
- ユーザーがログインしようとするとエラーが発生する
- 認証情報が正しいにもかかわらずログインが失敗する

#### 解決策

**メール確認の確認**
```javascript
// メールが確認されているか確認
const { data: { user } } = await supabase.auth.getUser()
console.log(user?.email_confirmed_at)
```

**認証設定の確認**
- Supabaseダッシュボードで「Email Auth」が有効になっているか確認
- 「Confirm Email」設定を確認
- メールテンプレートが正しく設定されているか確認

**パスワードポリシーの確認**
- 最小文字数要件を満たしているか確認
- 特殊文字要件がある場合は確認

### 2. セッションが維持されない

#### 症状
- ページをリロードするとログアウトされる
- セッションが予期せず期限切れになる

#### 解決策

**セッション永続化の設定**
```javascript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'example@email.com',
  password: 'example-password',
})

// セッションを永続化
if (data?.session) {
  localStorage.setItem('supabase.auth.token', JSON.stringify(data.session))
}
```

**自動トークン更新の実装**
```javascript
// クライアント初期化時に自動更新を有効化
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  }
})
```

### 3. OAuthプロバイダーの問題

#### 症状
- Google、GitHub などのソーシャルログインが機能しない
- リダイレクトエラーが発生する

#### 解決策

**リダイレクトURLの設定**
```javascript
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: 'http://localhost:3000/auth/callback'
  }
})
```

**許可されたリダイレクトURLの確認**
- Supabaseダッシュボードの「Authentication」→「URL Configuration」
- アプリケーションのURLが「Redirect URLs」リストに含まれているか確認

**プロバイダー設定の確認**
- クライアントIDとシークレットが正しく設定されているか確認
- プロバイダー側のリダイレクトURLが正しく設定されているか確認

### 4. メールが届かない

#### 症状
- 確認メールが送信されない
- パスワードリセットメールが届かない

#### 解決策

**メール送信の確認**
- Supabaseダッシュボードの「Authentication」→「Email Templates」を確認
- SMTPの設定が正しいか確認（カスタムSMTPを使用している場合）

**スパムフォルダの確認**
- ユーザーにスパムフォルダを確認するよう依頼

**レート制限の確認**
```javascript
// エラーレスポンスを確認
const { error } = await supabase.auth.signUp({
  email: 'example@email.com',
  password: 'example-password',
})

if (error?.status === 429) {
  console.log('レート制限に達しました')
}
```

### 5. データベースエラー

#### 症状
- 「database error saving new user」エラーが発生する
- ユーザー作成時にエラーが発生する

#### 解決策

**auth.usersテーブルの確認**
```sql
-- ユーザーテーブルの構造を確認
SELECT * FROM auth.users LIMIT 1;
```

**Row Level Security (RLS) ポリシーの確認**
```sql
-- 関連テーブルのRLSポリシーを確認
SELECT * FROM pg_policies WHERE tablename = 'your_table';
```

**外部キー制約の確認**
- カスタムテーブルがauth.usersを参照している場合、制約を確認

### 6. 「アップストリームサーバーから無効な応答を受信」エラー

#### 症状
- 認証クエリ時に502エラーが発生する

#### 解決策

**ネットワーク接続の確認**
- インターネット接続が安定しているか確認
- ファイアウォールやプロキシ設定を確認

**Supabaseステータスの確認**
- [Supabaseステータスページ](https://status.supabase.com/)でサービス状態を確認

**再試行ロジックの実装**
```javascript
async function retryAuth(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const result = await fn()
      return result
    } catch (error) {
      if (i === maxRetries - 1) throw error
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
    }
  }
}
```

### 7. MAU（月間アクティブユーザー）使用状況の確認

#### 症状
- 認証が突然機能しなくなる
- 「quota exceeded」エラーが発生する

#### 解決策

**使用状況の確認**
- Supabaseダッシュボードの「Settings」→「Billing」→「Usage」を確認
- MAU制限に達していないか確認

**不要なユーザーの削除**
```sql
-- 非アクティブなユーザーを確認
SELECT * FROM auth.users
WHERE last_sign_in_at < NOW() - INTERVAL '90 days';
```

### 8. カスタムドメインでのメール問題

#### 症状
- カスタムドメインからのメールが配信されない
- メール認証が機能しない

#### 解決策

**DNS設定の確認**
- SPF、DKIM、DMARCレコードが正しく設定されているか確認

**メール送信者の確認**
```javascript
// カスタムメール設定の確認
const { data, error } = await supabase.auth.admin.updateUser(
  userId,
  { email_confirm: true }
)
```

## デバッグのヒント

### ログの確認

```javascript
// 詳細なエラーログ
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth event:', event)
  console.log('Session:', session)
})
```

### ネットワークリクエストの監視

ブラウザの開発者ツールで：
1. ネットワークタブを開く
2. 認証リクエストをフィルタリング
3. リクエスト/レスポンスの詳細を確認

### 環境変数の確認

```javascript
// 環境変数が正しく読み込まれているか確認
console.log('SUPABASE_URL:', process.env.SUPABASE_URL)
console.log('SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY)
```

## よくある設定ミス

1. **環境変数の不一致**
   - `.env`ファイルと実際の環境変数が一致していない

2. **CORS設定**
   - 許可されたオリジンにアプリケーションのURLが含まれていない

3. **RLSポリシー**
   - 厳しすぎるRLSポリシーがデータアクセスをブロックしている

4. **トークンの期限切れ**
   - リフレッシュトークンの処理が適切に実装されていない

## サポートリソース

- [Supabase公式ドキュメント](https://supabase.com/docs)
- [Supabaseコミュニティフォーラム](https://github.com/supabase/supabase/discussions)
- [Discordコミュニティ](https://discord.supabase.com)
- [エラーコード一覧](/docs/services/supabase/docs/guides/auth/debugging/error-codes.md)

## 追加のヘルプ

上記の解決策で問題が解決しない場合：

1. **再現手順を文書化**：問題を再現できる最小限のコード例を作成
2. **エラーログを収集**：完全なエラーメッセージとスタックトレースを保存
3. **環境情報を記録**：ブラウザ、OS、Supabaseクライアントのバージョンを記録
4. **GitHubイシューを作成**：または Supabase サポートに問い合わせ
