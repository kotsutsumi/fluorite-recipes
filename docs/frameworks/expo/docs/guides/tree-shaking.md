# Tree ShakingとコードRemoval

Tree Shakingは、使用されていないコードを削除することで本番JavaScriptバンドルを最適化する技術です。

## Platform Shaking

### プラットフォーム固有のコードの削除

異なるプラットフォーム（Android、iOS、Web）向けにプラットフォーム固有のコードを削除します。

```typescript
import { Platform } from 'react-native';

if (Platform.OS === 'ios') {
  // iOSのみのコード - Androidビルドから削除される
}

if (Platform.OS === 'android') {
  // Androidのみのコード - iOSビルドから削除される
}

if (Platform.OS === 'web') {
  // Webのみのコード - ネイティブビルドから削除される
}
```

## コードRemoval技術

### 開発専用コードの削除

`process.env.NODE_ENV`または`__DEV__`を使用して開発専用コードを削除します。

```typescript
if (process.env.NODE_ENV === 'development') {
  // 本番ビルドから削除される開発専用コード
  console.log('デバッグ情報');
}

if (__DEV__) {
  // 本番ビルドから削除される開発専用コード
  console.warn('開発モード');
}
```

### カスタムコードRemoval

`EXPO_PUBLIC_`環境変数を使用したカスタムコードRemovalをサポートします。

```typescript
if (process.env.EXPO_PUBLIC_FEATURE_FLAG === 'enabled') {
  // 環境変数に基づいて条件付きで含まれる
}
```

### サーバー専用コードの削除

`typeof window === 'undefined'`を使用してサーバー専用コードを削除できます。

```typescript
if (typeof window === 'undefined') {
  // サーバーのみのコード - クライアントビルドから削除される
}
```

## 実験的Tree Shaking機能（SDK 52以降）

SDK 52以降では、より高度なTree Shaking機能が実験的に提供されています。

### 主な機能

#### 1. 未使用のインポートとエクスポートの自動削除

使用されていないインポートとエクスポートを自動的に削除します。

#### 2. バレルファイルの最適化

バレルファイル（多数のエクスポートを再エクスポートするファイル）を最適化します。

```typescript
// components/index.ts (バレルファイル)
export { Button } from './Button';
export { Input } from './Input';
export { Select } from './Select';

// App.tsx
import { Button } from './components'; // Buttonのみがバンドルに含まれる
```

#### 3. 再帰的モジュール最適化

モジュールツリー全体を再帰的に最適化します。

#### 4. モジュール副作用の尊重

モジュールの副作用を尊重し、必要なコードは保持します。

### Tree Shakingの有効化

#### 1. experimentalImportSupportの有効化

`metro.config.js`で設定します：

```javascript
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: true,
    inlineRequires: true,
  },
});

module.exports = config;
```

#### 2. 環境変数の設定

```bash
EXPO_UNSTABLE_METRO_OPTIMIZE_GRAPH=1 \
EXPO_UNSTABLE_TREE_SHAKING=1 \
npx expo export
```

#### 3. 本番モードでのバンドル

Tree Shakingは本番モードでのみ有効です：

```bash
NODE_ENV=production npx expo export
```

### すべてを組み合わせた例

```bash
NODE_ENV=production \
EXPO_UNSTABLE_METRO_OPTIMIZE_GRAPH=1 \
EXPO_UNSTABLE_TREE_SHAKING=1 \
npx expo export --platform web
```

## 主な利点

### 1. 小さい本番バンドル

使用されていないコードを削除することで、バンドルサイズが大幅に削減されます。

### 2. 速い起動時間

小さいバンドルは、アプリの起動時間を改善します。

### 3. プラットフォーム固有の最適化

各プラットフォーム向けに最適化されたバンドルを生成します。

## ベストプラクティス

### 1. 副作用のないコードを記述

Tree Shakingを最大限に活用するには、副作用のないコードを記述してください。

```typescript
// ❌ 副作用あり
import './styles.css'; // 常に含まれる

// ✅ 副作用なし
export function myFunction() {
  return 'Hello';
}
```

### 2. 名前付きエクスポートを使用

デフォルトエクスポートよりも名前付きエクスポートを使用してください。

```typescript
// ✅ Tree Shakingしやすい
export function Button() { }
export function Input() { }

// ❌ Tree Shakingしにくい
export default {
  Button,
  Input,
};
```

### 3. バレルファイルを慎重に使用

バレルファイルは便利ですが、Tree Shakingを難しくする可能性があります。

## トラブルシューティング

### Tree Shakingが動作しない

#### 確認事項

1. **本番モードで実行しているか**：`NODE_ENV=production`
2. **実験的フラグが有効か**：環境変数を確認
3. **副作用のないコードか**：副作用を持つコードは削除されません

### バンドルサイズが減らない

#### デバッグ手順

1. **Expo Atlasで分析**：どのモジュールがバンドルに含まれているか確認
2. **依存関係を確認**：未使用の依存関係を削除
3. **動的インポートを使用**：大きいモジュールは動的にインポート

## 重要な注意事項

> **警告**: これは実験的機能であり、本番環境で使用する前に十分にテストしてください。

### 既知の制限

- すべてのライブラリがTree Shakingに対応しているわけではありません
- 副作用を持つコードは削除されません
- 動的インポートは完全にはサポートされていません

## まとめ

Tree Shakingは、本番バンドルを最適化する強力な技術です。SDK 52以降の実験的機能を使用することで、さらに高度な最適化が可能になります。ベストプラクティスに従い、十分にテストすることで、大幅なバンドルサイズの削減と起動時間の改善を実現できます。
