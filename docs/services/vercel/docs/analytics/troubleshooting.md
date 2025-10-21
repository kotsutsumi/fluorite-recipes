# Web Analyticsトラブルシューティング

## Web Analyticsダッシュボードにデータが表示されない

**問題**: ダッシュボードにデータが表示されない、または`script.js`に対して404エラーが発生する

**解決方法**:

### 1. Analyticsが有効になっていることを確認

- プロジェクトダッシュボードに移動
- Analyticsタブを確認
- Web Analyticsが[有効になっている](/docs/analytics/quickstart#enable-web-analytics-in-vercel)ことを確認

### 2. アプリを再デプロイ

```bash
vercel deploy
```

### 3. 最新のデプロイメントを本番に昇格

1. プロジェクトのDeploymentsタブに移動
2. 最新のデプロイメントの横にある3点メニューを選択
3. 「Promote to Production」を選択

## プロキシでWeb Analyticsが動作しない（例: Cloudflare）

**問題**: プロキシを使用している場合のWeb Analyticsの機能不全

**解決方法**:

### 1. プロキシ設定を確認

プロキシ設定がすべてのページを正しくルーティングすることを確認

### 2. Analyticsリクエストを転送

すべての`/_vercel/insights/*`リクエストをデプロイメントに転送

**Nginx の例:**
```nginx
location /_vercel/insights/ {
    proxy_pass https://your-deployment.vercel.app/_vercel/insights/;
    proxy_set_header Host $host;
}
```

**Cloudflare Workers の例:**
```javascript
async function handleRequest(request) {
  const url = new URL(request.url);

  if (url.pathname.startsWith('/_vercel/insights/')) {
    return fetch(request);
  }

  // その他のリクエスト処理
}
```

## Web Analyticsダッシュボードにルートが表示されない

**問題**: 不完全なデータの可視性

**解決方法**:

### 1. 最新のパッケージを使用していることを確認

```bash
npm show @vercel/analytics version
pnpm update @vercel/analytics
```

### 2. 正しいインポートステートメントを使用

**Next.js:**
```javascript
import { Analytics } from '@vercel/analytics/next';
```

**一般的なReact:**
```javascript
import { Analytics } from '@vercel/analytics/react';
```

**Vue:**
```javascript
import { Analytics } from '@vercel/analytics/vue';
```

**Svelte:**
```javascript
import { Analytics } from '@vercel/analytics/svelte';
```

## 一般的な問題と解決策

### コンポーネントが正しく配置されていない

**症状**: データが収集されない

**解決方法**:

```typescript
// ✅ 正しい - ルートレイアウトに配置
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}

// ❌ 間違い - 個別のページに配置
export default function Page() {
  return (
    <div>
      <Content />
      <Analytics /> {/* ここに配置しない */}
    </div>
  );
}
```

### パッケージバージョンが古い

**症状**: 機能が正しく動作しない

**解決方法**:

```bash
# 現在のバージョンを確認
npm list @vercel/analytics

# 最新バージョンに更新
pnpm update @vercel/analytics
```

### 環境変数の問題

**症状**: 特定の環境でのみ動作しない

**解決方法**:

1. 環境変数が正しく設定されていることを確認
2. デプロイメント後に再デプロイして環境変数の変更を反映

### Content Security Policy (CSP) の競合

**症状**: スクリプトがブロックされる

**解決方法**:

```typescript
// next.config.js
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "script-src 'self' 'unsafe-inline' /_vercel/",
          },
        ],
      },
    ];
  },
};
```

## デバッグ手順

### 1. ブラウザ開発者ツールを確認

**ネットワークタブ**:
- `/_vercel/insights/script.js`が読み込まれることを確認
- `/_vercel/insights/view`へのPOSTリクエストを確認

**コンソールタブ**:
- エラーメッセージを確認
- 警告を探す

### 2. debugモードの有効化

```typescript
<Analytics debug={true} />
```

コンソールに以下が表示されます：
- 収集されたイベント
- 送信されたデータ
- エラーまたは警告

### 3. データフローの確認

1. **スクリプトの読み込み**: `script.js`が正常に読み込まれる
2. **イベントの収集**: ページビューが追跡される
3. **データの送信**: イベントがサーバーに送信される
4. **ダッシュボードの更新**: データがUIに表示される

## beforeSendの問題

### イベントが送信されない

**原因**: `beforeSend`が`null`を返している

**解決方法**:

```typescript
<Analytics
  beforeSend={(event) => {
    console.log('送信前:', event);

    // nullを返さないことを確認
    if (event.url.includes('/exclude')) {
      return null; // このページのみ除外
    }

    return event; // その他すべてを送信
  }}
/>
```

### beforeSendが機能しない

**確認事項**:

1. 関数が正しく定義されている
2. イベントオブジェクトを返している
3. コンソールエラーを確認

## データの整合性

### データが不正確に見える

**考えられる原因**:

1. **不十分なトラフィック**: より多くのデータを収集するまで待つ
2. **フィルタリング**: `beforeSend`で過度にフィルタリング
3. **ボットトラフィック**: 正しくフィルタリングされている

**解決方法**:

```typescript
<Analytics
  beforeSend={(event) => {
    console.log('イベント:', event);
    return event; // すべてを送信してテスト
  }}
/>
```

## パフォーマンスへの影響

### Analyticsがページを遅くしている

**確認事項**:

1. Analyticsスクリプトは非同期で読み込まれる
2. ユーザー体験に影響を与えるべきではない
3. 他のパフォーマンス問題を確認

## サポートを受ける

問題が解決しない場合：

1. [Vercelドキュメント](/docs)を確認
2. [Vercelコミュニティ](https://vercel.com/community)で質問
3. [サポートに連絡](/support)

### サポートリクエストに含める情報

- Vercelプラン
- 使用しているフレームワーク
- `@vercel/analytics`のバージョン
- エラーメッセージまたはスクリーンショット
- 再現手順

## ベストプラクティス

### 問題の予防

1. 最新バージョンを使用
2. ドキュメントに従う
3. 変更後にテスト
4. デバッグモードで検証

### 定期的なメンテナンス

1. パッケージを定期的に更新
2. 設定を見直し
3. メトリクスを監視
4. 異常を調査

## 次のステップ

- [Web Analytics概要](/docs/analytics)を確認
- [パッケージドキュメント](/docs/analytics/package)を読む
- [クイックスタート](/docs/analytics/quickstart)を再確認

## 関連リソース

- [Web Analyticsの使用](/docs/analytics/using-web-analytics)
- [カスタムイベント](/docs/analytics/custom-events)
- [料金と制限](/docs/analytics/limits-and-pricing)
