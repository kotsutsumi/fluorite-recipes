# オブジェクトのコピー

## オブジェクトのコピーと移動方法を学ぶ

### オブジェクトのコピー

バケット間または同じバケット内でオブジェクトをコピーできます。現在、APIを使用してコピーできるのは最大5GBまでのオブジェクトのみです。

オブジェクトのコピーを作成する場合、新しいオブジェクトの所有者はコピー操作を開始したユーザーになります。

#### 同じバケット内でのオブジェクトのコピー

同じバケット内でオブジェクトをコピーするには、`copy`メソッドを使用します:

```typescript
await supabase.storage.from('avatars').copy('public/avatar1.png', 'private/avatar2.png')
```

#### バケット間でのオブジェクトのコピー

バケット間でオブジェクトをコピーするには、`copy`メソッドを使用し、宛先バケットを指定します:

```typescript
await supabase.storage.from('avatars').copy('public/avatar1.png', 'private/avatar2.png', {
  destinationBucket: 'avatars2'
})
```

### オブジェクトの移動

バケット間または同じバケット内でオブジェクトを移動できます。現在、APIを使用して移動できるのは最大5GBまでのオブジェクトのみです。

オブジェクトを移動する場合、新しいオブジェクトの所有者は移動操作を開始したユーザーになります。オブジェクトが移動されると、元のオブジェクトは存在しなくなります。

#### 同じバケット内でのオブジェクトの移動

同じバケット内でオブジェクトを移動するには、`move`メソッドを使用します:

```typescript
const { data, error } = await supabase.storage
  .from('avatars')
  .move('public/avatar1.png', 'private/avatar2.png')
```

#### バケット間でのオブジェクトの移動

バケット間でオブジェクトを移動するには、`move`メソッドを使用し、宛先バケットを指定します:

```typescript
await supabase.storage.from('avatars').move('public/avatar1.png', 'private/avatar2.png', {
  destinationBucket: 'avatars2'
})
```

### 権限

ユーザーがオブジェクトを移動およびコピーするには、ソースオブジェクトに対する`select`権限と、宛先オブジェクトに対する`insert`権限が必要です。例:

```sql
create policy "User can select their own objects (in any buckets)"
on storage.objects
for select
to authenticated
using (
    owner_id = auth.uid()
);
```
