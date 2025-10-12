# Form

`<Form>`コンポーネントは、HTMLの`<form>`要素を拡張し、以下の機能を提供します:

- **プリフェッチ**: ローディングUIの事前読み込み
- **クライアントサイドナビゲーション**: フォーム送信時のページ遷移を最適化
- **プログレッシブエンハンスメント**: JavaScriptが無効でも動作

## インポート

```typescript
import Form from 'next/form'
```

## 基本的な使い方

`<Form>`コンポーネントは、2つの異なるタイプの`action`プロパティをサポートします:

1. **文字列アクション**: URLまたはパスを指定してナビゲーション
2. **関数アクション**: Server Actionを指定して実行

### 文字列アクション (検索フォーム)

検索フォームなど、GETメソッドでナビゲーションする場合:

```typescript
import Form from 'next/form'

export default function SearchPage() {
  return (
    <Form action="/search">
      <input name="query" placeholder="検索..." />
      <button type="submit">検索</button>
    </Form>
  )
}
```

このフォームを送信すると、`/search?query=検索語`のようなURLに遷移します。

### 関数アクション (Server Action)

Server Actionを使用してデータを処理する場合:

```typescript
import Form from 'next/form'
import { createPost } from '@/app/actions'

export default function CreatePostPage() {
  return (
    <Form action={createPost}>
      <input name="title" placeholder="タイトル" />
      <textarea name="content" placeholder="内容" />
      <button type="submit">投稿を作成</button>
    </Form>
  )
}
```

## Props

### 文字列アクション用のProps

文字列アクション (`action="/path"`) を使用する場合、以下のPropsが利用できます:

#### `action` (必須)

- **型**: `string`
- **説明**: ナビゲート先のURLまたはパス
- **例**: `action="/search"` または `action="https://example.com/search"`

```typescript
<Form action="/search">
  <input name="query" />
  <button type="submit">検索</button>
</Form>
```

#### `replace`

- **型**: `boolean`
- **デフォルト**: `false`
- **説明**: `true`の場合、現在の履歴エントリを置き換えます

```typescript
<Form action="/search" replace>
  <input name="query" />
  <button type="submit">検索</button>
</Form>
```

#### `scroll`

- **型**: `boolean`
- **デフォルト**: `true`
- **説明**: ナビゲーション後のスクロール動作を制御

```typescript
<Form action="/search" scroll={false}>
  <input name="query" />
  <button type="submit">検索</button>
</Form>
```

#### `prefetch`

- **型**: `boolean | null`
- **デフォルト**: `null` (自動)
- **説明**: ルートのプリフェッチ動作を制御

```typescript
<Form action="/search" prefetch={true}>
  <input name="query" />
  <button type="submit">検索</button>
</Form>
```

プリフェッチのオプション:
- `true`: ルートを積極的にプリフェッチ
- `false`: プリフェッチを無効化
- `null` (デフォルト): フォームが表示されたときに自動的にプリフェッチ

### 関数アクション用のProps

関数アクション (Server Action) を使用する場合:

#### `action` (必須)

- **型**: `(formData: FormData) => void | Promise<void>`
- **説明**: フォーム送信時に呼び出されるServer Action

```typescript
import Form from 'next/form'

async function createUser(formData: FormData) {
  'use server'
  const name = formData.get('name')
  // データベースに保存など
}

export default function Page() {
  return (
    <Form action={createUser}>
      <input name="name" />
      <button type="submit">作成</button>
    </Form>
  )
}
```

## 動作の詳細

### GETメソッドとナビゲーション

文字列アクションを使用する場合、`<Form>`は以下の動作をします:

1. **メソッド**: 常にGETメソッドを使用
2. **エンコーディング**: フォームデータをURLの検索パラメータとしてエンコード
3. **ナビゲーション**: クライアントサイドナビゲーションを実行
4. **プリフェッチ**: フォームが表示可能になったときにルートをプリフェッチ

```typescript
// この例では
<Form action="/search">
  <input name="query" value="next.js" />
  <input name="category" value="docs" />
</Form>

// 送信すると以下のURLに遷移:
// /search?query=next.js&category=docs
```

### Server Actionの実行

関数アクションを使用する場合、`<Form>`は以下の動作をします:

