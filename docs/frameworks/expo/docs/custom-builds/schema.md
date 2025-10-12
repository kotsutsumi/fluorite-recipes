# カスタムビルド設定スキーマ

EAS Buildのカスタムビルド用のYAML設定について学びます。

---

このドキュメントは、EAS Buildでカスタムビルドを構成するためのYAML構文について説明します。

## 主要なハイライト

- EAS Buildのカスタムビルド用のYAML構文の詳細な説明
- `build`、`functions`、`import`セクションの設定オプション
- `eas/build`、`eas/checkout`、`eas/maestro_test`などの組み込みEAS関数の包括的なリスト
- ビルド設定を使用およびカスタマイズする方法の例
- AndroidおよびiOS向けのカスタムビルドプロセスを作成するためのステップバイステップガイダンス

## 主要な設定セクション

### build セクション
ビルドプロセスの主要な設定を定義します：

```yml
build:
  name: My Custom Build
  steps:
    - run: echo "Building..."
```

### functions セクション
再利用可能な関数を定義します：

```yml
functions:
  my_function:
    name: Custom Function
    command: ./scripts/my-script.sh
```

### import セクション
他の設定ファイルをインポートします：

```yml
import:
  - path: ./shared-config.yml
```

## 組み込みEAS関数

EAS Buildは、一般的なビルドタスク用の組み込み関数を提供します：

- `eas/build` - 標準のビルドプロセスを実行
- `eas/checkout` - ソースコードをチェックアウト
- `eas/maestro_test` - Maestroテストを実行
- その他多数

## 例

### 基本的な例

```yml
build:
  name: Simple Build
  steps:
    - eas/checkout
    - run: npm install
    - eas/build
```

### 高度な例

```yml
build:
  name: Advanced Build
  steps:
    - eas/checkout
    - run: npm ci
    - run: npm run test
    - eas/build
    - run: npm run post-build
```

このスキーマドキュメントは、EAS Buildでカスタムビルドプロセスを作成するための完全なリファレンスを提供します。
