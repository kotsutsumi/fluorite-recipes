# PGroonga: 多言語全文検索

## 概要

PGroongaは、Groongaをベースにした全文検索インデックス方式を追加するPostgres拡張機能です。Postgresはネイティブで全文インデックスをサポートしていますが、アルファベットと数字ベースの言語に限定されています。PGroongaは、日本語、中国語など、Postgresがサポートする言語のスーパーセットを含む、より広範な文字サポートを提供します。

## 拡張機能の有効化

### ダッシュボードを使用する方法
1. ダッシュボードのDatabaseページに移動
2. サイドバーの**Extensions**をクリック
3. `pgroonga`を検索して拡張機能を有効化

### SQLを使用する方法
```sql
-- "pgroonga"拡張機能を有効化
create extension pgroonga with schema extensions;

-- "pgroonga"拡張機能を無効化
drop extension if exists pgroonga;
```

## 全文検索インデックスの作成

テキストカラムを持つテーブルを作成：
```sql
create table memos (
 id serial primary key,
 content text
);
```

PGroongaインデックスを作成：
```sql
create index ix_memos_content ON memos USING pgroonga(content);
```

## 全文検索の例

### 基本的な検索
```sql
select * from memos where content &@~ 'groonga';
```

### すべての検索語にマッチ
```sql
select * from memos where content &@~ 'postgres pgroonga';
```

### いずれかの検索語にマッチ
```sql
select * from memos where content &@~ 'postgres OR pgroonga';
```

### 否定を含む検索
```sql
select * from memos where content &@~ 'postgres -pgroonga';
```

## リソース
- [PGroonga公式ドキュメント](https://pgroonga.github.io/tutorial/)
