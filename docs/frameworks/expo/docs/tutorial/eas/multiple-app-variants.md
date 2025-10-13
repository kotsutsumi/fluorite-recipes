# 複数のアプリバリアントを設定

単一のデバイスに複数のアプリバリアントをインストールするために動的アプリ設定を設定する方法を学びます。

## 動的設定のためにapp.config.jsを追加

プロジェクトのルートに、`config`を引数として受け取るデフォルト関数をエクスポートする`app.config.js`という新しいファイルを作成：

```javascript
export default ({ config }) => ({
  ...config,
});
```

## 環境に基づいて動的な値を更新

ビルドタイプを識別するための環境変数を追加：

```javascript
const IS_DEV = process.env.APP_VARIANT === 'development';
const IS_PREVIEW = process.env.APP_VARIANT === 'preview';

const getUniqueIdentifier = () => {
  if (IS_DEV) {
    return 'com.yourname.stickersmash.dev';
  }

  if (IS_PREVIEW) {
    return 'com.yourname.stickersmash.preview';
  }

  return 'com.yourname.stickersmash';
};

const getAppName = () => {
  if (IS_DEV) {
    return 'StickerSmash (Dev)';
  }

  if (IS_PREVIEW) {
    return 'StickerSmash (Preview)';
  }

  return 'StickerSmash: Emoji Stickers';
};

export default ({ config }) => ({
  ...config,
  name: getAppName(),
  ios: {
    ...config.ios,
    bundleIdentifier: getUniqueIdentifier(),
  },
  android: {
    ...config.android,
    package: getUniqueIdentifier(),
  },
});
```

## eas.jsonを設定

`APP_VARIANT`環境変数を含めるように`eas.json`を更新：

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "env": {
        "APP_VARIANT": "development"
      }
    },
    "preview": {
      "distribution": "internal",
      "env": {
        "APP_VARIANT": "preview"
      }
    },
    "production": {}
  }
}
```

## まとめ

環境変数とEAS設定を使用して、単一のデバイスに異なるアプリバリアント（開発、プレビュー、本番）をインストールできるようになりました。
