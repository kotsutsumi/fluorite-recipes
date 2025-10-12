# trailingSlash

デフォルトでは、Next.jsは末尾にスラッシュがあるURLを、スラッシュがない対応するURLにリダイレクトします。たとえば、`/about/`は`/about`にリダイレクトされます。

## 設定

この動作を変更するには、`next.config.js`で`trailingSlash`を`true`に設定します：

```javascript filename="next.config.js"
module.exports = {
  trailingSlash: true,
}
```

このオプションを有効にすると、`/about`のようなURLは`/about/`にリダイレクトされます。

## 特殊なケース

一部のURLは例外であり、末尾のスラッシュは追加されません：

- 拡張子を持つ静的ファイルURL
- `.well-known/`配下のパス

変更されないURLの例：

- `/file.txt`
- `images/photos/picture.png`
- `.well-known/subfolder/config.json`

## 静的エクスポート

`output: "export"`と併用する場合、`/about`ページは`/about.html`の代わりに`/about/index.html`として出力されます。

```javascript filename="next.config.js"
module.exports = {
  output: 'export',
  trailingSlash: true,
}
```

この場合、以下のようなディレクトリ構造になります：

```
out/
├── about/
│   └── index.html
├── index.html
└── ...
```

## 例

### デフォルトの動作（`trailingSlash: false`）

```
/about    → /about (変更なし)
/about/   → /about (リダイレクト)
```

### `trailingSlash: true`の場合

```
/about    → /about/ (リダイレクト)
/about/   → /about/ (変更なし)
```

## バージョン履歴

| バージョン | 変更内容 |
|-----------|---------|
| `v9.5.0` | `trailingSlash`が追加されました |
