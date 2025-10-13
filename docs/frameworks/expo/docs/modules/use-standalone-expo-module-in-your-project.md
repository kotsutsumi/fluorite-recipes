# スタンドアロンExpoモジュールをプロジェクトで使用する

スタンドアロンExpoモジュールをプロジェクトで使用する方法を学びます。

## 概要

スタンドアロンExpoモジュールを使用するには、2つの主要な方法があります。

**2つのアプローチ**：
1. **モノレポアプローチ**: プロジェクト内でモジュールを開発
2. **npmパッケージ公開**: npmレジストリに公開して配布

## 方法1: モノレポアプローチ

### モノレポとは

モノレポは、複数のパッケージを1つのリポジトリで管理する手法です。

**利点**：
- ローカル開発が容易
- 依存関係の管理が簡単
- コードの共有が効率的

### プロジェクト構造

```
monorepo/
├── apps/
│   └── my-app/
│       ├── app/
│       ├── package.json
│       └── app.json
├── packages/
│   └── expo-settings/
│       ├── android/
│       ├── ios/
│       ├── src/
│       └── package.json
├── package.json
└── pnpm-workspace.yaml
```

### ステップ1: モノレポのセットアップ

#### ルートpackage.jsonの作成

```json
{
  "name": "my-monorepo",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "build": "turbo run build"
  },
  "devDependencies": {
    "turbo": "latest"
  }
}
```

#### pnpmワークスペースの設定（オプション）

```yaml
# pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

### ステップ2: モジュールの作成

```bash
npx create-expo-module@latest packages/expo-settings --no-example
```

**--no-exampleフラグ**: サンプルアプリを作成しない

### ステップ3: アプリの作成

```bash
npx create-expo-app@latest apps/my-app
```

### ステップ4: アプリにモジュールを追加

```json
// apps/my-app/package.json
{
  "name": "my-app",
  "dependencies": {
    "expo": "~51.0.0",
    "expo-settings": "*"
  }
}
```

**`"*"`**: ワークスペース内の最新バージョンを使用

### ステップ5: モジュールのビルド

```bash
cd packages/expo-settings
npm run build
```

### ステップ6: アプリのプリビルドと実行

```bash
cd apps/my-app

# プリビルド
npx expo prebuild --clean

# iOS実行
npx expo run:ios

# Android実行
npx expo run:android
```

### ステップ7: アプリでモジュールを使用

```typescript
// apps/my-app/app/index.tsx
import * as Settings from 'expo-settings';
import { StyleSheet, View, Text, Button } from 'react-native';
import { Theme } from 'expo-settings';

export default function HomeScreen() {
  const [theme, setTheme] = useState(Theme.LIGHT);

  useEffect(() => {
    const currentTheme = Settings.getTheme();
    setTheme(currentTheme);
  }, []);

  const handleChangeTheme = () => {
    const newTheme = theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT;
    Settings.setTheme(newTheme);
    setTheme(newTheme);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Current Theme: {theme}</Text>
      <Button title="Toggle Theme" onPress={handleChangeTheme} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
```

## 方法2: npmパッケージ公開

### ステップ1: モジュールの準備

```bash
npx create-expo-module@latest expo-settings
cd expo-settings
```

### ステップ2: サンプルアプリでのテスト

```bash
npx expo start
```

### ステップ3: npmログイン

```bash
npm login
```

**必要な情報**：
- npmユーザー名
- パスワード
- メールアドレス

### ステップ4: パッケージの公開

```bash
npm publish
```

**注意事項**：
- パッケージ名がユニークであることを確認
- semverに従ったバージョン管理
- READMEとドキュメントの充実

### ステップ5: パッケージのインストール

```bash
npx expo install expo-settings
```

### ステップ6: アプリでの使用

```typescript
import * as Settings from 'expo-settings';

export default function App() {
  return (
    <View>
      <Text>{Settings.hello()}</Text>
    </View>
  );
}
```

## 代替配布方法

### 1. Tarballの作成

```bash
cd expo-settings
npm pack
```

**生成されるファイル**: `expo-settings-1.0.0.tgz`

**インストール**：
```bash
npm install /path/to/expo-settings-1.0.0.tgz
```

### 2. ローカルnpmレジストリ（Verdaccio）

#### Verdaccioのインストール

```bash
npm install -g verdaccio
```

#### Verdaccioの起動

```bash
verdaccio
```

**デフォルトURL**: http://localhost:4873

#### レジストリの設定

```bash
npm set registry http://localhost:4873
```

#### パッケージの公開

```bash
npm publish --registry http://localhost:4873
```

#### パッケージのインストール

```bash
npm install expo-settings --registry http://localhost:4873
```

### 3. プライベートパッケージとEAS Build

#### npmプライベートレジストリの使用

```bash
npm login --registry=https://npm.pkg.github.com
npm publish
```

#### EAS Buildでの設定

```json
// eas.json
{
  "build": {
    "production": {
      "env": {
        "NPM_TOKEN": "@sensitive"
      }
    }
  }
}
```

**.npmrc**:
```
//registry.npmjs.org/:_authToken=${NPM_TOKEN}
```

## モノレポ開発のベストプラクティス

### 1. ワークスペースの設定

```json
// package.json
{
  "private": true,
  "workspaces": {
    "packages": [
      "apps/*",
      "packages/*"
    ]
  }
}
```

### 2. モジュールのウォッチモード

```json
// packages/expo-settings/package.json
{
  "scripts": {
    "build": "expo-module build",
    "watch": "expo-module build --watch"
  }
}
```

```bash
# ウォッチモードで起動
npm run watch
```

### 3. Turboを使用したビルド最適化

```bash
npm install turbo --save-dev
```

```json
// turbo.json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "dev": {
      "cache": false
    }
  }
}
```

### 4. 共通の依存関係の管理

```json
// ルートpackage.json
{
  "devDependencies": {
    "expo": "~51.0.0",
    "expo-modules-core": "~1.12.0",
    "typescript": "^5.3.0"
  }
}
```

## npmパッケージ公開のベストプラクティス

### 1. package.jsonの設定

```json
{
  "name": "expo-settings",
  "version": "1.0.0",
  "description": "Theme settings module for Expo",
  "main": "build/index.js",
  "types": "build/index.d.ts",
  "scripts": {
    "build": "expo-module build",
    "prepublishOnly": "npm run build"
  },
  "keywords": [
    "expo",
    "expo-module",
    "react-native",
    "settings",
    "theme"
  ],
  "repository": {
    "type": "git",
    "url": "https://github.com/username/expo-settings.git"
  },
  "bugs": {
    "url": "https://github.com/username/expo-settings/issues"
  },
  "homepage": "https://github.com/username/expo-settings#readme",
  "peerDependencies": {
    "expo": "*"
  }
}
```

### 2. .npmignoreの設定

```
# .npmignore
src/
tsconfig.json
*.tgz
example/
android/build/
ios/build/
.expo/
```

### 3. READMEの充実

```markdown
# expo-settings

