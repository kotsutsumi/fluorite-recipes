# 配列の操作

## 概要

Postgresは柔軟な配列型をサポートしており、SupabaseダッシュボードおよびJavaScript APIでもサポートされています。

## 配列列を持つテーブルの作成

テキスト配列を持つテーブルを作成する手順:

1. ダッシュボードのテーブルエディタに移動
2. "arraytest"という名前の新しいテーブルを作成
3. 配列として定義されたtext型の"textarray"という列を追加

## 配列値を持つレコードの挿入

配列を挿入する方法:

### ダッシュボード
`["Harry", "Larry", "Moe"]`で行を挿入

### SQL
```sql
INSERT INTO arraytest (id, textarray)
VALUES (1, ARRAY['Harry', 'Larry', 'Moe']);
```

### JavaScript
JavaScriptおよび他のクライアントライブラリも同様の挿入メソッドを提供しています。

## 配列データのクエリ

- Postgresは1ベースのインデックスを使用します
- クエリの例:
```sql
SELECT textarray[1], array_length(textarray, 1) FROM arraytest;
```
- 最初の配列項目と配列の全長を返します

## リソース

- [Supabase JSクライアント](https://github.com/supabase/supabase-js)
- [Supabase ウェブサイト](https://supabase.com)
- [Postgres配列ドキュメント](https://www.postgresql.org/docs/15/arrays.html)

このドキュメントは、Supabaseプラットフォームを通じてPostgresで配列型を操作するための包括的なガイドを提供します。
