# psqlで接続する

[`psql`](https://www.postgresql.org/docs/current/app-psql.html)は、Postgresに付属するコマンドラインツールです。

## SSLで接続する

盗聴や中間者攻撃を防ぐため、可能な限りSSLを使用してデータベースに接続する必要があります。

接続情報とサーバールート証明書は、アプリケーションのダッシュボードから取得できます:

![接続情報と証明書](/docs/img/database/database-settings-ssl.png)

SSL証明書を`/path/to/prod-supabase.cer`にダウンロードします。

接続設定を確認します。プロジェクトの[**Connect**パネル](/dashboard/project/_?showConnect=true)に移動し、`Session pooler`セクションからURLをコピーして、パラメータを接続文字列にコピーします:

```
psql "sslmode=verify-full sslrootcert=/path/to/prod-supabase.cer host=[CLOUD_PROVIDER]-0-[REGION].pooler.supabase.com dbname=postgres user=postgres.[PROJECT_REF]"
```
