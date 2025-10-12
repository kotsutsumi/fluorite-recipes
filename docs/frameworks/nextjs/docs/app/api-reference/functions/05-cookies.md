# cookies

`cookies` は、[サーバーコンポーネント](/docs/app/getting-started/server-and-client-components)で HTTP 受信リクエストのクッキーを読み取り、[サーバーアクション](/docs/app/getting-started/updating-data)または[ルートハンドラ](/docs/app/api-reference/file-conventions/route)で送信リクエストのクッキーを読み書きできる**非同期**関数です。

```typescript
import { cookies } from 'next/headers'

export default async function Page() {
  const cookieStore = await cookies()
  const theme = cookieStore.get('theme')
  return '...'
}
```

## リファレンス

### メソッド

以下のメソッドが利用可能です：

| メソッド | 戻り値の型 | 説明 |
|----------|------------|------|
| `get('name')` | オブジェクト | クッキー名を受け取り、名前と値を持つオブジェクトを返します |
| `getAll()` | オブジェクトの配列 | 一致する名前のすべてのクッキーを返します |
| `has('name')` | Boolean | クッキー名を受け取り、存在するかどうかのブール値を返します |
| `set(name, value, options)` | - | クッキー名、値、オプションを受け取り、送信リクエストのクッキーを設定します |
| `delete(name)` | - | クッキー名を受け取り、クッキーを削除します |
| `clear()` | - | すべてのクッキーを削除します |
| `toString()` | 文字列 | クッキーの文字列表現を返します |

### オプション

クッキーを設定する際、以下のオプションプロパティがサポートされています：

| オプション | 型 | 説明 |
|-----------|-----|------|
| `name` | 文字列 | クッキーの名前を指定します |
| `value` | 文字列 | クッキーに保存する値を指定します |
| `expires` | Date | クッキーの有効期限を定義します |
| `maxAge` | 数値 | クッキーの有効期間を秒単位で設定します |
| `domain` | 文字列 | クッキーが利用可能なドメインを指定します |
| `path` | 文字列 | クッキーが適用されるURLパスを制限します |
| `secure` | Boolean | HTTPSでのみクッキーを送信するかどうかを指定します |
| `httpOnly` | Boolean | JavaScriptからクッキーへのアクセスを防ぎます |
| `sameSite` | 文字列、Boolean | クッキーのクロスサイトリクエスト動作を制御します |
| `partitioned` | Boolean | パーティション化されたストレージAPIの使用を示します |
| `priority` | 文字列 | クッキーの優先度を指定します |

詳細は [MDN](https://developer.mozilla.org/docs/Web/HTTP/Headers/Set-Cookie) をご覧ください。

## 例

### サーバーコンポーネントでのクッキーの取得

```typescript
import { cookies } from 'next/headers'

export default async function Page() {
  const cookieStore = await cookies()
  const theme = cookieStore.get('theme')
  return <div>Theme: {theme?.value}</div>
}
```

### サーバーアクションでのクッキーの設定

```typescript
'use server'
import { cookies } from 'next/headers'

export async function handleLogin(formData) {
  const email = formData.get('email')
  const password = formData.get('password')
  // 認証処理...

  const cookieStore = await cookies()
  cookieStore.set('session', 'encrypted-session-data', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 1週間
    path: '/',
  })
}
```

### クッキーの削除

```typescript
'use server'
import { cookies } from 'next/headers'

export async function handleLogout() {
  const cookieStore = await cookies()
  cookieStore.delete('session')
}
```

## バージョン履歴

| バージョン | 変更点 |
|-----------|--------|
| `v15.0.0-RC` | `cookies` が非同期関数になりました |
| `v13.0.0` | `cookies` が導入されました |
