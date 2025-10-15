# コンポーネントのインポートとエクスポート

コンポーネントの魅力は、その再利用性にあります。他のコンポーネントを組み合わせて新しいコンポーネントを作ることができます。しかし、コンポーネントをネストしていくと、それらを別々のファイルに分割したくなることがよくあります。これにより、ファイルを見つけやすくなり、より多くの場所でコンポーネントを再利用できるようになります。

## 学ぶこと

- ルートコンポーネントファイルとは何か
- コンポーネントをインポートおよびエクスポートする方法
- デフォルトと名前付きのインポート・エクスポートをいつ使用するか
- 1 つのファイルから複数のコンポーネントをインポート・エクスポートする方法
- コンポーネントを複数のファイルに分割する方法

## ルートコンポーネントファイル

[初めてのコンポーネント](/learn/your-first-component)では、`Profile` コンポーネントと、それをレンダーする `Gallery` コンポーネントを作成しました。

```jsx
function Profile() {
  return (
    <img
      src="https://i.imgur.com/MK3eW3As.jpg"
      alt="Katherine Johnson"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

これらは現在、この例では `App.js` と呼ばれる**ルートコンポーネントファイル**に存在しています。[Create React App](https://create-react-app.dev/) では、アプリ全体が `src/App.js` に存在します。設定によっては、ルートコンポーネントが別のファイルにある場合もあります。Next.js のようなファイルベースのルーティングを持つフレームワークを使用している場合、ルートコンポーネントはページごとに異なります。

## コンポーネントのエクスポートとインポート

将来、ランディング画面を変更して、そこに科学の本のリストを置きたくなったらどうしますか？あるいは、すべてのプロフィールを別の場所に配置したい場合は？`Gallery` と `Profile` をルートコンポーネントファイルから移動することは理にかなっています。これにより、コンポーネントがよりモジュラーになり、他のファイルで再利用できるようになります。コンポーネントは次の 3 つのステップで移動できます。

1. コンポーネントを入れる新しい JS ファイルを**作成します**。
2. そのファイルから関数コンポーネントを**エクスポートします**（[デフォルト](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/export#using_the_default_export)または[名前付き](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/export#using_named_exports)エクスポートのいずれかを使用）。
3. コンポーネントを使用するファイルで**インポートします**（[デフォルト](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/import#importing_defaults)または[名前付き](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/import#import_a_single_export_from_a_module)エクスポートをインポートする適切な手法を使用）。

ここでは、`Profile` と `Gallery` の両方が `App.js` から `Gallery.js` という新しいファイルに移動されました。これで、`App.js` を変更して、`Gallery.js` から `Gallery` をインポートできるようになりました。

**App.js**

```jsx
import Gallery from './Gallery.js';

export default function App() {
  return (
    <Gallery />
  );
}
```

**Gallery.js**

```jsx
function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

この例が 2 つのコンポーネントファイルに分割されたことに注目してください。

1. `Gallery.js`:
   - 同じファイル内でのみ使用され、エクスポートされていない `Profile` コンポーネントを定義します。
   - `Gallery` コンポーネントを**デフォルトエクスポート**としてエクスポートします。
2. `App.js`:
   - `Gallery.js` から `Gallery` を**デフォルトインポート**としてインポートします。
   - ルート `App` コンポーネントを**デフォルトエクスポート**としてエクスポートします。

