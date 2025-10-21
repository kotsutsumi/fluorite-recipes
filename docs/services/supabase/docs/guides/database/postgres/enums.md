# Postgresでの列挙型（Enum）の管理

## 概要

Postgresの列挙型（Enum）は、列に対して固定値のセットを定義できるカスタムデータ型です。限定された安定した値のセットがある場合に便利です。

## 列挙型の作成

列挙型を作成する例:

```sql
create type mood as enum (
  'happy',
  'sad',
  'excited',
  'calm'
);
```

## 列挙型を使用する場合

### 利点

- **パフォーマンス**: ルックアップテーブルを使用する代わりに、単一のテーブルをクエリ
- **シンプルさ**: SQLの読み書きが簡単

### 欠点

- **柔軟性の制限**: 値の変更にはスキーママイグレーションが必要
- **メンテナンスのオーバーヘッド**: 頻繁に変更される要件の修正が困難

## テーブルでの列挙型の使用

### 列挙型を持つテーブルの作成

```sql
create table person (
  id serial primary key,
  name text,
  current_mood mood
);
```

### データの挿入

```sql
insert into person
  (name, current_mood)
values
  ('Alice', 'happy');
```

### データのクエリ

```sql
select * from person
where current_mood = 'sad';
```

## 列挙型の管理

### 列挙型の値の更新

```sql
update person
set current_mood = 'excited'
where name = 'Alice';
```

### 列挙型の値の追加

```sql
alter type mood add value 'content';
```

### 列挙型の値の削除

警告: 列挙型の値を削除することは安全ではなく、推奨されません。既存の値はそのまま残しておくのが最善です。

## リソース

- [公式Postgresドキュメント: 列挙型](https://www.postgresql.org/docs/current/datatype-enum.html)
