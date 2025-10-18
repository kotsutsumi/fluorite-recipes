# Redis

Redisは「永続性をオプションで備えた、分散インメモリキーバリューデータベース、キャッシュ、メッセージブローカーとして使用される、オープンソースのインメモリストレージ」です。Redis Wrapperを使用すると、PostgresデータベースからRedisのデータを読み取ることができます。

## 準備

### Wrappersを有効化

wrappers拡張をインストールします:

```sql
create extension if not exists wrappers with schema extensions;
```

### Redis Wrapperを有効化

```sql
create foreign data wrapper redis_wrapper
handler redis_fdw_handler
validator redis_fdw_validator;
```

### 認証情報を保存（オプション）

セキュアな認証情報保存のためにVaultの使用を推奨します:

```sql
select vault.create_secret(
  'redis://username:password@127.0.0.1:6379/db',
  'redis',
  'Redis connection URL for Wrappers'
);
```

注意: SSL/TLS接続の場合は、`rediss://`プロトコルを使用してください。

### Redisへの接続

認証情報を使用してサーバーを作成します:

```sql
create server redis_server
foreign data wrapper redis_wrapper
options (
  conn_url_id '<key_ID>' -- 上記で作成したKey ID
);
```

### スキーマの作成

```sql
create schema if not exists redis;
```

## オプション

### ソースタイプ

| ソースタイプ | 説明 |
|------------|-------------|
| list | 単一のリスト |
| set | 単一のセット |
| hash | 単一のハッシュ |
| zset | 単一のソート済みセット |
| stream | ストリーム |
| multi_list | 複数のリスト |
| multi_set | 複数のセット |
| multi_hash | 複数のハッシュ |
| multi_zset | 複数のソート済みセット |

### ソースキー

`src_key`には以下を指定できます:
- 単一タイプの場合: 正確なキー
- 複数タイプの場合: パターン（例: `list:*`）

## エンティティと操作

### サポートされているエンティティ

1. List（リスト）
2. Set（セット）
3. Hash（ハッシュ）
4. Sorted Set（ソート済みセット）
5. Stream（ストリーム）
6. Multiple Objects（パターンマッチングを使用した複数オブジェクト）

### 制限事項

- 読み取り専用アクセス
- 完全な結果セットを返します（部分的な結果セットのサポートなし）
- パターンマッチングは`multi_*`タイプでのみ使用可能

## 使用方法

### List（リスト）

単一のRedisリストからデータを読み取ります:

```sql
create foreign table redis.my_list (
  element text
)
server redis_server
options (
  src_type 'list',
  src_key 'my:list:key'
);

-- リストの全要素を取得
select * from redis.my_list;
```

### Set（セット）

単一のRedisセットからデータを読み取ります:

```sql
create foreign table redis.my_set (
  element text
)
server redis_server
options (
  src_type 'set',
  src_key 'my:set:key'
);

-- セットの全要素を取得
select * from redis.my_set;
```

### Hash（ハッシュ）

単一のRedisハッシュからデータを読み取ります:

```sql
create foreign table redis.my_hash (
  key text,
  value text
)
server redis_server
options (
  src_type 'hash',
  src_key 'my:hash:key'
);

-- ハッシュの全フィールドと値を取得
select * from redis.my_hash;

-- 特定のフィールドを取得
select value from redis.my_hash where key = 'username';
```

### Sorted Set（ソート済みセット）

単一のRedisソート済みセットからデータを読み取ります:

```sql
create foreign table redis.my_zset (
  element text,
  score numeric
)
server redis_server
options (
  src_type 'zset',
  src_key 'my:zset:key'
);

-- ソート済みセットの全要素とスコアを取得
select * from redis.my_zset order by score desc;

-- 特定のスコア範囲を取得
select element, score
from redis.my_zset
where score >= 10 and score <= 100;
```

### Stream（ストリーム）

Redisストリームからデータを読み取ります:

```sql
create foreign table redis.my_stream (
  id text,
  items jsonb
)
server redis_server
options (
  src_type 'stream',
  src_key 'my:stream:key'
);

-- ストリームの全エントリを取得
select * from redis.my_stream;

-- JSONBデータからフィールドを抽出
select
  id,
  items->>'field1' as field1,
  items->>'field2' as field2
from redis.my_stream;
```

### Multiple Lists（複数のリスト）

パターンマッチングを使用して複数のリストからデータを読み取ります:

```sql
create foreign table redis.all_user_lists (
  key text,
  items text[]
)
server redis_server
options (
  src_type 'multi_list',
  src_key 'user:*:items'
);

-- パターンにマッチするすべてのリストを取得
select * from redis.all_user_lists;

-- 特定のキーのリストを取得
select items from redis.all_user_lists where key = 'user:123:items';
```

### Multiple Hashes（複数のハッシュ）

パターンマッチングを使用して複数のハッシュからデータを読み取ります:

```sql
create foreign table redis.all_user_profiles (
  key text,
  fields jsonb
)
server redis_server
options (
  src_type 'multi_hash',
  src_key 'user:*:profile'
);

-- パターンにマッチするすべてのハッシュを取得
select * from redis.all_user_profiles;

-- JSONBデータからフィールドを抽出
select
  key,
  fields->>'name' as name,
  fields->>'email' as email,
  fields->>'age' as age
from redis.all_user_profiles;
```

### Multiple Sets（複数のセット）

