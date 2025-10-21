# 最新のSpeed Insightsパッケージへの移行

## 統合の変更点

### 新しいパッケージ: `@vercel/speed-insights`

Vercelは、いくつかの重要な改善を加えた新しいパッケージを導入しました：

- **ファーストパーティインジェスチョン**: データはドメインを通じて直接処理
- **強化されたルートサポート**: 動的ルートセグメントのサポート向上
- **高度なカスタマイズ**: より細かい制御オプション

#### 主な機能

- リクエストをインターセプトする機能
- プロジェクトごとのサンプルレート設定
- より広範なフレームワークサポート（Next.js `app`ルーター、Nuxt、Remix、SvelteKit）

## サンプルレート

サンプルレート設定がチーム設定から `@vercel/speed-insights` パッケージに移動され、プロジェクト固有のレート設定が可能になりました。

### 従来の方法

- チーム設定でグローバルに設定

### 新しい方法

```typescript
<SpeedInsights sampleRate={0.5} />
```

## ファーストパーティインテーク

### データインジェスチョンの変更

**従来**:
- サードパーティドメインからスクリプトを読み込み
- 外部エンドポイントにデータを送信

**新しい方法**:
- スクリプトソース: `https://yourdomain.com/_vercel/speed-insights/script.js`
- データポイントインジェスト: `https://yourdomain.com/_vercel/speed-insights/vitals`

### メリット

- **コンテンツブロッカーの影響を受けにくい**: ファーストパーティリクエストはブロックされにくい
- **DNSルックアップの削減**: 追加のドメイン解決が不要
- **CSPの簡素化**: サードパーティスクリプトのContent Security Policyを定義する必要なし

## UIの変更

### P75の重視

ダッシュボードは75パーセンタイルを重視するようになりました。Core Web Vitalsチームの推奨に基づいています：

- 最も速い75%のユーザーのパフォーマンスを表す
- 外れ値の影響を受けにくい
- 複数のパーセンタイルの表示が可能

### 更新されたスコアリング基準

スコアリングがLighthouse 10にインスパイアされ、メトリクスと重みが変更されました：

| メトリクス | 旧しきい値 | 新しきい値 | 旧重み | 新重み |
|--------|----------------|----------------|-------------|-------------|
| FCP | デバイスによって異なる | 1.8~3秒 | 20% | 15% |
| LCP | デバイスによって異なる | 2.5~4秒 | 35% | 30% |
| INP | 該当なし | 200~500ミリ秒 | - | 30% |
| FID | 100~300ミリ秒 | 削除 | 30% | - |
| CLS | 0.1~0.25 | 0.1~0.25 | 15% | 25% |

### 主な変更点

1. **INPの導入**: First Input Delay (FID) の代わりに Interaction to Next Paint (INP) を使用
2. **FIDの廃止**: より包括的なINPに置き換え
3. **重みの調整**: メトリクスの重要度が更新
4. **デバイス非依存のしきい値**: すべてのデバイスタイプで統一されたしきい値

## 移行手順

### 1. 古いパッケージのアンインストール

従来のSpeed Insightsパッケージを使用している場合：

```bash
pnpm uninstall @vercel/analytics
```

### 2. 新しいパッケージのインストール

```bash
pnpm install @vercel/speed-insights
```

### 3. インポートの更新

**Next.js:**
```typescript
// 従来
import { Analytics } from '@vercel/analytics/react';

// 新しい
import { SpeedInsights } from '@vercel/speed-insights/next';
```

**React:**
```typescript
// 新しい
import { SpeedInsights } from '@vercel/speed-insights/react';
```

### 4. コンポーネントの置き換え

**Next.js App Router:**
```typescript
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
```

### 5. サンプルレートの移行

チーム設定から削除し、コンポーネントに追加：

```typescript
<SpeedInsights sampleRate={0.8} />
```

### 6. カスタム設定の適用

必要に応じて新しい設定オプションを追加：

```typescript
<SpeedInsights
  sampleRate={0.75}
  beforeSend={(data) => {
    // カスタムロジック
    return data;
  }}
  debug={false}
/>
```

## 互換性

### サポートされているフレームワーク

- Next.js (Pages Router & App Router)
- React
- Vue
- Svelte
- Nuxt
- Remix
- SvelteKit
- その他のJavaScriptフレームワーク

## 新機能の活用

### beforeSend関数

```typescript
<SpeedInsights
  beforeSend={(data) => {
    if (data.url.includes('/admin')) {
      return null; // 管理ページを除外
    }

    return {
      ...data,
      customAttribute: 'value',
    };
  }}
/>
```

### カスタムエンドポイント

```typescript
<SpeedInsights
  endpoint="https://custom-domain.com/_vercel/speed-insights/vitals"
/>
```

### デバッグモード

```typescript
<SpeedInsights
  debug={process.env.NODE_ENV === 'development'}
/>
```

## スコアの違いの理解

### 移行後のスコア変更

新しいスコアリングシステムにより、スコアが変わる可能性があります：

- **INPの追加**: インタラクティビティがより重視される
- **重みの変更**: メトリクスの相対的な重要度が変更
- **しきい値の更新**: より厳密またはより緩和された基準

### 期待される動作

- スコアが上下する可能性がある
- より正確なユーザー体験の反映
- Core Web Vitalsの最新ベストプラクティスとの整合

## トラブルシューティング

### データが表示されない

1. ダッシュボードでSpeed Insightsが有効になっていることを確認
2. 最新のデプロイメントを本番に昇格
3. ネットワークタブで`/_vercel/speed-insights/`リクエストを確認

### スコアの不一致

1. 新しいスコアリングシステムを理解
2. 十分なデータポイントを収集
3. メトリクスの変更を確認

## ベストプラクティス

### 移行チェックリスト

- [ ] 新しいパッケージをインストール
- [ ] インポートを更新
- [ ] コンポーネントを置き換え
- [ ] サンプルレートを移行
- [ ] 本番にデプロイ
- [ ] データ収集を確認
- [ ] チームに変更を通知

### 移行後

- 新しいメトリクスを監視
- スコアの変更を追跡
- 新機能を活用
- ドキュメントを更新

## 次のステップ

- [パッケージドキュメント](/docs/speed-insights/package)を確認
- [新しいメトリクス](/docs/speed-insights/metrics)について学ぶ
- [ベストプラクティス](/docs/speed-insights/using-speed-insights)を実装

## 関連リソース

- [Speed Insights概要](/docs/speed-insights)
- [クイックスタート](/docs/speed-insights/quickstart)
- [トラブルシューティング](/docs/speed-insights/troubleshooting)
