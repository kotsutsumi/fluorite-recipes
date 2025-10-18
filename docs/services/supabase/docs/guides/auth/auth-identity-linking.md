# アイデンティティリンク

## アイデンティティリンク戦略

Supabase Authは、ユーザーにアイデンティティをリンクするための2つの戦略をサポートしています：

1. 自動リンク
2. 手動リンク（ベータ版）

### 自動リンク

Supabase Authは、同じメールアドレスを持つアイデンティティを自動的に単一のユーザーにリンクします。これにより、サインアップに使用したOAuthアカウントを覚える必要がなくなり、ユーザーエクスペリエンスが向上します。

主なポイント：

- すべてのユーザーメールが一意であることを保証します
- アカウント乗っ取りを防ぐため、未検証のメールアドレスのリンクを防ぎます
- 新しいアイデンティティをリンクできる場合、未確認のアイデンティティを削除します
- SAML SSOでサインアップしたユーザーは、自動リンクの対象とは見なされません

#### 動作の流れ

1. ユーザーがOAuthプロバイダーでサインインします
2. Supabaseは、同じメールアドレスを持つ既存のユーザーを確認します
3. メールアドレスが検証されている場合、アイデンティティを既存のユーザーにリンクします
4. メールアドレスが検証されていない場合、新しいユーザーを作成します

### 手動リンク（ベータ版）

ログイン時に、ユーザーが異なるメールアドレスを持つOAuthアイデンティティをリンクできるようにします。これは、JavaScript、Dart、Swift、Kotlin、Pythonなどのさまざまなプログラミング言語で`linkIdentity()`メソッドを使用して行うことができます。

JavaScriptの例：

```javascript
const { data, error } = await supabase.auth.linkIdentity({ provider: 'google' })
```

Dartの例：

```dart
await supabase.auth.linkIdentity(OAuthProvider.google);
```

Swiftの例：

```swift
try await supabase.auth.linkIdentity(provider: .google)
```

Kotlinの例：

```kotlin
supabase.auth.linkIdentity(Google)
```

Pythonの例：

```python
await supabase.auth.link_identity({"provider": "google"})
```

### ネイティブOAuth（IDトークン）でアイデンティティをリンクする

モバイルアプリケーションの場合、サードパーティOAuthプロバイダーからのIDトークンを使用してアイデンティティをリンクできます。これはネイティブOAuthフローに便利です。

```javascript
const { data, error } = await supabase.auth.linkIdentity({
  provider: 'google',
  options: {
    idToken: 'ID_TOKEN_FROM_GOOGLE',
  }
})
```

### アイデンティティのリンク解除

ユーザーは以下の方法でアイデンティティをリンク解除できます：

1. `getUserIdentities()`を使用してユーザーアイデンティティを取得します
2. `unlinkIdentity()`を呼び出します

要件：
- ログインしている必要があります
- 少なくとも2つのリンクされたアイデンティティが必要です

```javascript
// アイデンティティを取得
const { data: { user } } = await supabase.auth.getUser()

// アイデンティティをリンク解除
const { data, error } = await supabase.auth.unlinkIdentity({
  identity_id: user.identities[0].id
})
```

## よくある質問

### 1. OAuthアカウントにメール/パスワードを追加する

OAuthでサインアップした後にメール/パスワードアイデンティティを追加するには：

```javascript
const { data, error } = await supabase.auth.updateUser({
  password: 'validpassword'
})
```

### 2. OAuth後にメールでサインアップする

既存のOAuthメールでメールアカウントを作成しようとすると、ユーザー列挙攻撃を防ぐために、難読化されたユーザーレスポンスが返されます。

これは以下を意味します：
- 同じメールアドレスで複数の認証方法を使用できます
- セキュリティ上の理由から、どの認証方法が既に使用されているかはわかりません
- ユーザーは既存の認証方法でサインインし、その後追加のアイデンティティをリンクする必要があります

## セキュリティに関する考慮事項

### アカウント乗っ取りの防止

- 検証済みのメールアドレスのみが自動的にリンクされます
- 未検証のメールアドレスは、検証済みのアイデンティティでリンクされるときに削除されます

### ベストプラクティス

1. ユーザーがアイデンティティをリンクする前に、現在のセッションを再認証します
2. アイデンティティのリンクとリンク解除のアクションをログに記録します
3. ユーザーに複数の認証方法を設定するよう促します（アカウント復旧のため）
