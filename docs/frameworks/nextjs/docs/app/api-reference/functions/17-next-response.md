# NextResponse

NextResponseは、Web Response APIを追加の便利なメソッドで拡張します。

## Cookieメソッド

### `set(name, value)`

指定された名前と値でCookieを設定します：

```typescript
let response = NextResponse.next()
response.cookies.set('show-banner', 'false')
```

### `get(name)`

特定のCookieの値を取得します：

```typescript
response.cookies.get('show-banner')
// 返り値: { name: 'show-banner', value: 'false', Path: '/home' }
```

### `getAll()`

すべてのCookieを取得するか、名前でフィルタリングします：

```typescript
response.cookies.getAll('experiments')
// 一致するCookieの配列を返します
response.cookies.getAll()
// すべてのCookieを返します
```

### `delete(name)`

特定のCookieを削除します：

```typescript
response.cookies.delete('experiments')
// 削除された場合はtrueを返します
```

## その他のメソッド

### `json()`

JSONレスポンスを作成します：

```typescript
return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
```

### `redirect()`

新しいURLにリダイレクトします：

```typescript
return NextResponse.redirect(new URL('/new', request.url))
```

### `rewrite()`

元のURLを保持したままURLを書き換えます：

```typescript
return NextResponse.rewrite(new URL('/proxy', request.url))
```

### `next()`

Middleware内でルーティングを続行します：

```typescript
return NextResponse.next()
```

## バージョン履歴

| バージョン | 変更内容 |
|---------|---------|
| `v13.0.0` | `NextResponse`が導入されました |
