# Web Analyticsの使用

## Web Analyticsへのアクセス

Web Analyticsにアクセスするには：

1. ダッシュボードからプロジェクトを選択
2. Analyticsタブに移動
3. 期間と環境を選択
4. パネルを使用してページまたはイベントデータをフィルタリング

## データの次元の表示

アナリティクスデータを以下で表示できます：

- **Pages**: ページ
- **Routes**: ルート
- **Hostname**: ホスト名
- **Referrers**: リファラー
- **UTM Parameters**: UTMパラメータ（Web Analytics Plusで利用可能）
- **Country**: 国
- **Browsers**: ブラウザ
- **Devices**: デバイス
- **Operating Systems**: オペレーティングシステム

## 主な機能

### 期間の指定

- 期間ドロップダウンを選択
- 事前定義またはカスタム時間範囲を選択

### 環境固有のデータの表示

- Production、Preview、またはAll Environmentsから選択
- Productionがデフォルトビュー

### データのエクスポート

- パネルデータをCSVとしてエクスポート
- エクスポートあたり最大250エントリをサポート

## Web Analyticsの無効化

無効化するには：

1. 依存関係から`@vercel/analytics`パッケージを削除
2. データが収集されている場合は、ダッシュボードで「Disable Web Analytics」をクリック

## 重要な注意事項

### リファラーデータ

- HTTP Referrer-Policyに従って追跡
- 後続のソフトナビゲーションにはリファラーデータが含まれない

### 高度な機能

一部の高度な機能にはWeb Analytics PlusまたはEnterpriseプランが必要

## データパネル

### Pages パネル

- 最もビューされたページを表示
- ページビュー数とユニーク訪問者を表示
- 時間経過に伴う傾向を追跡

### Referrers パネル

- トラフィックソースを特定
- 外部リンクを追跡
- マーケティングキャンペーンを測定

### Countries パネル

- 地理的分布を表示
- 国別のエンゲージメントを追跡
- グローバルリーチを理解

### Devices & Browsers パネル

- デバイスタイプを分析
- ブラウザの使用状況を追跡
- クロスプラットフォームの互換性を確保

## ベストプラクティス

### データの分析

- 定期的にメトリクスを確認
- 傾向を特定
- データ駆動型の決定を行う

### フィルタリングの使用

- 特定のセグメントに焦点を当てる
- 複数のフィルタを組み合わせる
- カスタムビューを作成

## 次のステップ

- [フィルタリング](/docs/analytics/filtering)を探索
- [カスタムイベント](/docs/analytics/custom-events)を設定（Pro/Enterprise）
- [トラブルシューティング](/docs/analytics/troubleshooting)ガイドを確認

## 関連リソース

- [Web Analytics概要](/docs/analytics)
- [クイックスタート](/docs/analytics/quickstart)
- [パッケージリファレンス](/docs/analytics/package)
