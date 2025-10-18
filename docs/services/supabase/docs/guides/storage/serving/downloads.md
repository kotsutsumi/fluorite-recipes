# Storageからのアセット配信

## パブリックバケット

[Buckets Fundamentals](/docs/guides/storage/buckets/fundamentals)で述べたように、パブリックバケットにアップロードされたすべてのファイルは公開アクセス可能で、高いCDNキャッシュHIT率の恩恵を受けます。

次の従来のURLを使用してアクセスできます:
```
https://[project_id].supabase.co/storage/v1/object/public/[bucket]/[asset-name]
```

Supabase SDKの`getPublicUrl`を使用してこのURLを生成することもできます:

```javascript
const { data } = supabase.storage.from('bucket').getPublicUrl('filePath.jpg')
console.log(data.publicUrl)
```

### ダウンロード

ブラウザでアセットの自動ダウンロードを開始したい場合は、`?download`クエリ文字列パラメータを追加します。

デフォルトでは、アセット名を使用してファイルを保存します。カスタム名を渡すこともできます:
```
?download=customname.jpg
```

## プライベートバケット

非パブリックバケットに保存されたアセットはプライベートとみなされ、パブリックURL経由ではアクセスできません。

以下の方法でのみアクセスできます:
- サーバー上で期限付きURLに署名する（例: Edge Functionsを使用）
- ユーザーのAuthorizationヘッダーを付けて`https://[project_id].supabase.co/storage/v1/object/authenticated/[bucket]/[asset-name]`にGETリクエストを行う

### URLの署名

`createSignedUrl`メソッドを使用して、ユーザーと共有するための期限付きURLを作成できます:

```javascript
const { data, error } = await supabase.storage
  .from('bucket')
  .createSignedUrl('private-document.pdf', 3600)

if (data) {
  console.log(data.signedUrl)
}
```
