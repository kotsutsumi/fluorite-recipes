# プログレッシブWebアプリ（PWA）

プログレッシブWebアプリ（PWA）は、ユーザーのデバイスにインストールしてオフラインで使用できるWebサイトです。Expoはネイティブアプリを推奨していますが、PWAはデスクトップユーザーにとって優れた選択肢です。

## ファビコン

Expo CLIは、`app.json`の`web.favicon`フィールドに基づいて`favicon.ico`を自動的に生成します：

```json
{
  "expo": {
    "web": {
      "favicon": "./assets/favicon.png"
    }
  }
}
```

### カスタムファビコンの配置

`public`ディレクトリにカスタムファビコンを配置することもできます：

```
public/
├── favicon.ico
├── logo192.png
└── logo512.png
```

## マニフェストファイル

PWAはマニフェストファイルを使用してアプリのメタデータを記述します。

### マニフェストの作成手順

#### 1. manifest.jsonの作成

`public/manifest.json`を作成します：

```json
{
  "short_name": "Expo App",
  "name": "Expo Router Sample",
  "icons": [
    {
      "src": "favicon.ico",
      "sizes": "64x64 32x32 24x24 16x16",
      "type": "image/x-icon"
    },
    {
      "src": "logo192.png",
      "type": "image/png",
      "sizes": "192x192"
    },
    {
      "src": "logo512.png",
      "type": "image/png",
      "sizes": "512x512"
    }
  ],
  "start_url": ".",
  "display": "standalone",
  "theme_color": "#000000",
  "background_color": "#ffffff"
}
```

### マニフェストフィールドの説明

- **`short_name`**: アプリの短い名前（12文字以下を推奨）
- **`name`**: アプリのフルネーム
- **`icons`**: さまざまなサイズのアプリアイコン
- **`start_url`**: アプリの起動URL
- **`display`**: 表示モード（`standalone`、`fullscreen`、`minimal-ui`、`browser`）
- **`theme_color`**: テーマカラー
- **`background_color`**: スプラッシュスクリーンの背景色

#### 2. ロゴファイルの追加

`public`ディレクトリにロゴファイルを追加します：

```
public/
├── favicon.ico
├── logo192.png  # 192x192ピクセル
└── logo512.png  # 512x512ピクセル
```

#### 3. HTMLファイルにマニフェストをリンク

HTMLファイルの`<head>`タグにマニフェストへのリンクを追加します：

```html
<link rel="manifest" href="/manifest.json" />
```

Expoプロジェクトでは、これは通常`app/_layout.tsx`または`app/index.html`で行います。

## Service Workers

Service Workersはオフラインサポートを追加します。ExpoドキュメントではGoogleのWorkboxの使用を推奨していますが、潜在的なキャッシング問題について警告しています。

> **警告**: Service Workersを追加する際は注意してください。Web上で予期しない動作を引き起こすことが知られています。

### Workboxを使用したセットアップ

#### 1. Workboxのインストール

```bash
npm install --save-dev workbox-cli workbox-webpack-plugin
```

#### 2. Service Workerの登録

`app/_layout.tsx`または`index.js`で:

```typescript
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.log('SW registered:', registration);
      })
      .catch((error) => {
        console.log('SW registration failed:', error);
      });
  });
}
```

#### 3. Workbox設定の生成

`workbox-config.js`を作成します：

```javascript
module.exports = {
  globDirectory: 'dist/',
  globPatterns: [
    '**/*.{html,js,css,png,svg,jpg,gif,json,woff,woff2,eot,ico}'
  ],
  swDest: 'dist/service-worker.js',
  clientsClaim: true,
  skipWaiting: true,
};
```

#### 4. ビルドスクリプトの追加

`package.json`にスクリプトを追加します：

```json
{
  "scripts": {
    "build": "expo export -p web",
    "generate-sw": "workbox generateSW workbox-config.js"
  }
}
```

#### 5. Service Workerの生成

```bash
npm run build
npm run generate-sw
```

### Service Workerの機能

#### オフラインキャッシング

Service Workersは、アプリのリソースをキャッシュしてオフラインアクセスを可能にします。

#### バックグラウンド同期

ネットワークが利用可能になったときにデータを同期できます。

#### プッシュ通知

Webアプリでプッシュ通知を送信できます。

## インストール体験

### インストールプロンプト

ブラウザは、マニフェストとService Workerが正しく設定されている場合、自動的にインストールプロンプトを表示します。

### カスタムインストールボタン

カスタムインストールボタンを追加できます：

```typescript
import { useEffect, useState } from 'react';

export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    });
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response: ${outcome}`);
      setDeferredPrompt(null);
      setShowInstallButton(false);
    }
  };

  if (!showInstallButton) {
    return null;
  }

  return (
    <button onClick={handleInstall}>
      アプリをインストール
    </button>
  );
}
```

## テストとデバッグ

### Chrome DevTools

Chrome DevToolsのApplicationタブでPWAをテストできます：

1. **Manifest**: マニフェストファイルの検証
2. **Service Workers**: Service Workerの状態確認
3. **Storage**: キャッシュとストレージの管理

### Lighthouse

LighthouseでPWAスコアを確認できます：

```bash
npx lighthouse https://yourapp.com --view
```

## ベストプラクティス

### 1. HTTPSを使用

PWAはHTTPS接続が必要です（localhostを除く）。

### 2. レスポンシブデザイン

さまざまなデバイスサイズに対応するレスポンシブデザインを実装してください。

### 3. パフォーマンス最適化

ロード時間を短縮し、ユーザーエクスペリエンスを向上させてください。

### 4. アクセシビリティ

アクセシビリティ標準に準拠してください。

## まとめ

PWAは、Webアプリをネイティブアプリのように動作させる強力な技術です。Expoではネイティブアプリを推奨していますが、デスクトップユーザーやクロスプラットフォーム展開にはPWAが優れた選択肢となります。
