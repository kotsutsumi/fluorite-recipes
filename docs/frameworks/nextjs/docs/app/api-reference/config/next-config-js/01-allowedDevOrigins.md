# allowedDevOrigins

Next.jsは開発中にクロスオリジンリクエストを自動的にブロックしませんが、開発モードで利用可能な内部アセット/エンドポイントへの不正なリクエストを防ぐため、Next.jsの将来のメジャーバージョンではデフォルトでブロックされるようになります。

サーバーが初期化されたホスト名（デフォルトでは `localhost`）以外のオリジンからのリクエストを許可するようにNext.jsアプリケーションを設定するには、`allowedDevOrigins` 設定オプションを使用できます。

`allowedDevOrigins` を使用すると、開発モードで使用できる追加のオリジンを設定できます。例えば、`localhost` だけでなく `local-origin.dev` を使用するには、`next.config.js` を開いて `allowedDevOrigins` 設定を追加します：

```javascript
module.exports = {
  allowedDevOrigins: ['local-origin.dev', '*.local-origin.dev'],
}
```
