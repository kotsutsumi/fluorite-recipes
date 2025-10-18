# index_advisor: クエリ最適化

## 概要

index_advisorは、クエリのパフォーマンスを改善するためのインデックスを推奨するPostgres拡張機能です。

## 機能

- ジェネリックパラメータ（例：`$1`、`$2`）をサポート
- マテリアライズドビューをサポート
- ビューによって隠蔽されたテーブル/カラムを識別
- 重複したインデックスをスキップ

## インストール

```sql
create extension index_advisor;
```

## API

`index_advisor`関数は以下のシグネチャを持ちます：

```sql
index_advisor(query text)
returns table (
 startup_cost_before jsonb,
 startup_cost_after jsonb,
 total_cost_before jsonb,
 total_cost_after jsonb,
 index_statements text[],
 errors text[]
)
```

## 使用方法

### シンプルな例

```sql
create table book(
  id int primary key,
  title text not null
);

select * from index_advisor('select book.id from book where title = $1');
```

これにより、`title`カラムにインデックスを作成することが推奨されます。

### 複雑なクエリの例

```sql
create table author(id serial primary key, name text not null);
create table publisher(id serial primary key, name text not null, corporate_address text);
create table book(
    id serial primary key,
    author_id int not null references author(id),
    publisher_id int not null references publisher(id),
    title text
);
create table review(id serial primary key, book_id int references book(id), body text not null);

select * from index_advisor('
    select
        book.id,
        book.title,
        publisher.name as publisher_name,
        author.name as author_name,
        review.body review_body
    from
        book
        join publisher on book.publisher_id = publisher.id
        join author on book.author_id = author.id
        join review on book.id = review.book_id
    where
        author.id = $1
        and publisher.id = $2
');
```

これにより、複雑なクエリを最適化するための複数のインデックスが提案されます。

## 制限事項

- 単一カラムのB-treeインデックスのみを推奨
