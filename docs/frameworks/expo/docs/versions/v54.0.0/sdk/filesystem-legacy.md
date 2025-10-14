# FileSystem (legacy)

モバイルデバイスのローカルファイルシステムへのアクセスを提供するレガシーライブラリです。Android、iOS、tvOSをサポートし、アプリのスコープディレクトリ内でのファイル操作を可能にします。

> **注意**: これはレガシーバージョンのドキュメントです。新しいプロジェクトでは、最新の FileSystem API の使用を推奨します。

## 概要

FileSystem (legacy)は以下の機能を提供します：
- ファイルのダウンロードとアップロード
- ファイルの読み書き
- ファイルとディレクトリの作成、移動、コピー、削除
- デバイスストレージ情報へのアクセス
- 再開可能なダウンロードのサポート
- マルチパートファイルアップロードの処理

## インストール

```bash
npx expo install expo-file-system
```

## コアディレクトリ

### 利用可能なディレクトリ

```javascript
import * as FileSystem from 'expo-file-system';

// ドキュメントディレクトリ - 永続的なユーザードキュメントストレージ
console.log(FileSystem.documentDirectory);

// キャッシュディレクトリ - 一時ファイルストレージ
console.log(FileSystem.cacheDirectory);

// バンドルディレクトリ - バンドルされたアプリアセット（読み取り専用）
console.log(FileSystem.bundleDirectory);
```

## 主要なメソッド

### ファイルの読み書き

#### `readAsStringAsync(fileUri, options?)`

ファイルの内容を文字列として読み込みます。

```javascript
import * as FileSystem from 'expo-file-system';

const content = await FileSystem.readAsStringAsync(
  FileSystem.documentDirectory + 'file.txt',
  { encoding: FileSystem.EncodingType.UTF8 }
);
console.log(content);
```

**パラメータ:**
- `fileUri`: 読み込むファイルのURI
- `options`: エンコーディングオプション
  - `encoding`: `UTF8`（デフォルト）または `Base64`

#### `writeAsStringAsync(fileUri, contents, options?)`

ファイルに文字列を書き込みます。

```javascript
import * as FileSystem from 'expo-file-system';

await FileSystem.writeAsStringAsync(
  FileSystem.documentDirectory + 'file.txt',
  'Hello, World!',
  { encoding: FileSystem.EncodingType.UTF8 }
);
```

**パラメータ:**
- `fileUri`: 書き込むファイルのURI
- `contents`: 書き込む内容
- `options`: エンコーディングオプション

### ファイルとディレクトリの管理

#### `getInfoAsync(fileUri, options?)`

ファイルまたはディレクトリの情報を取得します。

```javascript
const info = await FileSystem.getInfoAsync(
  FileSystem.documentDirectory + 'file.txt'
);

console.log('存在:', info.exists);
console.log('サイズ:', info.size);
console.log('変更日:', info.modificationTime);
console.log('ディレクトリ:', info.isDirectory);
```

**戻り値:**
```typescript
{
  exists: boolean;
  uri: string;
  size?: number;
  isDirectory?: boolean;
  modificationTime?: number;
  md5?: string;
}
```

#### `deleteAsync(fileUri, options?)`

ファイルまたはディレクトリを削除します。

```javascript
await FileSystem.deleteAsync(
  FileSystem.documentDirectory + 'file.txt',
  { idempotent: true } // ファイルが存在しない場合でもエラーを投げない
);
```

#### `moveAsync(options)`

ファイルまたはディレクトリを移動します。

```javascript
await FileSystem.moveAsync({
  from: FileSystem.documentDirectory + 'old.txt',
  to: FileSystem.documentDirectory + 'new.txt'
});
```

#### `copyAsync(options)`

ファイルまたはディレクトリをコピーします。

```javascript
await FileSystem.copyAsync({
  from: FileSystem.documentDirectory + 'source.txt',
  to: FileSystem.documentDirectory + 'destination.txt'
});
```

#### `makeDirectoryAsync(fileUri, options?)`

ディレクトリを作成します。

```javascript
await FileSystem.makeDirectoryAsync(
  FileSystem.documentDirectory + 'my-folder',
  { intermediates: true } // 中間ディレクトリも作成
);
```

#### `readDirectoryAsync(fileUri)`

ディレクトリの内容を読み込みます。

