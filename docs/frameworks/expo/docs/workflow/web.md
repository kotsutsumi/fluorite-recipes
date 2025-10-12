# ExpoでWebサイトを開発

ExpoはReactを使用したフルスタックWebサイトの構築に対するファーストクラスのサポートを提供し、静的レンダリングとクライアントサイドレンダリングの両方のオプションを提供します。

## 主な機能

### ユニバーサル開発

すべてのプラットフォームで同じコードベースを使用できます。

#### React Native for Web（RNW）コンポーネント

`<Text>`のようなReact Nativeコンポーネントをプラットフォーム間で使用できます：

```typescript
import { Text, View } from 'react-native';

export default function Page() {
  return (
    <View>
      <Text>これはReact Nativeコンポーネントです</Text>
    </View>
  );
}
```

#### オプションのWeb固有React DOMコンポーネント

Web固有の機能が必要な場合は、React DOMコンポーネントを使用できます：

```typescript
export default function Page() {
  return <p>これはReact DOMコンポーネントです</p>;
}
```

### フルSDKライブラリサポート

ブラウザとサーバーレンダリングの両方で、Expo SDKライブラリの完全なサポートを提供します。

## Web開発のセットアップ

### 1. Web依存関係のインストール

```bash
npx expo install react-dom react-native-web @expo/metro-runtime
```

#### パッケージの説明

- **`react-dom`**: React DOMレンダラー
- **`react-native-web`**: React NativeをWeb向けに変換
- **`@expo/metro-runtime`**: Metroバンドラーのランタイム

### 2. 開発サーバーの起動

```bash
npx expo start --web
```

このコマンドでWeb開発サーバーが起動し、ブラウザが自動的に開きます。

### 3. 本番Webサイトとしてエクスポート

```bash
npx expo export --platform web
```

これにより、`dist`ディレクトリに本番用のWebサイトが生成されます。

## コンポーネントの例

### ユニバーサルコンポーネント

すべてのプラットフォームで動作するコンポーネント：

```typescript
import { Text, View, StyleSheet } from 'react-native';

export default function Page() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>ホームページ</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
```

### Web専用コンポーネント

Web専用の機能を使用するコンポーネント：

```typescript
export default function Page() {
  return (
    <div>
      <h1>ホームページ</h1>
      <p>これはWeb専用コンポーネントです</p>
    </div>
  );
}
```

### 条件付きレンダリング

プラットフォームに応じて異なるコンポーネントをレンダリング：

```typescript
import { Platform, Text, View } from 'react-native';

export default function Page() {
  if (Platform.OS === 'web') {
    return <p>Webバージョン</p>;
  }

  return (
    <View>
      <Text>ネイティブバージョン</Text>
    </View>
  );
}
```

## 注目すべきハイライト

### 1. 静的レンダリングのサポート（SEO対応）

静的サイト生成（SSG）をサポートし、SEOを改善します：

```json
{
  "expo": {
    "web": {
      "output": "static"
    }
  }
}
```

### 2. 統一された開発者エクスペリエンス

すべてのプラットフォームで同じツールと開発フローを使用します。

### 3. プラットフォーム固有の最適化

各プラットフォーム向けに最適化されたバンドルを生成します。

### 4. Expo Routerとの互換性

Expo Routerを使用したファイルベースルーティングをサポートします。

## Web固有の設定

### app.jsonでの設定

```json
{
  "expo": {
    "web": {
      "bundler": "metro",
      "output": "single",
      "favicon": "./assets/favicon.png",
      "build": {
        "babel": {
          "include": []
        }
      }
    }
  }
}
```

### 設定オプション

- **`bundler`**: 使用するバンドラー（`metro`または`webpack`）
- **`output`**: 出力タイプ（`single`、`static`、または`server`）
- **`favicon`**: ファビコンのパス
- **`build`**: ビルド設定

## Web開発のベストプラクティス

### 1. レスポンシブデザイン

すべてのデバイスサイズに対応するレスポンシブデザインを実装してください：

```typescript
import { useWindowDimensions } from 'react-native';

export default function Page() {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 768;

  return (
    <View style={{ padding: isSmallScreen ? 10 : 20 }}>
      <Text>レスポンシブコンテンツ</Text>
    </View>
  );
}
```

### 2. アクセシビリティ

アクセシビリティ標準に準拠してください：

```typescript
<View accessible={true} accessibilityLabel="メインコンテンツ">
  <Text>アクセシブルなコンテンツ</Text>
</View>
```

### 3. SEO最適化

静的レンダリングとメタタグを使用してSEOを改善してください。

### 4. パフォーマンス最適化

- コード分割を使用
- 画像を最適化
- 遅延読み込みを実装

## トラブルシューティング

### Web開発サーバーが起動しない

#### 確認事項

1. **依存関係がインストールされているか**：`npm install`
2. **ポートが使用中でないか**：別のポートを試す
3. **キャッシュをクリア**：`npx expo start --web --clear`

### スタイルが正しく表示されない

#### デバッグ手順

1. **React Native Webの互換性を確認**
2. **Web固有のCSSを使用**
3. **ブラウザの開発者ツールで確認**

## まとめ

ExpoはReactを使用したフルスタックWebサイトの構築に対するファーストクラスのサポートを提供します。ユニバーサルコンポーネント、静的レンダリング、プラットフォーム固有の最適化により、WebとネイティブプラットフォームForにわたって動作するアプリを最小限の設定で作成できます。
