# Data APIの強化

## 概要

- データベースの自動生成されたData APIは、デフォルトで`public`スキーマを公開します
- 任意のスキーマに変更したり、Data APIを完全に無効にすることができます
- Data API経由でアクセス可能なテーブルには、行レベルセキュリティ（RLS）を有効にする必要があります

## 共同責任

- アプリケーションのセキュリティは開発者の責任です
- Supabaseが提供するもの:
  - RLSがないテーブルに関する毎日のメール警告
  - ダッシュボードのセキュリティアドバイザーツール

## プライベートスキーマ

- 推奨: Data API経由で公開されないテーブル用に`private`スキーマを作成
- サーバー側のツールからアクセス可能
- RLSを有効にし、`bypassrls`権限を持つPostgresロールを使用することを推奨

## publicスキーマの管理

セキュリティを強化する2つのアプローチ:
- Data APIを完全に無効化
- `public`スキーマを削除してカスタムスキーマ（例: `api`）に置き換える

## Data APIの無効化

手順:
- API設定に移動
- 「Data APIを有効にする」をオフに切り替える

## カスタムスキーマの公開

手順:
- 公開されたスキーマから`public`を削除
- 新しいスキーマを作成（例: `api`）
- `anon`および`authenticated`ロールに使用権限を付与
- 公開されたスキーマに新しいスキーマを追加

### コード例

```sql
-- スキーマの作成
create schema if not exists api;

-- 使用権限の付与
grant usage on schema api to anon, authenticated;

-- テーブル権限の付与
grant select on table api.<your_table> to anon;
grant select, insert, update, delete on table api.<your_table> to authenticated;
```

この構造化された概要は、Supabase Data APIを強化するための主要なポイントをキャプチャしています。
