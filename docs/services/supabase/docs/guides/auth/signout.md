# ユーザーのサインアウト

ユーザーのサインアウトは、サインインに使用した方法に関係なく、同じように機能します。

クライアントライブラリからサインアウトメソッドを呼び出します。これにより、アクティブなセッションが削除され、ストレージメディアから認証データがクリアされます。

## コード例

### JavaScript

```javascript
async function signOut() {
  const { error } = await supabase.auth.signOut()
}
```

### TypeScript

```typescript
async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('サインアウトエラー:', error.message)
  }
}
```

### Dart

```dart
Future<void> signOut() async {
  await supabase.auth.signOut();
}
```

### Swift

```swift
func signOut() async throws {
  try await supabase.auth.signOut()
}
```

### Kotlin

```kotlin
suspend fun signOut() {
  supabase.auth.signOut()
}
```

## サインアウトとスコープ

Supabase Authでは、サインアウト時に3つの異なるスコープを指定できます：

### 1. `global`（デフォルト）

ユーザーのすべてのアクティブなセッションを終了します。

```javascript
// グローバルスコープがデフォルト
await supabase.auth.signOut()
```

**使用例：**
- ユーザーがパスワードを変更したとき
- セキュリティ上の懸念がある場合
- ユーザーがすべてのデバイスからログアウトしたい場合

### 2. `local`

現在のセッションのみを終了し、他のデバイスのセッションはアクティブなままにします。

```javascript
// 現在のセッションのみからサインアウト
await supabase.auth.signOut({ scope: 'local' })
```

**使用例：**
- 共有デバイスからサインアウト
- 1つのデバイスのみでログアウトしたい場合
- 他のアクティブなセッションを維持したい場合

### 3. `others`

現在のセッション以外のすべてのセッションを終了します。

```javascript
// 他のすべてのセッションをサインアウト
await supabase.auth.signOut({ scope: 'others' })
```

**使用例：**
- セキュリティ対策として他のデバイスからログアウト
- 不正なアクセスが疑われる場合
- 現在のデバイスは維持しながら、他のデバイスをログアウトしたい場合

## 内部動作

サインアウト時には以下が発生します：

1. **リフレッシュトークンの破棄**：すべてのリフレッシュトークンと関連するデータベースオブジェクトが破棄されます
2. **ローカルストレージのクリア**：セッションがローカルストレージから削除されます
3. **セッションの無効化**：選択したスコープに応じてセッションが無効化されます

## 重要な注意事項

### アクセストークンの有効期限

> **警告：** 取り消されたセッションのアクセストークンは、有効期限まで有効なままです（`exp`クレームにエンコードされています）。ユーザーはすぐにログアウトされず、アクセストークンが期限切れになったときにのみログアウトされます。

これは以下を意味します：

- サインアウト後も、アクセストークンが期限切れになるまで（通常1時間）、一部のリクエストが成功する可能性があります
- 即座のログアウトが必要な場合は、サーバー側でアクセストークンの検証を実装する必要があります

### 即座のログアウトの実装

即座のログアウトを実装するには、行レベルセキュリティ（RLS）ポリシーでセッションの有効性を確認します：

```sql
-- セッションが有効かどうかを確認するRLSポリシー
CREATE POLICY "Check session validity"
ON your_table
FOR ALL
USING (
  auth.uid() = user_id
  AND EXISTS (
    SELECT 1 FROM auth.sessions
    WHERE user_id = auth.uid()
    AND token = auth.jwt()
  )
);
```

## エラーハンドリング

```javascript
async function signOut() {
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('サインアウト中にエラーが発生しました:', error.message)
    // エラーを処理（例：ユーザーに通知）
    return false
  }

  // サインアウト成功
  // ログインページにリダイレクトまたはUIを更新
  return true
}
```

## React での実装例

```jsx
import { useNavigate } from 'react-router-dom'
import { supabase } from './supabaseClient'

function SignOutButton() {
  const navigate = useNavigate()

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('サインアウトエラー:', error.message)
      alert('サインアウトに失敗しました')
    } else {
      // ログインページにリダイレクト
      navigate('/login')
    }
  }

  return (
    <button onClick={handleSignOut}>
      サインアウト
    </button>
  )
}

export default SignOutButton
```

## ベストプラクティス

### 1. ユーザー確認

重要な操作の前にサインアウトを確認します：

```javascript
const confirmAndSignOut = async () => {
  if (window.confirm('本当にサインアウトしますか？')) {
    await supabase.auth.signOut()
  }
}
```

### 2. 状態のクリア

サインアウト後、アプリケーションの状態をクリアします：

```javascript
const signOut = async () => {
  await supabase.auth.signOut()

  // ローカル状態をクリア
  localStorage.clear()
  sessionStorage.clear()

  // グローバル状態をリセット（Redux、Zustandなど）
  dispatch(resetState())
}
```

### 3. リダイレクト

サインアウト後、適切なページにリダイレクトします：

```javascript
const signOut = async () => {
  const { error } = await supabase.auth.signOut()

  if (!error) {
    window.location.href = '/login'
    // または
    // navigate('/login')
  }
}
```

### 4. エラーログ

サインアウトエラーをログに記録して監視します：

```javascript
const signOut = async () => {
  const { error } = await supabase.auth.signOut()

  if (error) {
    // エラーログサービスに送信
    logger.error('Sign out failed', {
      error: error.message,
      userId: user?.id,
      timestamp: new Date().toISOString()
    })
  }
}
```
