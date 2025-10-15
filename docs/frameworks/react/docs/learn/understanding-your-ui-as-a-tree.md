# UI をツリーとして理解する

React アプリは、多数のコンポーネントが互いにネストされることで形成されます。React はどのようにアプリのコンポーネント構造を管理しているのでしょうか？

React をはじめとする多くの UI ライブラリは、UI をツリーとしてモデル化します。アプリをツリーとして捉えることにより、コンポーネント間の関係を理解するのに役立ちます。この理解は、パフォーマンスや state 管理などの今後の概念をデバッグするのに役立ちます。

## このページで学ぶこと

- React にはコンポーネント構造がどのように「見える」のか
- レンダーツリーとは何で、何の役に立つのか
- モジュール依存ツリーとは何で、何の役に立つのか

## UI をツリーとして理解する

ツリーとはアイテム間の関係を表すモデルの一種であり、UI はよくツリー構造を使用して表現されます。例えば、ブラウザは HTML（[DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model/Introduction)）や CSS（[CSSOM](https://developer.mozilla.org/docs/Web/API/CSS_Object_Model)）をモデル化するためにツリー構造を使用します。モバイルプラットフォームもビューの階層構造を表現するためにツリーを使用します。

ブラウザやモバイルプラットフォームと同様に、React もツリー構造を使用して React アプリ内のコンポーネント間の関係を管理し、モデル化します。これらのツリーは、React アプリ内でのデータの流れや、レンダリングとアプリサイズの最適化方法を理解するのに役立つツールです。

## レンダーツリー

コンポーネントの主要な機能は、他のコンポーネントをコンポーズできることです。[コンポーネントをネスト](/learn/your-first-component#nesting-and-organizing-components)すると、親コンポーネントと子コンポーネントの概念が生まれます。各親コンポーネントは、それ自体が別のコンポーネントの子である可能性があります。

React アプリをレンダーするとき、この関係を**レンダーツリー**と呼ばれるツリーでモデル化できます。

以下は、インスピレーションの名言をレンダーする React アプリです。

```jsx
import FancyText from './FancyText';
import InspirationGenerator from './InspirationGenerator';
import Copyright from './Copyright';

export default function App() {
  return (
    <>
      <FancyText title text="Get Inspired App" />
      <InspirationGenerator>
        <Copyright year={2004} />
      </InspirationGenerator>
    </>
  );
}
```

React は、レンダーされたコンポーネントで構成される UI ツリーである*レンダーツリー*を作成します。

このサンプルアプリでは、上記のレンダーツリーを構築できます。

ツリーはノードで構成され、各ノードはコンポーネントを表します。`App`、`FancyText`、`Copyright` などは、すべてツリー内のノードです。

React レンダーツリーのルートノードは、アプリの[ルートコンポーネント](/learn/importing-and-exporting-components#the-root-component-file)です。この場合、ルートコンポーネントは `App` であり、React が最初にレンダーするコンポーネントです。ツリーの各矢印は、親コンポーネントから子コンポーネントを指しています。

> **DEEP DIVE**
>
> ### レンダーツリー内の HTML タグはどこにありますか？
>
> 上記のレンダーツリーでは、各コンポーネントがレンダーする HTML タグについての言及がないことに気づくでしょう。これは、レンダーツリーが React [コンポーネント](https://react.dev/learn/your-first-component#components-ui-building-blocks)のみで構成されているためです。
>
> React は UI フレームワークとして、プラットフォームに依存しません。react.dev では、レンダーターゲットとして HTML マークアップを使用する Web にデプロイする例を紹介しています。しかし、React アプリは、[UIView](https://developer.apple.com/documentation/uikit/uiview) や [FrameworkElement](https://learn.microsoft.com/en-us/dotnet/api/system.windows.frameworkelement?view=windowsdesktop-7.0) などの異なる UI プリミティブを使用する可能性のあるモバイルまたはデスクトッププラットフォームにも同様にデプロイできます。
>
> これらのプラットフォーム UI プリミティブは React の一部ではありません。React のレンダーツリーは、アプリがどのプラットフォームにレンダーされるかに関係なく、React アプリに洞察を提供できます。

レンダーツリーは、React アプリケーションの単一のレンダーパスを表します。[条件付きレンダリング](/learn/conditional-rendering)では、親コンポーネントは渡されたデータに応じて異なる子をレンダーする場合があります。

アプリを更新して、インスピレーションの名言または色を条件付きでレンダーするようにできます。

```jsx
import FancyText from './FancyText';
import InspirationGenerator from './InspirationGenerator';
import Copyright from './Copyright';

export default function App() {
  return (
    <>
      <FancyText title text="Get Inspired App" />
      <InspirationGenerator>
        <Copyright year={2004} />
      </InspirationGenerator>
    </>
  );
}
```

この例では、`inspiration.type` に応じて、`<FancyText>` または `<Color>` をレンダーする場合があります。レンダーツリーはレンダーパスごとに異なる場合があります。

レンダーツリーはレンダーパスごとに異なる場合がありますが、これらのツリーは一般的に、React アプリの*トップレベル*および*リーフコンポーネント*が何であるかを識別するのに役立ちます。トップレベルコンポーネントは、ルートコンポーネントに最も近いコンポーネントであり、その下にあるすべてのコンポーネントのレンダリングパフォーマンスに影響を及ぼし、多くの場合、最も複雑さを含んでいます。リーフコンポーネントはツリーの下部にあり、子コンポーネントを持たず、頻繁に再レンダーされます。

これらのカテゴリのコンポーネントを識別することは、アプリのデータフローとパフォーマンスを理解するのに役立ちます。

## モジュール依存ツリー

React アプリでツリーでモデル化できる別の関係は、アプリのモジュール依存関係です。[コンポーネントや ロジックを別々のファイルに分割](/learn/importing-and-exporting-components#exporting-and-importing-a-component)すると、コンポーネント、関数、定数をエクスポートする [JS モジュール](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)を作成します。

モジュール依存ツリーの各ノードはモジュールであり、各ブランチはそのモジュールの `import` 文を表します。

以前の Inspirations アプリを使用すると、モジュール依存ツリー、略して依存ツリーを構築できます。

ツリーのルートノードは、ルートモジュールとしても知られる、エントリポイントファイルです。多くの場合、これはルートコンポーネントを含むモジュールです。

同じアプリのレンダーツリーと比較すると、類似した構造がありますが、いくつかの顕著な違いがあります。

- ツリーを構成するノードは、コンポーネントではなくモジュールを表します。
- `inspirations.js` のような非コンポーネントモジュールもこのツリーに表されます。レンダーツリーはコンポーネントのみをカプセル化します。
- `Copyright.js` は `App.js` の下に表示されますが、レンダーツリーでは、`Copyright` コンポーネントは `InspirationGenerator` の子として表示されます。これは、`InspirationGenerator` が JSX を [children props](/learn/passing-props-to-a-component#passing-jsx-as-children) として受け入れるため、`Copyright` を子コンポーネントとしてレンダーしますが、モジュールをインポートしないためです。

依存ツリーは、React アプリを実行するために必要なモジュールを決定するのに役立ちます。本番用の React アプリをビルドする場合、通常、クライアントに提供するために必要なすべての JavaScript をバンドルするビルドステップがあります。これを担当するツールは[バンドラー](https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Understanding_client-side_tools/Overview#the_modern_tooling_ecosystem)と呼ばれ、バンドラーは依存ツリーを使用して、どのモジュールを含めるべきかを決定します。

アプリが成長するにつれて、多くの場合、バンドルサイズも大きくなります。大きなバンドルサイズは、クライアントがダウンロードして実行するのに高価です。大きなバンドルサイズは、UI が描画される時間を遅らせる可能性があります。アプリの依存ツリーを把握することは、これらの問題をデバッグするのに役立つ場合があります。

## まとめ

- ツリーは、エンティティ間の関係を表す一般的な方法です。それらは UI をモデル化するためによく使用されます。
- レンダーツリーは、単一のレンダー全体での React コンポーネント間のネストされた関係を表します。
- 条件付きレンダリングでは、レンダーツリーは異なるレンダー間で変更される場合があります。異なる prop 値を使用すると、コンポーネントは異なる子コンポーネントをレンダーする場合があります。
- レンダーツリーは、トップレベルおよびリーフコンポーネントが何であるかを識別するのに役立ちます。トップレベルコンポーネントは、その下にあるすべてのコンポーネントのレンダリングパフォーマンスに影響を与え、リーフコンポーネントは頻繁に再レンダーされます。それらを識別することは、レンダリングパフォーマンスを理解しデバッグするのに役立ちます。
- 依存ツリーは、React アプリのモジュール依存関係を表します。
- 依存ツリーは、ビルドツールがアプリを出荷するために必要なコードをバンドルするために使用されます。
- 依存ツリーは、ペイントタイムを遅くする大きなバンドルサイズや、どのコードがバンドルされるかを最適化する機会をデバッグするのに役立ちます。

---

**原文:** https://react.dev/learn/understanding-your-ui-as-a-tree
