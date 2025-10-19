# Speed Insightsトラブルシューティング

## すべてのプランで利用可能

### Speed Insightsダッシュボードにデータが表示されない

**問題**: ダッシュボードにデータが表示されない、または `script.js` に対して404エラーが発生する

**解決方法**:

1. クイックスタートの手順を正しく実行したことを確認
2. アドブロッカーがSpeed Insightsスクリプトを妨げていないか確認
   - 妨げている場合は、アドブロッカーの無効化を検討

#### 詳細な手順

**a. ダッシュボードでSpeed Insightsが有効になっていることを確認**

1. プロジェクトダッシュボードに移動
2. Speed Insightsタブを確認
3. Speed Insightsが有効になっていることを確認

**b. アプリを再デプロイ**

```bash
vercel deploy
```

**c. 最新のデプロイメントを本番に昇格**

1. プロジェクトのDeploymentsタブに移動
2. 最新のデプロイメントの横にある3点メニューを選択
3. 「Promote to Production」を選択

### リクエストが呼び出されない

**問題**: `/_vercel/speed-insights/script.js` は読み込まれるが、データを送信していない

**解決方法**:

別のページに移動した後、またはタブを切り替えた後にリクエストを確認してください。

**理由**: 「Speed Insightsデータは、ウィンドウのblurまたはunloadイベントでのみ送信されます」

#### データが送信されるタイミング

- ユーザーがページから離れるとき
- タブを切り替えるとき
- ブラウザウィンドウを閉じるとき
- 別のページに移動するとき

### プロキシでSpeed Insightsが機能しない

**問題**: リバースプロキシを使用している場合の動作不良

**推奨事項**:

1. **Vercelの推奨**: Vercelの前にリバースプロキシを配置することは推奨されません

2. **プロキシを使用する場合**:
   - プロキシ設定が希望するすべてのページを正しくルーティングすることを確認
   - すべての `/_vercel/speed-insights/*` リクエストをデプロイメントに転送

#### プロキシ設定の例

**Nginx:**
```nginx
location /_vercel/speed-insights/ {
    proxy_pass https://your-deployment.vercel.app/_vercel/speed-insights/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

**Cloudflare Workers:**
```javascript
async function handleRequest(request) {
  const url = new URL(request.url);

  if (url.pathname.startsWith('/_vercel/speed-insights/')) {
    return fetch(request);
  }

  // その他のリクエスト処理
}
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
        <SpeedInsights />
      </body>
    </html>
  );
}

// ❌ 間違い - 個別のページに配置
export default function Page() {
  return (
    <div>
      <Content />
      <SpeedInsights /> {/* ここに配置しない */}
    </div>
  );
}
```

### パッケージのバージョンが古い

**症状**: 機能が正しく動作しない

**解決方法**:

```bash
# 最新バージョンを確認
npm show @vercel/speed-insights version

# アップデート
pnpm update @vercel/speed-insights
```

### 環境変数の問題

**症状**: 特定の環境でのみ動作しない

**解決方法**:

1. 環境変数が正しく設定されていることを確認
2. デプロイメント後に環境変数の変更を反映するために再デプロイ

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
- `/_vercel/speed-insights/script.js` が読み込まれることを確認
- `/_vercel/speed-insights/vitals` へのPOSTリクエストを確認

**コンソールタブ**:
- エラーメッセージを確認
- debugモードを有効化して詳細を表示

### 2. debugモードの有効化

```typescript
<SpeedInsights debug={true} />
```

コンソールに以下が表示されます：
- 収集されたメトリクス
- 送信されたデータ
- エラーまたは警告

### 3. データフローの確認

1. **スクリプトの読み込み**: `script.js` が正常に読み込まれる
2. **メトリクスの収集**: Web Vitalsが測定される
3. **データの送信**: メトリクスがサーバーに送信される
4. **ダッシュボードの更新**: データがUIに表示される

## パフォーマンスへの影響

### Speed Insightsが遅い場合

**症状**: ページの読み込みが遅く感じる

**確認事項**:

1. Speed Insightsスクリプトは非同期で読み込まれる
2. ユーザー体験に影響を与えるべきではない
3. 他の要因を確認

## データの整合性

### データが不正確に見える

**考えられる原因**:

1. **サンプルレート**: サンプルレートが低すぎる
2. **フィルタリング**: `beforeSend`で過度にフィルタリング
3. **トラフィック量**: 十分なトラフィックがない

**解決方法**:

```typescript
// サンプルレートを上げる
<SpeedInsights sampleRate={1.0} />

// フィルタを確認
<SpeedInsights
  beforeSend={(data) => {
    console.log('送信前:', data);
    return data;
  }}
/>
```

## サポートを受ける

問題が解決しない場合：

1. [Vercelドキュメント](/docs)を確認
2. [Vercelコミュニティ](https://vercel.com/community)で質問
3. [サポートに連絡](/support)

### サポートリクエストに含める情報

- Vercelプラン
- 使用しているフレームワーク
- `@vercel/speed-insights`のバージョン
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

- [Speed Insights概要](/docs/speed-insights)を確認
- [パッケージドキュメント](/docs/speed-insights/package)を読む
- [クイックスタート](/docs/speed-insights/quickstart)を再確認

## 関連リソース

- [Speed Insightsの使用](/docs/speed-insights/using-speed-insights)
- [メトリクス](/docs/speed-insights/metrics)
- [料金と制限](/docs/speed-insights/limits-and-pricing)
