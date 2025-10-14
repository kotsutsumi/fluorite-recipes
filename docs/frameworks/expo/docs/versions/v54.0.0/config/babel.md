---
title: babel.config.js
description: Babel 設定ファイルのリファレンス。
---

import { Terminal } from '~/ui/components/Snippet';

Babel は、最新の JavaScript (ES6+) をモバイル デバイス上の JavaScript エンジンと互換性のあるバージョンに変換するための JavaScript コンパイラーとして使用されます。

`npx create-expo-app` を使用して作成された新しい Expo プロジェクトはそれぞれ Babel を自動的に構成し、[`babel-preset-expo`](https://github.com/expo/expo/tree/main/packages/babel-preset-expo) をデフォルトのプリセットとして使用します。 Babel 構成をカスタマイズする必要がない限り、**babel.config.js** ファイルを作成する必要はありません。

## babel.config.js を作成する

プロジェクトにカスタム Babel 構成が必要な場合は、以下の手順に従って、プロジェクト内に **babel.config.js** ファイルを作成する必要があります。

1. プロジェクトのルートに移動し、ターミナル内で次のコマンドを実行します。これにより、プロジェクトのルートに **babel.config.js** ファイルが生成されます。

<Terminal cmd={['$ npx expo customize babel.config.js']} />

2. **babel.config.js** ファイルには、次のデフォルト設定が含まれています。

```js babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  };
};
```

3. **babel.config.js** ファイルに変更を加えた場合は、Metro バンドラーを再起動して変更を適用し、Expo CLI から `--clear` オプションを使用して Metro バンドラー キャッシュをクリアする必要があります。

<Terminal cmd={['$ npx expo start --clear']} />

## babel-プリセット-expo

[`babel-preset-expo`](https://github.com/expo/expo/tree/main/packages/babel-preset-expo) は、Expo プロジェクトで使用されるデフォルトのプリセットです。これは、デフォルトの React Native プリセット (`@react-native/babel-preset`) を拡張し、デコレータ、ツリーシェイク Web ライブラリ、およびフォント アイコンの読み込みのサポートを追加します。
