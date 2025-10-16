# eslint-config-turbo

`eslint-config-turbo`は、Turborepoのハッシュに含まれていないコードで使用される環境変数を識別するのに役立つパッケージです。エディターやESLintの出力で未宣言の変数を強調表示します。

## インストール

pnpm、yarn、npm、bunなどのパッケージマネージャーを使用してインストールします。

```bash
pnpm add eslint-config-turbo --filter=@repo/eslint-config
```

## 使用方法

### Flat Config (`eslint.config.js`)

```javascript
import turboConfig from 'eslint-config-turbo/flat';

export default [
  ...turboConfig,
  // その他の設定
  {
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

### レガシー設定

```json
{
  "extends": ["turbo"],
  "plugins": ["turbo"],
  "rules": {
    "turbo/no-undeclared-env-vars": [
      "error",
      {
        "allowList": ["^ENV_[A-Z]+$"]
      }
    ]
  }
}
```

## 機能

このパッケージは、ESLint設定とルールを提供することで、開発者がTurborepoプロジェクト内の環境変数を識別・管理するのを支援します。

### `turbo/no-undeclared-env-vars`ルール

このルールは、Turborepoの設定で宣言されていない環境変数の使用を検出します。`allowList`オプションを使用して、特定のパターンの環境変数を許可できます。
