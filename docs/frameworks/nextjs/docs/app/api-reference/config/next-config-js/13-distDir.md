# distDir

`.next` の代わりに使用するカスタムビルドディレクトリの名前を指定できます。

`next.config.js` を開いて `distDir` 設定を追加します：

```javascript
module.exports = {
  distDir: 'build',
}
```

これで `next build` を実行すると、Next.jsはデフォルトの `.next` フォルダの代わりに `build` を使用します。

> `distDir` はプロジェクトディレクトリから**出てはいけません**。例えば、`../build` は**無効な**ディレクトリです。
