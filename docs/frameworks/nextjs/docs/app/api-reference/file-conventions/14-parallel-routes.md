# パラレルルート

パラレルルートを使用すると、同じレイアウト内で1つ以上のページを同時または条件付きでレンダリングできます。これらは、ダッシュボードやソーシャルサイトのフィードなど、アプリの非常に動的なセクションに役立ちます。

## 説明

パラレルルートは、**スロット**という名前付きを使用して作成されます。スロットは`@folder`規約で定義され、同じレベルのレイアウトにpropsとして渡されます。

スロットはルートセグメントでは**ありません**。URLの構造には影響しません。ファイルパス`/@team/members`は`/members`でアクセスできます。

### 例

たとえば、次のファイル構造は、2つの明示的なスロット`@analytics`と`@team`を定義しています。

```
app/
├── @analytics/
│   └── page.tsx
├── @team/
│   └── page.tsx
├── layout.tsx
└── page.tsx
```

上記のフォルダー構造は、`app/layout.js`のコンポーネントが`@analytics`と`@team`スロットpropsを受け取り、`children` propと並行してレンダリングできることを意味します。

```tsx title="app/layout.tsx"
export default function Layout({
  children,
  team,
  analytics,
}: {
  children: React.ReactNode
  analytics: React.ReactNode
  team: React.ReactNode
}) {
  return (
    <>
      {children}
      {team}
      {analytics}
    </>
  )
}
```

> **知っておくべきこと**: `children` propは、フォルダーにマップする必要がない暗黙的なスロットです。つまり、`app/page.js`は`app/@children/page.js`と同等です。

## 知っておくべきこと

### アクティブ状態とナビゲーション

デフォルトでは、Next.jsは各スロットのアクティブな**状態**（またはサブページ）を追跡します。ただし、スロット内でレンダリングされるコンテンツは、ナビゲーションのタイプによって異なります。

#### ソフトナビゲーション

クライアント側のナビゲーション中、Next.jsは**部分レンダリング**を実行し、現在のURLと一致しない場合でも、スロット内のサブページを変更し、他のスロットのアクティブなサブページを維持します。

#### ハードナビゲーション

完全なページ読み込み（ブラウザの更新）後、Next.jsは現在のURLと一致しないスロットのアクティブな状態を判断できません。代わりに、一致しないスロットに対して`default.js`ファイルをレンダリングします。`default.js`が存在しない場合は、`404`をレンダリングします。

> **知っておくべきこと**: 一致しないルートの`404`は、パラレルルートとして意図されていないルートに誤ってパラレルルートをレンダリングしないようにするのに役立ちます。

### `default.js`

最初の読み込みまたは完全なページリロード中に、Next.jsが現在のURLに基づいてスロットのアクティブな状態を復元できない場合に、フォールバックとしてレンダリングする`default.js`ファイルを定義できます。

次のフォルダー構造を考えてみましょう。`@team`スロットには`/settings`ページがありますが、`@analytics`にはありません。

```
app/
├── @analytics/
│   ├── page.tsx
│   └── default.tsx
├── @team/
│   ├── page.tsx
│   ├── settings/
│   │   └── page.tsx
│   └── default.tsx
├── layout.tsx
└── page.tsx
```

`/settings`に移動すると、`@team`スロットは`/settings`ページをレンダリングし、`@analytics`スロットの現在アクティブなページを維持します。

リフレッシュ時に、Next.jsは`@analytics`に対して`default.js`をレンダリングします。`default.js`が存在しない場合は、代わりに`404`がレンダリングされます。

さらに、`children`は暗黙的なスロットであるため、Next.jsが親ページのアクティブな状態を復元できない場合に、`children`のフォールバックをレンダリングするための`default.js`ファイルも作成する必要があります。

#### `useSelectedLayoutSegment(s)`

