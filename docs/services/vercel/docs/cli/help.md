# vercel help

`vercel help` コマンドは、ターミナル内で利用可能なすべてのVercel CLIコマンドと[オプション](/docs/cli/global-options)のリストを生成します。第2引数に有効なVercel CLIコマンドを指定すると、そのコマンドに関するより詳細な情報を出力します。

代替として、特定のコマンドについてのヘルプ情報を取得するには、[`--help`グローバルオプション](/docs/cli/global-options#help)を追加することもできます。

## 使用方法

```bash
vercel help
```

`vercel help` コマンドを使用して、Vercel CLIコマンドとオプションのリストを生成します。

## 拡張された使用方法

```bash
vercel help [command]
```

`vercel help` コマンドを使用して、特定のVercel CLIコマンドに関する詳細情報を生成します。

## 例

```bash
vercel help deploy
```

deployコマンドの詳細なヘルプ情報を表示します。

```bash
vercel help env
```

envコマンドの詳細なヘルプ情報を表示します。

## 代替方法

コマンドに`--help`オプションを追加することでも同じ情報を取得できます：

```bash
vercel deploy --help
```
