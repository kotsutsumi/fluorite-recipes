# compress

デフォルトでは、Next.jsは `next start` またはカスタムサーバーを使用する際に、レンダリングされたコンテンツと静的ファイルを圧縮するために `gzip` を使用します。これは、圧縮が設定されていないアプリケーションの最適化です。カスタムサーバーを介してアプリケーションで圧縮が_既に_設定されている場合、Next.jsは圧縮を追加しません。

圧縮が有効になっているかどうか、およびどのアルゴリズムが使用されているかを確認するには、レスポンスの[`Accept-Encoding`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Encoding)（ブラウザが受け入れるオプション）および[`Content-Encoding`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Encoding)（現在使用されているもの）ヘッダーを確認します。

## 圧縮を無効にする

**圧縮**を無効にするには、`compress` 設定オプションを `false` に設定します：

```javascript
module.exports = {
  compress: false,
}
```

圧縮はバンドワイドの使用量を削減し、アプリケーションのパフォーマンスを向上させるため、サーバーで圧縮が設定されていない限り、**圧縮を無効にすることはお勧めしません**。例えば、[nginx](https://nginx.org/)を使用していて `brotli` に切り替えたい場合は、nginxに圧縮を処理させるために `compress` オプションを `false` に設定します。
