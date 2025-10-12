# typescript

Next.jsは、プロジェクトにTypeScriptエラーが存在する場合、本番ビルド（`next build`）を失敗させます。

## 設定

組み込みの型チェックステップを無効にするには、`next.config.js`を変更します：

```javascript filename="next.config.js"
module.exports = {
  typescript: {
    // !! 警告 !!
    // プロジェクトに型エラーがある場合でも、本番ビルドが
    // 正常に完了することを危険に許可します。
    // !! 警告 !!
    ignoreBuildErrors: true,
  },
}
```

## 重要な警告

> **警告**: `ignoreBuildErrors: true`を使用する場合は、ビルドまたはデプロイプロセスの一部として型チェックを実行していることを確認してください。そうしないと、非常に危険になる可能性があります。

## 推奨されるアプローチ

`ignoreBuildErrors`を使用する代わりに、以下のいずれかの方法で型チェックを確実に行うことをお勧めします：

### CI/CDパイプラインでの型チェック

```yaml filename=".github/workflows/ci.yml"
name: Type Check
on: [push, pull_request]
jobs:
  typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run type-check
```

### package.jsonスクリプト

```json filename="package.json"
{
  "scripts": {
    "type-check": "tsc --noEmit",
    "build": "npm run type-check && next build"
  }
}
```

### プリコミットフック

```javascript filename=".husky/pre-commit"
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npm run type-check
```

## TypeScript設定のカスタマイズ

Next.jsは、TypeScript設定を自動的に最適化します。ただし、`tsconfig.json`でカスタマイズできます：

```json filename="tsconfig.json"
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true
  }
}
```

## 増分型チェック

大規模なプロジェクトでは、増分型チェックを有効にしてパフォーマンスを向上させることができます：

```json filename="tsconfig.json"
{
  "compilerOptions": {
    "incremental": true
  }
}
```

## バージョン履歴

| バージョン | 変更内容 |
|-----------|---------|
| `v10.2.1` | `typescript.ignoreBuildErrors`が追加されました |

## 関連項目

- [TypeScript](/docs/app/building-your-application/configuring/typescript)
- [型チェック](/docs/app/building-your-application/configuring/typescript#type-checking)
