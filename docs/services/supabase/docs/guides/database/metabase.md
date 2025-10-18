# Metabaseとの接続

[Metabase](https://www.metabase.com/)は、Supabaseに保存されたデータを探索するためのオープンソースのデータ可視化ツールです。

## 接続手順

### 1. 登録

- [Metabaseアカウント](https://store.metabase.com/checkout)を作成するか、[Docker](https://www.docker.com/products/docker-desktop/)を使用してローカルにデプロイします

Dockerデプロイメントコマンド:

```bash
docker pull metabase/metabase:latest
docker run -d -p 3000:3000 --name metabase metabase/metabase
```

サーバーは`http://localhost:3000/setup`で利用可能になります

### 2. Postgresに接続

- プロジェクトダッシュボードで「Connect」をクリック
- 「Session pooler」の下のパラメータを表示

**注意**: IPv6環境にいる場合、またはIPv4アドオンを使用している場合は、Sessionモードのsupavisorの代わりに直接接続文字列を使用できます。

### 3. 探索

- データベース認証情報をMetabaseに入力します
- 接続が完了すると、Metabaseでデータの探索とビジュアライゼーションの作成が可能になります

## Metabaseを使用する理由

Metabaseは、次の機能を備えたデータ可視化ツールを提供します:

- **ビジュアルクエリビルダー**: SQLを書かずにクエリを作成
- **ダッシュボード**: データの傾向を追跡するためのカスタムダッシュボードを作成
- **共有とコラボレーション**: チームメンバーとインサイトを共有
- **自動レポート**: 定期的なレポートをスケジュール配信

主な利点:

- 直感的なUIで非技術者でも使いやすい
- 豊富なビジュアライゼーションオプション
- セルフホスティング可能なオープンソースソリューション
- PostgreSQLとのネイティブな統合

データの探索、分析、ビジュアライゼーションの作成に推奨されますが、複雑なデータ変換やETL処理には専用のツールが必要な場合があります。
