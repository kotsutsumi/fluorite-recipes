# サーバーとクライアントコンポーネント

サーバーとクライアントコンポーネントの仕組みを理解するためには、アプリケーションコードが実行される2つの基本的なWeb概念について理解しておくことが重要です：

- アプリケーションコードが実行される環境：サーバーとクライアント
- サーバーとクライアントコードを分離するネットワーク境界

## サーバーとクライアント環境

Webアプリケーションのコンテキストにおいて：

- **クライアント**とは、ユーザーのデバイス上のブラウザを指し、アプリケーションコードのためにサーバーにリクエストを送信します。サーバーから受け取ったレスポンスを、ユーザーが操作できるインターフェースに変換します。
- **サーバー**とは、データセンター内のコンピュータを指し、アプリケーションコードを保存し、クライアントからのリクエストを受信し、何らかの計算を行い、適切なレスポンスを送り返します。

各環境には、それぞれ固有の機能と制約があります。たとえば、レンダリングとデータフェッチをサーバーに移すことで、クライアントに送信されるコードの量を減らし、アプリケーションのパフォーマンスを向上させることができます。しかし、前章で学んだように、UIをインタラクティブにするためには、クライアント上でDOMを更新する必要があります。

したがって、サーバー用とクライアント用に書くコードは必ずしも同じではありません。特定の操作（例：データフェッチやユーザー状態の管理）は、一方の環境により適している場合があります。

## ネットワーク境界

ネットワーク境界は、異なる環境を分離する概念的な線です。

Reactでは、コンポーネントツリー内のどこにネットワーク境界を配置するかを選択します。たとえば、サーバー上でデータをフェッチしてユーザーの投稿をレンダリング（サーバーコンポーネントを使用）し、各投稿のインタラクティブな`LikeButton`をクライアント上でレンダリング（クライアントコンポーネントを使用）することができます。

同様に、サーバー上でレンダリングされ、ページ間で共有される`Nav`コンポーネントを作成できますが、リンクのアクティブ状態を表示したい場合は、`Links`のリストをクライアント上でレンダリングできます。

舞台裏では、コンポーネントは2つのモジュールグラフに分割されます。サーバーモジュールグラフ（またはツリー）には、サーバー上でレンダリングされるすべてのサーバーコンポーネントが含まれ、クライアントモジュールグラフ（またはツリー）には、すべてのクライアントコンポーネントが含まれます。

サーバーコンポーネントがレンダリングされた後、React Server Component Payload（RSC）と呼ばれる特別なデータ形式がクライアントに送信されます。RSCペイロードには以下が含まれます：

1. サーバーコンポーネントのレンダリング結果
2. クライアントコンポーネントがレンダリングされる場所のプレースホルダー（または穴）と、それらのJavaScriptファイルへの参照

Reactはこの情報を使用してサーバーとクライアントコンポーネントを統合し、クライアント上でDOMを更新します。

この仕組みがどのように動作するかを見てみましょう。

## クライアントコンポーネントの使用

前章で学んだように、Next.jsはデフォルトでサーバーコンポーネントを使用します。これはアプリケーションのパフォーマンスを向上させるためであり、それらを採用するための追加的な手順を踏む必要がないことを意味します。

ブラウザのエラーを振り返ると、Next.jsはサーバーコンポーネント内で`useState`を使用しようとしていることを警告しています。これを修正するには、インタラクティブな「Like」ボタンをクライアントコンポーネントに移動します。

`app`フォルダ内に`like-button.js`という新しいファイルを作成し、`LikeButton`コンポーネントをエクスポートします：

```javascript
// /app/like-button.js
export default function LikeButton() {}
```

`page.js`から`<button>`要素と`handleClick()`関数を新しい`LikeButton`コンポーネントに移動します：

```javascript
// /app/like-button.js
export default function LikeButton() {
  function handleClick() {
    setLikes(likes + 1);
  }

  return <button onClick={handleClick}>Like ({likes})</button>;
}
```

次に、`likes`状態とimportを移動します：

```javascript
// /app/like-button.js
import { useState } from "react";

export default function LikeButton() {
  const [likes, setLikes] = useState(0);

  function handleClick() {
    setLikes(likes + 1);
  }

  return <button onClick={handleClick}>Like ({likes})</button>;
}
```

今度は、`LikeButton`をクライアントコンポーネントにするために、ファイルの先頭にReactの`'use client'`ディレクティブを追加します。これにより、Reactにコンポーネントをクライアント上でレンダリングするよう指示します。

```javascript
// /app/like-button.js
"use client";

import { useState } from "react";

export default function LikeButton() {
  const [likes, setLikes] = useState(0);

  function handleClick() {
    setLikes(likes + 1);
  }

  return <button onClick={handleClick}>Like ({likes})</button>;
}
```

`page.js`ファイルに戻って、`LikeButton`コンポーネントをページにインポートします：

```javascript
// /app/page.js
import LikeButton from "./like-button";

function Header({ title }) {
  return <h1>{title ? title : "Default title"}</h1>;
}

export default function HomePage() {
  const names = ["Ada Lovelace", "Grace Hopper", "Margaret Hamilton"];

  return (
    <div>
      <Header title="Develop. Preview. Ship." />
      <ul>
        {names.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
      <LikeButton />
    </div>
  );
}
```

両方のファイルを保存してブラウザでアプリを表示します。エラーがなくなったので、変更を加えて保存すると、ブラウザが自動的に更新されて変更が反映されることに気づくはずです。

この機能は[Fast Refresh](https://nextjs.org/docs/architecture/fast-refresh)と呼ばれます。行った編集に対して瞬時にフィードバックを提供し、Next.jsに事前設定されています。

## まとめ

まとめると、サーバーとクライアント環境について、およびそれぞれをいつ使用するかを学びました。また、Next.jsがパフォーマンスを向上させるためにデフォルトでReact Server Componentsを使用することと、UIの小さな部分をインタラクティブにするためにクライアントコンポーネントを選択する方法も学びました。

## 追加の学習資料

サーバーとクライアントコンポーネントについては、さらに学ぶべきことがたくさんあります。以下は追加のリソースです：

- [Server Components Docs](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Client Component Docs](https://nextjs.org/docs/app/building-your-application/rendering/client-components)
- [Composition Patterns](https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns)
- [The "use client" Directive](https://react.dev/reference/react/use-client)
- [The "use server" Directive](https://react.dev/reference/react/use-server)

## 第10章が完了しました

サーバーとクライアントコンポーネントの使用方法を学びました。

### 次のステップ

第11章：次のステップ

次は何でしょうか？

[第11章を始める](https://nextjs.org/learn/react-foundations/next-steps)
