# devIndicators

`devIndicators` を使用すると、開発中に表示しているルートのコンテキストを提供する画面上のインジケーターを設定できます。

## 型

```typescript
devIndicators: false | {
  position?: 'bottom-right'
  | 'bottom-left'
  | 'top-right'
  | 'top-left', // デフォルトは 'bottom-left'
}
```

`devIndicators` を `false` に設定するとインジケーターが非表示になりますが、Next.jsは発生したビルドエラーやランタイムエラーを引き続き表示します。

## トラブルシューティング

### インジケーターがルートを静的としてマークしない

ルートが静的であることを期待しているのにインジケーターが動的としてマークしている場合、ルートが静的レンダリングをオプトアウトしている可能性があります。

`next build --debug` を使用してアプリケーションをビルドし、ターミナルの出力を確認することで、ルートが静的か動的かを確認できます。静的（またはプリレンダリングされた）ルートには `○` シンボルが表示され、動的ルートには `ƒ` シンボルが表示されます。例：

```
Route (app)                              Size     First Load JS
┌ ○ /_not-found                          0 B               0 kB
└ ƒ /products/[id]                       0 B               0 kB

○  (Static)   静的コンテンツとしてプリレンダリング
ƒ  (Dynamic)  要求時にサーバーでレンダリング
```

ルートが静的レンダリングをオプトアウトする理由は2つあります：

- ランタイム情報に依存する[動的API](/docs/app/getting-started/partial-prerendering#dynamic-rendering)の存在。
- ORMやデータベースドライバーへの呼び出しなど、[キャッシュされていないデータリクエスト](/docs/app/getting-started/fetching-data)。

これらの条件のいずれかがルートにないか確認し、ルートを静的にレンダリングできない場合は、[`loading.js`](/docs/app/api-reference/file-conventions/loading)または[`<Suspense />`](https://react.dev/reference/react/Suspense)を使用して[ストリーミング](/docs/app/getting-started/linking-and-navigating#streaming)を活用することを検討してください。
