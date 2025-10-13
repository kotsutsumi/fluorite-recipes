# 非同期ルート

Expo Routerで非同期ルートとJavaScriptバンドル分割を実装する方法を学びます。

## 非同期ルートとは

非同期ルートは、React Suspenseを使用してJavaScriptバンドルを分割する機能です。ルートは、ナビゲートした時点でのみ読み込まれます。

**実験的機能**: Expo Routerの実験的機能です。

## 主な特徴

### 1. バンドル分割

初期バンドルサイズを削減します。

### 2. 遅延読み込み

ルートへの最初のナビゲーションは少し長くかかりますが、その後の訪問はキャッシュされ、瞬時に表示されます。

### 3. OTAアップデートの改善

Over-the-Air（OTA）アップデートとWebサポートを改善します。

### 4. Suspenseバウンダリ

ルートはSuspenseバウンダリでラップされます。

### 5. エラーハンドリング

読み込みエラーはErrorBoundaryで処理されます。

## セットアップ

### app.configの設定

```typescript
// app.config.ts
export default {
  expo: {
    plugins: [
      [
        'expo-router',
        {
          asyncRoutes: {
            web: true,
            default: 'development',
          },
        },
      ],
    ],
  },
};
```

### 設定オプション

**web**: Webプラットフォームで非同期ルートを有効化
- 型: `boolean`
- デフォルト: `false`

**default**: ネイティブプラットフォームでの非同期ルート設定
- オプション: `'development'` | `'production'` | `false`
- デフォルト: `false`

### プロジェクトの起動

Metroキャッシュをクリアしてプロジェクトを起動します。

```bash
npx expo start --clear
```

**重要**: `--clear`フラグは、Metroキャッシュをクリアして非同期読み込みを確実にします。

## 動作の仕組み

### 初回ナビゲーション

```typescript
// app/index.tsx
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <View>
      <Text>Home Screen</Text>
      <Link href="/about">Go to About</Link>
    </View>
  );
}
```

**動作**：
1. ユーザーが「Go to About」をタップ
2. `/about`ルートのJavaScriptチャンクが読み込まれる（初回のみ遅延）
3. 読み込みが完了すると画面が表示される

### 2回目以降のナビゲーション

**動作**：
1. JavaScriptチャンクがすでにキャッシュされている
2. 瞬時に画面が表示される

## 静的レンダリングとの統合

### 本番Webアプリでのサポート

静的レンダリングは、本番Webアプリで非同期ルートをサポートします。

### Node.jsでの同期レンダリング

Suspenseバウンダリは、Node.jsで同期的にレンダリングされます。

**結果**：
- すべてのレイアウトルートが含まれる
- 最初のレンダリングで一貫性のある出力

### 例

```typescript
// app/_layout.tsx
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen name="about" />
    </Stack>
  );
}
```

**静的レンダリング時**：
- `index.html`にはルートレイアウトとホーム画面が含まれる
- `about.html`にはルートレイアウトとabout画面が含まれる
- 各HTMLファイルには完全なレイアウト構造が含まれる

## 注意事項

### 1. ネイティブ本番アプリで未サポート

現在、ネイティブ本番アプリでは非同期ルートはサポートされていません。

**制限**：
- iOSとAndroidの本番ビルドでは使用不可
- 開発ビルドとWebビルドでのみサポート

### 2. HTMLとJavaScriptの不一致

開発中に、HTMLとJavaScriptの間で潜在的な不一致が発生する可能性があります。

**影響**：
- Fast Refresh中にハイドレーションエラーが発生する可能性
- 本番ビルドでは問題なし

### 3. ローディング状態のカスタマイズ不可

現在、ローディング状態をカスタマイズすることはできません。

**制限**：
- デフォルトのSuspenseフォールバックが使用される
- カスタムローディングスピナーは設定不可

## 使用例

### 基本的な設定

```typescript
// app.config.ts
export default {
  expo: {
    plugins: [
      [
        'expo-router',
        {
          asyncRoutes: {
            web: true, // Webで有効化
            default: 'development', // 開発中のネイティブで有効化
          },
        },
      ],
    ],
  },
};
```

### 開発とProduction の分離

```typescript
// app.config.ts
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

export default {
  expo: {
    plugins: [
      [
        'expo-router',
        {
          asyncRoutes: {
            web: true,
            default: IS_PRODUCTION ? false : 'development',
          },
        },
      ],
    ],
  },
};
```

## パフォーマンスへの影響

### 初期バンドルサイズの削減

**例**：
- 非同期ルートなし: 500KB初期バンドル
- 非同期ルートあり: 200KB初期バンドル（60%削減）

### 初回ナビゲーションの遅延

**例**：
- 非同期ルートなし: 即座にナビゲーション
- 非同期ルートあり: 100-300ms遅延（初回のみ）

### キャッシュ後のパフォーマンス

**例**：
- 2回目以降のナビゲーション: 即座に表示（キャッシュ済み）

## ベストプラクティス

### 1. Webビルドで優先的に使用

Webビルドでは常に有効化することを推奨します。

```typescript
asyncRoutes: {
  web: true,
}
```

### 2. 開発中のみネイティブで有効化

ネイティブ開発中にのみ有効化して、フィードバックループを改善します。

```typescript
asyncRoutes: {
  web: true,
  default: 'development',
}
```

### 3. キャッシュをクリアして起動

変更後は必ず`--clear`フラグを使用します。

```bash
npx expo start --clear
```

### 4. 大規模アプリで活用

多くのルートを持つ大規模アプリで最も効果的です。

**推奨**：
- 10+ルート: 非同期ルートの使用を検討
- 50+ルート: 非同期ルートを強く推奨

## トラブルシューティング

### 問題1: ルートが非同期読み込みされない

**解決策**：
```bash
npx expo start --clear
```

### 問題2: ハイドレーションエラー

**原因**: 開発中のHTMLとJavaScriptの不一致

**解決策**: 本番ビルドでテストする
```bash
npx expo export --platform web
```

### 問題3: ネイティブ本番ビルドでエラー

**原因**: ネイティブ本番ビルドは未サポート

**解決策**: ネイティブ本番では無効化する
```typescript
asyncRoutes: {
  web: true,
  default: 'development', // 本番では無効
}
```

## まとめ

Expo Routerの非同期ルートは、以下の特徴があります：

1. **バンドル分割**: React Suspenseによる自動分割
2. **遅延読み込み**: ナビゲーション時のルート読み込み
3. **パフォーマンス改善**: 初期バンドルサイズの削減
4. **OTAアップデート改善**: Webとネイティブのサポート向上

**主な機能**：
- JavaScriptバンドル分割
- Suspenseバウンダリ
- ErrorBoundaryによるエラーハンドリング
- 静的レンダリングとの統合

**注意事項**：
- ネイティブ本番アプリで未サポート
- 潜在的なHTMLとJavaScriptの不一致
- ローディング状態のカスタマイズ不可

**ベストプラクティス**：
- Webビルドで優先的に使用
- 開発中のみネイティブで有効化
- キャッシュをクリアして起動
- 大規模アプリで活用

これらの機能を活用して、より効率的なルート読み込みと小さい初期バンドルサイズを実現できます。
