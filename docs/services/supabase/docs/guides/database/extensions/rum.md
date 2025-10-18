# RUM: 全文検索のための改良版転置インデックス

## 概要

RUMは、標準的なGINインデックスを拡張したPostgreSQL拡張機能です。レキセムの位置情報やタイムスタンプなど、エントリごとの追加情報をポスティングツリーに保存します。

## 主な機能

以下の場合に、より高速なインデックスオンリースキャンを実現：
- フレーズ検索
- テキスト距離によるランキングを伴うテキスト検索
- 非インデックス列（タイムスタンプなど）による並び替えを伴うテキスト選択

## 最適な使用ケース

RUMは、「可能なキーが高度に繰り返し可能な場合」に最適に機能します。つまり、限られた単語セットで構成されるテキストに対して、単語の組み合わせやフレーズの効率的な検索を可能にします。

## サポートされている並び替え演算子

- `tsvector <=> tsquery`: テキストベクトルとクエリ間の距離
- `timestamp`、`int2`、`float4`、`money`、`oid` などの型の距離計算をサポート

## インストール

### 拡張機能の有効化

1. SupabaseダッシュボードのDatabaseページに移動
2. 「Extensions」をクリック
3. 「rum」を検索して有効化

### SQLでの有効化

```sql
create extension rum with schema extensions;
```

## 使用例

### テキストベクトルのインデックス作成

```sql
CREATE TABLE test_rum(t text, a tsvector);
CREATE TRIGGER tsvectorupdate
BEFORE UPDATE OR INSERT ON test_rum
FOR EACH ROW EXECUTE PROCEDURE tsvector_update_trigger('a', 'pg_catalog.english', 't');
```

### ランキングを使用した検索

```sql
SELECT t, a <=> to_tsquery('english', 'beautiful | place') AS rank
FROM test_rum
WHERE a @@ to_tsquery('english', 'beautiful | place')
ORDER BY a <=> to_tsquery('english', 'beautiful | place');
```

## 制限事項

- GINインデックスと比較してビルドと挿入時間が遅い
- 追加の属性が保存されるため、インデックスサイズが大きくなる
- 汎用WALレコードを使用

## リソース

- [公式RUMドキュメント](https://github.com/postgrespro/rum)
