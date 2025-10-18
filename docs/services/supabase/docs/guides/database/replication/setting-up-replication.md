# SupabaseでのレプリケーションとCDCのセットアップ

## 前提条件

レプリケーションをセットアップするには、以下の要件が推奨されます：
- XL以上のインスタンスサイズ
- [IPv4アドオン](/docs/guides/platform/ipv4-address)の有効化

レプリケーションスロットを作成するには、次の手順が必要です：
- `postgres`ユーザーを使用する
- [Supabaseガイド](/docs/guides/database/postgres/setup-replication-external)の手順に従う

> Postgres 17以降を実行している場合は、新しいユーザーを作成し、`postgres`ユーザーでレプリケーション権限を付与できます。17未満のバージョンでは、`postgres`ユーザーを使用する必要があります。

外部システムへのレプリケーションには、特定のツールのドキュメントを確認することが推奨されます。サポートされているツールには以下が含まれます：
- Airbyte
- Estuary
- Fivetran
- Materialize
- Stitch

### 各ツール固有の考慮事項

#### Airbyte
- Airbyteの[ドキュメント](https://docs.airbyte.com/integrations/sources/postgres/)に従う
- `postgres`ユーザーを使用する
- レプリケーション方法として「logical replication」を選択する
- WALファイルのクリアに関する既知の問題があるため、「heartbeat」テーブルの使用が推奨される

#### Estuary
- Estuaryの[ドキュメント](https://docs.estuary.dev/reference/Connectors/capture-connectors/PostgreSQL/Supabase/)に従う

#### Fivetran
- Fivetranの[ドキュメント](https://fivetran.com/docs/connectors/databases/postgresql/setup-guide)に従う
- 同期メカニズムとして「logical replication」を選択する
- 既存の`postgres`ユーザーを使用する

#### Materialize
- Materializeの[ドキュメント](https://materialize.com/docs/sql/create-source/postgres/)に従う
- Supabaseのガイドを使用してパブリケーションスロットを作成する

#### Stitch
- Stitchの[ドキュメント](https://www.stitchdata.com/docs/integrations/databases/postgresql/v2#extract-data)に従う
- `postgres`ユーザーを使用する
- 特定の設定手順をスキップする
