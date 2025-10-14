# FileSystem

モバイルデバイスのローカルファイルシステムへのアクセスを提供するライブラリです。ファイルの読み書き、ダウンロード、アップロード、ディレクトリ管理などの機能を提供します。

## 概要

Expo FileSystemは、以下の機能を実現します：
- ファイルの読み書き
- ファイルのダウンロードとアップロード
- ディレクトリの管理
- ファイル操作の実行
- ファイルメタデータの取得
- ストリームベースのファイル操作

## インストール

```bash
npx expo install expo-file-system
```

## 基本的な使用方法

```typescript
import { File, Directory, Paths } from 'expo-file-system';

// ファイルの作成と書き込み
const file = new File(Paths.cache, 'example.txt');
file.create();
file.write('Hello, world!');

// ファイルの読み込み
console.log(file.textSync()); // 出力: Hello, world!
```

## 主要なクラス

### File

個々のファイルを表現し、操作するクラスです。

```typescript
import { File, Paths } from 'expo-file-system';

// ファイルの作成
const file = new File(Paths.document, 'data.json');

// ファイルへの書き込み
file.write(JSON.stringify({ name: 'John' }));

// ファイルの読み込み
const content = file.text();

// ファイルの削除
file.delete();
```

#### 主要なメソッド

- `create()`: ファイルを作成
- `write(content: string | Uint8Array)`: ファイルに書き込み
- `text()`: ファイルの内容をテキストとして読み込み（非同期）
- `textSync()`: ファイルの内容をテキストとして読み込み（同期）
- `bytes()`: ファイルの内容をバイト配列として読み込み
- `delete()`: ファイルを削除
- `move(destination: File | Directory)`: ファイルを移動
- `copy(destination: File | Directory)`: ファイルをコピー
- `exists()`: ファイルの存在を確認

### Directory

ディレクトリ操作を管理するクラスです。

```typescript
import { Directory, Paths } from 'expo-file-system';

// ディレクトリの作成
const dir = new Directory(Paths.document, 'my-folder');
dir.create();

// ディレクトリ内のファイル一覧を取得
const files = dir.list();

// ディレクトリの削除
dir.delete();
```

#### 主要なメソッド

- `create()`: ディレクトリを作成
- `list()`: ディレクトリ内のファイルとディレクトリの一覧を取得
- `delete()`: ディレクトリを削除
- `move(destination: Directory)`: ディレクトリを移動
- `copy(destination: Directory)`: ディレクトリをコピー
- `exists()`: ディレクトリの存在を確認

### Paths

システムディレクトリへのアクセスとパスユーティリティを提供します。

```typescript
import { Paths } from 'expo-file-system';

// 利用可能なパス
console.log(Paths.cache);      // キャッシュディレクトリ
console.log(Paths.document);   // ドキュメントディレクトリ
console.log(Paths.bundle);     // バンドルディレクトリ
```

#### 利用可能なパス

- `Paths.cache`: 一時ファイル用のキャッシュディレクトリ
- `Paths.document`: 永続的なユーザードキュメント用ディレクトリ
- `Paths.bundle`: アプリにバンドルされたアセット用ディレクトリ

### FileHandle

低レベルのファイル読み書き操作を可能にするクラスです。

```typescript
import { FileHandle, Paths } from 'expo-file-system';

// ファイルを開く
const handle = await FileHandle.open(Paths.document, 'large-file.bin');

// データを読み込む
const buffer = new Uint8Array(1024);
await handle.read(buffer, 0, 1024);

// ファイルを閉じる
await handle.close();
```

## ネットワーク操作

### ファイルのダウンロード

```typescript
import { downloadFileAsync, Paths } from 'expo-file-system';

const result = await downloadFileAsync(
  'https://example.com/image.jpg',
  new File(Paths.document, 'downloaded-image.jpg'),
  {
    headers: {
      'Authorization': 'Bearer token',
    },
  }
);

console.log('ダウンロード完了:', result.uri);
```

### ファイルピッカー

