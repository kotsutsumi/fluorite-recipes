# 匿名サインイン

## 概要

[匿名サインインを有効化](/dashboard/project/_/auth/providers)することで、Supabaseで匿名ユーザーを作成して認証できます。これにより、ユーザーは個人情報を提供することなく認証されたエクスペリエンスを得られます。

### 主な特徴

- 匿名ユーザーは永続的なユーザーと同様ですが、サインアウトしたりデバイスを変更したりするとアカウントにアクセスできなくなります
- `authenticated` Postgresロールを使用します
- JWTには、ユーザーを区別するための`is_anonymous`クレームが含まれます

### ユースケース

- Eコマースアプリケーション（ショッピングカート）
- 個人情報を収集せずにフル機能のデモを提供
- 一時的または使い捨てアカウント

## 匿名でサインインする

JavaScriptでの例：

```javascript
const { data, error } = await supabase.auth.signInAnonymously()
```

## 永続的なユーザーに変換する

### メール/電話番号のアイデンティティをリンクする

```javascript
const { data: updateEmailData, error: updateEmailError } = await supabase.auth.updateUser({
  email: 'valid.email@supabase.io',
})
```

### OAuthアイデンティティをリンクする

```javascript
const { data, error } = await supabase.auth.linkIdentity({ provider: 'google' })
```

## アクセス制御

行レベルセキュリティ（RLS）ポリシーを使用して、匿名ユーザーと永続的なユーザーを区別します：

```sql
create policy "Only permanent users can post"
on news_feed as restrictive for insert
to authenticated
with check ((select (auth.jwt()->>'is_anonymous')::boolean) is false);
```

## 悪用防止

- 推奨：CAPTCHAまたはCloudflare Turnstileを有効化
- IPベースのレート制限：1時間あたり30リクエスト
- プロジェクトダッシュボードで設定可能

## 重要な考慮事項

- 有効化する前に既存のRLSポリシーを確認してください
- Next.jsでは、メタデータのキャッシュを防ぐために動的レンダリングを使用してください
- 匿名ユーザーの自動クリーンアップは現在利用できません
