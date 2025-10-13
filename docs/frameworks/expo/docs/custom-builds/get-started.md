# カスタムビルドの開始

EAS Buildをカスタムビルドで拡張する方法を学びます。

---

カスタムビルドを使用すると、ビルドプロセスの前、中、または後にコマンドを実行することで、プロジェクトのビルドプロセスをカスタマイズできます。カスタマイズされたビルドは、EAS CLIから、または[EAS Workflows](/eas/workflows/get-started)のようなReact Native CI/CDパイプラインでビルドを実行する際に実行できます。

## 1. カスタムビルド設定を作成する

開始するには、eas.jsonと同じレベルに.eas/build/hello-world.ymlという名前のディレクトリとファイルを作成します。両方のディレクトリの場所と名前は、EAS Buildがプロジェクトにカスタムビルド設定が含まれていることを識別するために重要です。

hello-world.yml内に、カスタムビルド設定を記述します。ファイル名は重要ではありません。好きな名前を付けることができます。唯一の要件は、ファイル拡張子が.ymlを使用することです。

ファイルに次のカスタムビルド設定ステップを追加します：

```yml
build:
  name: Hello World!
  steps:
    - run: echo "Hello, world!"
    # 組み込み関数（オプション）
```

実際のシナリオでは、[組み込み関数](/custom-builds/schema#built-in-eas-functions)を呼び出してビルドをトリガーします。

## 2. eas.jsonに`config`プロパティを追加する

カスタムビルド設定を使用するには、ビルドプロファイルの下のeas.jsonに`config`プロパティを追加します。

test.ymlファイルからカスタム設定を実行するために、`build`の下に`test`という新しい[ビルドプロファイル](/build/eas-json#build-profiles)を作成しましょう：

```json
{
  "build": {
    ...
    "test": {
      "config": "test.yml",
    },
}
```

各プラットフォームに個別の設定を使用する場合は、AndroidとiOS用に個別のYAML設定ファイルを作成できます。例えば：

```json
{
  "build": {
    ...
    "test": {
      "ios": {
        "config": "hello-ios.yml",
      },
      "android": {
        "config": "hello-android.yml",
      }
    }
  }
}
```

## 3. ビルドを実行する

カスタムビルド設定を使用してビルドを実行するには、次のコマンドを実行します：

```
eas build --platform ios --profile test
```

これにより、testプロファイルで定義されたカスタムビルド設定を使用してビルドが開始されます。