1. **実行**: フォーム送信時に指定されたServer Actionを実行
2. **FormData**: `FormData`オブジェクトがActionに渡される
3. **検証**: Server Action内でデータ検証を実行可能
4. **リダイレクト**: Action内で`redirect()`を使用可能

## 使用例

### 検索フォーム with フィルター

```typescript
import Form from 'next/form'

export default function SearchPage() {
  return (
    <Form action="/search">
      <input
        name="query"
        type="text"
        placeholder="検索キーワード"
      />
      <select name="category">
        <option value="all">すべて</option>
        <option value="docs">ドキュメント</option>
        <option value="blog">ブログ</option>
      </select>
      <button type="submit">検索</button>
    </Form>
  )
}
```

### Server Actionでの投稿作成

```typescript
import Form from 'next/form'
import { redirect } from 'next/navigation'
import { createPost } from '@/lib/db'

async function handleCreatePost(formData: FormData) {
  'use server'

  const title = formData.get('title') as string
  const content = formData.get('content') as string

  // バリデーション
  if (!title || !content) {
    throw new Error('タイトルと内容は必須です')
  }

  // データベースに保存
  const post = await createPost({ title, content })

  // 投稿詳細ページにリダイレクト
  redirect(`/posts/${post.id}`)
}

export default function CreatePostPage() {
  return (
    <Form action={handleCreatePost}>
      <div>
        <label htmlFor="title">タイトル</label>
        <input
          id="title"
          name="title"
          type="text"
          required
        />
      </div>
      <div>
        <label htmlFor="content">内容</label>
        <textarea
          id="content"
          name="content"
          rows={10}
          required
        />
      </div>
      <button type="submit">投稿を作成</button>
    </Form>
  )
}
```

### ローディング状態の表示

`useFormStatus`フックを使用してローディング状態を表示:

```typescript
'use client'

import { useFormStatus } from 'react-dom'
import Form from 'next/form'

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button type="submit" disabled={pending}>
      {pending ? '送信中...' : '送信'}
    </button>
  )
}

export default function MyForm() {
  return (
    <Form action="/search">
      <input name="query" />
      <SubmitButton />
    </Form>
  )
}
```

### formActionによるアクションのオーバーライド

複数のボタンで異なるアクションを実行:

```typescript
import Form from 'next/form'

async function saveDraft(formData: FormData) {
  'use server'
  // 下書きとして保存
}

async function publish(formData: FormData) {
  'use server'
  // 公開
}

export default function EditPostPage() {
  return (
    <Form action={publish}>
      <input name="title" />
      <textarea name="content" />
      <button type="submit" formAction={saveDraft}>
        下書き保存
      </button>
      <button type="submit">
        公開
      </button>
    </Form>
  )
}
```

## 注意事項と制限

### formActionのサポート

`formAction`属性を使用して、メインのアクションをオーバーライドできます:

```typescript
<Form action={mainAction}>
  <button formAction={alternativeAction}>代替アクション</button>
</Form>
```

### keyプロパティの制限

文字列アクションを使用する場合、`key`プロパティはサポートされていません。

### サポートされていない属性

以下のHTML form属性は、`<Form>`コンポーネントではサポートされていません:

- `encType`: 常にURLエンコードされます (文字列アクションの場合)
- `method`: 文字列アクションの場合は常にGET、関数アクションの場合はPOST
- `target`: サポートされていません

### プログレッシブエンハンスメント

`<Form>`コンポーネントは、JavaScriptが無効な環境でも動作します。文字列アクションの場合、標準的なHTMLフォーム送信にフォールバックします。

## ベストプラクティス

1. **検索にはGET**: 検索やフィルタリングには文字列アクション (GET) を使用
2. **データ変更にはPOST**: データ作成・更新・削除にはServer Action (POST) を使用
3. **バリデーション**: Server Action内でデータ検証を実行
4. **エラーハンドリング**: 適切なエラーハンドリングとユーザーフィードバックを実装
5. **ローディング状態**: `useFormStatus`でユーザーに進行状況を表示
6. **アクセシビリティ**: 適切なラベルとバリデーションメッセージを提供

## まとめ

`<Form>`コンポーネントは、Next.jsアプリケーションでフォームを最適化するための強力なツールです。プリフェッチとクライアントサイドナビゲーションによりユーザーエクスペリエンスが向上し、Server Actionとの統合により安全なデータ処理が可能になります。
