# MediaLibrary

デバイスのメディアライブラリへのアクセスを提供するライブラリです。

## 概要

`expo-media-library` は、デバイスのメディアライブラリへのアクセスを提供し、既存の画像や動画へのアクセス、新しいメディアファイルの保存、メディアライブラリの更新の監視を可能にするライブラリです。

## 主な機能

- 既存の画像と動画へのアクセス
- 新しいメディアファイルの保存
- メディアライブラリの更新を監視
- アルバムとアセットのクエリ
- 許可管理
- メディアアセットの作成、削除、操作

## インストール

```bash
npx expo install expo-media-library
```

## 使用方法

### 基本的なアルバムの取得

```javascript
import { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import * as MediaLibrary from 'expo-media-library';

export default function App() {
  const [albums, setAlbums] = useState(null);
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

  async function getAlbums() {
    if (permissionResponse.status !== 'granted') {
      await requestPermission();
    }
    const fetchedAlbums = await MediaLibrary.getAlbumsAsync({
      includeSmartAlbums: true,
    });
    setAlbums(fetchedAlbums);
  }

  useEffect(() => {
    getAlbums();
  }, []);

  return (
    <View>
      <FlatList
        data={albums}
        renderItem={({ item }) => <Text>{item.title}</Text>}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}
```

### 写真の保存

```javascript
import * as MediaLibrary from 'expo-media-library';

async function savePhoto(uri) {
  const permission = await MediaLibrary.requestPermissionsAsync();

  if (permission.granted) {
    const asset = await MediaLibrary.createAssetAsync(uri);
    console.log('写真が保存されました:', asset.uri);
  }
}
```

### アセットの取得

```javascript
import * as MediaLibrary from 'expo-media-library';

async function getPhotos() {
  const permission = await MediaLibrary.requestPermissionsAsync();

  if (permission.granted) {
    const assets = await MediaLibrary.getAssetsAsync({
      mediaType: 'photo',
      first: 20,
      sortBy: [[MediaLibrary.SortBy.creationTime, false]],
    });

    console.log('取得した写真数:', assets.totalCount);
    return assets.assets;
  }
}
```

### アルバムの作成とアセットの追加

```javascript
import * as MediaLibrary from 'expo-media-library';

async function createAlbumWithPhoto(photoUri) {
  const permission = await MediaLibrary.requestPermissionsAsync();

  if (permission.granted) {
    // アセットを作成
    const asset = await MediaLibrary.createAssetAsync(photoUri);

    // アルバムを作成してアセットを追加
    const album = await MediaLibrary.createAlbumAsync('マイアルバム', asset);
    console.log('アルバムが作成されました:', album.title);
  }
}
```

### メディアライブラリの変更を監視

```javascript
import { useEffect } from 'react';
import * as MediaLibrary from 'expo-media-library';

function useMediaLibraryUpdates() {
  useEffect(() => {
    const subscription = MediaLibrary.addListener((event) => {
      console.log('メディアライブラリが更新されました');
      console.log('挿入されたアセット:', event.insertedAssets.length);
      console.log('削除されたアセット:', event.deletedAssets.length);
      console.log('更新されたアセット:', event.updatedAssets.length);
    });

    return () => subscription.remove();
  }, []);
}
```

## API

### パーミッション

#### `usePermissions()`

メディアライブラリの許可を管理するReact Hookです。

**戻り値:**
- `[PermissionResponse | null, requestPermission, getPermission]`

#### `requestPermissionsAsync(writeOnly?)`

メディアライブラリのアクセス許可をリクエストします。

**パラメータ:**
- `writeOnly` (optional) - 書き込みのみの許可をリクエスト

**戻り値:**
- `Promise<PermissionResponse>`

#### `getPermissionsAsync(writeOnly?)`

現在の許可状態を取得します。

**戻り値:**
- `Promise<PermissionResponse>`

### アルバム管理

#### `getAlbumsAsync(options?)`

ユーザーのアルバムを取得します。

**パラメータ:**
- `options` - アルバム取得のオプション
  - `includeSmartAlbums` - スマートアルバムを含めるか

**戻り値:**
- `Promise<Album[]>` - アルバムの配列

#### `createAlbumAsync(albumName, asset?, copyAsset?)`

新しいアルバムを作成します。

**パラメータ:**
- `albumName` - アルバム名
- `asset` (optional) - 追加する初期アセット
- `copyAsset` (optional) - アセットをコピーするか

