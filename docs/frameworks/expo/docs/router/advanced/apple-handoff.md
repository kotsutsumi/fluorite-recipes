# Apple Handoff

Expo RouterでApple Handoffを実装する方法を学びます。

## Apple Handoffとは

Apple Handoffは、ユーザーがAppleデバイス間でアプリやWebサイトの閲覧を継続できる機能です。iPhone、iPad、Mac間でシームレスに作業を引き継ぐことができます。

**必要なAPI**: iOSの`NSUserActivity` APIを使用してルート切り替えを管理します。

## 重要な要件

### 互換性

- **Expo Goとは互換性なし**: Handoffを使用するには、開発ビルドまたはスタンドアロンビルドが必要です
- **ユニバーサルリンク必須**: Handoffを機能させるには、ユニバーサルリンクの設定が必要です
- **expo-router/head必須**: Handoffをサポートするページには`expo-router/head`コンポーネントが必要です

### 必要な設定

1. ユニバーサルリンクの設定
2. Apple App Site Associationファイルの作成
3. アプリ設定の更新
4. ネイティブプロジェクトの再生成

## セットアップ手順

### 1. Apple App Site Associationファイルの作成

ドメインのルートディレクトリに`.well-known/apple-app-site-association`ファイルを作成します。

**ファイルパス**：
```
https://yourdomain.com/.well-known/apple-app-site-association
```

**ファイル内容**：
```json
{
  "applinks": {
    "apps": [],
    "details": [
      {
        "appID": "TEAM_ID.BUNDLE_IDENTIFIER",
        "paths": ["*"]
      }
    ]
  },
  "activitycontinuation": {
    "apps": [
      "TEAM_ID.BUNDLE_IDENTIFIER"
    ]
  }
}
```

**パラメータ**：
- `TEAM_ID`: Apple Developer Team ID
- `BUNDLE_IDENTIFIER`: アプリのバンドル識別子（例: `com.example.myapp`）

### 2. アプリ設定の更新

```typescript
// app.config.ts
export default {
  expo: {
    plugins: [
      [
        'expo-router',
        {
          origin: 'https://yourdomain.com',
        },
      ],
    ],
    ios: {
      bundleIdentifier: 'com.example.myapp',
      associatedDomains: [
        'applinks:yourdomain.com',
        'activitycontinuation:yourdomain.com',
      ],
    },
  },
};
```

### 3. ネイティブプロジェクトの再生成

```bash
npx expo prebuild -p ios --clean
```

このコマンドは、iOSネイティブプロジェクトを再生成し、Handoff設定を適用します。

## 実装方法

### expo-router/headコンポーネントの使用

Handoffをサポートするページに`expo-router/head`コンポーネントを追加します。

```typescript
// app/index.tsx
import Head from 'expo-router/head';
import { View, Text } from 'react-native';

export default function App() {
  return (
    <>
      <Head>
        <meta property="expo:handoff" content="true" />
      </Head>
      <View>
        <Text>Hello World</Text>
      </View>
    </>
  );
}
```

### サポートされるメタタグ

#### expo:handoff

Handoffの有効化/無効化を制御します。

```typescript
<Head>
  <meta property="expo:handoff" content="true" />
</Head>
```

**値**：
- `"true"`: Handoffを有効化
- `"false"`: Handoffを無効化

#### og:title

アクティビティのタイトルを設定します。

```typescript
<Head>
  <meta property="expo:handoff" content="true" />
  <meta property="og:title" content="Product Details" />
</Head>
```

#### og:description

アクティビティの説明を設定します。

```typescript
<Head>
  <meta property="expo:handoff" content="true" />
  <meta property="og:title" content="Product Details" />
  <meta property="og:description" content="View detailed product information" />
</Head>
```

#### og:url

デバイス切り替え時に使用するURLを指定します。

```typescript
<Head>
  <meta property="expo:handoff" content="true" />
  <meta property="og:url" content="https://yourdomain.com/products/123" />
</Head>
```

### 完全な実装例

```typescript
// app/products/[id].tsx
import Head from 'expo-router/head';
import { useLocalSearchParams } from 'expo-router';
import { View, Text, ScrollView } from 'react-native';

export default function ProductScreen() {
  const { id } = useLocalSearchParams();

  return (
    <>
      <Head>
        <meta property="expo:handoff" content="true" />
        <meta property="og:title" content={`Product ${id}`} />
        <meta property="og:description" content="View product details and purchase" />
        <meta property="og:url" content={`https://yourdomain.com/products/${id}`} />
      </Head>
      <ScrollView>
        <Text>Product ID: {id}</Text>
        {/* 商品詳細コンテンツ */}
      </ScrollView>
    </>
  );
}
```

## デバッグとトラブルシューティング

### 1. Handoffが有効化されているか確認

**iOSデバイス**：
- 設定 → 一般 → AirPlayとHandoff → Handoffがオンになっていることを確認

**macOS**：
- システム設定 → 一般 → AirDropとHandoff → このMacとiCloudデバイス間でのHandoffを許可をオンにする

### 2. Apple App Site Associationファイルの検証

**ブラウザで確認**：
```
https://yourdomain.com/.well-known/apple-app-site-association
```

**検証ツール**：
- Apple's App Search API Validation Tool
- [Branch.io AASA Validator](https://branch.io/resources/aasa-validator/)

### 3. Associated Domainsの確認

**Xcodeで確認**：
1. Xcodeでプロジェクトを開く
2. Signing & Capabilities → Associated Domains
3. `applinks:yourdomain.com`と`activitycontinuation:yourdomain.com`が含まれていることを確認

### 4. Ngrokを使用した開発テスト

開発中にHandoffをテストするには、Ngrokを使用してローカルサーバーを公開します。

```bash
# ローカルサーバーを起動
npx expo start

