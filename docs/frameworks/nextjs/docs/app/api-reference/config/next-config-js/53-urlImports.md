# urlImports

> **警告**: この機能は現在実験的であり、変更される可能性があります。本番環境での使用は推奨されません。

URLインポートは、外部サーバーから直接モジュールをインポートできる実験的な機能です（ローカルディスクからではなく）。

## 設定例

```javascript filename="next.config.js"
module.exports = {
  experimental: {
    urlImports: ['https://example.com/assets/', 'https://cdn.skypack.dev'],
  },
}
```

## セキュリティモデル

- **セキュリティが最優先事項です**
- 特定のドメインを手動で許可する必要があります
- Edge Runtimeを使用してブラウザサンドボックスでURLインポートを実行することを目指しています

> **警告**: マシン上でダウンロードして実行することを信頼できるドメインのみを使用してください

## ロックファイルの動作

- `next.lock`ディレクトリにロックファイルとフェッチされたアセットを作成します
- ロックファイルは**Gitにコミットする必要があります**
- 開発中、新しいURLインポートがロックファイルに追加されます
- 本番ビルドでは、ロックファイルのみを使用します

## 使用例

### 1. Skypackからのインポート

```javascript
import confetti from 'https://cdn.skypack.dev/canvas-confetti'

export default function Page() {
  return (
    <button onClick={() => confetti()}>
      紙吹雪を表示
    </button>
  )
}
```

### 2. 静的画像のインポート

```javascript
import Image from 'next/image'
import logo from 'https://example.com/assets/logo.png'

export default function Page() {
  return (
    <div>
      <Image src={logo} alt="ロゴ" />
    </div>
  )
}
```

### 3. CSSのURLインポート

```css filename="styles.css"
.className {
  background: url('https://example.com/assets/hero.jpg');
}

@font-face {
  font-family: 'Custom Font';
  src: url('https://example.com/fonts/custom-font.woff2');
}
```

### 4. JSONのインポート

```javascript
import data from 'https://example.com/data/products.json'

export default function Page() {
  return (
    <ul>
      {data.products.map((product) => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  )
}
```

## ロックファイルの構造

```
next.lock/
├── data/
│   └── https/
│       └── cdn.skypack.dev/
│           └── canvas-confetti/
│               └── index.js
└── lock.json
```

## 制限事項

- HTTP URLのみがサポートされています（HTTPSが推奨されます）
- 許可されたドメインからのインポートのみが機能します
- 一部のCDNは、適切なMIMEタイプを提供する必要があります

## セキュリティのベストプラクティス

1. **信頼できるドメインのみを許可する**
   ```javascript
   module.exports = {
     experimental: {
       urlImports: [
         'https://cdn.skypack.dev',
         'https://esm.sh',
         'https://unpkg.com',
       ],
     },
   }
   ```

2. **ロックファイルをバージョン管理にコミットする**
   ```bash
   git add next.lock
   git commit -m "URLインポートロックファイルを追加"
   ```

3. **定期的にロックファイルを監査する**
   - 予期しない変更がないか確認
   - ロックされた依存関係のセキュリティ脆弱性をレビュー

## トラブルシューティング

### URLインポートが機能しない

- `experimental.urlImports`にドメインが許可されていることを確認してください
- ロックファイルが存在し、有効であることを確認してください
- 開発サーバーを再起動してください

### ロックファイルの競合

```bash
# ロックファイルをクリーンアップして再生成
rm -rf next.lock
npm run dev
```

## バージョン履歴

| バージョン | 変更内容 |
|-----------|---------|
| `v12.0.0` | `experimental.urlImports`が導入されました |

## フィードバック

この機能を試して、[GitHub](https://github.com/vercel/next.js/issues)でフィードバックを共有することをお勧めします。

## 関連項目

- [ES Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
- [Edge Runtime](/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes)
