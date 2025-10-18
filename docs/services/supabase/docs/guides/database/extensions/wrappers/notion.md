# Notion

「Notionは、データ管理のための汎用性の高いすぐに使えるソリューションを提供します。」Notion Wrapperは、PostgresデータベースからNotionワークスペースのデータを読み取ることができるWebAssembly（Wasm）外部データラッパーです。

## 利用可能なバージョン

| バージョン | Wasmパッケージ URL | チェックサム | 必要なWrappersバージョン |
|---------|-----------------|----------|---------------------------|
| 0.2.0 | `https://github.com/supabase/wrappers/releases/download/wasm_notion_fdw_v0.2.0/notion_fdw.wasm` | `719910b65a049f1d9b82dc4f5f1466457582bec855e1e487d5c3cc1e6f986dc6` | >=0.5.0 |
| 0.1.1 | `https://github.com/supabase/wrappers/releases/download/wasm_notion_fdw_v0.1.1/notion_fdw.wasm` | `6dea3014f462aafd0c051c37d163fe326e7650c26a7eb5d8017a30634b5a46de` | >=0.4.0 |
| 0.1.0 | `https://github.com/supabase/wrappers/releases/download/wasm_notion_fdw_v0.1.0/notion_fdw.wasm` | `e017263d1fc3427cc1df8071d1182cdc9e2f00363344dddb8c195c5d398a2099` | >=0.4.0 |

## 準備

### Wrappersを有効化

```sql
create extension if not exists wrappers with schema extensions;
```

### Notion Wrapperを有効化

```sql
create foreign data wrapper wasm_wrapper
handler wasm_fdw_handler
validator wasm_fdw_validator;
```

### 認証情報を保存（オプション）

セキュアな認証情報保存のためにVaultの使用を推奨します:

```sql
-- Notion APIキーを保存
select vault.create_secret(
  'your_notion_api_key',
  'notion_api_key',
  'Notion API key for Wrappers'
);
```

