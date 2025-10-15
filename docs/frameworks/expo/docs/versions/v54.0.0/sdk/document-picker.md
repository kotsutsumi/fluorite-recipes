# DocumentPicker

デバイス上の利用可能なプロバイダーからドキュメントを選択するためのシステムUIへのアクセスを提供するライブラリです。

## 概要

DocumentPickerは、Android、iOS、Webプラットフォームでドキュメント選択機能を提供します。システムのネイティブドキュメントピッカーを使用して、ユーザーがファイルを選択できるようにします。

## インストール

```bash
npx expo install expo-document-picker
```

## 使用方法

```javascript
import * as DocumentPicker from 'expo-document-picker';

export default function App() {
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        multiple: false,
      });

      if (!result.canceled) {
        console.log('選択されたファイル:', result.assets[0]);
      }
    } catch (err) {
      console.error('エラー:', err);
    }
  };

  return (
    <Button title="ドキュメントを選択" onPress={pickDocument} />
  );
}
```

## API

### メソッド

#### `getDocumentAsync(options?: DocumentPickerOptions): Promise<DocumentPickerResult>`

システムUIを表示してドキュメントを選択します。

**パラメータ:**

```typescript
type DocumentPickerOptions = {
  type?: string | string[];
  multiple?: boolean;
  copyToCacheDirectory?: boolean;
};
```

- `type`: 許可するMIMEタイプ（デフォルト: `'*/*'`）
  - 例: `'application/pdf'`、`'image/*'`、`['image/*', 'video/*']`
- `multiple`: 複数ファイルの選択を許可（デフォルト: `false`）
- `copyToCacheDirectory`: アプリのキャッシュディレクトリにファイルをコピー（デフォルト: `true`）

**戻り値:**

```typescript
type DocumentPickerResult =
  | { canceled: false; assets: DocumentPickerAsset[] }
  | { canceled: true };

type DocumentPickerAsset = {
  uri: string;
  name: string;
  size: number;
  mimeType: string;
};
```

成功時：
- `canceled`: `false`
- `assets`: 選択されたファイルの配列
  - `uri`: ファイルのURI
  - `name`: ファイル名
  - `size`: ファイルサイズ（バイト）
  - `mimeType`: ファイルのMIMEタイプ

キャンセル時：
- `canceled`: `true`

## 使用例

### PDFファイルの選択

```javascript
import * as DocumentPicker from 'expo-document-picker';

async function selectPDF() {
  const result = await DocumentPicker.getDocumentAsync({
    type: 'application/pdf',
  });

  if (!result.canceled) {
    console.log('PDFファイル:', result.assets[0].name);
  }
}
```

### 複数の画像を選択

```javascript
import * as DocumentPicker from 'expo-document-picker';

async function selectMultipleImages() {
  const result = await DocumentPicker.getDocumentAsync({
    type: 'image/*',
    multiple: true,
  });

  if (!result.canceled) {
    console.log(`${result.assets.length}個の画像が選択されました`);
    result.assets.forEach(asset => {
      console.log('画像:', asset.name);
    });
  }
}
```

### 大きなファイルの処理

大きなファイルを扱う場合、`copyToCacheDirectory`を`false`に設定することを検討してください：

```javascript
import * as DocumentPicker from 'expo-document-picker';

async function selectLargeFile() {
  const result = await DocumentPicker.getDocumentAsync({
    type: '*/*',
    copyToCacheDirectory: false, // ファイルをコピーしない
  });

  if (!result.canceled) {
    // 元のファイルの場所を直接使用
    console.log('ファイルURI:', result.assets[0].uri);
  }
}
```

### FileSystemとの統合

```javascript
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';

async function readDocumentContent() {
  const result = await DocumentPicker.getDocumentAsync({
    type: 'text/plain',
  });

  if (!result.canceled) {
    const content = await FileSystem.readAsStringAsync(result.assets[0].uri);
    console.log('ファイルの内容:', content);
  }
}
```

## プラットフォーム固有の考慮事項

### iOS

iOSでは、iCloudストレージの高度な機能を使用するために手動設定が必要な場合があります。

### Android

Androidでは、ストレージ権限が自動的に処理されます。

### Web

Webプラットフォームでは：
- ドキュメントピッカーを表示するにはユーザーアクティベーションが必要です
- ボタンクリックなどのユーザーアクションから`getDocumentAsync()`を呼び出す必要があります

```javascript
// ✅ 正しい - ユーザーアクションから呼び出す
<Button onPress={() => DocumentPicker.getDocumentAsync()} />

// ❌ 間違い - 自動実行
useEffect(() => {
  DocumentPicker.getDocumentAsync(); // エラーが発生する可能性があります
}, []);
```

## プラットフォーム互換性

| プラットフォーム | サポート |
|----------------|---------|
| Android        | ✅      |
| iOS            | ✅      |
| Web            | ✅      |

## よくある使用パターン

### ファイルタイプによる選択

```javascript
// 画像のみ
type: 'image/*'

// PDFのみ
type: 'application/pdf'

// 画像または動画
type: ['image/*', 'video/*']

// すべてのファイル
type: '*/*'
```

### エラーハンドリング

```javascript
import * as DocumentPicker from 'expo-document-picker';

async function selectDocumentSafely() {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: '*/*',
    });

    if (result.canceled) {
      console.log('ユーザーが選択をキャンセルしました');
      return;
    }

    // ファイルを処理
    processFile(result.assets[0]);
  } catch (error) {
    console.error('ドキュメント選択エラー:', error);
  }
}
```

## バンドルバージョン

- バンドルバージョン: ~14.0.7
- 既存のReact Nativeアプリで動作
- `expo-file-system`との統合が可能

## 注意事項

- Webではユーザーアクティベーションが必須です
- 大きなファイルの場合、`copyToCacheDirectory: false`の使用を検討してください
- iOSの高度な機能には手動のiCloud設定が必要な場合があります
- 選択されたファイルのURIは一時的なものである可能性があるため、永続的な保存が必要な場合は適切な場所にコピーしてください
