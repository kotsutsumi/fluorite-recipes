# フェアユースガイドライン

すべてのサブスクリプションプランには、以下のフェアユースガイドラインの対象となる利用が含まれます。以下は、「フェアユース」の定義に該当するプロジェクトとそうでないプロジェクトを判断するための目安です。

## フェアユースの例

以下のユースケースはフェアユースと見なされます：

### 静的サイト

- ブログ
- ポートフォリオサイト
- ドキュメントサイト
- ランディングページ
- マーケティングサイト

**例**:
```typescript
// 静的生成されたブログ
export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({ slug: post.slug }));
}
```

### ハイブリッドアプリ

- SSG + SSRの組み合わせ
- ISR（インクリメンタル静的再生成）を使用
- 動的ルートと静的ルートの混在

**例**:
```typescript
// ISRを使用した製品ページ
export const revalidate = 60;

export default async function ProductPage({ params }) {
  const product = await getProduct(params.id);
  return <ProductDetails product={product} />;
}
```

### フロントエンドアプリ

- React、Vue、Svelteアプリケーション
- Next.js、Nuxt、SvelteKitアプリケーション
- クライアントサイドレンダリングアプリ

### シングルページアプリケーション (SPA)

- ダッシュボード
- 管理画面
- ウェブアプリケーション

### データベースやAPIを照会する関数

- バックエンドAPIへのプロキシ
- データベースクエリ
- サードパーティAPI統合

**例**:
```typescript
// API Route
export async function GET(request: Request) {
  const data = await db.query('SELECT * FROM products');
  return Response.json(data);
}
```

### ブログ、Eコマース、マーケティングサイト

- コンテンツ駆動型サイト
- オンラインストア
- コーポレートサイト

## フェアユースではない例

以下のユースケースはフェアユースに該当しません：

### プロキシとVPN

**禁止事項**:
- トラフィックをプロキシするサービス
- VPNサービス
- トンネリングサービス
- リバースプロキシとしての使用

**理由**: 過度な帯域幅使用とインフラストラクチャの悪用。

### メディアホスティングによるダイレクトリンク

**禁止事項**:
- 画像/動画ホスティングサービス
- ファイルストレージサービス
- CDNとしての使用のみ
- ダイレクトリンクによる大量ダウンロード

**理由**: Vercelは汎用CDNサービスではありません。

**適切な使用**:
```typescript
// アプリケーション内での画像使用は問題なし
import Image from 'next/image';

<Image src="/images/product.jpg" alt="Product" width={600} height={400} />
```

**不適切な使用**:
```html
<!-- 外部サイトからのダイレクトリンク -->
<img src="https://your-app.vercel.app/large-file.jpg" />
```

### スクレイパー

**禁止事項**:
- Webスクレイピングサービス
- 大量のクローリング
- 自動データ収集

**理由**: 他のウェブサイトへの過度なリクエストと不正利用。

### 暗号通貨マイニング

**禁止事項**:
- 暗号通貨マイニング
- ブロックチェーン計算
- 計算リソースの悪用

**理由**: サーバーレス関数の不適切な使用。

### 許可なしの負荷テスト

**禁止事項**:
- 事前通知なしの負荷テスト
- ストレステスト
- DDoS攻撃のようなトラフィックパターン

**理由**: インフラストラクチャへの予期しない負荷。

**適切な方法**:
1. Vercelサポートに連絡
2. 負荷テストの計画を共有
3. 承認を得る
4. 制限されたテストを実施

### ペネトレーションテスト

**禁止事項**:
- 事前通知なしのセキュリティテスト
- 脆弱性スキャン
- 侵入テスト

