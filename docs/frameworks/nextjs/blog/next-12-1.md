# Next.js 12.1

**投稿日**: 2022年2月17日（木曜日）

**著者**:
- Balázs Orbán ([@balazsorban44](https://twitter.com/balazsorban44))
- DongYoon Kang ([@kdy1dev](https://twitter.com/kdy1dev))
- Gerald Monaco ([@devknoll](https://twitter.com/devknoll))
- その他多数

## 主な機能

Next.js 12.1では、いくつかの重要な改善が導入されました：

### 1. オンデマンドインクリメンタル静的再生成（ベータ）

- `getStaticProps`を使用してページを即座に再検証可能
- 特定のページのキャッシュを手動でパージ可能
- 以下に有用：
  * ヘッドレスCMSからコンテンツを更新
  * eコマースメタデータの変更

### 2. 拡張されたSWCサポート

以下のサポートを追加：
- styled-components
- Relay
- importSource
- legacy-decorators
- remove-react-properties
- remove-console

### 3. ゼロ設定Jestプラグイン

- Next.jsコンパイラーを使用してJestを自動設定
- スタイルシート、環境変数などを処理

### 4. SWCによるより高速なミニフィケーション（RC）

Terserより7倍高速

### 5. セルフホスティングの改善

Dockerイメージが約80%小さくなりました

### 6. React 18とサーバーコンポーネント（アルファ）

- 安定性とサポートの改善
- エッジでのサーバーサイドレンダリングに向けて作業中

## コード例（オンデマンド再検証）

```javascript
export default async function handler(req, res) {
  // 有効なリクエストであることを確認するためのシークレットをチェック
  if (req.query.secret !== process.env.MY_SECRET_TOKEN) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  try {
    await res.unstable_revalidate('/path-to-revalidate');
    return res.json({ revalidated: true });
  } catch (err) {
    return res.status(500).send('Error revalidating');
  }
}
```

**更新するには**: `npm i next@latest`
