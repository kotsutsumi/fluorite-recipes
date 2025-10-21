# バケットの作成

複数の方法でバケットを作成できます:
- Supabaseダッシュボード
- SQL
- クライアントライブラリ（JavaScript、Dart、Swift、Python）

## バケットの作成

JavaScriptで「avatars」バケットを作成する例:

```javascript
const { data, error } = await supabase.storage.createBucket('avatars', {
  public: true, // default: false
})
```

## アップロードの制限

バケットを作成する際に、ファイルタイプとサイズを制限するための設定を追加できます:

```javascript
const { data, error } = await supabase.storage.createBucket('avatars', {
  public: true,
  allowedMimeTypes: ['image/*'],
  fileSizeLimit: '1MB',
})
```

重要なポイント:
- `allowedMimeTypes`はファイルタイプを制限します
- `fileSizeLimit`は最大ファイルサイズを設定します
- 制限を満たさないアップロードは拒否されます

詳細については、[ファイル制限のドキュメント](/docs/guides/storage/uploads/file-limits)を参照してください。

ドキュメントでは、複数の言語での例を提供し、さまざまな制限を持つストレージバケットの作成と設定方法を説明しています。
