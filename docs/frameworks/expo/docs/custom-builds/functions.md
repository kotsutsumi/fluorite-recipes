# TypeScript関数

カスタムビルド設定でEAS Build関数を作成および使用する方法を学びます。

* * *

EAS Build関数は、カスタムビルドの機能を拡張する優れた方法です。再利用可能なステップを作成し、JavaScript、TypeScript、またはBashでロジックを記述できます（詳細は[設定スキーマの`command`](/custom-builds/schema#functionsfunction_namecommand)を参照）。このガイドでは、TypeScriptで関数を作成する手順を説明します。

## 1. EAS Build関数モジュールの初期化

EAS Build関数を作成する最も簡単な方法は、`create-eas-build-function` CLIツールを使用することです。eas.jsonファイルと同じディレクトリから次のコマンドを実行することで、新しいカスタムTypeScript関数を作成できます：

Terminal

```
npx create-eas-build-function@latest ./.eas/build/myFunction
```

これにより、.eas/buildディレクトリに`myFunction`という新しいモジュールが作成されます。このモジュールには、事前生成されたモジュール設定と、デフォルトのTypeScript関数テンプレートを含むindex.tsファイルを含むsrcディレクトリが含まれます。

.eas/build/myFunction/src/index.ts

```typescript
// このファイルは`create-eas-build-function`コマンドによって自動生成されました。
// 独自のカスタムビルド関数の書き方については、README.mdを参照してください。

import { BuildStepContext } from '@expo/steps';

// interface FunctionInputs {
//   // ここで入力値の型と必須かどうかを指定します
//   // 例: name: BuildStepInput<BuildStepInputValueTypeName.STRING, true>;
// }

// interface FunctionOutputs {
//   // ここで関数の出力と必須かどうかを指定します
//   // 例: name: BuildStepOutput<true>;
// }

async function myFunction(
  ctx: BuildStepContext
  // {
  //   inputs,
  //   outputs,
  //   env,
  // }: {
  //   inputs: FunctionInputs;
  //   outputs: FunctionOutputs;
  //   env: Record<string, string>;
  // }
) {
  // ここに関数のロジックを実装します
  ctx.logger.info('Hello from myFunction!');
}

export default myFunction;
```

## 2. 関数の実装

生成されたテンプレートを使用して、関数のロジックを実装します：

```typescript
import { BuildStepContext } from '@expo/steps';

async function myCustomFunction(ctx: BuildStepContext) {
  ctx.logger.info('カスタム関数を実行中...');

  // ビルドロジックをここに実装

  ctx.logger.info('カスタム関数が完了しました！');
}

export default myCustomFunction;
```

## 3. ビルド設定で関数を使用する

カスタムビルド設定YAMLファイルで関数を参照します：

```yml
build:
  name: My Build with Custom Function
  steps:
    - eas/checkout
    - myFunction
    - eas/build
```

これにより、TypeScriptで記述されたカスタム関数を使用してビルドプロセスを拡張できます。