# Ngrokでトンネルを作成
ngrok http 8081

# app.config.tsでNgrok URLを使用
```

## ユースケース

### 1. Eコマースアプリ

ユーザーがiPhoneで商品を閲覧し、iPadで購入を完了できます。

```typescript
// app/products/[id].tsx
<Head>
  <meta property="expo:handoff" content="true" />
  <meta property="og:title" content={productName} />
  <meta property="og:url" content={`https://shop.example.com/products/${id}`} />
</Head>
```

### 2. ニュースアプリ

iPhoneで記事を読み始め、Macで続きを読むことができます。

```typescript
// app/articles/[id].tsx
<Head>
  <meta property="expo:handoff" content="true" />
  <meta property="og:title" content={articleTitle} />
  <meta property="og:url" content={`https://news.example.com/articles/${id}`} />
</Head>
```

### 3. タスク管理アプリ

iPhoneでタスクを作成し、iPadで詳細を編集できます。

```typescript
// app/tasks/[id].tsx
<Head>
  <meta property="expo:handoff" content="true" />
  <meta property="og:title" content={`Task: ${taskName}`} />
  <meta property="og:url" content={`https://tasks.example.com/tasks/${id}`} />
</Head>
```

## 既知の制限事項

### WebからネイティブへのルーティングHas制限

**制限**: WebブラウザからネイティブアプリへのHandoffには制限があります。

**理由**：
- ブラウザのセキュリティポリシー
- ユニバーサルリンクの動作制限

### HTTPSが必須

**要件**: ユニバーサルリンクはHTTPSでのみ機能します。

**開発環境**：
- Ngrokなどのトンネリングサービスを使用してHTTPSを提供

### Expo Goでは動作しない

**制限**: Expo GoではHandoffを使用できません。

**解決策**：
- 開発ビルド（`expo run:ios`）を使用
- EAS Buildでスタンドアロンビルドを作成

## ベストプラクティス

### 1. 適切なメタタグの設定

すべての必要なメタタグを設定してください。

```typescript
<Head>
  <meta property="expo:handoff" content="true" />
  <meta property="og:title" content="Page Title" />
  <meta property="og:description" content="Page Description" />
  <meta property="og:url" content="https://example.com/page" />
</Head>
```

### 2. ユーザーコンテキストの保持

ユーザーが別のデバイスで作業を継続できるように、十分なコンテキストを提供してください。

```typescript
<Head>
  <meta property="expo:handoff" content="true" />
  <meta
    property="og:url"
    content={`https://example.com/page?scrollPosition=${scrollY}`}
  />
</Head>
```

### 3. エラーハンドリング

Handoffが失敗した場合のフォールバックを提供してください。

```typescript
import { useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';

export default function Screen() {
  const params = useLocalSearchParams();

  useEffect(() => {
    // Handoffパラメータが存在するか確認
    if (params.handoff === 'true') {
      // Handoff専用のロジック
    }
  }, [params]);

  return <View>{/* コンテンツ */}</View>;
}
```

### 4. テストの実施

複数のデバイスとシナリオでHandoffをテストしてください。

**テストシナリオ**：
- iPhone → iPad
- iPhone → Mac
- iPad → Mac
- アプリが開いている状態
- アプリが閉じている状態

## まとめ

Expo RouterのApple Handoffは、以下の特徴があります：

1. **デバイス間の継続性**: iPhoneからiPad、Macへシームレスに移行
2. **NSUserActivity統合**: iOSのネイティブAPIを活用
3. **簡単な実装**: `expo-router/head`コンポーネントで簡単に設定

**主な機能**：
- ユニバーサルリンクのサポート
- メタタグによるカスタマイズ
- デバイス間のコンテキスト保持

**必要な設定**：
- Apple App Site Associationファイル
- Associated Domainsの設定
- expo-router/headコンポーネント

**制限事項**：
- Expo Goとは互換性なし
- HTTPSが必須
- WebからネイティブへのルーティングHas制限

これらの機能を活用して、Appleデバイス間でシームレスなユーザー体験を提供できます。