```sql
create foreign table redis.all_tags (
  key text,
  members text[]
)
server redis_server
options (
  src_type 'multi_set',
  src_key 'tags:*'
);

-- すべてのタグセットを取得
select * from redis.all_tags;
```

### Multiple Sorted Sets（複数のソート済みセット）

```sql
create foreign table redis.all_leaderboards (
  key text,
  items jsonb
)
server redis_server
options (
  src_type 'multi_zset',
  src_key 'leaderboard:*'
);

-- すべてのリーダーボードを取得
select * from redis.all_leaderboards;

-- JSONBデータからスコアと要素を抽出
select
  key,
  jsonb_array_elements(items) as item
from redis.all_leaderboards;
```

## 外部テーブルオプション

| オプション | 必須 | 説明 | デフォルト |
|----------|------|------|----------|
| src_type | はい | Redisデータタイプ: `list`, `set`, `hash`, `zset`, `stream`, `multi_list`, `multi_set`, `multi_hash`, `multi_zset` | - |
| src_key | はい | Redisキーまたはパターン（`multi_*`タイプの場合） | - |

## 外部サーバーオプション

| オプション | 必須 | 説明 | デフォルト |
|----------|------|------|----------|
| conn_url_id | はい | VaultのRedis接続URL Key ID | - |

## データ型マッピング

| Redisデータ型 | Postgres列 | 説明 |
|--------------|-----------|------|
| List | element text | 各リスト要素 |
| Set | element text | 各セット要素 |
| Hash | key text, value text | ハッシュのフィールドと値 |
| Sorted Set | element text, score numeric | 要素とスコア |
| Stream | id text, items jsonb | ストリームIDとフィールド |
| Multi List | key text, items text[] | キーと要素配列 |
| Multi Set | key text, members text[] | キーとメンバー配列 |
| Multi Hash | key text, fields jsonb | キーとフィールドのJSON |
| Multi Sorted Set | key text, items jsonb | キーと要素/スコアのJSON |

## 例

### セッション管理

```sql
-- ユーザーセッションデータを保存（Redisハッシュ）
create foreign table redis.user_sessions (
  key text,
  value text
)
server redis_server
options (
  src_type 'hash',
  src_key 'session:abc123'
);

-- セッションデータを取得
select key, value from redis.user_sessions;

-- 特定のセッション値を取得
select value from redis.user_sessions where key = 'user_id';
```

### リアルタイムランキング

```sql
-- ゲームのリーダーボード
create foreign table redis.game_leaderboard (
  player text,
  score numeric
)
server redis_server
options (
  src_type 'zset',
  src_key 'game:leaderboard'
);

-- トップ10プレイヤーを取得
select player, score
from redis.game_leaderboard
order by score desc
limit 10;
```

### キャッシュデータの分析

```sql
-- すべてのキャッシュキーを分析
create foreign table redis.all_cache_keys (
  key text,
  fields jsonb
)
server redis_server
options (
  src_type 'multi_hash',
  src_key 'cache:*'
);

-- キャッシュ統計
select
  count(*) as total_cache_entries,
  avg(length(fields::text)) as avg_size
from redis.all_cache_keys;
```

### イベントストリーム処理

```sql
-- アプリケーションログストリーム
create foreign table redis.app_logs (
  id text,
  items jsonb
)
server redis_server
options (
  src_type 'stream',
  src_key 'logs:application'
);

-- エラーログを抽出
select
  id,
  items->>'timestamp' as timestamp,
  items->>'level' as level,
  items->>'message' as message
from redis.app_logs
where items->>'level' = 'ERROR'
order by id desc
limit 100;
```

### クロスデータベース分析

```sql
-- Redisキャッシュとローカルデータを組み合わせ
select
  u.id,
  u.username,
  s.value as session_data
from local_schema.users u
left join redis.user_sessions s on s.key = 'user_id' and s.value = u.id::text
where u.active = true;
```

### タグシステム

```sql
-- 複数のタグセットを分析
create foreign table redis.article_tags (
  key text,
  members text[]
)
server redis_server
options (
  src_type 'multi_set',
  src_key 'article:*:tags'
);

-- 人気のタグを集計
select
  unnest(members) as tag,
  count(*) as article_count
from redis.article_tags
group by tag
order by article_count desc
limit 20;
```

## パフォーマンスに関する考慮事項

1. **パターンマッチング**: `multi_*`タイプでワイルドカードパターンを使用すると、大規模なRedisインスタンスではパフォーマンスに影響する可能性があります。

2. **結果セットサイズ**: 大きなリスト、セット、またはストリームは、Postgresで処理する際にメモリを大量に消費する可能性があります。

3. **ネットワークレイテンシ**: Redis WrapperはRedisサーバーへのネットワーク呼び出しを行うため、ローカルPostgresクエリよりも遅くなります。

4. **接続プーリング**: 複数のクエリでRedis接続を再利用するように設定してください。

## トラブルシューティング

### 接続エラー

```sql
-- 接続をテスト
select * from redis.my_list limit 1;
```

接続エラーが発生する場合:
- Redis URLが正しいか確認
- Redisサーバーが稼働しているか確認
- ファイアウォール設定を確認
- SSL/TLS設定を確認（`rediss://`の場合）

### データ型エラー

Redisのデータ型と外部テーブルの`src_type`が一致していることを確認してください。

### パフォーマンスの問題

- より具体的なパターンを使用
- 結果を制限するためにWHERE句を使用
- 大きなデータセットの場合は、Redisで直接フィルタリングを検討
