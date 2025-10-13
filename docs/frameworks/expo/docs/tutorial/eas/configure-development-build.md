# クラウドで開発ビルドを設定

## 開発ビルドを理解する

開発ビルドは、迅速な反復のために最適化されたプロジェクトのデバッグバージョンです。`expo-dev-client`ライブラリを含み、堅牢な開発環境を提供します。

### 主要なハイライト

| 機能 | 開発ビルド | Expo Go |
|---------|-------------------|---------|
| 開発フェーズ | Web的な反復速度 | 迅速な反復とテスト |
| コラボレーション | 共有ネイティブランタイム | 簡単なプロジェクト共有 |
| サードパーティライブラリ | 完全サポート | Expo SDKに限定 |
| カスタマイズ | 広範囲 | 限定的 |
| 使用目的 | 本格的なアプリ開発 | 学習とプロトタイピング |

## expo-dev-clientライブラリをインストール

次のコマンドを使用してライブラリをインストール：

```terminal
npx expo install expo-dev-client
```

### 開発サーバーを起動

実行：

```terminal
npx expo start
```

## 開発ビルドを初期化

### EAS CLIをインストール

```terminal
npm install -g eas-cli
```

### Expoアカウントにログイン

```terminal
eas login
```

### プロジェクトを初期化してEASにリンク

```terminal
eas init
```

## EAS Build用にプロジェクトを設定

```terminal
eas build:configure
```

これにより、デフォルトのビルドプロファイルを持つ`eas.json`ファイルが作成されます：

```json
{
  "cli": {
    "version": ">= 16.18.0",
    "appVersionSource": "remote"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {}
  }
}
```

## まとめ

この章では、EAS CLIを使用した開発ビルドの初期化と設定をカバーし、クラウドビルドのためのプロジェクトの準備を行いました。
