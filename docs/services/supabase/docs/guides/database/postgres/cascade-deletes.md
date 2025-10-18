# カスケード削除

## 概要

PostgreSQLの外部キー制約の削除には5つのオプションがあります:

### 1. CASCADE

親テーブルから行が削除されると、子テーブルの関連するすべての行も削除されます。

### 2. RESTRICT

親テーブルから行が削除されようとした際、子テーブルに関連する行がある場合、削除操作が中止されます。

### 3. SET NULL

親テーブルから行が削除されると、子テーブルの外部キー列の値がNULLに設定されます。

### 4. SET DEFAULT

親テーブルから行が削除されると、子テーブルの外部キー列の値がデフォルト値に設定されます。

### 5. NO ACTION

RESTRICTに似ていますが、トランザクションの終わりまで「遅延」させることができ、他のカスケード削除を先に実行できます。

## テーブル例

ドキュメントは3つのテーブルを使った例を提供しています:
- `grandparent`（祖父母）
- `parent`（親）
- `child`（子）

## 主な違い: RESTRICTとNO ACTION

### RESTRICT

- 参照される行が存在する場合、即座にエラーを発生させます
- 子参照を持つ親行の削除を防ぎます

### NO ACTION

- RESTRICTに似ています
- `INITIALLY DEFERRED`を使用して「遅延」させることができます
- より複雑なトランザクションレベルの制約処理を可能にします

## コード例

異なる削除動作で外部キー制約を設定する方法を示すSQL例:

```sql
alter table child_table
add constraint fk_parent foreign key (parent_id) references parent_table (id)
on delete cascade;
```

## 実用的な考慮事項

- オプションが指定されていない場合、`NO ACTION`がデフォルトの動作です
- 特定のデータ整合性要件に基づいて選択してください
- `INITIALLY DEFERRED`は、複雑なデータベースシナリオで柔軟性を提供します

このドキュメントは、PostgreSQLでカスケード削除戦略を理解および実装するための包括的なガイドを提供します。
