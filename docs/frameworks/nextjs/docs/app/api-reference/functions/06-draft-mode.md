# draftMode

`draftMode` は、[ドラフトモード](/docs/app/guides/draft-mode)を有効化および無効化し、[サーバーコンポーネント](/docs/app/getting-started/server-and-client-components)でドラフトモードが有効かどうかを確認できる**非同期**関数です。

```typescript
import { draftMode } from 'next/headers'

export default async function Page() {
  const { isEnabled } = await draftMode()
}
```

## リファレンス

以下のメソッドとプロパティが利用可能です：

| メソッド | 説明 |
|----------|------|
| `isEnabled` | ドラフトモードが有効かどうかを示すブール値 |
| `enable()` | ルートハンドラでクッキーを設定してドラフトモードを有効化 |
| `disable()` | ルートハンドラでクッキーを削除してドラフトモードを無効化 |

## 注意点

- `draftMode` は非同期関数で、`async/await` または React の `use` 関数を使用する必要があります。
- ビルドごとに新しいバイパスクッキー値が生成されます。
- ローカルでHTTP経由でテストする場合、ブラウザでサードパーティのCookieとローカルストレージへのアクセスを許可する必要があります。

## 例

### ドラフトモードの有効化

```typescript
import { draftMode } from 'next/headers'

export async function GET(request: Request) {
  const draft = await draftMode()
  draft.enable()
  return new Response('ドラフトモードが有効になりました')
}
```

### ドラフトモードの無効化

```typescript
import { draftMode } from 'next/headers'

export async function GET(request: Request) {
  const draft = await draftMode()
  draft.disable()
  return new Response('ドラフトモードが無効になりました')
}
```

### ドラフトモードのチェック

```typescript
import { draftMode } from 'next/headers'

export default async function Page() {
  const { isEnabled } = await draftMode()

  return (
    <div>
      <h1>ドラフトモード状態</h1>
      <p>ドラフトモードは {isEnabled ? '有効' : '無効'} です</p>
    </div>
  )
}
```

## バージョン履歴

| バージョン | 変更点 |
|-----------|--------|
| `v15.0.0-RC` | `draftMode` が非同期関数になりました |
| `v13.4.0` | `draftMode` が導入されました |
