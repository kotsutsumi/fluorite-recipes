# トラブルシューティング

Expo Routerの一般的な問題と解決策を学びます。

## 一般的な問題と解決策

### 1. React Native DevToolsでファイルやソースマップが見つからない

#### 問題

React Native DevToolsでファイルやソースマップが表示されません。

#### 解決策

React Native DevToolsを使用して設定をリセットします。

**手順**：
1. ターミナルで`j`を押してDevToolsを起動
2. Settingsを開く
3. "Restore defaults and reload"をクリック
4. `/node_modules/`の除外設定を解除

```bash
# ターミナルで
npx expo start

# 'j' を押してDevToolsを起動
```

### 2. EXPO_ROUTER_APP_ROOTが定義されていない

#### 問題

`EXPO_ROUTER_APP_ROOT` is not definedエラーが発生します。

#### 原因

Babelプラグイン`expo-router/babel`が使用されていません。

#### 解決策1: キャッシュをクリア

```bash
npx expo start --clear
```

#### 解決策2: カスタムindex.jsの作成

```javascript
// index.js
import { registerRootComponent } from 'expo';
import { ExpoRoot } from 'expo-router';

export function App() {
  const ctx = require.context('./app');
  return <ExpoRoot context={ctx} />;
}

registerRootComponent(App);
```

#### 解決策3: package.jsonの更新

```json
{
  "main": "index.js"
}
```

### 3. require.contextが有効になっていない

#### 問題

`require.context is not enabled`エラーが発生します。

#### 原因

Metro設定が`expo-router/metro`を使用していません。

#### 解決策1: metro.config.jsの削除

既存の`metro.config.js`を削除します。

```bash
rm metro.config.js
```

#### 解決策2: expo/metro-configの拡張

```javascript
// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

module.exports = getDefaultConfig(__dirname);
```

### 4. 戻るボタンが表示されない

#### 問題

ディープリンク時に戻るボタンが表示されません。

#### 原因

`unstable_settings`で`initialRouteName`が設定されていません。

#### 解決策

ルートのレイアウトに`unstable_settings`を追加します。

```typescript
// app/_layout.tsx
export const unstable_settings = {
  initialRouteName: 'index',
};

export default function RootLayout() {
  return <Stack />;
}
```

### 5. モジュールが見つからない

#### 問題

`Module not found: Can't resolve 'expo-router'`エラーが発生します。

#### 解決策

expo-routerをインストールします。

```bash
npx expo install expo-router
```

### 6. Metroバンドラーエラー

#### 問題

Metroバンドラーが起動しません。

#### 解決策

キャッシュをクリアして再起動します。

```bash
npx expo start --clear
```

または、ノードモジュールを再インストールします。

```bash
rm -rf node_modules
npm install
npx expo start --clear
```

### 7. TypeScript型エラー

#### 問題

TypeScriptの型エラーが発生します。

#### 解決策

型定義を再生成します。

```bash
npx expo start
```

型定義ファイルが自動生成されます。

### 8. 静的レンダリングエラー

#### 問題

静的レンダリングが失敗します。

#### 解決策1: generateStaticParams()の確認

動的ルートに`generateStaticParams()`が実装されているか確認します。

```typescript
export async function generateStaticParams() {
  return [{ id: '1' }, { id: '2' }];
}
```

#### 解決策2: app.json設定の確認

```json
{
  "expo": {
    "web": {
      "bundler": "metro",
      "output": "static"
    }
  }
}
```

### 9. ナビゲーションが機能しない

#### 問題

ナビゲーションが機能しません。

#### 解決策

ルートパスを確認します。

```typescript
// ✅ 正しい
<Link href="/about" />
router.push('/about');

// ❌ 間違い
<Link href="about" /> // 先頭の '/' が必要
```

### 10. APIルートが動作しない

#### 問題

APIルートが動作しません。

#### 解決策

サーバー出力を確認します。

```json
{
  "expo": {
    "web": {
      "output": "server"
    }
  }
}
```

## デバッグのヒント

### ログの有効化

```typescript
// app/_layout.tsx
import { usePathname } from 'expo-router';
import { useEffect } from 'react';

export default function RootLayout() {
  const pathname = usePathname();

  useEffect(() => {
    console.log('Current pathname:', pathname);
  }, [pathname]);

  return <Slot />;
}
```

### ルート構造の確認

サイトマップを使用してルート構造を確認します。

```
http://localhost:8081/_sitemap
```

### キャッシュのクリア

問題が発生した場合は、まずキャッシュをクリアします。

```bash
npx expo start --clear
```

## ベストプラクティス

### 1. 常に最新バージョンを使用

```bash
npx expo install expo-router@latest
```

### 2. エラーメッセージを注意深く読む

エラーメッセージには、問題の解決策が含まれていることが多いです。

### 3. ドキュメントを参照

公式ドキュメントで最新の情報を確認します。

### 4. コミュニティに質問

GitHub IssuesやDiscordでコミュニティに質問します。

## まとめ

Expo Routerのトラブルシューティングは、以下のカテゴリに分類されます：

1. **セットアップ問題**: Babelプラグイン、Metro設定
2. **ナビゲーション問題**: 戻るボタン、パス設定
3. **ビルド問題**: キャッシュ、型定義
4. **静的レンダリング問題**: generateStaticParams()、app.json設定

**主な解決策**：
- キャッシュのクリア
- 設定の確認
- パスの修正
- 型定義の再生成

**デバッグのヒント**：
- ログの有効化
- サイトマップの確認
- キャッシュのクリア

**ベストプラクティス**：
- 最新バージョンの使用
- エラーメッセージの確認
- ドキュメントの参照
- コミュニティへの質問

これらの解決策を活用して、Expo Routerの問題を効率的に解決できます。
