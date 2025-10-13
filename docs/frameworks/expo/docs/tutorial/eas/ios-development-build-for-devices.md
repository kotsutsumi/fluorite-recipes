# iOSデバイス用のクラウドビルドを作成して実行

## 前提条件

iOSデバイス用の開発ビルドを作成するには、以下が必要です：
- Apple Developer Account
- iOS 16以降でDeveloper Modeを有効化

## プロビジョニングプロファイル

### iOSデバイスを登録

EAS CLIを使用してデバイスを登録：

```bash
eas device:create
```

プロンプトに従って：
- アカウントを確認
- Apple IDを入力
- 登録URLを生成

### プロファイルをダウンロードしてインストール

1. iOSデバイスで提供されたリンクを開く
2. 「Download Profile」をタップ
3. 設定アプリを開く
4. プロビジョニングプロファイルをインストール

## iOSデバイス用の開発ビルド

### ビルドを作成

EAS buildコマンドを実行：

```bash
eas build --platform ios --profile development
```

このプロセスは以下を行います：
- バンドル識別子を設定
- Apple Distribution Certificateを生成
- ad hocビルド用のデバイスを選択

### ビルドをインストール

2つのインストール方法：
1. Expo Orbit
   - USB経由でデバイスを接続
   - Orbitアプリを開く
   - デバイスとビルドを選択

2. QRコード方法
   - ビルド成果物で「Install」をクリック
   - デバイスでQRコードをスキャン

### 開発ビルドを実行

1. 開発サーバーを起動：
```bash
npx expo start
```

2. デバイスで：
   - アプリを開く
   - Expoアカウントにログイン
   - 開発サーバーを選択

## まとめ

EAS Buildを使用してiOSデバイス用のクラウドビルドを正常に作成して実行し、物理デバイスでの開発とテストを可能にしました。
