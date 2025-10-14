# Print

AndroidとiOS（AirPrint）向けの印刷機能を提供するライブラリです。

## インストール

```bash
npx expo install expo-print
```

## プラットフォーム

- Android
- iOS
- Web

## 主な機能

- HTMLコンテンツの印刷
- PDFファイルへの印刷
- プリンターへの直接印刷
- ページの向きと余白の設定
- ローカルおよびリモート画像の印刷サポート

## 基本的な使用例

```javascript
import * as Print from 'expo-print';
import { Button, View } from 'react-native';

export default function App() {
  const html = `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
      </head>
      <body style="text-align: center;">
        <h1 style="font-size: 50px; font-family: Helvetica Neue; font-weight: normal;">
          Hello Expo!
        </h1>
        <img
          src="https://d30j33t1r58ioz.cloudfront.net/static/guides/sdk.png"
          style="width: 90vw;" />
      </body>
    </html>
  `;

  const print = async () => {
    await Print.printAsync({
      html
    });
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="印刷" onPress={print} />
    </View>
  );
}
```

## API

### `Print.printAsync(options)`

ドキュメントまたはHTMLを印刷します。

**パラメータ:**

```typescript
{
  html?: string;           // 印刷するHTMLコンテンツ
  uri?: string;           // 印刷するドキュメントのURI
  printerUrl?: string;    // (iOS) プリンターURL
  width?: number;         // ページ幅
  height?: number;        // ページ高さ
  orientation?: 'portrait' | 'landscape';  // ページの向き
  margins?: {             // ページ余白
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
}
```

**戻り値:**
- `Promise<void>`

**例:**

```javascript
await Print.printAsync({
  html: '<h1>Hello World</h1>',
  orientation: 'landscape'
});
```

### `Print.printToFileAsync(options)`

HTMLをPDFファイルに印刷します。

**パラメータ:**

```typescript
{
  html?: string;           // 印刷するHTMLコンテンツ
  uri?: string;           // 印刷するドキュメントのURI
  width?: number;         // ページ幅
  height?: number;        // ページ高さ
  base64?: boolean;       // Base64エンコードされた結果を返す
  orientation?: 'portrait' | 'landscape';
  margins?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
}
```

**戻り値:**
- `Promise<{ uri: string; numberOfPages: number; base64?: string }>`

**例:**

```javascript
const { uri } = await Print.printToFileAsync({
  html: '<h1>Document</h1>',
  base64: false
});
console.log('PDFファイル:', uri);
```

### `Print.selectPrinterAsync()` (iOS のみ)

プリンターを選択するためのシステムUIを表示します。

**戻り値:**
- `Promise<{ name: string; url: string } | null>`

**例:**

```javascript
const printer = await Print.selectPrinterAsync();
if (printer) {
  console.log('選択されたプリンター:', printer.name);
}
```

## 画像の印刷

### リモート画像

リモート画像はHTMLの`<img>`タグで直接使用できます：

```javascript
const html = `
  <html>
    <body>
      <img src="https://example.com/image.png" style="width: 100%;" />
    </body>
  </html>
`;

await Print.printAsync({ html });
```

### ローカル画像（iOS）

iOSでローカル画像を印刷する場合は、Base64エンコードが必要です：

```javascript
import * as FileSystem from 'expo-file-system';

const base64Image = await FileSystem.readAsStringAsync(
  localImageUri,
  { encoding: FileSystem.EncodingType.Base64 }
);

const html = `
  <html>
    <body>
      <img src="data:image/png;base64,${base64Image}" style="width: 100%;" />
    </body>
  </html>
`;

await Print.printAsync({ html });
```

## 詳細設定

### ページサイズと向き

```javascript
await Print.printAsync({
  html: '<h1>横向き印刷</h1>',
  orientation: 'landscape',
  width: 842,   // A4横向きの幅（ポイント）
  height: 595   // A4横向きの高さ（ポイント）
});
```

### カスタム余白

```javascript
await Print.printAsync({
  html: '<h1>カスタム余白</h1>',
  margins: {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50
  }
});
```

### PDFへの印刷

```javascript
const { uri, numberOfPages } = await Print.printToFileAsync({
  html: '<h1>PDFドキュメント</h1>',
  base64: false
});

console.log(`${numberOfPages}ページのPDFを作成: ${uri}`);
```

## プラットフォーム固有の考慮事項

### iOS
- ローカルアセットURLに制限があります
- ローカル画像にはBase64エンコードが必要です
- AirPrintプリンターのみサポートされます
- `selectPrinterAsync()`でプリンターを選択できます

### Android
- ほとんどのプリンターをサポートします
- ローカル画像を直接使用できます
- システム印刷ダイアログを使用します

### Web
- ブラウザの印刷機能を使用します
- プラットフォーム固有の機能は制限されます

## ベストプラクティス

1. **レスポンシブHTML**: ビューポートメタタグを使用して、さまざまなページサイズに適応します
2. **画像の最適化**: 大きな画像は印刷前に最適化します
3. **エラー処理**: 印刷操作を適切なエラー処理でラップします
4. **プレビュー**: 可能な場合は、印刷前にユーザーにプレビューを表示します
5. **クロスプラットフォームテスト**: 各プラットフォームで印刷出力をテストします

## トラブルシューティング

- **iOSで画像が表示されない**: ローカル画像にBase64エンコードを使用していることを確認してください
- **レイアウトの問題**: HTMLにビューポートメタタグを含めてください
- **プリンターが見つからない**: プリンターが同じネットワーク上にあり、AirPrint対応であることを確認してください（iOS）

このライブラリは、Expoアプリケーションで印刷ジョブをカスタマイズするための包括的なオプションを提供します。