> 注意
>
> `.js` ファイル拡張子を省略したファイルに遭遇することがあります。
>
> ```jsx
> import Gallery from './Gallery';
> ```
>
> `'./Gallery.js'` または `'./Gallery'` のどちらも React で動作しますが、前者は[ネイティブ ES モジュール](https://developer.mozilla.org/docs/Web/JavaScript/Guide/Modules)の動作に近いものです。

> Deep Dive
>
> ### デフォルトエクスポート vs 名前付きエクスポート
>
> JavaScript で値をエクスポートする主な方法には、デフォルトエクスポートと名前付きエクスポートの 2 つがあります。これまでの例では、デフォルトエクスポートのみを使用してきました。しかし、同じファイルで両方を使用することも、どちらか一方だけを使用することもできます。**1 つのファイルが持てるデフォルトエクスポートは 1 つだけですが、名前付きエクスポートはいくつでも持つことができます。**
>
> ![デフォルトエクスポートと名前付きエクスポート](https://react.dev/images/docs/illustrations/i_import-export.svg)
>
> コンポーネントをエクスポートする方法によって、インポートする方法が決まります。デフォルトエクスポートを名前付きエクスポートと同じようにインポートしようとすると、エラーが発生します！この表は、追跡するのに役立ちます。
>
> | 構文 | エクスポート文 | インポート文 |
> |------|--------------|------------|
> | デフォルト | `export default function Button() {}` | `import Button from './Button.js';` |
> | 名前付き | `export function Button() {}` | `import { Button } from './Button.js';` |
>
> _デフォルト_インポートを書く場合、`import` の後に任意の名前を置くことができます。例えば、`import Banana from './Button.js'` と書いても、同じデフォルトエクスポートが提供されます。対照的に、名前付きインポートでは、名前が両側で一致する必要があります。だから_名前付き_インポートと呼ばれるのです！
>
> **ファイルが 1 つのコンポーネントのみをエクスポートする場合は、デフォルトエクスポートを使用し、複数のコンポーネントや値をエクスポートする場合は、名前付きエクスポートを使用することがよくあります。** どちらのコーディングスタイルを好むかに関わらず、常にコンポーネント関数とそれを含むファイルに意味のある名前を付けてください。`export default () => {}` のような名前のないコンポーネントは、デバッグを困難にするため推奨されません。

## 同じファイルから複数のコンポーネントをエクスポートおよびインポートする

ギャラリー全体ではなく、1 つの `Profile` だけを表示したい場合はどうでしょうか。`Profile` コンポーネントもエクスポートできます。しかし、`Gallery.js` には既に_デフォルト_エクスポートがあり、2 つの_デフォルト_エクスポートを持つことはできません。デフォルトエクスポートを使用して新しいファイルを作成することも、`Profile` に_名前付き_エクスポートを追加することもできます。**1 つのファイルには、デフォルトエクスポートは 1 つしか持てませんが、名前付きエクスポートは複数持つことができます！**

> 注意
>
> デフォルトエクスポートと名前付きエクスポートの間の潜在的な混乱を減らすために、一部のチームは 1 つのスタイル（デフォルトまたは名前付き）だけに固執するか、単一のファイル内でそれらを混在させないことを選択します。自分に合った方法を選んでください！

まず、名前付きエクスポートを使用して `Gallery.js` から `Profile` を**エクスポート**します（`default` キーワードなし）。

```jsx
export function Profile() {
  // ...
}
```

次に、名前付きインポートを使用して `Gallery.js` から `App.js` に `Profile` を**インポート**します（波括弧付き）。

```jsx
import { Profile } from './Gallery.js';
```

最後に、`App` コンポーネントから `<Profile />` を**レンダー**します。

```jsx
export default function App() {
  return <Profile />;
}
```

これで、`Gallery.js` には 2 つのエクスポートが含まれます。デフォルト `Gallery` エクスポートと、名前付き `Profile` エクスポートです。`App.js` は両方をインポートします。この例で `<Profile />` を `<Gallery />` に、そして元に戻してみてください。

**App.js**

```jsx
import Gallery from './Gallery.js';
import { Profile } from './Gallery.js';

export default function App() {
  return (
    <Profile />
  );
}
```

**Gallery.js**

```jsx
export function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

これで、デフォルトエクスポートと名前付きエクスポートの両方を混在させています。

- `Gallery.js`:
  - `Profile` コンポーネントを `Profile` という**名前付きエクスポート**としてエクスポートします。
  - `Gallery` コンポーネントを**デフォルトエクスポート**としてエクスポートします。
- `App.js`:
  - `Gallery.js` から `Profile` を `Profile` という**名前付きインポート**としてインポートします。
  - `Gallery.js` から `Gallery` を**デフォルトインポート**としてインポートします。
  - ルート `App` コンポーネントを**デフォルトエクスポート**としてエクスポートします。

## まとめ

このページでは以下を学びました。

- ルートコンポーネントファイルとは何か
- コンポーネントをインポートおよびエクスポートする方法
- デフォルトと名前付きのインポートとエクスポートをいつどのように使用するか
- 同じファイルから複数のコンポーネントをエクスポートする方法

## チャレンジ

### チャレンジ 1: コンポーネントをさらに分割する

現在、`Gallery.js` は `Profile` と `Gallery` の両方をエクスポートしていますが、これは少し混乱します。

`Profile` コンポーネントを独自の `Profile.js` に移動し、`App` コンポーネントを変更して `<Profile />` と `<Gallery />` の両方を次々にレンダーしてください。

`Profile` にはデフォルトエクスポートまたは名前付きエクスポートのいずれかを使用できますが、`App.js` と `Gallery.js` の両方で対応するインポート構文を使用してください！上記の深掘りの表を参考にできます。

| 構文 | エクスポート文 | インポート文 |
|------|--------------|------------|
| デフォルト | `export default function Button() {}` | `import Button from './Button.js';` |
| 名前付き | `export function Button() {}` | `import { Button } from './Button.js';` |

> ヒント
>
> コンポーネントが呼び出される場所でインポートすることを忘れないでください。`Gallery` も `Profile` を使用していますよね？

#### 解決策

これは、名前付きエクスポートを使用した解決策です。

**App.js**

```jsx
import Gallery from './Gallery.js';
import { Profile } from './Profile.js';

export default function App() {
  return (
    <div>
      <Profile />
      <Gallery />
    </div>
  );
}
```

**Gallery.js**

```jsx
import { Profile } from './Profile.js';

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

**Profile.js**

```jsx
export function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}
```

名前付きエクスポートを動作させた後、デフォルトエクスポートを使用するように変更してみてください。

**App.js**

```jsx
import Gallery from './Gallery.js';
import Profile from './Profile.js';

export default function App() {
  return (
    <div>
      <Profile />
      <Gallery />
    </div>
  );
}
```

**Gallery.js**

```jsx
import Profile from './Profile.js';

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

**Profile.js**

```jsx
export default function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}
```