[`useSelectedLayoutSegment`](/docs/app/api-reference/functions/use-selected-layout-segment)と[`useSelectedLayoutSegments`](/docs/app/api-reference/functions/use-selected-layout-segments)は、両方とも`parallelRoutesKey`パラメータを受け取り、スロット内のアクティブなルートセグメントを読み取ることができます。

```tsx title="app/layout.tsx"
'use client'

import { useSelectedLayoutSegment } from 'next/navigation'

export default function Layout({
  auth,
}: {
  auth: React.ReactNode
}) {
  const loginSegment = useSelectedLayoutSegment('auth')
  // ...
}
```

ユーザーが`app/@auth/login`（または`/login`）に移動すると、`loginSegment`は文字列`"login"`と等しくなります。

## 例

### 条件付きルート

パラレルルートを使用して、ユーザーの役割などの特定の条件に基づいてルートを条件付きでレンダリングできます。たとえば、`/admin`または`/user`の役割に対して異なるダッシュボードページをレンダリングするには:

```tsx title="app/dashboard/layout.tsx"
import { checkUserRole } from '@/lib/auth'

export default function Layout({
  user,
  admin,
}: {
  user: React.ReactNode
  admin: React.ReactNode
}) {
  const role = checkUserRole()
  return <>{role === 'admin' ? admin : user}</>
}
```

### タブグループ

スロット内に`layout`を追加して、ユーザーがスロットを独立してナビゲートできるようにすることができます。これは、タブを作成するのに役立ちます。

たとえば、`@analytics`スロットには、`/page-views`と`/visitors`の2つのサブページがあります。

```
app/
├── @analytics/
│   ├── page-views/
│   │   └── page.tsx
│   ├── visitors/
│   │   └── page.tsx
│   └── layout.tsx
└── layout.tsx
```

`@analytics`内に、2つのページ間でタブを共有する`layout`ファイルを作成します。

```tsx title="app/@analytics/layout.tsx"
import Link from 'next/link'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <nav>
        <Link href="/page-views">ページビュー</Link>
        <Link href="/visitors">訪問者</Link>
      </nav>
      {children}
    </div>
  )
}
```

### モーダル

パラレルルートは、[インターセプティングルート](/docs/app/building-your-application/routing/intercepting-routes)と一緒に使用して、ディープリンクをサポートするモーダルを作成できます。これにより、モーダルを構築する際の一般的な課題を解決できます。例:

- モーダルコンテンツをURLで**共有可能**にする
- ページが更新されたときに、モーダルを閉じるのではなく**コンテキストを保持**する
- **後方ナビゲーションでモーダルを閉じる**（前のルートに移動するのではなく）
- **前方ナビゲーションでモーダルを再度開く**

次のUIパターンを考えてみましょう。ユーザーは、クライアント側のナビゲーションを使用してレイアウトからログインモーダルを開くことも、別の`/login`ページにアクセスすることもできます。

```
app/
├── @auth/
│   ├── login/
│   │   └── page.tsx
│   └── default.tsx
├── layout.tsx
└── page.tsx
```

このパターンを実装するには、**メイン**のログインページをレンダリングする`/login`ルートを作成することから始めます。

```tsx title="app/login/page.tsx"
import { Login } from '@/app/ui/login'

export default function Page() {
  return <Login />
}
```

次に、`@auth`スロット内に、`null`を返す`default.js`ファイルを追加します。これにより、モーダルがアクティブでない場合にレンダリングされないようにします。

```tsx title="app/@auth/default.tsx"
export default function Default() {
  return null
}
```

`@auth`スロット内で、`/(.)login`フォルダーを更新して`/login`ルートをインターセプトします。`<Modal>`コンポーネントとその子を`/(.)login/page.tsx`ファイルにインポートします。

```tsx title="app/@auth/(.)login/page.tsx"
import { Modal } from '@/app/ui/modal'
import { Login } from '@/app/ui/login'

export default function Page() {
  return (
    <Modal>
      <Login />
    </Modal>
  )
}
```

