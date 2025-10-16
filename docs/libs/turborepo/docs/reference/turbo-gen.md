# @turbo/gen

このパッケージは、[Turborepoコードジェネレーター](/docs/reference/generate)での型定義に使用します。

## コード例

```ts title="./turbo/generators/my-generator.ts"
import type { PlopTypes } from "@turbo/gen";

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  // ジェネレーターを作成
  plop.setGenerator("ジェネレーター名", {
    description: "ジェネレーターの説明",
    // ユーザーから情報を収集
    prompts: [
      ...
    ],
    // プロンプトに基づいてアクションを実行
    actions: [
      ...
    ],
  });
}
```

詳細については、[コード生成ガイド](/docs/guides/generating-code)を参照してください。

## 主要なポイント

- Turborepoエコシステムの一部
- コードジェネレーター用の型定義を提供
- ジェネレーター設定にPlopを使用
- カスタムコード生成テンプレートの作成が可能

## 使用例

### 基本的なコンポーネントジェネレーター

```ts title="./turbo/generators/component.ts"
import type { PlopTypes } from "@turbo/gen";

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  plop.setGenerator("component", {
    description: "新しいReactコンポーネントを作成",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "コンポーネント名は何ですか？",
      },
      {
        type: "list",
        name: "type",
        message: "コンポーネントのタイプは？",
        choices: ["functional", "class"],
      },
    ],
    actions: [
      {
        type: "add",
        path: "src/components/{{pascalCase name}}/{{pascalCase name}}.tsx",
        templateFile: "templates/component.hbs",
      },
      {
        type: "add",
        path: "src/components/{{pascalCase name}}/index.ts",
        templateFile: "templates/index.hbs",
      },
    ],
  });
}
```

### パッケージジェネレーター

```ts title="./turbo/generators/package.ts"
import type { PlopTypes } from "@turbo/gen";

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  plop.setGenerator("package", {
    description: "新しいパッケージを作成",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "パッケージ名は何ですか？",
      },
      {
        type: "input",
        name: "description",
        message: "パッケージの説明は？",
      },
    ],
    actions: [
      {
        type: "add",
        path: "packages/{{kebabCase name}}/package.json",
        templateFile: "templates/package.json.hbs",
      },
      {
        type: "add",
        path: "packages/{{kebabCase name}}/src/index.ts",
        templateFile: "templates/package-index.hbs",
      },
      {
        type: "add",
        path: "packages/{{kebabCase name}}/tsconfig.json",
        templateFile: "templates/tsconfig.json.hbs",
      },
    ],
  });
}
```

## 利用可能なヘルパー

`@turbo/gen` は、テンプレート内で使用できる複数のヘルパー関数を提供します:

- `camelCase`: 文字列をキャメルケースに変換
- `pascalCase`: 文字列をパスカルケースに変換
- `kebabCase`: 文字列をケバブケースに変換
- `snakeCase`: 文字列をスネークケースに変換
- `upperCase`: 文字列を大文字に変換
- `lowerCase`: 文字列を小文字に変換

## プロンプトタイプ

### input
テキスト入力を収集します。

```ts
{
  type: "input",
  name: "componentName",
  message: "コンポーネント名は？",
}
```

### list
選択肢のリストから1つを選択します。

```ts
{
  type: "list",
  name: "framework",
  message: "どのフレームワークを使用しますか？",
  choices: ["React", "Vue", "Svelte"],
}
```

### confirm
はい/いいえの質問。

```ts
{
  type: "confirm",
  name: "useTypeScript",
  message: "TypeScriptを使用しますか？",
}
```

### checkbox
複数の選択肢を選択できます。

```ts
{
  type: "checkbox",
  name: "features",
  message: "含める機能を選択してください:",
  choices: ["Routing", "State Management", "Testing"],
}
```

## アクションタイプ

### add
新しいファイルを作成します。

```ts
{
  type: "add",
  path: "src/{{name}}.ts",
  templateFile: "templates/file.hbs",
}
```

### modify
既存のファイルを変更します。

```ts
{
  type: "modify",
  path: "package.json",
  pattern: /"scripts": {/,
  template: '"scripts": {\n    "{{name}}": "{{command}}",',
}
```

### append
ファイルにコンテンツを追加します。

```ts
{
  type: "append",
  path: "src/index.ts",
  template: "export * from './{{name}}';",
}
```

## ベストプラクティス

1. **明確な命名**: ジェネレーターとテンプレートには説明的な名前を使用します
2. **バリデーション**: プロンプトでユーザー入力を検証します
3. **テンプレートの整理**: テンプレートファイルを専用のディレクトリに保管します
4. **ドキュメント化**: 各ジェネレーターの目的と使用方法を文書化します
5. **テスト**: ジェネレーターをテストして、期待通りのファイルが生成されることを確認します

## 関連リンク

- [コード生成ガイド](/docs/guides/generating-code)
- [Plop公式ドキュメント](https://plopjs.com/)
- [Turborepoジェネレーター](/docs/reference/generate)
