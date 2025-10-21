# Smart CDN

## 概要

Smart CDNは、高度なキャッシング機能を提供するSupabase Storageの機能です:

- アセットメタデータがエッジに同期されます
- アセットが変更または削除されたときにキャッシュを自動的に再検証
- オリジンサーバーをシールドすることでより高いキャッシュヒット率を実現

## 主な機能

### 利用可能性
「Smart CDNキャッシングはProプラン以上で自動的に有効になります。」

### キャッシュ期間
- アセットはCDN上で「できるだけ長く」キャッシュされます
- ブラウザキャッシュの期間は`cacheControl`オプションで制御できます
- 署名付きURLを含むすべてのストレージ操作で動作します

### キャッシュの無効化
- ファイルが更新/削除されるとCDNキャッシュが自動的に無効化されます
- データセンター全体に伝播するまでに「最大60秒」かかる場合があります

## キャッシュ管理戦略

### 頻繁に更新されるアセットの処理
「頻繁に更新されるアセットがある場合は、新しいアセットを異なるパスにアップロードすることをお勧めします。」

### 古いキャッシュの防止
- `cacheControl`を使用してブラウザのTTLを短く設定
- デフォルトのTTLは通常1時間です

### キャッシュのバイパス
URLに一意のクエリ文字列を追加することでキャッシュをバイパスできます:

例:
```
/storage/v1/object/sign/profile-pictures/cat.jpg?version=1
/storage/v1/object/sign/profile-pictures/cat.jpg?version=2
```

CDNは新しいクエリ文字列を認識し、オリジンから更新されたバージョンを取得します。

## Smart CDNの使用例

### ファイルアップロード時のキャッシュ制御

```javascript
const { data, error } = await supabase.storage
  .from('avatars')
  .upload('user1.png', file, {
    cacheControl: '3600', // 1時間
    upsert: false
  });
```

### 異なるキャッシュ戦略

```javascript
// 長期キャッシュ - 静的アセット用
await supabase.storage
  .from('public-assets')
  .upload('logo.png', file, {
    cacheControl: '31536000' // 1年
  });

// 短期キャッシュ - 頻繁に更新されるコンテンツ用
await supabase.storage
  .from('news-images')
  .upload('headline.jpg', file, {
    cacheControl: '300' // 5分
  });

// キャッシュなし - 常に最新のコンテンツを取得
await supabase.storage
  .from('dynamic-content')
  .upload('live-feed.json', file, {
    cacheControl: 'no-cache'
  });
```

### バージョン管理されたURL

```javascript
// バージョン番号を使用してキャッシュをバイパス
const version = Date.now();
const { data } = await supabase.storage
  .from('images')
  .createSignedUrl(`profile.jpg?v=${version}`, 60);
```

## ベストプラクティス

### 静的コンテンツ

- 長いキャッシュTTLを設定(例: 1年)
- バージョン管理されたファイル名を使用(例: `logo-v2.png`)
- CDNキャッシュを最大限に活用

```javascript
await supabase.storage
  .from('static')
  .upload('style-v1.2.3.css', file, {
    cacheControl: '31536000', // 1年
    contentType: 'text/css'
  });
```

### 動的コンテンツ

- 短いキャッシュTTLを設定(例: 5-15分)
- 更新時にキャッシュ無効化を使用
- クエリパラメータでバージョン管理

```javascript
await supabase.storage
  .from('dynamic')
  .upload('news-feed.json', file, {
    cacheControl: '300', // 5分
    upsert: true
  });
```

### ユーザー生成コンテンツ

- 中程度のキャッシュTTL(例: 1時間)
- 更新時に新しいパスを検討
- コンテンツタイプを適切に設定

```javascript
await supabase.storage
  .from('user-uploads')
  .upload(`${userId}/avatar-${Date.now()}.jpg`, file, {
    cacheControl: '3600', // 1時間
    contentType: 'image/jpeg'
  });
```

## キャッシュ無効化の理解

### 自動無効化

Smart CDNは以下の場合に自動的にキャッシュを無効化します:
- ファイルが更新された場合
- ファイルが削除された場合
- ファイルメタデータが変更された場合

### 伝播時間

- キャッシュ無効化は最大60秒かかります
- グローバル展開には時間がかかる場合があります
- 重要な更新には手動バージョン管理を検討

### 手動キャッシュバスト

```javascript
// クエリパラメータによるバージョン管理
const timestamp = Date.now();
const url = `${baseUrl}/image.jpg?v=${timestamp}`;

// またはファイル名にバージョンを含める
const fileName = `image-${version}.jpg`;
await supabase.storage.from('bucket').upload(fileName, file);
```

## パフォーマンスの最適化

### オリジンシールド

Smart CDNはオリジンシールドを使用して:
- オリジンサーバーへのリクエストを削減
- キャッシュヒット率を向上
- バックエンドの負荷を軽減

### エッジ同期

- メタデータがCDNエッジに同期されます
- より高速な応答時間
- オリジンへのラウンドトリップを削減

### グローバル配信

- 世界中のエッジロケーション
- 自動ルーティングで最も近いエッジへ
- 低レイテンシのコンテンツ配信

## トラブルシューティング

### キャッシュが更新されない

1. 60秒待って伝播を確認
2. クエリパラメータでキャッシュをバスト
3. ブラウザキャッシュをクリア
4. 異なるパスに新しいファイルをアップロード

### 予期しないキャッシュ動作

1. `cacheControl`設定を確認
2. `cf-cache-status`ヘッダーを確認
3. ファイルパスが正しいことを確認
4. プランがProプラン以上であることを確認

### パフォーマンスの問題

1. キャッシュヒット率を監視
2. 適切な`cacheControl`値を使用
3. 頻繁に更新されるファイルのバージョン管理を検討
4. Smart CDN機能が有効であることを確認(Proプラン以上)
