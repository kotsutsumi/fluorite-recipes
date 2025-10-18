# Supabase Vault

## 概要

VaultはPostgres拡張機能およびSupabase UI機能で、データベース内に暗号化されたシークレットを安全に保存できます。主な機能:
- 認証された暗号化を使用してシークレットを保存
- 簡単なシークレット管理のためのダッシュボードUIを提供
- 環境変数やAPIキーなどのシークレットを保存可能
- Postgres関数、トリガー、Webhookで使用可能

## 主な機能

### シークレットの追加

`vault.create_secret()`関数を使用:
- オプションで一意の名前と説明を追加できます
- 作成されたシークレットのUUIDを返します

例:

```sql
select vault.create_secret('my_s3kre3t');
select vault.create_secret('another_s3kre3t', 'unique_name', 'Description');
```

### シークレットの表示

- シークレットは`vault.secrets`テーブルに暗号化されて保存されます
- `vault.decrypted_secrets`ビューが復号化されたアクセスを提供します
- 復号化されたビューはクエリ時にのみ存在し、保存時の暗号化を維持します

### シークレットの更新

`vault.update_secret()`関数を使用:
- シークレットの値、名前、または説明を更新できます

## 技術的詳細

### 暗号化アプローチ

- 透過的列暗号化（TCE）を使用
- 関連データ付き認証暗号化（AEAD）
- 暗号化キーはデータベースとは別に保存
- データ偽造を防ぐための署名検証を提供

## リソース

- [Supabase Vaultブログ投稿](/blog/vault-now-in-beta)
- [GitHub上のVault](https://github.com/supabase/vault)
- [列暗号化ガイド](/docs/guides/database/column-encryption)
