# 標準アップロード

Supabase Storageにファイルをアップロードする方法を学びます。

## アップロード

標準ファイルアップロード方式は、6MBを超えない小さなファイルに最適です。従来の`multipart/form-data`形式を使用し、supabase-js SDKを使用して簡単に実装できます。

> 標準アップロード方式を使用して最大5GBのファイルをアップロードできますが、信頼性を向上させるために、6MBを超えるファイルのアップロードにはTUSレジューム可能アップロードを使用することをお勧めします。

複数言語（JavaScript、Dart、Swift、Kotlin、Python）でのアップロード例:

```javascript
// Supabaseクライアントを作成
const supabase = createClient('your_project_url', 'your_supabase_api_key')

// 標準アップロードを使用してファイルをアップロード
async function uploadFile(file) {
  const { data, error } = await supabase.storage.from('bucket_name').upload('file_path', file)
  if (error) {
    // エラーを処理
  } else {
    // 成功を処理
  }
}
```

## ファイルの上書き

既に存在するパスにファイルをアップロードすると、デフォルトの動作では`400 Asset Already Exists`エラーが返されます。ファイルを上書きするには、`upsert`オプションを`true`に設定するか、`x-upsert`ヘッダーを使用します。

```javascript
await supabase.storage.from('bucket_name').upload('file_path', file, {
  upsert: true,
})
```

> Content Delivery Networkがすべてのエッジノードに変更を伝播するのに時間がかかり、古いコンテンツが表示される可能性があるため、可能な限りファイルの上書きは避けることをお勧めします。

## コンテンツタイプ

デフォルトでは、Storageはファイル拡張子からコンテンツタイプを推測します。カスタムコンテンツタイプを指定するには、アップロード時に`contentType`オプションを使用します:

```javascript
await supabase.storage.from('bucket_name').upload('file_path', file, {
  contentType: 'image/jpeg',
})
```

## 同時実行

複数のクライアントが同じパスにアップロードする場合:
- 最初にアップロードを完了したクライアントが成功します
- 他のクライアントは`400`エラーを受け取ります
