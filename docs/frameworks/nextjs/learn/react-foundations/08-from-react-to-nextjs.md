# ReactからNext.jsへ

これまでに、Reactを使い始める方法を探ってきました。最終的なコードは以下のようになりました。ここから始める場合は、このコードをコードエディターの`index.html`ファイルに貼り付けてください。

```html
<html>
  <body>
    <div id="app"></div>

    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>

    <script type="text/jsx">
      const app = document.getElementById("app");

      function Header({ title }) {
        return <h1>{title ? title : "Default title"}</h1>;
      }

      function HomePage() {
        const names = ["Ada Lovelace", "Grace Hopper", "Margaret Hamilton"];
        const [likes, setLikes] = React.useState(0);

        function handleClick() {
          setLikes(likes + 1);
        }

        return (
          <div>
            <Header title="Develop. Preview. Ship." />
            <ul>
              {names.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
            <button onClick={handleClick}>Like ({likes})</button>
          </div>
        );
      }

      const root = ReactDOM.createRoot(app);
      root.render(<HomePage />);
    </script>
  </body>
</html>
```

過去数章では、Reactの3つの重要な概念（コンポーネント、props、state）について学びました。これらの強固な基盤を持つことで、Reactアプリケーションの構築を始めるのに役立ちます。

Reactを学ぶ際の最良の方法は、実際に構築することです。`<script>`タグとこれまでに学んだことを使用して、既存のWebサイトに小さなコンポーネントを追加することで、徐々にReactを採用することができます。しかし、多くの開発者は、Reactが可能にするユーザーエクスペリエンスと開発者エクスペリエンスの価値を見出し、フロントエンド全体をReactで書くことにしています。

## ReactからNext.jsへ

ReactはUIの構築に優れていますが、UIを完全に機能するスケーラブルなアプリケーションに独立して構築するには、いくつかの作業が必要です。また、サーバーコンポーネントやクライアントコンポーネントなど、フレームワークが必要な新しいReactの機能もあります。良いニュースは、Next.jsがセットアップと設定の多くを処理し、Reactアプリケーションの構築を支援する追加機能を提供することです。

次に、この例をReactからNext.jsに移行し、Next.jsの動作について説明し、サーバーコンポーネントとクライアントコンポーネントの違いについて紹介します。

## 第8章完了

あと少しです！

**次回：第9章 - Next.jsのインストール**

Next.jsをインストールし、ReactアプリをNext.jsにリファクタリングします。