```javascript
const files = await FileSystem.readDirectoryAsync(
  FileSystem.documentDirectory
);
console.log('ファイル一覧:', files);
```

### ネットワーク操作

#### `downloadAsync(uri, fileUri, options?)`

ファイルをダウンロードします。

```javascript
const downloadResult = await FileSystem.downloadAsync(
  'https://example.com/image.jpg',
  FileSystem.documentDirectory + 'image.jpg',
  {
    headers: {
      'Authorization': 'Bearer token'
    }
  }
);

console.log('ダウンロード完了:', downloadResult.uri);
console.log('ステータス:', downloadResult.status);
console.log('ヘッダー:', downloadResult.headers);
```

**戻り値:**
```typescript
{
  uri: string;
  status: number;
  headers: Record<string, string>;
  md5?: string;
}
```

#### `uploadAsync(url, fileUri, options?)`

ファイルをアップロードします。

```javascript
const uploadResult = await FileSystem.uploadAsync(
  'https://example.com/upload',
  FileSystem.documentDirectory + 'photo.jpg',
  {
    httpMethod: 'POST',
    uploadType: FileSystem.FileSystemUploadType.MULTIPART,
    fieldName: 'file',
    headers: {
      'Authorization': 'Bearer token'
    },
    parameters: {
      'description': 'My photo'
    }
  }
);

console.log('ステータス:', uploadResult.status);
console.log('レスポンス:', uploadResult.body);
```

**オプション:**
- `httpMethod`: HTTPメソッド（`POST`、`PUT`、`PATCH`）
- `uploadType`: `BINARY_CONTENT`または`MULTIPART`
- `fieldName`: マルチパートフォームのフィールド名
- `headers`: HTTPヘッダー
- `parameters`: 追加のフォームパラメータ

### 再開可能なダウンロード

#### `createDownloadResumable(uri, fileUri, options?, callback?, resumeData?)`

再開可能なダウンロードを作成します。

```javascript
const downloadResumable = FileSystem.createDownloadResumable(
  'https://example.com/video.mp4',
  FileSystem.documentDirectory + 'video.mp4',
  {},
  (downloadProgress) => {
    const progress = downloadProgress.totalBytesWritten /
                     downloadProgress.totalBytesExpectedToWrite;
    console.log(`進行状況: ${(progress * 100).toFixed(0)}%`);
  }
);

try {
  const { uri } = await downloadResumable.downloadAsync();
  console.log('ダウンロード完了:', uri);
} catch (error) {
  console.error('ダウンロードエラー:', error);
}
```

**主要なメソッド:**

- `downloadAsync()`: ダウンロードを開始
- `pauseAsync()`: ダウンロードを一時停止
- `resumeAsync()`: ダウンロードを再開
- `savable()`: 再開データを保存可能な形式で取得

**使用例 - ダウンロードの一時停止と再開:**

```javascript
const downloadResumable = FileSystem.createDownloadResumable(
  'https://example.com/large-file.zip',
  FileSystem.documentDirectory + 'large-file.zip',
  {},
  (progress) => {
    console.log(`進行状況: ${(progress.totalBytesWritten / progress.totalBytesExpectedToWrite * 100).toFixed(0)}%`);
  }
);

// ダウンロードを開始
downloadResumable.downloadAsync().catch(error => {
  console.log('ダウンロードエラー:', error);
});

// 一時停止
await downloadResumable.pauseAsync();

// 再開データを保存
const resumeData = downloadResumable.savable();
await AsyncStorage.setItem('resumeData', JSON.stringify(resumeData));

// 後で再開
const savedResumeData = JSON.parse(await AsyncStorage.getItem('resumeData'));
const newDownloadResumable = new FileSystem.DownloadResumable(
  savedResumeData.url,
  savedResumeData.fileUri,
  savedResumeData.options,
  null,
  savedResumeData.resumeData
);

await newDownloadResumable.resumeAsync();
```

### ストレージ情報

#### `getFreeDiskStorageAsync()`

利用可能なディスクストレージを取得します。

```javascript
const freeSpace = await FileSystem.getFreeDiskStorageAsync();
console.log(`空き容量: ${(freeSpace / (1024 * 1024 * 1024)).toFixed(2)} GB`);
```

#### `getTotalDiskCapacityAsync()`

総ディスク容量を取得します。

