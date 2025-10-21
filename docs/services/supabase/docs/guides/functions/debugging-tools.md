# Supabase Edge Functionsのローカルデバッグ

## 概要

バージョンv1.171.0以降、Supabase CLIはv8インスペクタープロトコルを使用したEdge Functionsのデバッグをサポートしており、Chrome DevToolsやその他のChromiumベースのブラウザを通じてデバッグが可能です。

## デバッグ手順

### 1. インスペクトモードで関数を起動

```bash
supabase functions serve --inspect-mode brk
```

### 2. Chromeブラウザを開く

`chrome://inspect` に移動します。

### 3. ネットワークターゲットを設定

- 「Configure...」ボタンをクリック
- `127.0.0.1:8083` を入力
- 「Done」をクリック

### 4. Node用の専用DevToolsを開く

Remote Targetのリストから該当の関数を選択します。

### 5. ローカル関数にリクエストを送信

curlやPostmanなどを使用してリクエストを送信します。

### 6. DevToolsでコードを確認

DevToolsの「Sources」タブで以下に移動します:

```
file:// > home/deno/functions/<your-function-name>/index.ts
```

### 7. ブレークポイントを設定して実行を検査

- ブレークポイントを設定
- 関数の実行を検査
- 変数の値を確認

## 主な機能

- 最初の行でスクリプトの実行を一時停止
- Chrome DevToolsでコードを検査
- Supabase Edge Functionsをローカルでデバッグ

![Chrome DevToolsでのデバッグ](/docs/img/guides/functions/debug-chrome-devtools.png)
