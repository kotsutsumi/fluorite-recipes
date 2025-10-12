# loading.js

**loading**ファイルは、React Suspenseを使用した意味のあるローディングUIを作成できます。この規則により、ルートセグメントのコンテンツが読み込まれている間に、サーバーから即座にローディング状態を表示できます。新しいコンテンツは、レンダリングが完了すると自動的に入れ替わります。

## 説明

ローディングUIコンポーネントは、ルートセグメント（レイアウトまたはページ）の代替UIとして機能し、コンテンツが読み込まれている間に表示されます。

### 即座のローディング状態

即座のローディング状態は、ナビゲーション時にすぐに表示されるフォールバックUIです。スケルトンやスピナーのようなローディングインジケーター、または将来の画面の小さいながらも意味のある部分（カバー写真、タイトルなど）を事前にレンダリングできます。これにより、ユーザーはアプリが応答していることを理解でき、より良いユーザーエクスペリエンスを提供します。

フォルダー内に`loading.js`ファイルを追加することで、ローディング状態を作成します。

```tsx title="app/dashboard/loading.tsx"
export default function Loading() {
  // ローディング内に任意のUIを追加できます（スケルトンを含む）
  return <LoadingSkeleton />
}
```

同じフォルダーに、`loading.js`は`layout.js`内にネストされます。これは、`page.js`ファイルとその下のすべての子を`<Suspense>`境界で自動的にラップします。

## 知っておくべきこと

- [サーバー中心のルーティング](/docs/app/building-your-application/routing/linking-and-navigating#how-routing-and-navigation-works)でも、ナビゲーションは即座に行われます
- ナビゲーションは中断可能です。つまり、ルートを変更するとき、別のルートに移動する前に、ルートのコンテンツが完全に読み込まれるのを待つ必要はありません
- 新しいルートセグメントが読み込まれている間も、共有レイアウトはインタラクティブなままです

## サーバーコンポーネントまたはクライアントコンポーネント

`loading.js`は、サーバーコンポーネントまたはクライアントコンポーネントのいずれかにできます。

## 例

### 基本的なローディングコンポーネント

```tsx title="app/feed/loading.tsx"
export default function Loading() {
  return <p>読み込み中...</p>
}
```

### スケルトンUIを使用したローディング

```tsx title="app/dashboard/loading.tsx"
export default function Loading() {
  return (
    <div className="space-y-4">
      <div className="h-8 bg-gray-200 rounded animate-pulse" />
      <div className="h-64 bg-gray-200 rounded animate-pulse" />
      <div className="h-8 bg-gray-200 rounded animate-pulse" />
    </div>
  )
}
```

### カスタムスピナーコンポーネント

```tsx title="app/products/loading.tsx"
import { Spinner } from '@/components/spinner'

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Spinner size="large" />
    </div>
  )
}
```

## ストリーミングとSuspense

`loading.js`に加えて、独自のUIコンポーネント用に手動でSuspense境界を作成することもできます。App Routerは、[Node.jsランタイムとEdgeランタイム](/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes)の両方で[Suspense](/docs/app/building-your-application/routing/loading-ui-and-streaming#streaming-with-suspense)を使用したストリーミングをサポートしています。

### ストリーミングとは

Reactとその後のNext.jsでストリーミングがどのように機能するかを理解するには、**サーバーサイドレンダリング（SSR）**とその制限を理解することが役立ちます。

SSRでは、ユーザーがページを表示して操作できるようになる前に、一連のステップを完了する必要があります：

1. 最初に、特定のページのすべてのデータがサーバーでフェッチされます
2. 次に、サーバーがページのHTMLをレンダリングします
3. ページのHTML、CSS、JavaScriptがクライアントに送信されます
4. 生成されたHTMLとCSSを使用して、非インタラクティブなユーザーインターフェースが表示されます
5. 最後に、Reactがユーザーインターフェースを[ハイドレート](https://react.dev/reference/react-dom/client/hydrateRoot#hydrating-server-rendered-html)して、インタラクティブにします

これらのステップは順次かつブロッキングです。つまり、サーバーは、すべてのデータがフェッチされた後にのみ、ページのHTMLをレンダリングできます。また、クライアント側では、Reactは、ページのすべてのコンポーネントのコードがダウンロードされた後にのみ、UIをハイドレートできます。

ReactとNext.jsを使用したSSRは、非インタラクティブなページをできるだけ早くユーザーに表示することで、知覚されるローディングパフォーマンスを向上させるのに役立ちます。

しかし、ページをユーザーに表示する前に、サーバーですべてのデータフェッチが完了する必要があるため、依然として遅くなる可能性があります。

**ストリーミング**を使用すると、ページのHTMLを小さなチャンクに分割し、それらのチャンクをサーバーからクライアントに段階的に送信できます。

これにより、UIがレンダリングされる前に、すべてのデータが読み込まれるのを待つことなく、ページの一部をより早く表示できます。

ストリーミングは、Reactのコンポーネントモデルとよく連携します。各コンポーネントをチャンクと見なすことができるためです。優先度が高い（例: 製品情報）コンポーネントや、データに依存しないコンポーネントは、最初に送信できます（例: レイアウト）。優先度が低いコンポーネント（例: レビュー、関連製品）は、データがフェッチされた後、同じサーバーリクエストで送信できます。

ストリーミングは、長いデータリクエストがページのレンダリングをブロックするのを防ぐ場合に特に有益です。また、Time To First Byte（TTFB）とFirst Contentful Paint（FCP）を削減できます。また、特に遅いデバイスでは、Time to Interactive（TTI）の改善にも役立ちます。

## プラットフォームサポート

| プラットフォーム | サポート状況 |
| ---------------- | ------------ |
| Node.js Server   | はい         |
| Docker Container | はい         |
| Static Export    | いいえ       |

## バージョン履歴

| バージョン | 変更内容           |
| ---------- | ------------------ |
| `v13.0.0`  | `loading`が導入されました |
