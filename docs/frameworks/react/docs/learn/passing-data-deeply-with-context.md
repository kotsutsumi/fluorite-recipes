# コンテクストで深くデータを受け渡す

通常、親コンポーネントから子コンポーネントには props を使って情報を渡します。しかし、props を多数の中間コンポーネントを経由して渡さないといけない場合や、アプリ内の多くのコンポーネントが同じ情報を必要とする場合、props の受け渡しは冗長で不便なものとなり得ます。*コンテクスト (Context)* を使用することで、親コンポーネントから props を明示的に渡さずとも、それ以下のツリー内の任意のコンポーネントが情報を受け取れるようにできます。

## このページで学ぶこと

- "props の穴掘り作業 (prop drilling)" とは何か
- コンテクストを使って props の冗長な受け渡しを解消する方法
- コンテクストの一般的な用途
- コンテクストの代替手段

## props を渡すことの問題

[props を渡す](/learn/passing-props-to-a-component)ことは、UI ツリーを通じてデータを明示的に使用したいコンポーネントに渡す優れた方法です。

しかし、props をツリーの深くまで渡す必要がある場合、または多くのコンポーネントが同じ props を必要とする場合、props を渡すことは冗長で不便になる可能性があります。最も近い共通の祖先がデータを必要とするコンポーネントから遠く離れている可能性があり、[state をそこまで持ち上げる](/learn/sharing-state-between-components)と、"props の穴掘り作業 (prop drilling)" と呼ばれる状況が発生する可能性があります。

props を渡さずにツリー内のコンポーネントにデータを「テレポート」する方法があればいいと思いませんか? React のコンテクスト機能を使えば、それが可能です!

## コンテクスト: props を渡す代替手段

コンテクストを使用すると、親コンポーネントはそれ以下のツリー全体にデータを提供できます。コンテクストには多くの用途があります。以下はその一例です。この `Heading` コンポーネントは、見出しレベルとして `level` を受け取ります。

```javascript
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading level={1}>Title</Heading>
      <Heading level={2}>Heading</Heading>
      <Heading level={3}>Sub-heading</Heading>
      <Heading level={4}>Sub-sub-heading</Heading>
      <Heading level={5}>Sub-sub-sub-heading</Heading>
      <Heading level={6}>Sub-sub-sub-sub-heading</Heading>
    </Section>
  );
}
```

同じ `Section` 内の複数の見出しが常に同じサイズになるようにしたいとしましょう。

```javascript
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading level={1}>Title</Heading>
      <Section>
        <Heading level={2}>Heading</Heading>
        <Heading level={2}>Heading</Heading>
        <Heading level={2}>Heading</Heading>
        <Section>
          <Heading level={3}>Sub-heading</Heading>
          <Heading level={3}>Sub-heading</Heading>
          <Heading level={3}>Sub-heading</Heading>
          <Section>
            <Heading level={4}>Sub-sub-heading</Heading>
            <Heading level={4}>Sub-sub-heading</Heading>
            <Heading level={4}>Sub-sub-heading</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

現在、`level` prop を各 `<Heading>` に個別に渡しています。

```javascript
<Section>
  <Heading level={3}>About</Heading>
  <Heading level={3}>Photos</Heading>
  <Heading level={3}>Videos</Heading>
</Section>
```

代わりに、`level` prop を `<Section>` コンポーネントに渡して、`<Heading>` から削除できれば良いでしょう。これにより、同じセクション内のすべての見出しが同じサイズになることを強制できます。

```javascript
<Section level={3}>
  <Heading>About</Heading>
  <Heading>Photos</Heading>
  <Heading>Videos</Heading>
</Section>
```

しかし、`<Heading>` コンポーネントはどのようにして最も近い `<Section>` のレベルを知ることができるのでしょうか? **それには、子が上のツリーのどこかからデータを「要求」する方法が必要です。**

props だけではそれはできません。ここでコンテクストの出番です。以下の 3 つのステップで実現できます。

1. コンテクストを**作成する**。(見出しレベル用なので、`LevelContext` と呼ぶことができます。)
2. データを必要とするコンポーネントからそのコンテクストを**使用する**。(`Heading` は `LevelContext` を使用します。)
3. データを指定するコンポーネントからそのコンテクストを**提供する**。(`Section` は `LevelContext` を提供します。)

コンテクストを使用すると、親(遠く離れていても!)がそれ以下のツリー全体にデータを提供できます。

### ステップ 1: コンテクストを作成する

まず、コンテクストを作成する必要があります。**ファイルからエクスポート**して、コンポーネントが使用できるようにする必要があります。

```javascript
import { createContext } from 'react';

