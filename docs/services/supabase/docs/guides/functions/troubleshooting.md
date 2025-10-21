# Edge Functionsのトラブルシューティング

このトラブルシューティングページでは、Supabase Edge Functionsでよくある問題を解決するためのガイダンスを提供します。

## 主なトラブルシューティングトピック

### 1. Supabase Egress

複数のSupabaseサービスにわたるプラットフォーム全体の帯域幅とネットワーク関連の問題をカバーします。

### 2. Wall Clock Time Limit（実行時間制限）

- Edge Functionsのランタイム制限に対処
- HTTPステータスコード: 546
- 関数の実行時間の制約に関連

### 3. モジュールとインポートの問題

- Deno Edge Functionsでesm.shからモジュールをインポートする際の問題を具体的にカバー
- モジュール読み込みエラーの解決に役立ちます

### 4. 環境変数

- Edge Functionの環境変数の検査と管理に関するガイダンスを提供
- CLIおよびデプロイ設定に有用

### 5. データベーストリガー関数

- トリガー関数で`NEW`変数がnullになる問題を説明
- SQLおよびデータベース関連の関数の問題を診断するのに役立ちます

## 追加リソース

問題が解決しない場合は、以下のリソースを参照してください:

- [サポートに連絡](https://supabase.com/support)
- [システムステータスを確認](https://status.supabase.com/)
- [製品変更履歴](https://supabase.com/changelog)

このページは、開発者がEdge Functionsの開発およびデプロイにおける一般的な課題を迅速に診断し、解決するために設計されています。
