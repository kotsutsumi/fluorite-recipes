# Android用のクラウドビルドを作成して実行

## 開発プロファイル用のビルドを作成

Androidの場合、開発ビルドは.apk形式である必要があります。ビルドを作成するには：

1. `eas.json`で、`build.development`プロファイルの下で`developmentClient`が`true`に設定されていることを確認
2. EAS buildコマンドを実行：

```terminal
eas build --platform android --profile development
```

コマンドは以下を促します：
- Androidアプリケーション IDを確認
- 新しいAndroid Keystoreを生成

## Androidデバイス

### 開発ビルドをインストール

インストールのオプション：
- Expo Orbitを使用
- QRコードインストール方法を使用

#### Expo Orbit
- USB経由でAndroidデバイスを接続
- OrbitメニューバーアプリOpen
- デバイスを選択
- EASダッシュボードで「Open with Orbit」をクリック

#### QRコード方法
- Installボタンをクリック
- デバイスのカメラでQRコードをスキャン
- .apkファイルをダウンロード
- アプリをインストール（「Unsafe app」警告を無視）

### 開発ビルドを実行

開発サーバーを起動：

```terminal
npx expo start
```

ターミナルで`a`を押してプロジェクトを開く

## Androidエミュレーター

インストール方法はAndroidデバイスと同様：
- EAS CLIプロンプトを使用
- Expo Orbitを使用
- 手動で.apkをインストール

### 開発ビルドを実行

Androidデバイスと同じ：

```terminal
npx expo start
```

ターミナルで`a`を押してプロジェクトを開く

## まとめ

EAS Buildを使用してAndroid開発ビルドを正常に作成して実行し、.apkと.aabファイル形式について学びました。
