# Node.jsの高度な使用方法

## 概要

Node.jsを使用するには、プロジェクトの`api`ディレクトリ内にファイルを作成します。追加の設定は必要ありません。

`src`のエントリーポイントは、デフォルト関数をエクスポートする`.js`、`.mjs`、または`.ts`ファイルに一致するglobである必要があります。

## Node.jsのヘルパーを無効化

Node.jsヘルパーを無効にするには:

1. ダッシュボードから、プロジェクトを選択してSettingsタブに移動します。
2. 設定の左側からEnvironment Variablesを選択します。
3. 新しい環境変数を追加します:
   - キー: `NODEJS_HELPERS`
   - 値: `0`
4. 環境変数をローカルにプルします:

```bash
vercel env pull
```

## Node.jsのプライベートnpmモジュール

プライベートnpmモジュールをインストールするには:

1. ダッシュボードから、プロジェクトを選択してSettingsタブに移動します。
2. 設定の左側からEnvironment Variablesを選択します。
3. 新しい環境変数を追加します:
   - キー: `NPM_TOKEN`(npmトークンを含む)
   - または、`~/.npmrc`の内容で`NPM_RC`を定義
4. 環境変数をローカルにプルします:

```bash
vercel env pull
```

## Node.jsのカスタムビルドステップ

`package.json`に`vercel-build`スクリプトを追加:

```json
{
  "scripts": {
    "vercel-build": "node ./build.js"
  }
}
```

ビルドスクリプトの例(`build.js`):

```javascript
const fs = require('fs');
fs.writeFile('built-time.js', `module.exports = '${new Date()}'`, (err) => {
  if (err) throw err;
  console.log('Build time file created successfully!');
});
```

Vercel関数の例(`api/index.js`):

```javascript
const BuiltTime = require('./built-time');
module.exports = (request, response) => {
  response.setHeader('content-type', 'text/plain');
  response.send(`
    This Vercel Function was built at ${new Date(BuiltTime)}.
    The current time is ${new Date()}
  `);
};
```
