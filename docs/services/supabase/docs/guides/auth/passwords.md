# パスワードベース認証

メールアドレスまたは電話番号に紐づくパスワードを使用してユーザーがサインインできるようにします。

ユーザーは、パスワードを使用してサイトにサインインすることを期待することがよくあります。Supabase Authは、安全な設定オプションとパスワードの保存・検証のベストプラクティスを使用して、パスワードベースの認証を安全に実装するのに役立ちます。

ユーザーは、[メールアドレス](#メールアドレスを使用)または[電話番号](#電話番号を使用)を使用して、パスワードをIDに関連付けることができます。

## メールアドレスを使用

### メールアドレスとパスワードベース認証の有効化

メール認証はデフォルトで有効になっています。

ユーザーがサインインするためにメールアドレスを検証する必要があるかどうかを設定できます。ホストされたSupabaseプロジェクトでは、これはデフォルトでtrueです。セルフホストプロジェクトまたはローカル開発では、これはデフォルトでfalseです。

この設定は、ホストされたプロジェクトの場合は[Auth Providersページ](/dashboard/project/_/auth/providers)で、セルフホストプロジェクトの場合は[設定ファイル](/docs/guides/cli/config#auth.email.enable_confirmations)で変更できます。

### メールアドレスとパスワードでサインアップ

メールサインアップには2つの可能なフローがあります：[暗黙的フロー](/docs/guides/auth/sessions#implicit-flow)と[PKCEフロー](/docs/guides/auth/sessions#pkce-flow)です。SSRを使用している場合は、PKCEフローを使用しています。クライアントのみのコードを使用している場合、デフォルトのフローはクライアントライブラリによって異なります。暗黙的フローはJavaScriptとDartでデフォルトであり、PKCEフローはSwiftでデフォルトです。

このセクションの手順は、メール確認が有効になっていることを前提としています。

#### 暗黙的フロー

暗黙的フローは、クライアントのみのアプリでのみ機能します。ユーザーがメールを確認した後、サイトは直接アクセストークンを受け取ります。

JavaScriptでのサインアップ例：

```javascript
async function signUpNewUser() {
  const { data, error } = await supabase.auth.signUp({
    email: 'valid.email@supabase.io',
    password: 'example-password',
    options: {
      emailRedirectTo: 'https://example.com/welcome',
    },
  })
}
```

### メールアドレスとパスワードでサインイン

ユーザーがサインインするときは、`signInWithPassword()`を呼び出します。

```javascript
async function signInWithEmail() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'valid.email@supabase.io',
    password: 'example-password',
  })
}
```
