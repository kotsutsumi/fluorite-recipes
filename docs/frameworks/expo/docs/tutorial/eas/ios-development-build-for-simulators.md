# iOSシミュレーター用のクラウドビルドを作成して実行

EAS Buildを使用してiOSシミュレーター用の開発ビルドを設定する方法を学びます。

## eas.jsonでシミュレータービルドプロファイルを作成

`eas.json`に、`ios.simulator`プロパティを`true`に設定した`ios-simulator`という新しいビルドプロファイルを追加：

```json
{
  "build": {
    "ios-simulator": {
      "extends": "development",
      "ios": {
        "simulator": true
      }
    }
  }
}
```

## iOSシミュレーター用の開発ビルド

### 作成

EAS buildコマンドを実行：

```bash
eas build --platform ios --profile ios-simulator
```

これにより以下が促されます：
- iOSバンドル識別子を指定
- 暗号化の使用を確認

### インストール

ビルドが完了したら、EAS CLIはiOSシミュレーターでビルドを実行することを提案します。

または、Expo Orbitを使用して開発ビルドをインストールできます。

### 実行

開発サーバーを起動：

```bash
npx expo start
```

ターミナルで`i`を押してiOSシミュレーターでプロジェクトを開きます。

## まとめ

この章では、以下の方法を学びました：
- iOSシミュレーター用のビルドプロファイルを作成
- EAS Buildを使用して開発ビルドを生成
- iOSシミュレーターでビルドをインストールして実行

ドキュメントは、Expoを使用してiOSシミュレータービルドを作成する開発者向けのステップバイステップガイドを提供します。
