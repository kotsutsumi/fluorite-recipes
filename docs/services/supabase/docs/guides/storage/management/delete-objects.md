# オブジェクトの削除

## オブジェクトの削除について学ぶ

バケットから1つ以上のオブジェクトを削除すると、ファイルは完全に削除され、復元できません。単一のオブジェクトまたは複数のオブジェクトを一度に削除できます。

> オブジェクトの削除は常に**Storage API**を介して行う必要があり、**SQLクエリ**を介して行うべきではありません。SQLクエリを介してオブジェクトを削除すると、バケットからオブジェクトが削除されず、オブジェクトが孤立した状態になります。

## オブジェクトの削除

1つ以上のオブジェクトを削除するには、`remove`メソッドを使用します:

```typescript
await supabase.storage.from('bucket').remove(['object-path-2', 'folder/avatar2.png'])
```

> オブジェクトを削除する場合、`remove`メソッドを使用して一度に削除できるオブジェクトは最大1000個です。

## RLS（Row Level Security）

オブジェクトを削除するには、ユーザーはそのオブジェクトに対する`delete`権限を持っている必要があります。例:

```sql
create policy "User can delete their own objects"
on storage.objects
for delete
TO authenticated
USING (
    owner = (select auth.uid()::text)
);
```