export const LevelContext = createContext(1);
```

`createContext` の唯一の引数は *デフォルト* 値です。ここでは、`1` は最大の見出しレベルを指しますが、あらゆる種類の値(オブジェクトでさえ)を渡すことができます。デフォルト値の重要性は次のステップでわかります。

### ステップ 2: コンテクストを使用する

React から `useContext` フックと、作成したコンテクストをインポートします。

```javascript
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';
```

現在、`Heading` コンポーネントは props から `level` を読み取っています。

```javascript
export default function Heading({ level, children }) {
  // ...
}
```

代わりに、`level` prop を削除し、先ほどインポートしたコンテクスト `LevelContext` から値を読み取ります。

```javascript
export default function Heading({ children }) {
  const level = useContext(LevelContext);
  // ...
}
```

`useContext` はフックです。`useState` や `useReducer` と同様に、フックは React コンポーネントの直接内部でのみ呼び出すことができます。**`useContext` は React に、`Heading` コンポーネントが `LevelContext` を読み取りたいと伝えます。**

これで `Heading` コンポーネントに `level` prop がないので、次のように JSX で `Heading` に level prop を渡す必要はありません。

```javascript
<Section>
  <Heading level={4}>Sub-sub-heading</Heading>
  <Heading level={4}>Sub-sub-heading</Heading>
  <Heading level={4}>Sub-sub-heading</Heading>
</Section>
```

代わりに、`Section` が受け取るように JSX を更新します。

```javascript
<Section level={4}>
  <Heading>Sub-sub-heading</Heading>
  <Heading>Sub-sub-heading</Heading>
  <Heading>Sub-sub-heading</Heading>
</Section>
```

思い出してください、これが動作させようとしていたマークアップです。

```javascript
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section level={1}>
      <Heading>Title</Heading>
      <Section level={2}>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Section level={3}>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Section level={4}>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

この例はまだ完全には機能しないことに注意してください! すべての見出しは同じサイズです。なぜなら、**コンテクストを*使用*しているにもかかわらず、まだ*提供*していないからです。** React はどこからそれを取得すればよいかわかりません!

コンテクストを提供しない場合、React は前のステップで指定したデフォルト値を使用します。この例では、`createContext` の引数として `1` を指定したので、`useContext(LevelContext)` は `1` を返し、すべての見出しを `<h1>` に設定します。この問題を修正するには、各 `Section` が独自のコンテクストを提供するようにしましょう。

### ステップ 3: コンテクストを提供する

`Section` コンポーネントは現在その子をレンダリングします。

```javascript
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

**コンテクストプロバイダでラップして**、`LevelContext` を提供します。

```javascript
import { LevelContext } from './LevelContext.js';

export default function Section({ level, children }) {
  return (
    <section className="section">
      <LevelContext.Provider value={level}>
        {children}
      </LevelContext.Provider>
    </section>
  );
}
```

これは React に「この `<Section>` 内で誰かが `LevelContext` を要求した場合、この `level` を与えよ」と伝えます。コンポーネントは、UI ツリーの上にある最も近い `<LevelContext.Provider>` の値を使用します。

```javascript
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section level={1}>
      <Heading>Title</Heading>
      <Section level={2}>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Section level={3}>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Section level={4}>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

これは元のコードと同じ結果ですが、各 `Heading` コンポーネントに `level` prop を渡す必要はありませんでした! 代わりに、上の最も近い `Section` に尋ねることで、見出しレベルを「把握」します。

1. `level` prop を `<Section>` に渡します。
2. `Section` はその子を `<LevelContext.Provider value={level}>` でラップします。
3. `Heading` は `useContext(LevelContext)` を使用して、上の最も近い `LevelContext` の値を要求します。

