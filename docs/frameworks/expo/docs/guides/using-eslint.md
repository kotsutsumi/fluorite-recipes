# ESLintとPrettierを使用する

ExpoプロジェクトでESLintとPrettierを設定し、コード品質を維持する方法を学びます。

## 概要

**ESLint**: JavaScriptリンターで、コードのエラーを検出し修正します。

**Prettier**: コードフォーマッターで、一貫したコードスタイルを保証します。

**主な利点**：
- コードエラーの早期検出
- 一貫したコードスタイル
- 自動フォーマット
- チーム開発での統一

## サポートされる設定形式

### Flat Config（SDK 53+）

**使用ファイル**: `eslint.config.js`

**特徴**：
- モダンなESLint設定形式
- 環境固有のグローバル設定
- `eslint-config-expo`を拡張

### Legacy Config（SDK 52以前）

**使用ファイル**: `.eslintrc.js`

**特徴**：
- 従来のESLint設定形式
- 手動での環境設定が必要

## セットアップ

### ステップ1: ESLintのインストール

```bash
# ESLintをインストールし、基本設定を作成
npx expo lint

# または手動でインストール
npx expo install --dev eslint
```

このコマンドは以下を実行します：
- ESLintパッケージのインストール
- プロジェクトに適した設定ファイルの作成
- 必要な依存関係の追加

### ステップ2: Prettierのインストール

```bash
npx expo install --dev prettier eslint-config-prettier eslint-plugin-prettier
```

**インストールされるパッケージ**：
- `prettier`: コードフォーマッター
- `eslint-config-prettier`: ESLintとPrettierの競合を防ぐ
- `eslint-plugin-prettier`: PrettierをESLintルールとして実行

## Flat Config（SDK 53+）の設定

### eslint.config.js

```javascript
const { config } = require('@expo/eslint-config/base');

module.exports = [
  ...config,
  {
    ignores: [
      // ビルド成果物
      'dist/*',
      '.expo/*',
      'node_modules/*',

      // プラットフォーム固有
      'android/*',
      'ios/*',

      // 設定ファイル
      'metro.config.js',
      'babel.config.js',
    ],
  },
  {
    rules: {
      // カスタムルールを追加
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
];
```

### 環境設定

```javascript
const { config: expoConfig } = require('@expo/eslint-config/base');

module.exports = [
  ...expoConfig,
  {
    // Node.js環境（ビルドスクリプト用）
    files: ['**/*.config.{js,ts}', 'scripts/**/*.{js,ts}'],
    languageOptions: {
      globals: {
        ...require('globals').node,
      },
    },
  },
  {
    // Hermes環境（React Native用）
    files: ['app/**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      globals: {
        // Hermes固有のグローバル
        HermesInternal: 'readonly',
      },
    },
  },
  {
    // ブラウザ環境（Web用）
    files: ['**/*.web.{js,jsx,ts,tsx}'],
    languageOptions: {
      globals: {
        ...require('globals').browser,
      },
    },
  },
];
```

## Legacy Config（SDK 52以前）の設定

### .eslintrc.js

```javascript
module.exports = {
  extends: ['expo', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
  },
  env: {
    'react-native/react-native': true,
  },
};
```

### ファイル固有の環境設定

```javascript
module.exports = {
  extends: ['expo', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
  },
  overrides: [
    {
      // Node.js環境
      files: ['**/*.config.js', 'scripts/**/*.js'],
      env: {
        node: true,
      },
    },
    {
      // ブラウザ環境
      files: ['**/*.web.{js,jsx,ts,tsx}'],
      env: {
        browser: true,
      },
    },
  ],
};
```

## Prettierの設定

### .prettierrc

```json
{
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5",
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

### .prettierignore

```
# 依存関係
node_modules/

# ビルド成果物
dist/
.expo/
android/
ios/

# 設定ファイル
*.config.js
*.config.ts

# その他
.git/
coverage/
```

## .eslintignore

```
# 依存関係
node_modules/

# ビルド成果物
dist/
.expo/
android/
ios/

# プラットフォーム固有
*.native.js
*.android.js
*.ios.js

# 設定ファイル
metro.config.js
babel.config.js
```

## VS Code統合

### 拡張機能のインストール

1. **ESLint拡張機能**: [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
2. **Prettier拡張機能**: [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

### .vscode/settings.json

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

## package.jsonスクリプト

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write \"**/*.{js,jsx,ts,tsx,json,md}\"",
    "format:check": "prettier --check \"**/*.{js,jsx,ts,tsx,json,md}\"",
    "type-check": "tsc --noEmit"
  }
}
```

**スクリプトの使用**：
```bash
# リントチェック
npm run lint

# 自動修正
npm run lint:fix

# フォーマット
npm run format

# フォーマットチェック
npm run format:check

# 型チェック
npm run type-check
```

## カスタムルールの例

### TypeScript向けルール

