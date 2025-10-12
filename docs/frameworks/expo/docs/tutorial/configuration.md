# ステータスバー、スプラッシュスクリーン、アプリアイコンを設定

このチュートリアルでは、ステータスバー、アプリアイコン、スプラッシュスクリーンを設定する基本を学びます。

## 1. ステータスバーを設定

`expo-status-bar`ライブラリはすべてのプロジェクトにプリインストールされています。`StatusBar`コンポーネントを使用してアプリのステータスバーのスタイルを設定します。

`app/_layout.tsx`の例：

```typescript
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}
```

## 2. アプリアイコン

アプリアイコンは`assets/images/icon.png`にあります。デフォルトでは、`app.json`ファイルはすでにこのパスを使用するように設定されています。

> 注記：Expo Application Services（EAS）は、アプリストア用にビルドする際に異なるデバイス用に最適化されたアイコンを作成します。

## 3. スプラッシュスクリーン

スプラッシュスクリーンは、アプリのコンテンツが読み込まれる前に表示されます。`expo-splash-screen`プラグインはプリインストールされ、`app.json`で設定されています。

`app.json`の設定例：

```json
{
  "plugins": [
    [
      "expo-splash-screen",
      {
        "image": "./assets/images/splash-icon.png"
      }
    ]
  ]
}
```

### スプラッシュスクリーンのテスト

スプラッシュスクリーンをテストするには：
- Expo Goまたは開発ビルドは使用できません
- プレビューまたは本番ビルドを作成する必要があります
- 推奨リソース：
  - [スプラッシュスクリーンアイコンガイドを作成](/develop/user-interface/splash-screen-and-app-icon#splash-screen)
  - [内部配信ガイド](/tutorial/eas/internal-distribution-builds)
  - [Android](/tutorial/eas/android-production-build)と[iOS](/tutorial/eas/ios-production-build)の本番ビルドガイド

## まとめ

この章では、ステータスバー、アプリアイコン、スプラッシュスクリーンの設定をカバーしました。