**適切な方法**:
1. [バグバウンティプログラム](https://vercel.com/security)を確認
2. 責任ある開示ポリシーに従う

## 利用ガイドライン

コミュニティのガイドラインとして、ほとんどのユーザーは以下の範囲内で利用することを想定しています。利用が外れている場合は通知します。私たちの目標は、インフラに過度な負担をかけることなく、できる限り寛容であることです。可能な限り、是正のためのアクションを取る前にユーザーに連絡し、協力して対応します。

### 典型的な月間利用ガイドライン

| リソース | Hobby | Pro |
|----------|-------|-----|
| 高速データ転送 | 最大100 GB | 最大1 TB |
| 高速オリジン転送 | 最大10 GB | 最大100 GB |
| 関数実行 | 最大100 GB秒 | 最大1,000 GB秒 |
| エッジリクエスト | 最大100万 | 最大1,000万 |

**注**: これらは一般的なガイドラインであり、厳格な制限ではありません。正当な理由で超過する場合はサポートにご連絡ください。

## ベストプラクティス

### リソース使用の最適化

1. **画像最適化**:
```typescript
import Image from 'next/image';

// 自動最適化
<Image
  src="/photo.jpg"
  alt="Photo"
  width={800}
  height={600}
  quality={80}
/>
```

2. **キャッシング**:
```typescript
export const revalidate = 3600; // 1時間

export default async function Page() {
  const data = await fetch('https://api.example.com/data', {
    next: { revalidate: 3600 }
  });
  return <div>{/* ... */}</div>;
}
```

3. **関数の最適化**:
```typescript
// 必要な依存関係のみをインポート
import { specific } from 'large-library/specific';

// 関数を軽量に保つ
export async function GET() {
  const data = await quickQuery();
  return Response.json(data);
}
```

### モニタリング

定期的に使用状況を確認：

```bash
# Vercel ダッシュボード
vercel analytics

# デプロイメント詳細
vercel inspect [url]
```

**ダッシュボードで確認**:
- Analytics → Usage
- 帯域幅使用量
- 関数実行時間
- ビルド時間

## 過度な使用への対応

### 通知プロセス

1. **初回通知**: メールで使用状況と改善提案を通知
2. **協議**: サポートチームと最適化について協議
3. **猶予期間**: 改善のための時間を提供
4. **制限**: 改善されない場合のみ、サービスを制限

### 改善手順

過度な使用の通知を受けた場合：

1. **使用状況の確認**:
   - Vercel ダッシュボードで詳細を確認
   - どのリソースが多く使用されているか特定

2. **最適化の実施**:
   - 画像とアセットの最適化
   - キャッシング戦略の改善
   - 不要な処理の削除

3. **プランのアップグレード**:
   - より高い制限が必要な場合
   - [Pro](https://vercel.com/pricing)または[Enterprise](https://vercel.com/contact/sales)プランへのアップグレード

4. **サポートへの連絡**:
   - 技術的なアドバイスが必要な場合
   - カスタムプランについて相談

## よくある質問

### Q: どのくらいの帯域幅使用が「過度」ですか？

A: 典型的なガイドラインは上記の表を参照してください。正当なユースケースで超過する場合は、事前にサポートに連絡することをお勧めします。

### Q: 大規模なイベントやキャンペーンの予定があります。何をすべきですか？

A: イベント前にサポートに連絡し、予想されるトラフィックを共有してください。適切なプランとサポートを提供します。

### Q: エラー通知を受けました。どうすればよいですか？

A:
1. 通知メールの詳細を確認
2. ダッシュボードで使用状況を確認
3. 上記の最適化手順を実施
4. サポートに連絡して支援を求める

### Q: テスト環境でも制限は適用されますか？

A: はい、すべての環境（本番、プレビュー、開発）に制限が適用されます。

## 連絡先

フェアユースに関する質問や懸念事項：

- **一般的なサポート**: [vercel.com/support](https://vercel.com/support)
- **セールス**: [vercel.com/contact/sales](https://vercel.com/contact/sales)
- **不正使用の報告**: [abuse@vercel.com](mailto:abuse@vercel.com)

## 関連リソース

- [価格プラン](https://vercel.com/pricing)
- [制限](/docs/limits)
- [最適化ガイド](https://vercel.com/docs/concepts/solutions/optimization)
- [サポートセンター](https://vercel.com/support)