```javascript
module.exports = [
  // ...他の設定
  {
    rules: {
      // 未使用変数の警告（_で始まる引数は除外）
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],

      // 明示的な型定義を推奨
      '@typescript-eslint/explicit-function-return-type': [
        'warn',
        {
          allowExpressions: true,
          allowTypedFunctionExpressions: true,
        },
      ],

      // any型の使用を警告
      '@typescript-eslint/no-explicit-any': 'warn',

      // 非null表明の使用を警告
      '@typescript-eslint/no-non-null-assertion': 'warn',
    },
  },
];
```

### React向けルール

```javascript
module.exports = [
  // ...他の設定
  {
    rules: {
      // Hooksの依存関係ルール
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // JSXでのフラグメント使用
      'react/jsx-fragments': ['warn', 'syntax'],

      // 不要なフラグメントを警告
      'react/jsx-no-useless-fragment': 'warn',

      // key propの使用を強制
      'react/jsx-key': 'error',
    },
  },
];
```

### Import順序の設定

```bash
# eslint-plugin-importのインストール
npx expo install --dev eslint-plugin-import
```

```javascript
module.exports = [
  // ...他の設定
  {
    plugins: ['import'],
    rules: {
      'import/order': [
        'warn',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
    },
  },
];
```

## CI/CDでの使用

### GitHub Actions

```yaml
name: Lint and Format

on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run ESLint
        run: npm run lint

      - name: Run Prettier check
        run: npm run format:check

      - name: TypeScript type check
        run: npm run type-check
```

## トラブルシューティング

### 問題1: ESLintサーバーが更新を反映しない

**原因**: VS CodeのESLintサーバーがキャッシュを使用

**解決策**：
1. VS Codeコマンドパレットを開く（Cmd/Ctrl + Shift + P）
2. "ESLint: Restart ESLint Server"を実行

### 問題2: リントが遅い

**原因**: 大きなディレクトリをスキャンしている

**解決策**：
```.eslintignore
# 大きなディレクトリを無視
node_modules/
.expo/
dist/
android/
ios/
coverage/
```

### 問題3: PrettierとESLintの競合

**原因**: フォーマットルールが競合

**解決策**：
```bash
# eslint-config-prettierをインストール
npx expo install --dev eslint-config-prettier
```

```javascript
// eslint.config.jsで最後に追加
const prettierConfig = require('eslint-config-prettier');

module.exports = [
  // ...他の設定
  prettierConfig,
];
```

## ファイル固有の設定

### インラインコメント

```typescript
// ESLintルールを無効化
/* eslint-disable no-console */
console.log('This is allowed');
/* eslint-enable no-console */

// 単一行でルールを無効化
console.log('Debug info'); // eslint-disable-line no-console

// 次の行でルールを無効化
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const data: any = fetchData();

// ファイル全体でルールを無効化
/* eslint-disable @typescript-eslint/no-unused-vars */
```

### 環境指定コメント

```javascript
/* eslint-env node */
const fs = require('fs');

/* eslint-env browser */
window.addEventListener('load', () => {
  console.log('Page loaded');
});
```

## ベストプラクティス

### 1. 早期統合

プロジェクト開始時からESLintとPrettierを設定します。

### 2. チーム統一

```.editorconfig
root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.md]
trim_trailing_whitespace = false
```

### 3. プリコミットフック

```bash
# Huskyのインストール
npx expo install --dev husky lint-staged

# Huskyの初期化
npx husky init
```

**package.json**:
```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md}": [
      "prettier --write"
    ]
  }
}
```

**.husky/pre-commit**:
```bash
#!/bin/sh
npx lint-staged
```

### 4. 段階的な導入

既存プロジェクトでは、段階的にルールを有効化：

```javascript
module.exports = [
  // ...他の設定
  {
    rules: {
      // 最初は警告のみ
      'no-console': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',

      // 段階的にエラーに変更
      // 'no-console': 'error',
      // '@typescript-eslint/no-unused-vars': 'error',
    },
  },
];
```

## まとめ

ESLintとPrettierは、以下の機能を提供します：

### ESLint
- **コード品質**: エラーと潜在的なバグを検出
- **ベストプラクティス**: コーディング標準を強制
- **自動修正**: 多くの問題を自動的に修正

### Prettier
- **一貫性**: 統一されたコードスタイル
- **自動フォーマット**: 保存時に自動フォーマット
- **チーム統一**: コードレビューでのスタイル議論を削減

### 設定オプション
- **Flat Config**: SDK 53+の推奨形式
- **Legacy Config**: SDK 52以前の形式
- **VS Code統合**: リアルタイムリント

### ベストプラクティス
- プロジェクト開始時から統合
- チーム全体で設定を統一
- プリコミットフックの使用
- CI/CDでの自動チェック

これらのツールを活用して、高品質で一貫性のあるコードベースを維持できます。