## 同じコンポーネントからコンテクストを使用および提供する

現在、各セクションの `level` を手動で指定する必要があります。

```javascript
export default function Page() {
  return (
    <Section level={1}>
      ...
      <Section level={2}>
        ...
        <Section level={3}>
          ...
```

コンテクストを使用すると、上のコンポーネントから情報を読み取ることができるため、各 `Section` は上の `Section` から `level` を読み取り、自動的に `level + 1` を下に渡すことができます。以下はその方法です。

```javascript
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Section({ children }) {
  const level = useContext(LevelContext);
  return (
    <section className="section">
      <LevelContext.Provider value={level + 1}>
        {children}
      </LevelContext.Provider>
    </section>
  );
}
```

この変更により、`level` prop を `<Section>` または `<Heading>` のどちらにも渡す必要はありません。

```javascript
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading>Title</Heading>
      <Section>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Section>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Section>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

今、`Heading` と `Section` の両方が、どれだけ「深い」かを把握するために `LevelContext` を読み取ります。そして、`Section` は、その中のすべてが「より深い」レベルにあることを指定するために、その子を `LevelContext` でラップします。

> **Note**
>
> この例では、ネストされたコンポーネントがコンテクストを上書きする方法を視覚的に示すために、見出しレベルを使用しています。しかし、コンテクストは他の多くのユースケースにも役立ちます。コンテクストを使用して、現在の配色、現在ログインしているユーザなど、サブツリー全体に必要な情報を渡すことができます。

## コンテクストは中間コンポーネントを通過する

コンテクストを提供するコンポーネントとそれを使用するコンポーネントの間に、好きなだけコンポーネントを挿入できます。これには、`<div>` のような組み込みコンポーネントと、自分で作成したコンポーネントの両方が含まれます。

この例では、同じ `Post` コンポーネント(破線の境界線付き)が 2 つの異なるネストレベルでレンダリングされます。その中の `<Heading>` が最も近い `<Section>` から自動的にレベルを取得することに注意してください。

```javascript
import Heading from './Heading.js';
import Section from './Section.js';

export default function ProfilePage() {
  return (
    <Section>
      <Heading>My Profile</Heading>
      <Post
        title="Hello traveller!"
        body="Read about my adventures."
      />
      <AllPosts />
    </Section>
  );
}

function AllPosts() {
  return (
    <Section>
      <Heading>Posts</Heading>
      <RecentPosts />
    </Section>
  );
}

function RecentPosts() {
  return (
    <Section>
      <Heading>Recent Posts</Heading>
      <Post
        title="Flavors of Lisbon"
        body="...those pastéis de nata!"
      />
      <Post
        title="Buenos Aires in the rhythm of tango"
        body="I loved it!"
      />
    </Section>
  );
}

