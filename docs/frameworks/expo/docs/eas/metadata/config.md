# EAS Metadataの設定

> EAS Metadataはプレビュー段階であり、破壊的な変更が加えられる可能性があります。

EAS Metadataは、プロジェクトのルートにある`store.config.json`ファイルを通じて設定されます。設定は複数のアプローチをサポートしています：

## 静的ストア設定

App Storeメタデータの基本的なJSON設定：

```json
{
  "configVersion": 0,
  "apple": {
    "info": {
      "en-US": {
        "title": "Awesome App",
        "subtitle": "Your self-made awesome app",
        "description": "The most awesome app you have ever seen",
        "keywords": ["awesome", "app"],
        "marketingUrl": "https://example.com/en/promo",
        "supportUrl": "https://example.com/en/support",
        "privacyPolicyUrl": "https://example.com/en/privacy"
      }
    }
  }
}
```

## 動的ストア設定

現在の年などの動的な値の場合、JavaScriptの設定ファイルを使用します：

```javascript
// store.config.js
const config = require('./store.config.json');

const year = new Date().getFullYear();
config.apple.copyright = `${year} Acme, Inc.`;

module.exports = config;
```

`eas.json`で設定：

```json
{
  "submit": {
    "production": {
      "ios": {
        "metadataPath": "./store.config.js"
      }
    }
  }
}
```

## 外部コンテンツを含むストア設定

外部コンテンツを動的に取得するためのサポート：

```javascript
// store.config.js
const config = require('./store.config.json');

module.exports = async () => {
  const year = new Date().getFullYear();
  const info = await fetchLocalizations('...').then(response => response.json());

  config.apple.copyright = `${year} Acme, Inc.`;
  config.apple.info = info;

  return config;
};
```

主要な注記：
- JSONとJavaScriptの設定ファイルをサポート
- 動的コンテンツを生成可能
- 外部ローカリゼーションデータの取得を許可
- 設定が必要
