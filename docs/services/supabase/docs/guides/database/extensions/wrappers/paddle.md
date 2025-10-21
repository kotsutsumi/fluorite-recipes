# Paddle

「Paddleは、世界中の数千のソフトウェア企業に決済インフラストラクチャを提供するマーチャント・オブ・レコードとして機能します。」Paddle Wrapperは、PostgresデータベースからPaddleデータの読み取りと書き込みを可能にするWebAssembly（Wasm）外部データラッパーです。

## 利用可能なバージョン

| バージョン | Wasmパッケージ URL | チェックサム | 必要なWrappersバージョン |
|---------|-----------------|----------|---------------------------|
| 0.2.0 | `https://github.com/supabase/wrappers/releases/download/wasm_paddle_fdw_v0.2.0/paddle_fdw.wasm` | `e788b29ae46c158643e1e1f229d94b28a9af8edbd3233f59c5a79053c25da213` | >=0.5.0 |
| 0.1.1 | `https://github.com/supabase/wrappers/releases/download/wasm_paddle_fdw_v0.1.1/paddle_fdw.wasm` | `c5ac70bb2eef33693787b7d4efce9a83cde8d4fa40889d2037403a51263ba657` | >=0.4.0 |
| 0.1.0 | `https://github.com/supabase/wrappers/releases/download/wasm_paddle_fdw_v0.1.0/paddle_fdw.wasm` | `7d0b902440ac2ef1af85d09807145247f14d1d8fd4d700227e5a4d84c8145409` | >=0.4.0 |

## 準備

### Wrappersを有効化

```sql
create extension if not exists wrappers with schema extensions;
```

### Paddle Wrapperを有効化

```sql
create foreign data wrapper wasm_wrapper
handler wasm_fdw_handler
validator wasm_fdw_validator;
```

### 認証情報を保存（オプション）

セキュアな認証情報保存のためにVaultの使用を推奨します:

```sql
-- Paddle APIキーを保存
select vault.create_secret(
  'your_paddle_api_key',
  'paddle_api_key',
  'Paddle API key for Wrappers'
);
```

