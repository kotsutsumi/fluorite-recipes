# Analyticsのフィルタリング

## 概要

Web Analyticsは、データをフィルタリングしてWebサイトトラフィックに関する深いインサイトを得る方法を提供します。フィルタは、アナリティクスを特定のセグメントに分解することで、訪問者の行動を理解するのに役立ちます。

## フィルタの使用

### フィルタの適用方法

1. ダッシュボードからプロジェクトを選択
2. Analyticsタブをクリック
3. データパネルの任意の行をクリックしてフィルタリング

### 利用可能なフィルタカテゴリ

- **Routes**: ルート
- **Pages**: ページ
- **Hostname**: ホスト名
- **Referrers**: リファラー
- **UTM Parameters**: UTMパラメータ（Web Analytics Plus/Enterprise）
- **Country**: 国
- **Browsers**: ブラウザ
- **Devices**: デバイス
- **Operating System**: オペレーティングシステム
- **Custom Events**: カスタムイベント
- **Feature Flags**: 機能フラグ

## 使用例

### 特定のページの訪問者の出身を見つける

1. Pagesパネルで `/about-us` にフィルタリング
2. Referrerパネルを確認して外部リンクソースを表示

### 国別のコンテンツの人気を分析

1. Countriesパネルで「Canada」を選択
2. カナダの訪問者に固有のページビューを表示

### リファラーからのルートの人気を発見

1. 「google.com」などのリファラーをクリック
2. Routesパネルを調べて特定のページ訪問を確認

## ドリルダウン機能

### Referrers パネル

- 詳細なリファラーソースを探索
- `t.co`を検索してTwitterリンクを見つける
- クリックして特定のTwitterリンクソースを表示
- Twitterで元の投稿を見つけるためにTwitter検索を開く

### Flags パネル

- 機能フラグの使用状況を分析
- フラグがオンになっているセッションを確認

### Custom Events パネル

- 特定のイベント発生を調べる
- イベントプロパティで分析

## 複数のフィルタ

- 複数のフィルタを同時に適用可能
- 非常に特定のセグメントを作成
- 詳細な分析を実行

## ベストプラクティス

### 効果的なフィルタリング

- 特定の質問から開始
- 関連するフィルタを組み合わせる
- パターンと傾向を探す

### データセグメンテーション

- ユーザーグループを特定
- 行動パターンを理解
- ターゲットを絞った最適化

## 次のステップ

- [カスタムイベント](/docs/analytics/custom-events)を作成（Pro/Enterprise）
- [機密データの編集](/docs/analytics/redacting-sensitive-data)
- [Web Analyticsの使用](/docs/analytics/using-web-analytics)

## 関連リソース

- [Web Analytics概要](/docs/analytics)
- [クイックスタート](/docs/analytics/quickstart)
- [トラブルシューティング](/docs/analytics/troubleshooting)