Notion APIキーの取得方法:
1. [Notion Developers](https://www.notion.so/my-integrations)にアクセス
2. 新しいインテグレーションを作成
3. Internal Integration Tokenをコピー

### Notionサーバーへの接続

Wasmパッケージを使用してサーバーを作成します:

```sql
create server notion_server
foreign data wrapper wasm_wrapper
options (
  fdw_package_url 'https://github.com/supabase/wrappers/releases/download/wasm_notion_fdw_v0.2.0/notion_fdw.wasm',
  fdw_package_name 'supabase:notion-fdw',
  fdw_package_version '0.2.0',
  fdw_package_checksum '719910b65a049f1d9b82dc4f5f1466457582bec855e1e487d5c3cc1e6f986dc6',
  api_key_id '<key_ID>' -- 上記で作成したKey ID
);
```

### スキーマの作成

```sql
create schema if not exists notion;
```

## 使用方法

### 外部テーブルの作成

Notionデータベースを外部テーブルとしてマッピングします:

```sql
create foreign table notion.my_database (
  id text,
  title text,
  status text,
  created_time timestamp,
  last_edited_time timestamp,
  attrs jsonb
)
server notion_server
options (
  object 'database',
  database_id 'your_database_id'
);
```

NotionデータベースIDの取得方法:
1. Notionでデータベースページを開く
2. URLから32文字のIDをコピー（例: `https://www.notion.so/myworkspace/a8aec43384f447ed84390e8e42c2e089?v=...`の`a8aec43384f447ed84390e8e42c2e089`）

### Notionページのクエリ

Notionページを外部テーブルとしてマッピング:

```sql
create foreign table notion.my_page (
  id text,
  title text,
  content jsonb,
  created_time timestamp,
  last_edited_time timestamp
)
server notion_server
options (
  object 'page',
  page_id 'your_page_id'
);
```

### クエリの実行

```sql
-- データベースから全レコードを取得
select * from notion.my_database;

-- 特定のステータスでフィルタリング
select title, status, created_time
from notion.my_database
where status = 'In Progress';

-- ページコンテンツを取得
select title, content
from notion.my_page;
```

## オプション

### 外部テーブルオプション

| オプション | 必須 | 説明 | デフォルト |
|----------|------|------|----------|
| object | はい | オブジェクトタイプ: `database`または`page` | - |
| database_id | 条件付き | Notionデータベースの32文字ID（objectがdatabaseの場合） | - |
| page_id | 条件付き | Notionページの32文字ID（objectがpageの場合） | - |

### 外部サーバーオプション

| オプション | 必須 | 説明 | デフォルト |
|----------|------|------|----------|
| fdw_package_url | はい | WasmパッケージのURL | - |
| fdw_package_name | はい | Wasmパッケージ名 | - |
| fdw_package_version | はい | Wasmパッケージバージョン | - |
| fdw_package_checksum | はい | Wasmパッケージのチェックサム | - |
| api_key_id | はい | VaultのAPIキーID | - |

## サポートされているデータ型

Notionのプロパティは以下のPostgresデータ型にマッピングされます:

| Notionプロパティ | Postgresデータ型 | 説明 |
|-----------------|----------------|------|
| Title | text | タイトルテキスト |
| Rich Text | text | リッチテキストコンテンツ |
| Number | numeric | 数値 |
| Select | text | 選択オプション |
| Multi-select | text[] | 複数選択オプション |
| Date | timestamp | 日付/日時 |
| People | text[] | ユーザーID配列 |
| Files | text[] | ファイルURL配列 |
| Checkbox | boolean | チェックボックス値 |
| URL | text | URL |
| Email | text | メールアドレス |
| Phone | text | 電話番号 |
| Created time | timestamp | 作成日時 |
| Last edited time | timestamp | 最終編集日時 |

### JSONB列

すべてのプロパティを含む完全なレスポンスを取得するには、`attrs`列（jsonb型）を使用します:

```sql
create foreign table notion.my_database (
  id text,
  title text,
  attrs jsonb  -- すべてのプロパティを含む
)
server notion_server
options (
  object 'database',
  database_id 'your_database_id'
);

-- JSONBデータからプロパティを抽出
select
  title,
  attrs->'properties'->'Status'->>'name' as status,
  attrs->'properties'->'Priority'->>'name' as priority
from notion.my_database;
```

## 制限事項

- 読み取り専用アクセス（SELECT操作のみ）
- Notion APIレート制限が適用されます（1秒あたり3リクエスト）
- 大きなデータベースの場合、パフォーマンスが制限される可能性があります
- 一部の複雑なNotionプロパティタイプは完全にサポートされていない場合があります

## 例

### タスク管理データベース

```sql
-- Notionタスクデータベースをマッピング
create foreign table notion.tasks (
  id text,
  name text,
  status text,
  priority text,
  due_date timestamp,
  assignee text,
  attrs jsonb
)
server notion_server
options (
  object 'database',
  database_id 'abc123...'
);

-- 今週の高優先度タスクを取得
select name, status, due_date, assignee
from notion.tasks
where priority = 'High'
  and due_date >= current_date
  and due_date < current_date + interval '7 days'
order by due_date;
```

### ナレッジベース

```sql
-- Notionナレッジベースページをマッピング
create foreign table notion.kb_articles (
  id text,
  title text,
  category text,
  content jsonb,
  last_edited_time timestamp
)
server notion_server
options (
  object 'database',
  database_id 'xyz789...'
);

-- 最近更新された記事を取得
select title, category, last_edited_time
from notion.kb_articles
where last_edited_time > current_date - interval '30 days'
order by last_edited_time desc;
```

### クロスプラットフォーム集計

```sql
-- Notionデータとローカルデータを組み合わせ
select
  u.name as user_name,
  count(t.id) as task_count,
  count(case when t.status = 'Done' then 1 end) as completed_tasks
from local_schema.users u
left join notion.tasks t on t.assignee = u.notion_id
group by u.name
order by task_count desc;
```