Paddle APIキーの取得方法:
1. [Paddle Dashboard](https://vendors.paddle.com/)にログイン
2. Developer Tools → Authentication に移動
3. API Keyを作成またはコピー

### Paddleサーバーへの接続

Wasmパッケージを使用してサーバーを作成します:

```sql
create server paddle_server
foreign data wrapper wasm_wrapper
options (
  fdw_package_url 'https://github.com/supabase/wrappers/releases/download/wasm_paddle_fdw_v0.2.0/paddle_fdw.wasm',
  fdw_package_name 'supabase:paddle-fdw',
  fdw_package_version '0.2.0',
  fdw_package_checksum 'e788b29ae46c158643e1e1f229d94b28a9af8edbd3233f59c5a79053c25da213',
  api_key_id '<key_ID>', -- 上記で作成したKey ID
  api_url 'https://api.paddle.com' -- sandboxの場合は https://sandbox-api.paddle.com
);
```

### スキーマの作成

```sql
create schema if not exists paddle;
```

## 使用方法

### サポートされているエンティティ

Paddle Wrapperは以下のPaddleエンティティをサポートしています:

- Products（商品）
- Prices（価格）
- Customers（顧客）
- Subscriptions（サブスクリプション）
- Transactions（トランザクション）
- Invoices（請求書）

### 外部テーブルの作成

#### Products（商品）

```sql
create foreign table paddle.products (
  id text,
  name text,
  description text,
  tax_category text,
  status text,
  created_at timestamp,
  updated_at timestamp,
  attrs jsonb
)
server paddle_server
options (
  object 'products'
);
```

#### Prices（価格）

```sql
create foreign table paddle.prices (
  id text,
  product_id text,
  description text,
  unit_price jsonb,
  billing_cycle jsonb,
  status text,
  created_at timestamp,
  updated_at timestamp,
  attrs jsonb
)
server paddle_server
options (
  object 'prices'
);
```

#### Customers（顧客）

```sql
create foreign table paddle.customers (
  id text,
  email text,
  name text,
  status text,
  created_at timestamp,
  updated_at timestamp,
  attrs jsonb
)
server paddle_server
options (
  object 'customers'
);
```

#### Subscriptions（サブスクリプション）

```sql
create foreign table paddle.subscriptions (
  id text,
  customer_id text,
  status text,
  current_billing_period jsonb,
  billing_cycle jsonb,
  scheduled_change jsonb,
  created_at timestamp,
  updated_at timestamp,
  attrs jsonb
)
server paddle_server
options (
  object 'subscriptions'
);
```

#### Transactions（トランザクション）

```sql
create foreign table paddle.transactions (
  id text,
  customer_id text,
  status text,
  origin text,
  currency_code text,
  billing_period jsonb,
  created_at timestamp,
  updated_at timestamp,
  attrs jsonb
)
server paddle_server
options (
  object 'transactions'
);
```

#### Invoices（請求書）

```sql
create foreign table paddle.invoices (
  id text,
  number text,
  status text,
  currency_code text,
  created_at timestamp,
  updated_at timestamp,
  attrs jsonb
)
server paddle_server
options (
  object 'invoices'
);
```

### クエリの実行

```sql
-- すべての商品を取得
select * from paddle.products;

-- アクティブなサブスクリプションを取得
select id, customer_id, status, created_at
from paddle.subscriptions
where status = 'active';

-- 特定の顧客のトランザクションを取得
select id, status, currency_code, created_at
from paddle.transactions
where customer_id = 'ctm_01h...';

-- 商品と価格をJOIN
select
  p.name as product_name,
  pr.description as price_description,
  pr.unit_price->>'amount' as amount,
  pr.unit_price->>'currency_code' as currency
from paddle.products p
join paddle.prices pr on pr.product_id = p.id
where p.status = 'active';
```

## オプション

### 外部テーブルオプション

| オプション | 必須 | 説明 | デフォルト |
|----------|------|------|----------|
| object | はい | Paddleオブジェクトタイプ: `products`, `prices`, `customers`, `subscriptions`, `transactions`, `invoices` | - |

### 外部サーバーオプション

| オプション | 必須 | 説明 | デフォルト |
|----------|------|------|----------|
| fdw_package_url | はい | WasmパッケージのURL | - |
| fdw_package_name | はい | Wasmパッケージ名 | - |
| fdw_package_version | はい | Wasmパッケージバージョン | - |
| fdw_package_checksum | はい | Wasmパッケージのチェックサム | - |
| api_key_id | はい | VaultのAPIキーID | - |
| api_url | はい | Paddle API URL（本番またはsandbox） | - |

## サポートされているデータ型

Paddleのフィールドは以下のPostgresデータ型にマッピングされます:

| Paddleフィールド | Postgresデータ型 | 説明 |
|-----------------|----------------|------|
| id | text | エンティティID |
| email | text | メールアドレス |
| name | text | 名前 |
| description | text | 説明 |
| status | text | ステータス |
| currency_code | text | 通貨コード（ISO 4217） |
| created_at | timestamp | 作成日時 |
| updated_at | timestamp | 更新日時 |
| unit_price | jsonb | 価格情報（金額、通貨など） |
| billing_cycle | jsonb | 請求サイクル情報 |
| current_billing_period | jsonb | 現在の請求期間 |
| attrs | jsonb | 完全なレスポンスデータ |

### JSONB列の活用

`attrs`列を使用して、すべてのフィールドにアクセスできます:

```sql
-- カスタムデータフィールドを抽出
select
  id,
  name,
  attrs->'custom_data'->>'user_id' as user_id,
  attrs->'custom_data'->>'plan_type' as plan_type
from paddle.customers;

-- 価格詳細を抽出
select
  id,
  description,
  attrs->'unit_price'->>'amount' as amount,
  attrs->'unit_price'->>'currency_code' as currency,
  attrs->'billing_cycle'->>'interval' as interval,
  attrs->'billing_cycle'->>'frequency' as frequency
from paddle.prices;
```

## 制限事項

- 読み取り専用アクセス（SELECT操作のみ）
- Paddle APIレート制限が適用されます
- 大量のデータを取得する場合、パフォーマンスが制限される可能性があります
- 一部の複雑なネストされたデータは`jsonb`列を使用してアクセスする必要があります

## 例

### 収益分析

```sql
-- 月別収益レポート
select
  date_trunc('month', created_at) as month,
  currency_code,
  count(*) as transaction_count,
  sum((attrs->'details'->'totals'->>'total')::numeric) as total_revenue
from paddle.transactions
where status = 'completed'
  and created_at >= current_date - interval '12 months'
group by month, currency_code
order by month desc, currency_code;
```

### サブスクリプション分析

```sql
-- アクティブサブスクリプションのステータス別集計
select
  status,
  count(*) as count,
  count(*) * 100.0 / sum(count(*)) over () as percentage
from paddle.subscriptions
group by status
order by count desc;

-- チャーンリスク分析（キャンセル予定のサブスクリプション）
select
  s.id,
  c.email,
  s.status,
  s.scheduled_change->>'action' as scheduled_action,
  s.scheduled_change->>'effective_at' as change_date
from paddle.subscriptions s
join paddle.customers c on c.id = s.customer_id
where s.scheduled_change->>'action' = 'cancel';
```

### 顧客ライフタイムバリュー（LTV）

```sql
-- 顧客別の総支払額
select
  c.id,
  c.email,
  c.name,
  count(t.id) as transaction_count,
  sum((t.attrs->'details'->'totals'->>'total')::numeric) as lifetime_value,
  min(t.created_at) as first_transaction,
  max(t.created_at) as last_transaction
from paddle.customers c
left join paddle.transactions t on t.customer_id = c.id and t.status = 'completed'
group by c.id, c.email, c.name
having count(t.id) > 0
order by lifetime_value desc
limit 100;
```

### 製品パフォーマンス

```sql
-- 製品別の売上
select
  p.name as product_name,
  count(distinct s.id) as active_subscriptions,
  count(distinct t.id) as total_transactions,
  sum((t.attrs->'details'->'totals'->>'total')::numeric) as total_revenue
from paddle.products p
left join paddle.prices pr on pr.product_id = p.id
left join paddle.subscriptions s on s.attrs->'items'->0->>'price_id' = pr.id
left join paddle.transactions t on t.attrs->'items'->0->>'price_id' = pr.id and t.status = 'completed'
where p.status = 'active'
group by p.id, p.name
order by total_revenue desc;
```

### ローカルデータとの統合

```sql
-- Paddleサブスクリプションとローカルユーザーデータを統合
select
  u.id as user_id,
  u.username,
  c.email as paddle_email,
  s.status as subscription_status,
  s.current_billing_period->>'starts_at' as period_start,
  s.current_billing_period->>'ends_at' as period_end
from local_schema.users u
left join paddle.customers c on c.email = u.email
left join paddle.subscriptions s on s.customer_id = c.id
where u.account_type = 'premium';
```
