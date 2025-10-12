# Expoでモノレポを使用

## 主要な概念

モノレポは「複数のアプリやパッケージを含む単一のリポジトリ」で、以下のメリットがあります：

- 開発の高速化
- コード共有の簡素化
- 単一の真実の情報源

## サポートされるパッケージマネージャー

以下のパッケージマネージャーをサポートしています：

- **Bun**
- **npm**
- **pnpm**
- **Yarn**（ClassicとBerry）

## モノレポ構造

典型的なモノレポレイアウト：

```
monorepo/
├── apps/
│   ├── mobile-app/
│   └── web-app/
├── packages/
│   ├── shared-components/
│   ├── shared-utils/
│   └── shared-types/
├── package.json
└── pnpm-workspace.yaml (または yarn workspaces)
```

### ワークスペースの設定

#### npm/Yarn Classic

ルートの`package.json`：

```json
{
  "name": "monorepo",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ]
}
```

#### pnpm

`pnpm-workspace.yaml`を作成：

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

#### Yarn Berry

`.yarnrc.yml`を設定：

```yaml
nodeLinker: node-modules

yarnPath: .yarn/releases/yarn-3.6.0.cjs
```

## モノレポの作成

### 1. appsディレクトリの作成

```bash
mkdir apps
```

### 2. 最初のExpoアプリの追加

```bash
cd apps
npx create-expo-app mobile-app
cd ..
```

### 3. packagesディレクトリの作成

```bash
mkdir packages
```

### 4. 共有パッケージの作成

```bash
cd packages
mkdir shared-components
cd shared-components
npm init -y
```

`packages/shared-components/package.json`：

```json
{
  "name": "shared-components",
  "version": "1.0.0",
  "main": "index.js",
  "dependencies": {
    "react": "*",
    "react-native": "*"
  }
}
```

### 5. パッケージ間の依存関係の追加

`apps/mobile-app/package.json`：

```json
{
  "dependencies": {
    "shared-components": "*"
  }
}
```

## パッケージの使用例

### 共有パッケージ（packages/shared-components/index.js）

```javascript
import { Text, View, StyleSheet } from 'react-native';

export const greeting = 'Hello from shared package!';

export function SharedButton({ title, onPress }) {
  return (
    <View style={styles.button}>
      <Text onPress={onPress}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 10,
    backgroundColor: '#007AFF',
    borderRadius: 5,
  },
});
```

### アプリでの使用（apps/mobile-app/App.js）

```javascript
import { greeting, SharedButton } from 'shared-components';
import { View, Text } from 'react-native';

export default function App() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>{greeting}</Text>
      <SharedButton
        title="Press Me"
        onPress={() => console.log('Button pressed')}
      />
    </View>
  );
}
```

## よくあるモノレポの課題

### 1. 依存関係の解決

異なるパッケージ間で依存関係のバージョンが競合する可能性があります。

#### 解決策

パッケージマネージャーの解決機能を使用します：

```json
{
  "resolutions": {
    "react": "18.2.0",
    "react-native": "0.72.0"
  }
}
```

### 2. ネイティブモジュールの競合

複数のネイティブモジュールのバージョンが競合する可能性があります。

#### 解決策

重複するネイティブパッケージを避けます：

```json
{
  "resolutions": {
    "expo": "~49.0.0"
  }
}
```

### 3. 複雑なツール設定

モノレポには追加の設定が必要です。

#### 解決策

適切なツールを使用します：

- **Nx**: モノレポ管理ツール
- **Turborepo**: 高速ビルドシステム
- **Lerna**: パッケージ管理ツール

## ベストプラクティス

### 1. ツールとライブラリの互換性を確認

すべてのパッケージがモノレポで動作することを確認してください。

### 2. 依存関係管理に注意

重複する依存関係を避け、バージョンを統一してください。

### 3. 共有設定を使用

TypeScript、ESLint、Prettierなどの設定を共有してください。

```
monorepo/
├── tsconfig.base.json
├── .eslintrc.js
├── .prettierrc
└── ...
```

### 4. ビルドキャッシュを活用

ビルド時間を短縮するためにキャッシュを活用してください。

## 高度な設定

### TypeScript Path Mapping

ルートの`tsconfig.json`：

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "shared-components": ["./packages/shared-components"],
      "shared-utils": ["./packages/shared-utils"]
    }
  }
}
```

### Metro設定

`metro.config.js`でモノレポサポートを追加：

```javascript
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

module.exports = config;
```

### EAS Buildでのモノレポ

`eas.json`：

```json
{
  "build": {
    "production": {
      "node": "18.0.0",
      "yarn": "3.6.0"
    }
  }
}
```

## モノレポツール

### Nx

強力なモノレポ管理ツール：

```bash
npx create-nx-workspace@latest
```

### Turborepo

高速ビルドシステム：

```bash
npx create-turbo@latest
```

### Lerna

パッケージ管理ツール：

```bash
npx lerna init
```

## 重要な注意事項

> **注意**: モノレポはすべてのプロジェクトに適しているわけではありません。複雑さを伴いますが、開発効率の向上などのメリットがあります。

### モノレポが適している場合

- 複数の関連するアプリやパッケージを維持している
- コードを頻繁に共有している
- チームが大きく、協力が必要

### モノレポが適していない場合

- 単一のアプリのみを開発している
- パッケージ間の依存関係がない
- チームが小さく、シンプルさを優先

## トラブルシューティング

### 依存関係が見つからない

```bash
# キャッシュをクリア
rm -rf node_modules
rm -rf apps/*/node_modules
rm -rf packages/*/node_modules

# 再インストール
npm install
# または
pnpm install
# または
yarn install
```

### Metro bundlerエラー

```bash
# Metroキャッシュをクリア
npx expo start --clear
```

## まとめ

Expoモノレポは、複数のアプリやパッケージを効率的に管理する強力な方法です。適切に設定することで、コード共有の簡素化、開発の高速化、単一の真実の情報源の維持が可能になります。ただし、すべてのプロジェクトに適しているわけではないため、プロジェクトの要件を慎重に評価してください。
