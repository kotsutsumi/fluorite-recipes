# eslint-plugin-turbo

`eslint-plugin-turbo` パッケージは、Turborepoのハッシュに含まれていないコード内の環境変数を見つけるのに役立ちます。`turbo.json` に記載されていない環境変数は、ESLintエラーとしてエディタ内でハイライト表示されます。

## インストール

ESLint設定が保持されている場所に `eslint-plugin-turbo` をインストールします:

### パッケージマネージャーのインストールオプション:
- pnpm: `pnpm add eslint-plugin-turbo --filter=@repo/eslint-config`
- yarn: `yarn workspace @acme/eslint-config add eslint-plugin-turbo --dev`
- npm: `npm i --save-dev eslint-plugin-turbo -w @acme/eslint-config`
- bun: `bun install --dev eslint-plugin-turbo --filter=@acme/eslint-config`

## 使用方法 (Flat Config `eslint.config.js`)

ESLint v9でFlat Configを使用する場合:

```javascript
import turbo from 'eslint-plugin-turbo';

export default [turbo.configs['flat/recommended']];
```

または、特定のルールを設定します:

```javascript
import turbo from 'eslint-plugin-turbo';

export default [
  {
    plugins: {
      turbo,
    },
    rules: {
      'turbo/no-undeclared-env-vars': 'error',
    },
  },
];
```

## 例 (Flat Config `eslint.config.js`)

```javascript
import turbo from 'eslint-plugin-turbo';

export default [
  {
    plugins: {
      turbo,
    },
    rules: {
      'turbo/no-undeclared-env-vars': [
        'error',
        {
          allowList: ['^ENV_[A-Z]+$'],
        },
      ],
    },
  },
];
```

## 使用方法 (Legacy `eslintrc*`)

`.eslintrc` ファイルのpluginsセクションに `turbo` を追加します。

## ルール

### `turbo/no-undeclared-env-vars`

コード内で使用されているが `turbo.json` で宣言されていない環境変数を検出します。このルールは、Turborepoのキャッシュが適切に機能するために、すべての環境変数が明示的に宣言されていることを保証します。

#### オプション

- `allowList`: 正規表現パターンの配列。このパターンに一致する環境変数はチェックから除外されます。

#### 例

```javascript
{
  'turbo/no-undeclared-env-vars': [
    'error',
    {
      allowList: ['^ENV_[A-Z]+$', '^NEXT_PUBLIC_'],
    },
  ],
}
```
