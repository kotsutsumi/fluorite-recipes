# EAS Hostingを始める

Expo RouterとReactアプリをEAS Hostingでデプロイする方法を説明します。

## 前提条件

- Expoユーザーアカウント
- Expo Router webプロジェクト
- 最新のEAS CLI

## デプロイ手順

### 1. Expoアカウントの作成

[expo.dev](https://expo.dev)でアカウントを作成します。

### 2. EAS CLIのインストール

```bash
npm install --global eas-cli
```

### 3. Expoアカウントにログイン

```bash
eas login
```

### 4. プロジェクトの準備

`expo.web.output`を設定します。推奨される出力モード：

- **`single`**: シングルページアプリケーション
- **`static`**: 静的に生成されたWebアプリ
- **`server`**: サーバー関数とAPIルートをサポート

### 5. Webプロジェクトのエクスポート

```bash
npx expo export --platform web
```

### 6. デプロイ

```bash
eas deploy
```

デプロイプロセスでは：
- EASプロジェクトの接続を求められます
- プレビューサブドメインの選択を求められます
- デプロイされたアプリのプレビューURLが生成されます

## EAS Hostingの主な利点

### バージョン同期の課題に対応

従来のホスティングサービスでは、ネイティブアプリとWebバージョンの同期が課題でした。EAS Hostingはこれを簡素化します。

### リクエストルーティングの簡素化

ネイティブアプリのリクエストルーティングを簡単に管理できます。

### プラットフォーム固有のメトリクスと分析

プラットフォーム固有のメトリクスと分析を提供します。

## 出力モードの選択

### Single（シングルページアプリ）
```json
{
  "expo": {
    "web": {
      "output": "single"
    }
  }
}
```

クライアントサイドルーティングを使用する従来のSPA。

### Static（静的生成）
```json
{
  "expo": {
    "web": {
      "output": "static"
    }
  }
}
```

ビルド時にHTMLを生成する静的サイト。

### Server（サーバーレンダリング）
```json
{
  "expo": {
    "web": {
      "output": "server"
    }
  }
}
```

サーバー関数とAPIルートをサポートする動的アプリ。

## 次のステップ

- [デプロイメントとエイリアスの管理](/frameworks/expo/docs/eas/hosting/deployments-and-aliases)
- [環境変数の設定](/frameworks/expo/docs/eas/hosting/environment-variables)
- [カスタムドメインの設定](/frameworks/expo/docs/eas/hosting/custom-domain)
- [APIルートの監視](/frameworks/expo/docs/eas/hosting/api-routes)
