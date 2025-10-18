# Stripe

[Stripe](https://stripe.com/)は、インターネットビジネス向けの決済処理プラットフォームです。

Stripe Wrapperは、WebAssembly (Wasm) 外部データラッパーで、Postgresデータベース内からStripeのデータを読み書きできます。

## 準備

StripeラッパーをSupabaseプロジェクトで使用する前に、いくつかの準備ステップが必要です。

### Wrappersエクステンションの有効化

次のようにしてSupabaseダッシュボードでWrappersエクステンションを有効にします:

1. [Database](https://supabase.com/dashboard/project/_/database/tables)ページに移動します
2. サイドメニューで**Extensions**をクリックします
3. "wrappers"を検索し、エクステンションを有効にします

### 外部データラッパーの有効化

これはStripeラッパーの外部データラッパーを有効にするSQLコマンドです:

```sql
create foreign data wrapper stripe_wrapper
  handler stripe_fdw_handler
  validator stripe_fdw_validator;
```

注意: Wasmは、Supabaseに接続されたVaultにシークレットを保存することをサポートしていません。次のステップでStripe API情報を含めます。

### Stripe APIキーの保護

デフォルトでは、Postgresはロールがアクセスできるテーブルから選択する際にロール権限を適用します。これにより、特定の外部テーブルへのアクセス権を持つPostgresユーザーは、基礎となる外部データラッパーが使用する資格情報を含むオプションを確認できます。

外部データラッパーから資格情報を保護するには、Supabaseに接続されたVaultに保存することをお勧めします。これらの資格情報は、Postgresの機密データを保護する拡張機能である[Supabase Vault](https://supabase.com/docs/guides/database/vault)を使用して保存および取得できます。

#### Supabase Vaultへの保存

```sql
insert into vault.secrets (name, secret)
values (
  'stripe_api_key',
  'sk_test_xxx'
)
returning key_id;
```

### Stripeへの接続

次のコマンドでStripeに接続するためのサーバーを作成します:

```sql
do $$
declare
  api_key_id uuid;
begin
  -- VaultからAPIキーのkey_idを取得
  select key_id into api_key_id from vault.decrypted_secrets where name = 'stripe_api_key' limit 1;

  -- Wasmパッケージメタデータとsourceを指定してStripeへの外部サーバーを作成
  execute format(
    E'create server stripe_server \n'
    '  foreign data wrapper stripe_wrapper \n'
    '  options ( \n'
    '    api_key_id ''%s'', \n'
    '    api_url ''https://api.stripe.com/v1'' \n'
    '  ); \n',
    api_key_id
  );
end $$;
```

一部のオプションはVaultから読み取られます:

- `api_key_id` - Stripe APIキーを含むVaultシークレットオブジェクトのID

## エンティティ

Stripe外部テーブルは、Stripeオブジェクトに対するPostgresプロキシです。Stripe外部テーブルは、ローカルPostgresデータベースに専用のスキーマを作成することをお勧めします:

```sql
create schema stripe;
```

Stripeラッパーは、以下のStripeオブジェクトをサポートしています:

| インテグレーション | Select | Insert | Update | Delete | Truncate |
|--------------|--------|--------|--------|--------|----------|
| [Balance](#balance) | ✅ | ❌ | ❌ | ❌ | ❌ |
| [Balance Transactions](#balance-transactions) | ✅ | ❌ | ❌ | ❌ | ❌ |
| [Charges](#charges) | ✅ | ✅ | ✅ | ❌ | ❌ |
| [Customers](#customers) | ✅ | ✅ | ✅ | ✅ | ❌ |
| [Disputes](#disputes) | ✅ | ✅ | ✅ | ❌ | ❌ |
| [Events](#events) | ✅ | ❌ | ❌ | ❌ | ❌ |
| [Files](#files) | ✅ | ❌ | ❌ | ❌ | ❌ |
| [File Links](#file-links) | ✅ | ✅ | ✅ | ❌ | ❌ |
| [Invoices](#invoices) | ✅ | ✅ | ✅ | ✅ | ❌ |
| [Mandates](#mandates) | ✅ | ❌ | ❌ | ❌ | ❌ |
| [Payment Intents](#payment-intents) | ✅ | ✅ | ✅ | ❌ | ❌ |
| [Payouts](#payouts) | ✅ | ✅ | ✅ | ❌ | ❌ |
| [Products](#products) | ✅ | ✅ | ✅ | ✅ | ❌ |
| [Refunds](#refunds) | ✅ | ✅ | ✅ | ❌ | ❌ |
| [Setup Attempts](#setup-attempts) | ✅ | ❌ | ❌ | ❌ | ❌ |
| [Setup Intents](#setup-intents) | ✅ | ✅ | ✅ | ❌ | ❌ |
| [Subscriptions](#subscriptions) | ✅ | ✅ | ✅ | ✅ | ❌ |
| [Tokens](#tokens) | ✅ | ❌ | ❌ | ❌ | ❌ |
| [Top-ups](#top-ups) | ✅ | ✅ | ✅ | ❌ | ❌ |

### Balance

これは外部テーブルであり、対応するStripe APIは[Retrieve balance](https://stripe.com/docs/api/balance/balance_retrieve)です。

#### 操作

| オブジェクト | Select | Insert | Update | Delete | Truncate |
|---------|--------|--------|--------|--------|----------|
| Balance | ✅      | ❌      | ❌      | ❌      | ❌        |

#### 使用方法

```sql
create foreign table stripe.balance (
  balance_type text,
  amount bigint,
  currency text,
  attrs jsonb
)
  server stripe_server
  options (
    object 'balance'
  );
```

#### メモ

- `attrs`列には完全なレスポンスJSONが含まれます
- すべての列は読み取り専用です

### Balance Transactions

これは外部テーブルであり、対応するStripe APIは[Balance transactions](https://stripe.com/docs/api/balance_transactions)です。

#### 操作

| オブジェクト | Select | Insert | Update | Delete | Truncate |
|---------|--------|--------|--------|--------|----------|
| Balance Transactions | ✅ | ❌ | ❌ | ❌ | ❌ |

#### 使用方法

```sql
create foreign table stripe.balance_transactions (
  id text,
  amount bigint,
  currency text,
  description text,
  fee bigint,
  net bigint,
  status text,
  type text,
  created timestamp,
  attrs jsonb
)
  server stripe_server
  options (
    object 'balance_transactions'
  );
```

### Charges

これは外部テーブルであり、対応するStripe APIは[Charges](https://stripe.com/docs/api/charges)です。

#### 操作

| オブジェクト | Select | Insert | Update | Delete | Truncate |
|---------|--------|--------|--------|--------|----------|
| Charges | ✅ | ✅ | ✅ | ❌ | ❌ |

#### 使用方法

```sql
create foreign table stripe.charges (
  id text,
  amount bigint,
  currency text,
  customer text,
  description text,
  invoice text,
  payment_intent text,
  status text,
  created timestamp,
  attrs jsonb
)
  server stripe_server
  options (
    object 'charges',
    rowid_column 'id'
  );
```

### Customers

これは外部テーブルであり、対応するStripe APIは[Customers](https://stripe.com/docs/api/customers)です。

#### 操作

| オブジェクト | Select | Insert | Update | Delete | Truncate |
|---------|--------|--------|--------|--------|----------|
| Customers | ✅ | ✅ | ✅ | ✅ | ❌ |

#### 使用方法

```sql
create foreign table stripe.customers (
  id text,
  email text,
  name text,
  description text,
  created timestamp,
  attrs jsonb
)
  server stripe_server
  options (
    object 'customers',
    rowid_column 'id'
  );
```

#### 例

基本的なクエリ:

```sql
-- 最初の10人の顧客を取得
select * from stripe.customers limit 10;

-- 顧客を挿入
insert into stripe.customers(email, name, description)
values ('test@test.com', 'test name', null);

-- 顧客を更新
update stripe.customers
set description='hello'
where id = 'cus_xxx';

-- 顧客を削除
delete from stripe.customers
where id = 'cus_xxx';
```

### Disputes

これは外部テーブルであり、対応するStripe APIは[Disputes](https://stripe.com/docs/api/disputes)です。

#### 操作

| オブジェクト | Select | Insert | Update | Delete | Truncate |
|---------|--------|--------|--------|--------|----------|
| Disputes | ✅ | ✅ | ✅ | ❌ | ❌ |

#### 使用方法

```sql
create foreign table stripe.disputes (
  id text,
  amount bigint,
  currency text,
  charge text,
  payment_intent text,
  reason text,
  status text,
  created timestamp,
  attrs jsonb
)
  server stripe_server
  options (
    object 'disputes',
    rowid_column 'id'
  );
```

### Events

これは外部テーブルであり、対応するStripe APIは[Events](https://stripe.com/docs/api/events)です。

#### 操作

| オブジェクト | Select | Insert | Update | Delete | Truncate |
|---------|--------|--------|--------|--------|----------|
| Events | ✅ | ❌ | ❌ | ❌ | ❌ |

#### 使用方法

```sql
create foreign table stripe.events (
  id text,
  type text,
  api_version text,
  created timestamp,
  attrs jsonb
)
  server stripe_server
  options (
    object 'events'
  );
```

### Files

これは外部テーブルであり、対応するStripe APIは[Files](https://stripe.com/docs/api/files)です。

#### 操作

| オブジェクト | Select | Insert | Update | Delete | Truncate |
|---------|--------|--------|--------|--------|----------|
| Files | ✅ | ❌ | ❌ | ❌ | ❌ |

#### 使用方法

```sql
create foreign table stripe.files (
  id text,
  filename text,
  purpose text,
  title text,
  size bigint,
  type text,
  url text,
  created timestamp,
  expires_at timestamp,
  attrs jsonb
)
  server stripe_server
  options (
    object 'files'
  );
```

### File Links

これは外部テーブルであり、対応するStripe APIは[File Links](https://stripe.com/docs/api/file_links)です。

#### 操作

| オブジェクト | Select | Insert | Update | Delete | Truncate |
|---------|--------|--------|--------|--------|----------|
| File Links | ✅ | ✅ | ✅ | ❌ | ❌ |

#### 使用方法

```sql
create foreign table stripe.file_links (
  id text,
  file text,
  url text,
  created timestamp,
  expired bool,
  expires_at timestamp,
  attrs jsonb
)
  server stripe_server
  options (
    object 'file_links',
    rowid_column 'id'
  );
```

### Invoices

これは外部テーブルであり、対応するStripe APIは[Invoices](https://stripe.com/docs/api/invoices)です。

#### 操作

| オブジェクト | Select | Insert | Update | Delete | Truncate |
|---------|--------|--------|--------|--------|----------|
| Invoices | ✅ | ✅ | ✅ | ✅ | ❌ |

#### 使用方法

```sql
create foreign table stripe.invoices (
  id text,
  customer text,
  subscription text,
  status text,
  total bigint,
  currency text,
  period_start timestamp,
  period_end timestamp,
  attrs jsonb
)
  server stripe_server
  options (
    object 'invoices',
    rowid_column 'id'
  );
```

### Mandates

これは外部テーブルであり、対応するStripe APIは[Mandates](https://stripe.com/docs/api/mandates)です。

#### 操作

| オブジェクト | Select | Insert | Update | Delete | Truncate |
|---------|--------|--------|--------|--------|----------|
| Mandates | ✅ | ❌ | ❌ | ❌ | ❌ |

#### 使用方法

```sql
create foreign table stripe.mandates (
  id text,
  payment_method text,
  status text,
  type text,
  attrs jsonb
)
  server stripe_server
  options (
    object 'mandates'
  );
```

### Payment Intents

これは外部テーブルであり、対応するStripe APIは[Payment Intents](https://stripe.com/docs/api/payment_intents)です。

#### 操作

| オブジェクト | Select | Insert | Update | Delete | Truncate |
|---------|--------|--------|--------|--------|----------|
| Payment Intents | ✅ | ✅ | ✅ | ❌ | ❌ |

#### 使用方法

```sql
create foreign table stripe.payment_intents (
  id text,
  customer text,
  amount bigint,
  currency text,
  payment_method text,
  created timestamp,
  attrs jsonb
)
  server stripe_server
  options (
    object 'payment_intents',
    rowid_column 'id'
  );
```

### Payouts

これは外部テーブルであり、対応するStripe APIは[Payouts](https://stripe.com/docs/api/payouts)です。

#### 操作

| オブジェクト | Select | Insert | Update | Delete | Truncate |
|---------|--------|--------|--------|--------|----------|
| Payouts | ✅ | ✅ | ✅ | ❌ | ❌ |

#### 使用方法

```sql
create foreign table stripe.payouts (
  id text,
  amount bigint,
  currency text,
  arrival_date timestamp,
  description text,
  statement_descriptor text,
  status text,
  created timestamp,
  attrs jsonb
)
  server stripe_server
  options (
    object 'payouts',
    rowid_column 'id'
  );
```

### Products

これは外部テーブルであり、対応するStripe APIは[Products](https://stripe.com/docs/api/products)です。

#### 操作

| オブジェクト | Select | Insert | Update | Delete | Truncate |
|---------|--------|--------|--------|--------|----------|
| Products | ✅ | ✅ | ✅ | ✅ | ❌ |

#### 使用方法

```sql
create foreign table stripe.products (
  id text,
  name text,
  active bool,
  default_price text,
  description text,
  created timestamp,
  updated timestamp,
  attrs jsonb
)
  server stripe_server
  options (
    object 'products',
    rowid_column 'id'
  );
```

### Refunds

これは外部テーブルであり、対応するStripe APIは[Refunds](https://stripe.com/docs/api/refunds)です。

#### 操作

| オブジェクト | Select | Insert | Update | Delete | Truncate |
|---------|--------|--------|--------|--------|----------|
| Refunds | ✅ | ✅ | ✅ | ❌ | ❌ |

#### 使用方法

```sql
create foreign table stripe.refunds (
  id text,
  amount bigint,
  currency text,
  charge text,
  payment_intent text,
  reason text,
  status text,
  created timestamp,
  attrs jsonb
)
  server stripe_server
  options (
    object 'refunds',
    rowid_column 'id'
  );
```

### Setup Attempts

これは外部テーブルであり、対応するStripe APIは[Setup Attempts](https://stripe.com/docs/api/setup_attempts)です。

#### 操作

| オブジェクト | Select | Insert | Update | Delete | Truncate |
|---------|--------|--------|--------|--------|----------|
| Setup Attempts | ✅ | ❌ | ❌ | ❌ | ❌ |

#### 使用方法

```sql
create foreign table stripe.setup_attempts (
  id text,
  application text,
  customer text,
  on_behalf_of text,
  payment_method text,
  setup_intent text,
  status text,
  usage text,
  created timestamp,
  attrs jsonb
)
  server stripe_server
  options (
    object 'setup_attempts'
  );
```

### Setup Intents

これは外部テーブルであり、対応するStripe APIは[Setup Intents](https://stripe.com/docs/api/setup_intents)です。

#### 操作

| オブジェクト | Select | Insert | Update | Delete | Truncate |
|---------|--------|--------|--------|--------|----------|
| Setup Intents | ✅ | ✅ | ✅ | ❌ | ❌ |

#### 使用方法

```sql
create foreign table stripe.setup_intents (
  id text,
  client_secret text,
  customer text,
  description text,
  payment_method text,
  status text,
  usage text,
  created timestamp,
  attrs jsonb
)
  server stripe_server
  options (
    object 'setup_intents',
    rowid_column 'id'
  );
```

### Subscriptions

これは外部テーブルであり、対応するStripe APIは[Subscriptions](https://stripe.com/docs/api/subscriptions)です。

#### 操作

| オブジェクト | Select | Insert | Update | Delete | Truncate |
|---------|--------|--------|--------|--------|----------|
| Subscriptions | ✅ | ✅ | ✅ | ✅ | ❌ |

#### 使用方法

```sql
create foreign table stripe.subscriptions (
  id text,
  customer text,
  currency text,
  current_period_start timestamp,
  current_period_end timestamp,
  attrs jsonb
)
  server stripe_server
  options (
    object 'subscriptions',
    rowid_column 'id'
  );
```

### Tokens

これは外部テーブルであり、対応するStripe APIは[Tokens](https://stripe.com/docs/api/tokens)です。

#### 操作

| オブジェクト | Select | Insert | Update | Delete | Truncate |
|---------|--------|--------|--------|--------|----------|
| Tokens | ✅ | ❌ | ❌ | ❌ | ❌ |

#### 使用方法

```sql
create foreign table stripe.tokens (
  id text,
  type text,
  client_ip text,
  created timestamp,
  livemode bool,
  used bool,
  attrs jsonb
)
  server stripe_server
  options (
    object 'tokens'
  );
```

### Top-ups

これは外部テーブルであり、対応するStripe APIは[Top-ups](https://stripe.com/docs/api/topups)です。

#### 操作

| オブジェクト | Select | Insert | Update | Delete | Truncate |
|---------|--------|--------|--------|--------|----------|
| Top-ups | ✅ | ✅ | ✅ | ❌ | ❌ |

#### 使用方法

```sql
create foreign table stripe.topups (
  id text,
  amount bigint,
  currency text,
  description text,
  status text,
  created timestamp,
  attrs jsonb
)
  server stripe_server
  options (
    object 'topups',
    rowid_column 'id'
  );
```

## クエリのプッシュダウンサポート

このFDWは、`where`、`order by`、`limit`のプッシュダウンをサポートしています。

## 例

以下にいくつかの例を示します。

### 基本的な作成と読み取りの例

これは、顧客を作成し、Postgresから直接Stripe顧客のリストを照会する例です:

```sql
-- Stripe顧客を挿入
insert into stripe.customers (email, name, description)
values
  ('test@test.com', 'Test Name', 'Description');

-- Stripe顧客をクエリ
select * from stripe.customers where email = 'test@test.com';
```

### JSONクエリの例

すべての外部テーブルには`attrs` JSONBフィールドが含まれており、JSON演算子を使用してクエリを実行できます。これにより、外部テーブル定義に含まれていないデータにアクセスできます。

```sql
-- 顧客のメタデータのmy_keyフィールドを返す
select attrs->'metadata'->>'my_key' from stripe.customers where id = 'cus_xxx';

-- where句でJSON属性を使用してフィルタリング
select * from stripe.customers where attrs->'metadata'->>'my_key' = 'foo';

-- JSON配列の最初の要素にアクセス
select attrs->'subscriptions'->'data'->0 from stripe.customers where id = 'cus_xxx';
```

### データ変更の例

```sql
-- 新しい顧客を挿入
insert into stripe.customers (email, name, description)
values
  ('test@test.com', 'Test Name', 'Description');

-- 顧客を更新
update stripe.customers
set
  description='New description'
where id = 'cus_xxx';

-- 顧客を削除
delete from stripe.customers
where id = 'cus_xxx';
```

## 制限事項

このセクションでは、Stripeラッパーを使用する際の制限事項について説明します。

### リアルタイムデータなし

Stripe Wrapperはリアルタイムデータを提供しません。Stripe Webhookを使用して、Stripe内のイベントに応じてデータベースの変更をトリガーできます。詳細については、[Stripeのイベントリスニングガイド](https://docs.stripe.com/webhooks)を参照してください。

### APIバージョンの互換性

このラッパーは特定のStripe APIバージョンで動作します。将来のStripe APIの変更により、ラッパーの機能に影響を与える可能性があります。