```typescript
import { pickFileAsync, Paths } from 'expo-file-system';

const result = await pickFileAsync({
  types: ['image/*', 'application/pdf'],
  multiple: false,
});

if (result) {
  console.log('選択されたファイル:', result.uri);
}
```

## 高度な使用例

### ストリーム操作

```typescript
import { File, Paths } from 'expo-file-system';

const file = new File(Paths.document, 'stream-data.txt');

// ストリームを使用した書き込み
const writeStream = file.createWriteStream();
writeStream.write('First line\n');
writeStream.write('Second line\n');
writeStream.close();

// ストリームを使用した読み込み
const readStream = file.createReadStream();
let data = '';
readStream.on('data', (chunk) => {
  data += chunk;
});
readStream.on('end', () => {
  console.log('読み込み完了:', data);
});
```

### ファイル情報の取得

```typescript
import { File, Paths } from 'expo-file-system';

const file = new File(Paths.document, 'info.txt');

if (file.exists()) {
  const info = file.info();
  console.log('ファイルサイズ:', info.size);
  console.log('最終更新日:', info.modificationTime);
  console.log('ファイルタイプ:', info.isDirectory ? 'ディレクトリ' : 'ファイル');
}
```

### ディレクトリの再帰的な操作

```typescript
import { Directory, Paths } from 'expo-file-system';

function listAllFiles(dir: Directory): string[] {
  const files: string[] = [];
  const items = dir.list();

  for (const item of items) {
    if (item.isDirectory) {
      files.push(...listAllFiles(item as Directory));
    } else {
      files.push(item.uri);
    }
  }

  return files;
}

const documentDir = new Directory(Paths.document);
const allFiles = listAllFiles(documentDir);
console.log('すべてのファイル:', allFiles);
```

## プラットフォーム固有の機能

### Android

```typescript
import { Paths } from 'expo-file-system';

// Androidの外部ストレージ
if (Paths.externalStorage) {
  console.log('外部ストレージ:', Paths.externalStorage);
}
```

### iOS

```typescript
import { Paths } from 'expo-file-system';

// iOSのアプリグループ
if (Paths.appGroup) {
  console.log('アプリグループ:', Paths.appGroup);
}
```

## エラーハンドリング

```typescript
import { File, Paths } from 'expo-file-system';

try {
  const file = new File(Paths.document, 'test.txt');
  file.write('Hello');
  const content = file.text();
  console.log(content);
} catch (error) {
  console.error('ファイル操作エラー:', error);
}
```

## パフォーマンスの考慮事項

### 同期 vs 非同期

```typescript
// 同期（UIをブロックする可能性があります）
const contentSync = file.textSync();

// 非同期（推奨）
const contentAsync = await file.text();
```

### バッチ操作

```typescript
import { File, Directory, Paths } from 'expo-file-system';

// 複数ファイルの効率的な処理
const dir = new Directory(Paths.document, 'batch');
dir.create();

const files = Array.from({ length: 100 }, (_, i) =>
  new File(dir, `file-${i}.txt`)
);

// バッチで作成
await Promise.all(files.map(f => f.create()));
```

## プラットフォーム互換性

| プラットフォーム | サポート |
|----------------|---------|
| Android        | ✅      |
| iOS            | ✅      |
| tvOS           | ✅      |
| Web            | ❌      |

## 注意事項

- ファイル操作は適切なエラーハンドリングを実装してください
- 大きなファイルを扱う場合はストリーム操作を使用してください
- 同期メソッドはUIをブロックする可能性があるため、非同期メソッドを優先してください
- プラットフォーム固有の機能を使用する前に可用性を確認してください
- キャッシュディレクトリのファイルは定期的にクリアされる可能性があります

## ベストプラクティス

1. **エラーハンドリング**: すべてのファイル操作にtry-catchを使用
2. **非同期操作**: UIをブロックしないよう非同期メソッドを優先
3. **リソース管理**: ファイルハンドルは使用後に必ず閉じる
4. **パスの検証**: ファイル操作前にパスの存在を確認
5. **適切なディレクトリ**: ファイルの性質に応じて適切なディレクトリを使用
