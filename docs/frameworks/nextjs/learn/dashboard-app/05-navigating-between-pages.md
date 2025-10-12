# ページ間のナビゲーション

前の章では、ダッシュボードのレイアウトとページを作成しました。今度は、ユーザーがダッシュボードルート間をナビゲートできるようにするリンクをいくつか追加しましょう。

この章では...

ここで扱うトピックは次のとおりです

- `next/link` コンポーネントの使用方法
- `usePathname()` フックでアクティブなリンクを表示する方法
- Next.js でナビゲーションがどのように動作するか

## ナビゲーションを最適化する理由

ページ間をリンクするには、従来は `<a>` HTML要素を使用していました。現在、サイドバーのリンクは `<a>` 要素を使用していますが、ブラウザでホーム、invoices、customersページ間をナビゲートするときに何が起こるかに注目してください。

見えましたか？

各ページナビゲーションで完全なページリフレッシュが発生しています！

## `<Link>` コンポーネント

Next.js では、`<Link />` コンポーネントを使用してアプリケーション内のページ間をリンクできます。`<Link>` は JavaScript を使った[クライアントサイドナビゲーション](https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating#how-routing-and-navigation-works)を可能にします。

`<Link />` コンポーネントを使用するには、`/app/ui/dashboard/nav-links.tsx` を開き、[next/link](https://nextjs.org/docs/app/api-reference/components/link) から `Link` コンポーネントをインポートします。そして、`<a>` タグを `<Link>` に置き換えます：

```tsx
// /app/ui/dashboard/nav-links.tsx
import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

// ...

export default function NavLinks() {
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
```

ご覧のとおり、`Link` コンポーネントは `<a>` タグの使用に似ていますが、`<a href="…">` の代わりに `<Link href="…">` を使用します。

変更を保存し、localhost で動作するかどうかを確認してください。完全なリフレッシュを見ることなく、ページ間をナビゲートできるようになったはずです。アプリケーションの一部はサーバー上でレンダリングされていますが、完全なページリフレッシュはなく、ネイティブWebアプリのように感じられます。なぜでしょうか？

### 自動コード分割とプリフェッチ

ナビゲーション体験を向上させるために、Next.js はアプリケーションをルートセグメントごとに自動的にコード分割します。これは、ブラウザが初期ページロード時にすべてのアプリケーションコードを読み込む従来の React [SPA](https://nextjs.org/docs/app/building-your-application/upgrading/single-page-applications) とは異なります。

ルートごとにコードを分割することは、ページが分離されることを意味します。特定のページがエラーをスローしても、アプリケーションの残りの部分は引き続き動作します。これにより、ブラウザが解析するコードも少なくなり、アプリケーションが高速化されます。

さらに、本番環境では、[<Link>](https://nextjs.org/docs/api-reference/next/link) コンポーネントがブラウザのビューポートに表示されるたびに、Next.js はリンクされたルートのコードをバックグラウンドで自動的にプリフェッチします。ユーザーがリンクをクリックする頃には、移動先のページのコードは既にバックグラウンドで読み込まれており、これがページ遷移をほぼ瞬時にするのです！

[ナビゲーションの仕組み](https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating#how-routing-and-navigation-works)について詳しく学びましょう。

## パターン：アクティブなリンクの表示

一般的なUIパターンは、ユーザーが現在どのページにいるかを示すアクティブなリンクを表示することです。これを行うには、URLからユーザーの現在のパスを取得する必要があります。Next.js は、パスをチェックしてこのパターンを実装するために使用できる [usePathname()](https://nextjs.org/docs/app/api-reference/functions/use-pathname) というフックを提供します。

[usePathname()](https://nextjs.org/docs/app/api-reference/functions/use-pathname) は React フックなので、`nav-links.tsx` をクライアントコンポーネントに変更する必要があります。ファイルの先頭に React の `"use client"` ディレクティブを追加し、`next/navigation` から `usePathname()` をインポートします：

```tsx
// /app/ui/dashboard/nav-links.tsx
"use client";

import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";

// ...
```

次に、`<NavLinks />` コンポーネント内で、パスを `pathname` という変数に割り当てます：

```tsx
// /app/ui/dashboard/nav-links.tsx
export default function NavLinks() {
  const pathname = usePathname();
  // ...
}
```

> 注意：`nav-links.tsx` は Next.js の特別なファイルではありません — 任意の名前を付けることができます。名前を変更する場合は、それに応じてインポート文を更新してください。

[CSS スタイリング](https://nextjs.org/learn/dashboard-app/css-styling)の章で紹介した `clsx` ライブラリを使用して、リンクがアクティブなときに条件付きでクラス名を適用できます。`link.href` が `pathname` と一致するとき、リンクは青いテキストと薄い青の背景で表示されるべきです。

`nav-links.tsx` の最終的なコードは次のとおりです：

```tsx
// /app/ui/dashboard/nav-links.tsx
"use client";

import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

// ...

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              "flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3",
              {
                "bg-sky-100 text-blue-600": pathname === link.href,
              }
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
```

保存して localhost を確認してください。アクティブなリンクが青でハイライトされて表示されるはずです。

## 第5章を完了しました

Next.js でページ間をリンクし、クライアントサイドナビゲーションを活用する方法を学びました。

次は

**第6章：データベースのセットアップ**

実際のデータの取得を開始するためのデータベースを作成しましょう！

[第6章を開始](https://nextjs.org/learn/dashboard-app/setting-up-your-database)