function Post({ title, body }) {
  return (
    <Section isFancy={true}>
      <Heading>
        {title}
      </Heading>
      <p><i>{body}</i></p>
    </Section>
  );
}
```

これを機能させるために特別なことは何もしていません。`Section` はそれ以下のツリーのコンテクストを指定するため、どこにでも `<Heading>` を挿入でき、正しいサイズになります。上記のサンドボックスで試してみてください!

**コンテクストを使用すると、「周囲に適応」し、*どこで*(または、言い換えれば、*どのコンテクストで*)レンダリングされているかに応じて異なる表示をするコンポーネントを記述できます。**

コンテクストの仕組みは、[CSS プロパティの継承](https://developer.mozilla.org/en-US/docs/Web/CSS/inheritance)を思い起こさせるかもしれません。CSS では、`<div>` に `color: blue` を指定でき、それ以下の DOM ノードは、途中の別の DOM ノードが `color: green` で上書きしない限り、どれだけ深くても、その色を継承します。同様に、React では、上から来るコンテクストを上書きする唯一の方法は、子を異なる値を持つコンテクストプロバイダでラップすることです。

CSS では、`color` や `background-color` などの異なるプロパティは互いに上書きしません。すべての `<div>` の `color` を赤に設定しても、`background-color` には影響しません。同様に、**異なる React コンテクストは互いに上書きしません。** `createContext()` で作成する各コンテクストは、他のコンテクストとは完全に分離されており、*その特定の*コンテクストを使用および提供するコンポーネントを結び付けます。1 つのコンポーネントが問題なく多くの異なるコンテクストを使用または提供できます。

## コンテクストを使用する前に

コンテクストは非常に魅力的に見えます! しかし、これは使いすぎやすいことも意味します。**いくつかの props を何階層か深く渡す必要があるからといって、その情報をコンテクストに入れるべきだというわけではありません。**

コンテクストを使用する前に考慮すべきいくつかの代替案を以下に示します。

1. **[props を渡す](/learn/passing-props-to-a-component)ことから始めます。** コンポーネントが些細でない場合、ダース単位の props をダース単位のコンポーネントを介して渡すことは珍しくありません。地道に感じるかもしれませんが、どのコンポーネントがどのデータを使用するかが非常に明確になります! コードをメンテナンスする人は、props でデータフローを明示したことを喜ぶでしょう。
2. **コンポーネントを抽出し、[JSX を `children` として渡す](/learn/passing-props-to-a-component#passing-jsx-as-children)。** データを使用しないが、それを下に渡すだけの多くの中間コンポーネントを介してデータを渡す場合(そして面倒な場合)、途中のどこかでコンポーネントを抽出し忘れていることがよくあります。例えば、`posts` のようなデータ props を直接使用しない視覚的なコンポーネントに渡しているかもしれません。例: `<Layout posts={posts} />`。代わりに、`Layout` に `children` を prop として受け取らせ、`<Layout><Posts posts={posts} /></Layout>` をレンダリングします。これにより、データを指定するコンポーネントとそれを必要とするコンポーネントの間の階層が減ります。

これらのアプローチのいずれもうまくいかない場合は、コンテクストを検討してください。

## コンテクストのユースケース

- **テーマ設定:** アプリがユーザにその外観を変更させる場合(例: ダークモード)、アプリの最上位にコンテクストプロバイダを配置し、視覚的な外観を調整する必要があるコンポーネントでそのコンテクストを使用できます。
- **現在のアカウント:** 多くのコンポーネントが現在ログインしているユーザを知る必要がある場合があります。コンテクストに入れると、ツリーのどこでも読み取りやすくなります。一部のアプリでは、複数のアカウントを同時に操作できます(例: 別のユーザとしてコメントを残す)。そのような場合、UI の一部を異なる現在のアカウント値を持つネストされたプロバイダでラップすると便利です。
- **ルーティング:** ほとんどのルーティングソリューションは、内部的にコンテクストを使用して現在のルートを保持します。これが、すべてのリンクがアクティブかどうかを「知る」方法です。独自のルータを構築する場合も、同様にしたいと思うかもしれません。
- **state の管理:** アプリが成長するにつれて、アプリの最上位近くに多くの state が発生する可能性があります。下の遠くにある多くのコンポーネントがそれを変更したい場合があります。[reducer をコンテクストと組み合わせて](/learn/scaling-up-with-reducer-and-context)使用して、複雑な state を管理し、面倒なことなく遠くのコンポーネントに渡すのが一般的です。

コンテクストは静的な値に限定されません。次のレンダリングで異なる値を渡すと、React はそれを読み取る下のすべてのコンポーネントを更新します! これが、コンテクストが state と組み合わせてよく使用される理由です。

一般的に、ツリーの異なる部分にある遠く離れたコンポーネントが何らかの情報を必要とする場合、コンテクストが役立つ良いヒントです。

## まとめ

- コンテクストを使用すると、コンポーネントは下のツリー全体に情報を提供できます。
- コンテクストを渡すには:
  1. `export const MyContext = createContext(defaultValue)` で作成してエクスポートします。
  2. `useContext(MyContext)` フックに渡して、どんなに深い子コンポーネントでも読み取れるようにします。
  3. 子を `<MyContext.Provider value={...}>` でラップして、親から提供します。
- コンテクストは中間のコンポーネントを通過します。
- コンテクストを使用すると、「周囲に適応」するコンポーネントを記述できます。
- コンテクストを使用する前に、props を渡すか、JSX を `children` として渡してみてください。