Theme settings module for Expo

## Installation

\`\`\`bash
npx expo install expo-settings
\`\`\`

## Usage

\`\`\`typescript
import * as Settings from 'expo-settings';
import { Theme } from 'expo-settings';

// Get current theme
const theme = Settings.getTheme();

// Set theme
Settings.setTheme(Theme.DARK);
\`\`\`

## API Reference

### getTheme()

Returns the current theme.

**Returns**: \`Theme\`

### setTheme(theme: Theme)

Sets the theme.

**Parameters**:
- \`theme\`: The theme to set (\`Theme.LIGHT\`, \`Theme.DARK\`, or \`Theme.SYSTEM\`)
```

### 4. バージョン管理

```bash
# パッチバージョンアップ（1.0.0 → 1.0.1）
npm version patch

# マイナーバージョンアップ（1.0.0 → 1.1.0）
npm version minor

# メジャーバージョンアップ（1.0.0 → 2.0.0）
npm version major

# 公開
npm publish
```

## よくある問題と解決策

### 問題1: モジュールが見つからない

**モノレポ**:
```bash
# ワークスペースの再インストール
rm -rf node_modules
npm install
```

**npmパッケージ**:
```bash
# キャッシュをクリア
npm cache clean --force
npm install
```

### 問題2: ビルドが失敗する

```bash
# モジュールを再ビルド
cd packages/expo-settings
npm run build

# アプリを再ビルド
cd apps/my-app
npx expo prebuild --clean
```

### 問題3: 変更が反映されない

**モノレポ**:
```bash
# ウォッチモードを使用
cd packages/expo-settings
npm run watch
```

### 問題4: npmパッケージ名の衝突

**解決策**: スコープ付きパッケージ名を使用

```json
{
  "name": "@username/expo-settings"
}
```

```bash
npm publish --access public
```

## まとめ

スタンドアロンExpoモジュールを使用するには、2つの主要な方法があります：

### モノレポアプローチ

**手順**：
1. モノレポ構造の作成
2. `npx create-expo-module --no-example`
3. アプリにモジュールを依存関係として追加
4. モジュールのビルド
5. アプリのプリビルドと実行

**利点**：
- ローカル開発が容易
- 即座にテスト可能
- バージョン管理が不要

### npmパッケージ公開

**手順**：
1. モジュールの作成
2. サンプルアプリでテスト
3. `npm login`
4. `npm publish`
5. `npx expo install module-name`

**利点**：
- 広く配布可能
- バージョン管理
- コミュニティでの共有

**代替方法**：
- Tarballの作成（`npm pack`）
- ローカルnpmレジストリ（Verdaccio）
- プライベートパッケージ（EAS Build）

これらの方法を活用して、Expoモジュールを効率的に配布・使用できます。
