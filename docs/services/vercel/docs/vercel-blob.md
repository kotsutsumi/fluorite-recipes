# Vercel Blob

## 概要

Vercel Blobは、すべてのプランで利用可能なストレージサービスで、[所有者、メンバー、開発者](/docs/rbac/access-roles#owner, member, developer-role)ロールを持つユーザーがアクセスできます。

## ユースケース

Vercel Blobは、以下のようなファイル保存に最適です：

- ビルド時に生成されるアバター、スクリーンショット、カバー画像、動画などのファイル
- グローバルネットワークを活用できる大容量の動画や音声ファイル
- 通常Amazon S3などの外部ストレージに保存するファイル

## 使用例

```javascript
import { put } from '@vercel/blob';

const blob = await put('avatar.jpg', imageFile, {
  access: 'public',
});
```

## 主な特徴

- 19のリージョンから選択可能
- チームやプロジェクトに接続可能
- 公開可能なBlobのURL
- アップロードや削除にはトークンが必要

## キャッシング

- ブラウザとVercelの両方でキャッシュ
- デフォルトで最大1か月間キャッシュ
- 最大512 MBのBlobをキャッシュ可能

## 操作の種類

### シンプル操作

- メタデータ取得
- キャッシュミス時のBlobアクセス

### 高度な操作

- Blobのアップロード
- Blobのコピー
- Blobのリスト表示

## ストレージ計算

- 15分ごとにスナップショットを取得
- 月間平均使用量で課金

## 関連リンク

- [サーバーアップロード](/docs/vercel-blob/server-upload)
- [クライアントアップロード](/docs/vercel-blob/client-upload)
- [Blob SDK の使用](/docs/vercel-blob/using-blob-sdk)
- [使用量と料金](/docs/vercel-blob/usage-and-pricing)
- [セキュリティ](/docs/vercel-blob/security)
- [例](/docs/vercel-blob/examples)
