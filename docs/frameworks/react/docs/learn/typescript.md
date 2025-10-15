# TypeScript の使用

TypeScript は、JavaScript のコードベースに型定義を追加する人気の方法です。TypeScript はネイティブで [JSX をサポート](/learn/writing-markup-with-jsx)しており、プロジェクトに [`@types/react`](https://www.npmjs.com/package/@types/react) と [`@types/react-dom`](https://www.npmjs.com/package/@types/react-dom) を追加することで、React Web の完全なサポートを得られます。

## このページで学ぶこと

- [React コンポーネントで TypeScript を使用する方法](#typescript-で-react-コンポーネントを書く)
- [フックの型付けの例](#フックに型を付ける例)
- [`@types/react` の一般的な型](#便利な型)
- [さらに学ぶための場所](#さらに学ぶ)

## インストール

すべての[本番レベルの React フレームワーク](/learn/start-a-new-react-project#production-grade-react-frameworks)は TypeScript の使用をサポートしています。フレームワーク固有のガイドに従ってインストールしてください：

- [Next.js](https://nextjs.org/docs/app/building-your-application/configuring/typescript)
- [Remix](https://remix.run/docs/en/1.19.2/guides/typescript)
- [Gatsby](https://www.gatsbyjs.com/docs/how-to/custom-configuration/typescript/)
- [Expo](https://docs.expo.dev/guides/typescript/)

### 既存の React プロジェクトに TypeScript を追加する

最新バージョンの React の型定義をインストールするには：

```bash
npm install @types/react @types/react-dom
```

`tsconfig.json` に次のコンパイラオプションを設定する必要があります：

1. [`lib`](https://www.typescriptlang.org/tsconfig/#lib) に `dom` を含める必要があります（注：`lib` オプションが指定されていない場合、`dom` はデフォルトで含まれます）。
2. [`jsx`](https://www.typescriptlang.org/tsconfig/#jsx) を有効なオプションのいずれかに設定する必要があります。ほとんどのアプリケーションでは `preserve` で十分です。
   ライブラリを公開する場合は、[`jsx` のドキュメント](https://www.typescriptlang.org/tsconfig/#jsx)を参照して、どの値を選択するかを決定してください。

## TypeScript で React コンポーネントを書く

> **注意**
>
> JSX を含むすべてのファイルは `.tsx` ファイル拡張子を使用する必要があります。これは TypeScript 固有の拡張子で、このファイルに JSX が含まれていることを TypeScript に伝えます。

React で TypeScript を書くことは、React で JavaScript を書くことに非常に似ています。コンポーネントを扱う際の主な違いは、コンポーネントの props に型を提供できることです。これらの型は、正確性チェックやエディタ内ドキュメントの提供に使用できます。

[クイックスタート](/learn)ガイドの [`MyButton` コンポーネント](/learn#components)を例にとると、ボタンの `title` に型を追加できます：

```tsx title="App.tsx"
function MyButton({ title }: { title: string }) {
  return (
    <button>{title}</button>
  );
}

export default function MyApp() {
  return (
    <div>
      <h1>Welcome to my app</h1>
      <MyButton title="I'm a button" />
    </div>
  );
}
```

> **注意**
>
> これらのサンドボックスは TypeScript コードを処理できますが、型チェッカは実行しません。これは、学習のためにサンドボックスを修正できることを意味しますが、型エラーや警告は表示されません。型チェックを受けるには、[TypeScript Playground](https://www.typescriptlang.org/play) を使用するか、より機能豊富なオンラインサンドボックスを使用できます。

このインライン構文は、コンポーネントに型を提供する最も簡単な方法ですが、記述するフィールドがいくつかある場合は扱いにくくなります。代わりに、`interface` または `type` を使用してコンポーネントの props を記述できます：

```tsx title="App.tsx"
interface MyButtonProps {
  /** ボタン内に表示するテキスト */
  title: string;
  /** ボタンがインタラクション可能かどうか */
  disabled: boolean;
}

function MyButton({ title, disabled }: MyButtonProps) {
  return (
    <button disabled={disabled}>{title}</button>
  );
}

export default function MyApp() {
  return (
    <div>
      <h1>Welcome to my app</h1>
      <MyButton title="I'm a disabled button" disabled={true}/>
    </div>
  );
}
```

コンポーネントの props を記述する型は、必要に応じてシンプルまたは複雑にできますが、`type` または `interface` で記述されたオブジェクト型である必要があります。TypeScript がオブジェクトを記述する方法については[オブジェクト型](https://www.typescriptlang.org/docs/handbook/2/objects.html)で学べますが、[ユニオン型](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types)を使用して、複数の異なる型のいずれかになり得る prop を記述したり、[型から型を作成する](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)ガイドでより高度なユースケースについて学ぶこともできます。

## フックに型を付ける例

`@types/react` の型定義には、組み込みフックの型が含まれているため、追加のセットアップなしでコンポーネントで使用できます。これらはコンポーネントで書くコードを考慮して構築されているため、多くの場合[推論される型](https://www.typescriptlang.org/docs/handbook/type-inference.html)が得られ、理想的には型を提供する細かい部分を処理する必要はありません。

ただし、フックに型を提供するいくつかの例を見ていきましょう。

### `useState`

[`useState` フック](/reference/react/useState)は、初期状態として渡された値を再利用して、その値がどのような型であるべきかを決定します。例えば：

```tsx
// 型を "boolean" と推論
const [enabled, setEnabled] = useState(false);
```

これは `enabled` に `boolean` 型を割り当て、`setEnabled` は `boolean` 引数を受け取る関数、または boolean を返す関数になります。状態の型を明示的に提供したい場合は、`useState` 呼び出しに型引数を提供することでそれを行うことができます：

```tsx
// 型を明示的に "boolean" に設定
const [enabled, setEnabled] = useState<boolean>(false);
```

これはこのケースではあまり有用ではありませんが、ユニオン型がある場合に型を提供したいと思う一般的なケースです。例えば、ここでは `status` はいくつかの異なる文字列のいずれかになります：

```tsx
type Status = "idle" | "loading" | "success" | "error";

const [status, setStatus] = useState<Status>("idle");
```

または、[状態の構造化の原則](/learn/choosing-the-state-structure#principles-for-structuring-state)で推奨されているように、関連する状態をオブジェクトとしてグループ化し、オブジェクト型を介して異なる可能性を記述できます：

```tsx
type RequestState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success', data: any }
  | { status: 'error', error: Error };

const [requestState, setRequestState] = useState<RequestState>({ status: 'idle' });
```

### `useReducer`

[`useReducer` フック](/reference/react/useReducer)は、reducer 関数と初期状態を受け取るより複雑なフックです。reducer 関数の型は初期状態から推論されます。オプションで `useReducer` 呼び出しに型引数を提供して状態の型を指定できますが、初期状態に型を設定する方が良い場合が多いです：

```tsx title="App.tsx"
import { useReducer } from 'react';

interface State {
  count: number;
}

type CounterAction =
  | { type: "reset" }
  | { type: "setCount"; value: State["count"] };

const initialState: State = { count: 0 };

function stateReducer(state: State, action: CounterAction): State {
  switch (action.type) {
    case "reset":
      return initialState;
    case "setCount":
      return { ...state, count: action.value };
    default:
      throw new Error("Unknown action");
  }
}

export default function App() {
  const [state, dispatch] = useReducer(stateReducer, initialState);

  const addFive = () => dispatch({ type: "setCount", value: state.count + 5 });
  const reset = () => dispatch({ type: "reset" });

  return (
    <div>
      <h1>Welcome to my counter</h1>

      <p>Count: {state.count}</p>
      <button onClick={addFive}>Add 5</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
```

私たちは、TypeScript をいくつかの重要な場所で使用しています：

- `interface State` は reducer の状態の形状を記述します。
- `type CounterAction` は dispatch できるさまざまなアクションを記述します。
- `const initialState: State` は初期状態の型を提供し、これは `useReducer` が使用する型でもあります。
- `stateReducer(state: State, action: CounterAction): State` は、reducer 関数の引数と戻り値の型を設定します。

`initialState` に型を設定する代わりに、`useReducer` に型引数を提供することもできます：

```tsx
import { stateReducer, State } from './your-reducer-implementation';

const initialState = { count: 0 };

export default function App() {
  const [state, dispatch] = useReducer<State>(stateReducer, initialState);
}
```

### `useContext`

[`useContext` フック](/reference/react/useContext)は、props を介してコンポーネントを通じてデータを渡すことなく、コンポーネントツリーを通じてデータを渡す技術です。これは、プロバイダコンポーネントを作成し、多くの場合、値を子コンポーネントで消費するためのフックを作成することで使用されます。

コンテキストが提供する値の型は、`createContext` 呼び出しに渡される値から推論されます：

```tsx title="App.tsx"
import { createContext, useContext, useState } from 'react';

type Theme = "light" | "dark" | "system";
const ThemeContext = createContext<Theme>("system");

const useGetTheme = () => useContext(ThemeContext);

export default function MyApp() {
  const [theme, setTheme] = useState<Theme>('light');

  return (
    <ThemeContext.Provider value={theme}>
      <MyComponent />
    </ThemeContext.Provider>
  )
}

function MyComponent() {
  const theme = useGetTheme();

  return (
    <div>
      <p>Current theme: {theme}</p>
    </div>
  )
}
```

この技術は、デフォルト値が意味を持つ場合に機能します。しかし、時にはそうでない場合があり、その場合は `null` が適切なデフォルト値に感じられます。ただし、型システムがあなたのコードを理解できるようにするには、`createContext` に `ContextShape | null` を明示的に設定する必要があります。

これにより、コンテキストコンシューマの型から `| null` を削除する必要があるという問題が発生します。私たちの推奨事項は、フックにその存在のランタイムチェックを行い、存在しない場合にエラーをスローすることです：

```tsx {5, 16-20} title="App.tsx"
import { createContext, useContext, useState, useMemo } from 'react';

// これはシンプルな例ですが、ここにはより複雑なオブジェクトを想像できます
type ComplexObject = {
  kind: string
};

// コンテキストは `| null` で作成されますが、型は提供されます
const Context = createContext<ComplexObject | null>(null);

// `| null` はフックで null がチェックされることで削除されます
const useGetComplexObject = () => {
  const object = useContext(Context);
  if (!object) { throw new Error("useGetComplexObject must be used within a Provider") }
  return object;
}

export default function MyApp() {
  const object = useMemo(() => ({ kind: "complex" }), []);

  return (
    <Context.Provider value={object}>
      <MyComponent />
    </Context.Provider>
  )
}

function MyComponent() {
  const object = useGetComplexObject();

  return (
    <div>
      <p>Current object: {object.kind}</p>
    </div>
  )
}
```

### `useMemo`

[`useMemo`](/reference/react/useMemo) フックは、関数呼び出しから値を作成/再アクセスし、2 番目のパラメータで渡される依存関係が変更された場合にのみ関数を再実行します。フックの呼び出しの結果は、最初のパラメータの関数の戻り値から推論されます。フックに型引数を提供することでより明示的にできます。

```tsx
// visibleTodos の型は filterTodos の戻り値から推論されます
const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
```

### `useCallback`

[`useCallback`](/reference/react/useCallback) は、2 番目のパラメータで渡された依存関係が同じである限り、関数への安定した参照を提供します。`useMemo` と同様に、関数の型は最初のパラメータの関数の戻り値から推論され、フックに型引数を提供することでより明示的にできます。

```tsx
const handleClick = useCallback(() => {
  // ...
}, [todos]);
```

TypeScript の strict モードで作業する場合、`useCallback` はコールバックのパラメータに型を追加する必要があります。これは、コールバックの型がコードのコンテキストから推論できず、型が指定されていない場合、暗黙的に `any` 型になるためです。

コードスタイルの好みに応じて、React 型から `*EventHandler` 関数を使用して、コールバックを定義すると同時にイベントハンドラの型を提供できます：

```tsx
import { useState, useCallback } from 'react';

export default function Form() {
  const [value, setValue] = useState("Change me");

  const handleChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>((event) => {
    setValue(event.currentTarget.value);
  }, [setValue])

  return (
    <>
      <input value={value} onChange={handleChange} />
      <p>Value: {value}</p>
    </>
  );
}
```

## 便利な型

`@types/react` パッケージには非常に多くの型があり、React と TypeScript の相互作用に慣れてきたら読む価値があります。[DefinitelyTyped の React フォルダ](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react/index.d.ts)で見つけることができます。ここでは、より一般的な型のいくつかをカバーします。

### DOM イベント

React で DOM イベントを扱う場合、イベントの型は多くの場合イベントハンドラから推論できます。ただし、イベントハンドラに渡す関数を抽出したい場合は、イベントの型を明示的に設定する必要があります。

```tsx title="App.tsx"
import { useState } from 'react';

export default function Form() {
  const [value, setValue] = useState("Change me");

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setValue(event.currentTarget.value);
  }

  return (
    <>
      <input value={value} onChange={handleChange} />
      <p>Value: {value}</p>
    </>
  );
}
```

React 型には多くのイベント型があります。完全なリストは[こちら](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/b580df54c0819ec9df62b0835a315dd48b8594a9/types/react/index.d.ts#L1247C1-L1373)で見つけることができ、DOM で最も人気のあるイベントに基づいています。

探している型を決定する際は、まず使用しているイベントハンドラのホバー情報を見ることができ、イベントの型が表示されます。

このリストに含まれていないイベントを使用する必要がある場合は、`React.SyntheticEvent` 型を使用できます。これはすべてのイベントのベース型です。

### Children

コンポーネントの children を記述するには、2 つの一般的な方法があります。1 つ目は、`React.ReactNode` 型を使用することです。これは、JSX で children として渡すことができるすべての可能な型のユニオンです：

```tsx
interface ModalRendererProps {
  title: string;
  children: React.ReactNode;
}
```

これは children の非常に広い定義です。2 つ目は、`React.ReactElement` 型を使用することです。これは JSX 要素のみであり、文字列や数値などの JavaScript プリミティブではありません：

```tsx
interface ModalRendererProps {
  title: string;
  children: React.ReactElement;
}
```

TypeScript を使用して、特定の種類の JSX 要素のみが渡されることを記述することはできないため、型システムを使用して、特定の子要素のみを受け入れるコンポーネントを記述することはできません。

`React.ReactNode` と `React.ReactElement` の両方の例は、[この TypeScript playground](https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAJQKYEMDG8BmUIjgIilQ3wChSB6CxYmAOmXRgDkIATJOdNJMGAZzgwAFpxAR+8YADswAVwGkZMJFEzpOjDKw4AFHGEEBvUnDhphwADZsi0gFw0mDWjqQBuUgF9yaCNMlENzgAXjgACjADfkctFnYkfQhDAEpQgD44AB42YAA3dKMo5P46C2tbJGkvLIpcgt9-QLi3AEEwMFCItJDMrPTTbIQ3dKywdIB5aU4kKyQQKpha8drhhIGzLLWODbNs3b3s8YAxKBQAcwXpAThMaGWDvbH0gFloGbmrgQfBzYpd1YjQZbEYARkB6zMwO2SHSAAlZlYIBCdtCRkZpHIrFYahQYQD1o-HsUEECkTh0QTcIyWJTuILkBQTqUlP6SGphlNFgC6ZJqYrGbExGYMAAjIB-Vw0xmCdXSRPECZ8RFsjjE7n42HqhEagVCiXYuA3aKvDpMgCeZRZ3AgABNYABfKKhF6dPoCEaiBisSxEZRuTBYGhSADWoRpjDY3jMmJgOiJdMlsm1sDgqpFdFVG3qiP1tRGSS69wAukgUqhCXw4FwDdQsVi8QTpWIAIaJbmCABGvFBvuGAHliLFsrF4om08gE8ngdGoQGo1AGLykgFADMwwFg8GSKbJa+SAG3DAN-f88gA) で見ることができます。

### スタイル Props

React でインラインスタイルを使用する場合、`React.CSSProperties` を使用してスタイルプロップに渡されるオブジェクトを記述できます。この型は、すべての可能な CSS プロパティのユニオンであり、スタイルプロップに有効な CSS プロパティを渡していることを確認し、エディタでオートコンプリートを取得するのに適した方法です。

```tsx
interface MyComponentProps {
  style: React.CSSProperties;
}
```

## さらに学ぶ

このガイドでは、React で TypeScript を使用する基本について説明しましたが、さらに学ぶべきことがたくさんあります。ドキュメントの個々の API ページには、TypeScript での使用方法に関するより詳細なドキュメントが含まれる場合があります。

以下のリソースをお勧めします：

- [TypeScript ハンドブック](https://www.typescriptlang.org/docs/handbook/)は、TypeScript の公式ドキュメントであり、ほとんどの主要な言語機能をカバーしています。

- [TypeScript リリースノート](https://devblogs.microsoft.com/typescript/)は、新機能を詳細にカバーしています。

- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/) は、React で TypeScript を使用するためのコミュニティが維持するチートシートであり、多くの有用なエッジケースをカバーし、このドキュメントよりも広範な内容を提供しています。

- [TypeScript コミュニティ Discord](https://discord.com/invite/typescript) は、TypeScript と React の問題についてヘルプを求めたり質問したりするのに最適な場所です。
