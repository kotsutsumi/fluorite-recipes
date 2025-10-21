# pgsodium（非推奨予定）: 暗号化機能

## 重要な注意事項

- Supabaseは**pgsodiumの新規利用を推奨していません**
- この拡張機能は非推奨サイクルに移行する予定です
- Vault拡張機能は影響を受けません

## 概要

pgsodiumは、libsodiumの高レベル暗号化アルゴリズムへのSQLアクセスを提供するPostgres拡張機能です。

## 非推奨に関する警告

Supabaseは、以下の2つの主要機能の使用を**明確に警告**しています：

1. サーバーキー管理
2. 透過的カラム暗号化

### 非推奨の理由

- 運用の複雑さが高い
- 設定ミスのリスク

## 暗号化に関する考慮事項

> 注意: Supabaseプロジェクトはデフォルトで保存時に暗号化されており、これはSOC2やHIPAAなどのコンプライアンス要件には十分である可能性が高いです。

## 暗号化キー管理

> 暗号化にはキーが必要です。暗号化されたデータと同じデータベースにキーを保存することは安全ではありません。

ルート暗号化キーは重要であり、以下の用途に使用されます：

- Vault値の復号化
- 透過的カラム暗号化
- 慎重に管理する必要がある

## リソース

- [Supabase Vault](/docs/guides/database/vault)
- [Vault ブログ記事](/blog/vault-now-in-beta)
- [Supabase Vault on GitHub](https://github.com/supabase/vault)
- [pgsodium 公式ドキュメント](https://github.com/michelp/pgsodium)