```javascript
const totalSpace = await FileSystem.getTotalDiskCapacityAsync();
console.log(`総容量: ${(totalSpace / (1024 * 1024 * 1024)).toFixed(2)} GB`);
```

## エンコーディングタイプ

```javascript
FileSystem.EncodingType.UTF8    // UTF-8エンコーディング
FileSystem.EncodingType.Base64  // Base64エンコーディング
```

## 使用例

### JSONファイルの保存と読み込み

```javascript
import * as FileSystem from 'expo-file-system';

// データを保存
const data = { name: 'John', age: 30 };
await FileSystem.writeAsStringAsync(
  FileSystem.documentDirectory + 'data.json',
  JSON.stringify(data)
);

// データを読み込み
const content = await FileSystem.readAsStringAsync(
  FileSystem.documentDirectory + 'data.json'
);
const loadedData = JSON.parse(content);
console.log(loadedData);
```

### 画像のダウンロードと表示

```javascript
import * as FileSystem from 'expo-file-system';
import { Image } from 'react-native';

const imageUrl = 'https://example.com/image.jpg';
const imageUri = FileSystem.documentDirectory + 'downloaded-image.jpg';

// 画像をダウンロード
await FileSystem.downloadAsync(imageUrl, imageUri);

// 画像を表示
<Image source={{ uri: imageUri }} style={{ width: 200, height: 200 }} />
```

### ファイルの存在確認

```javascript
import * as FileSystem from 'expo-file-system';

async function fileExists(uri) {
  const info = await FileSystem.getInfoAsync(uri);
  return info.exists;
}

const exists = await fileExists(FileSystem.documentDirectory + 'file.txt');
console.log('ファイルが存在:', exists);
```

### ディレクトリ内の全ファイルを削除

```javascript
import * as FileSystem from 'expo-file-system';

async function clearDirectory(directoryUri) {
  const files = await FileSystem.readDirectoryAsync(directoryUri);

  await Promise.all(
    files.map(file =>
      FileSystem.deleteAsync(directoryUri + file, { idempotent: true })
    )
  );
}

await clearDirectory(FileSystem.cacheDirectory);
```

## プラットフォーム固有の権限

### Android

Android 10（API level 29）以降では、スコープストレージが導入されています。アプリ固有のディレクトリへのアクセスには権限は不要ですが、外部ストレージへのアクセスには以下の権限が必要です：

```json
{
  "expo": {
    "android": {
      "permissions": [
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE"
      ]
    }
  }
}
```

### iOS

iOSでは、アプリのサンドボックス内のファイルアクセスに追加の権限は不要です。

## プラットフォーム互換性

| プラットフォーム | サポート |
|----------------|---------|
| Android        | ✅      |
| iOS            | ✅      |
| tvOS           | ✅      |
| Web            | ❌      |

## 注意事項

1. **キャッシュディレクトリ**: `cacheDirectory`内のファイルは、システムによって自動的に削除される可能性があります
2. **バンドルディレクトリ**: `bundleDirectory`は読み取り専用です
3. **ファイルURI**: 必ず`file://`プロトコルを使用してください
4. **エラーハンドリング**: すべての非同期操作にはtry-catchを使用してください
5. **パフォーマンス**: 大きなファイルを扱う場合は、進行状況のコールバックを使用してください

## ベストプラクティス

1. **適切なディレクトリの使用**:
   - 永続データ: `documentDirectory`
   - 一時データ: `cacheDirectory`
   - アプリアセット: `bundleDirectory`

2. **エラーハンドリング**:
```javascript
try {
  await FileSystem.writeAsStringAsync(uri, content);
} catch (error) {
  console.error('ファイル書き込みエラー:', error);
}
```

3. **ファイルの存在確認**:
```javascript
const info = await FileSystem.getInfoAsync(uri);
if (info.exists) {
  // ファイルが存在する場合の処理
}
```

4. **再開可能なダウンロード**: 大きなファイルには`createDownloadResumable`を使用

5. **メモリ管理**: 大きなファイルは一度にすべてをメモリに読み込まないでください

## マイグレーション

新しいFileSystem APIへの移行を検討してください。新しいAPIは以下の利点があります：
- モダンなTypeScriptサポート
- より直感的なAPI設計
- パフォーマンスの向上
- より良いエラーハンドリング

詳細は最新のFileSystemドキュメントを参照してください。