**戻り値:**
- `Promise<Album>` - 作成されたアルバム

#### `deleteAlbumsAsync(albums, assetRemove?)`

アルバムを削除します。

**パラメータ:**
- `albums` - 削除するアルバムの配列またはID
- `assetRemove` (optional) - アセットも削除するか

**戻り値:**
- `Promise<boolean>` - 成功した場合は `true`

### アセット管理

#### `getAssetsAsync(options?)`

メディアアセットを取得します。

**パラメータ:**
- `options` - アセット取得のオプション
  - `first` - 取得する数
  - `after` - カーソル
  - `album` - 特定のアルバム
  - `sortBy` - ソート順
  - `mediaType` - メディアタイプ
  - `createdAfter` - 作成日時フィルター
  - `createdBefore` - 作成日時フィルター

**戻り値:**
- `Promise<PagedInfo<Asset>>` - ページング情報とアセット

#### `createAssetAsync(uri)`

新しいアセットを作成します。

**パラメータ:**
- `uri` - ファイルのURI

**戻り値:**
- `Promise<Asset>` - 作成されたアセット

#### `deleteAssetsAsync(assets)`

アセットを削除します。

**パラメータ:**
- `assets` - 削除するアセットの配列またはID

**戻り値:**
- `Promise<boolean>` - 成功した場合は `true`

#### `getAssetInfoAsync(asset)`

アセットの詳細情報を取得します。

**パラメータ:**
- `asset` - アセットまたはアセットID

**戻り値:**
- `Promise<AssetInfo>` - アセットの詳細情報

### リスナー

#### `addListener(listener)`

メディアライブラリの変更を監視します。

**パラメータ:**
- `listener` - 変更イベントのコールバック

**戻り値:**
- `Subscription` - サブスクリプションオブジェクト

## 型定義

### Asset

```typescript
{
  id: string;
  filename: string;
  uri: string;
  mediaType: MediaType;
  width: number;
  height: number;
  creationTime: number;
  modificationTime: number;
  duration: number;
  albumId?: string;
}
```

### Album

```typescript
{
  id: string;
  title: string;
  assetCount: number;
  type?: string;
}
```

### MediaType

```typescript
enum MediaType {
  photo = 'photo',
  video = 'video',
  audio = 'audio',
  unknown = 'unknown',
}
```

### SortBy

```typescript
enum SortBy {
  default = 'default',
  creationTime = 'creationTime',
  modificationTime = 'modificationTime',
  mediaType = 'mediaType',
  width = 'width',
  height = 'height',
  duration = 'duration',
}
```

## プラットフォーム固有の動作

### Android

#### 許可
- `READ_EXTERNAL_STORAGE` - 読み取り許可（Android 12以前）
- `WRITE_EXTERNAL_STORAGE` - 書き込み許可（Android 12以前）
- `READ_MEDIA_IMAGES` - 画像の読み取り（Android 13以降）
- `READ_MEDIA_VIDEO` - 動画の読み取り（Android 13以降）
- `READ_MEDIA_AUDIO` - 音声の読み取り（Android 13以降）

#### 制限事項
- Androidでは空のアルバムを作成できません
- アルバム間のアセット移動にはユーザー確認が必要な場合があります

### iOS

#### 許可
- `NSPhotoLibraryUsageDescription` - 読み取りアクセスの説明
- `NSPhotoLibraryAddUsageDescription` - 書き込みアクセスの説明

#### 制限事項
- 画像の向きに関する問題が発生する可能性があります
- 一部の操作にはユーザー確認が必要です

## 設定

`app.json` でプラグインを設定できます：

```json
{
  "expo": {
    "plugins": [
      [
        "expo-media-library",
        {
          "photosPermission": "写真にアクセスします",
          "savePhotosPermission": "写真を保存します",
          "isAccessMediaLocationEnabled": true
        }
      ]
    ]
  }
}
```

## ベストプラクティス

1. **許可管理**: 常に許可を確認してからアクセス
2. **パフォーマンス**: 大量のアセットを扱う場合はページングを使用
3. **エラーハンドリング**: ユーザーが許可を拒否した場合の処理を実装
4. **プライバシー**: ユーザーのプライバシーを尊重

## 既知の制限事項

- Androidでは空のアルバムを作成できません
- アルバム間のアセット移動には確認が必要な場合があります
- 画像の向きに関する問題が発生する可能性があります

## サポートプラットフォーム

- Android
- iOS
- tvOS（限定サポート）