> **知っておくべきこと**:
>
> - ルートをインターセプトするために使用される規約（例: `(.)`）は、ファイルシステム構造によって異なります。[インターセプティングルート規約](/docs/app/building-your-application/routing/intercepting-routes#convention)を参照してください。
> - `<Modal>`機能をモーダルコンテンツ（`<Login>`）から分離することで、モーダル内のコンテンツ（例: フォーム）がサーバーコンポーネントであることを確認できます。詳細については、[クライアントコンポーネントとサーバーコンポーネントの混在](/docs/app/building-your-application/rendering/composition-patterns#supported-pattern-passing-server-components-to-client-components-as-props)を参照してください。

#### モーダルを開く

これで、Next.jsルーターを活用してモーダルを開いたり閉じたりできます。これにより、モーダルが開いているとき、および前方および後方にナビゲートするときに、URLが正しく更新されます。

モーダルを開くには、`@auth`スロットを親レイアウトにpropとして渡し、`children` propと一緒にレンダリングします。

```tsx title="app/layout.tsx"
import Link from 'next/link'

export default function Layout({
  auth,
  children,
}: {
  auth: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <>
      <nav>
        <Link href="/login">モーダルを開く</Link>
      </nav>
      <div>{auth}</div>
      <div>{children}</div>
    </>
  )
}
```

ユーザーが`<Link>`をクリックすると、`/login`ページに移動する代わりにモーダルが開きます。ただし、リフレッシュ時または最初の読み込み時に`/login`に移動すると、ユーザーはメインのログインページに移動します。

#### モーダルを閉じる

`router.back()`を呼び出すか、`Link`コンポーネントを使用してモーダルを閉じることができます。

```tsx title="app/ui/modal.tsx"
'use client'

import { useRouter } from 'next/navigation'

export function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  return (
    <>
      <button
        onClick={() => {
          router.back()
        }}
      >
        モーダルを閉じる
      </button>
      <div>{children}</div>
    </>
  )
}
```

`Link`コンポーネントを使用して、`@auth`スロットをレンダリングしなくなったページから離れる場合は、並列ルートが`null`を返すキャッチオールルートを使用する必要があります。たとえば、ルートページに戻るとき:

```tsx title="app/ui/modal.tsx"
import Link from 'next/link'

export function Modal({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Link href="/">モーダルを閉じる</Link>
      <div>{children}</div>
    </>
  )
}
```

```tsx title="app/@auth/[...catchAll]/page.tsx"
export default function CatchAll() {
  return null
}
```

> **知っておくべきこと**:
>
> - [アクティブ状態とナビゲーション](#アクティブ状態とナビゲーション)で説明されている動作のため、`@auth`スロットをクローズするためにキャッチオールルートを使用します。スロットと一致しなくなったルートへのクライアント側ナビゲーションは引き続き表示されるため、スロットを`null`を返すルートと一致させてモーダルを閉じる必要があります。
> - 他の例には、ギャラリー内の写真モーダルを開きながら専用の`/photo/[id]`ページを持つこと、またはサイドモーダルでショッピングカートを開くことが含まれる場合があります。
> - インターセプトされたルートとパラレルルートを使用したモーダルの[例を見る](https://github.com/vercel-labs/nextgram)

### ローディングとエラーUI

パラレルルートは独立してストリーミングできるため、各ルートに独立したエラーとローディング状態を定義できます。

```
app/
├── @analytics/
│   ├── loading.tsx
│   └── page.tsx
├── @team/
│   ├── error.tsx
│   └── page.tsx
└── layout.tsx
```

詳細については、[ローディングUI](/docs/app/building-your-application/routing/loading-ui-and-streaming)と[エラー処理](/docs/app/building-your-application/routing/error-handling)のドキュメントを参照してください。

## バージョン履歴

| バージョン | 変更内容                     |
| ---------- | ---------------------------- |
| `v13.0.0`  | パラレルルートが導入されました |
