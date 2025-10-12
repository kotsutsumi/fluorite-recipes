# NextRequest

NextRequestは、Web Request APIを追加の便利なメソッドで拡張します。

## `cookies`

リクエストの`Set-Cookie`ヘッダーを読み取ったり変更したりします。

### `set(name, value)`

リクエストに指定された値でCookieを設定します。

```javascript
// /home への入力リクエストがある場合
// バナーを非表示にするためのCookieを設定
// リクエストは `Set-Cookie:show-banner=false;path=/home` ヘッダーを持つことになります
request.cookies.set('show-banner', 'false')
```

### `get(name)`

Cookieの値を返します。見つからない場合は`undefined`を返します。複数のCookieが存在する場合は、最初のものを返します。

```javascript
// /home への入力リクエストがある場合
// { name: 'show-banner', value: 'false', Path: '/home' }
request.cookies.get('show-banner')
```

### `getAll()`

Cookieの値を返します。名前を指定しない場合は、リクエスト上のすべてのCookieを返します。

```javascript
// /home への入力リクエストがある場合
// [
//   { name: 'experiments', value: 'new-pricing-page', Path: '/home' },
//   { name: 'experiments', value: 'winter-launch', Path: '/home' },
// ]
request.cookies.getAll('experiments')
// または、リクエストのすべてのCookieを取得
request.cookies.getAll()
```

### `delete(name)`

リクエストからCookieを削除します。

```javascript
// 削除された場合はtrueを、何も削除されなかった場合はfalseを返します
request.cookies.delete('experiments')
```

### `has(name)`

リクエストにCookieが存在する場合は`true`を返します。

```javascript
// Cookieが存在する場合はtrue、存在しない場合はfalseを返します
request.cookies.has('experiments')
```

### `clear()`

リクエストから`Set-Cookie`ヘッダーを削除します。

```javascript
request.cookies.clear()
```

## `nextUrl`

Next.js固有のプロパティでネイティブの`URL` APIを拡張します。

```javascript
// /home へのリクエストがある場合、pathnameは /home
request.nextUrl.pathname
// /home?name=lee へのリクエストがある場合、searchParamsは { name: 'lee' }
request.nextUrl.searchParams
```

## バージョン履歴

| バージョン | 変更内容 |
|---------|---------|
| `v13.0.0` | `NextRequest`が導入されました |
