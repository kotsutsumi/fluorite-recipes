# eas.jsonでEAS Buildを設定

## 概要
`eas.json`は、EAS CLIおよびサービスの設定ファイルで、通常は`eas build:configure`を実行したときに生成されます。`package.json`の隣のプロジェクトのルートに配置されます。

## ビルドプロファイル

### デフォルト設定
```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {}
  }
}
```

### 主な特徴
- ビルドプロファイルは、異なるビルドタイプ用の設定の名前付きグループです
- プロファイルはカスタム名を持つことができます
- `eas build --profile <profile-name>`を使用してプロファイルを実行できます
- 指定されていない場合、デフォルトプロファイルは`production`です

## 一般的なビルドプロファイルタイプ

### 開発ビルド
- 開発者ツールを含む
- 内部的に配布
- iOSシミュレーター用に設定可能

### プレビュービルド
- 開発者ツールなし
- チームと関係者のテスト向け
- 本番ビルドに似ているが、アプリストア準備完了ではない

### 本番ビルド
- アプリストア提出用に準備
- 通常、Androidには.aab形式を使用
- エミュレーター/デバイスに直接インストールできない

## ビルドツール設定

### バージョン選択
- Node.jsなどのツールのバージョンを指定できます
- 例：
```json
{
  "build": {
    "production": {
      "node": "18.18.0"
    }
  }
}
```

### リソースクラスの選択
- VMリソース（CPU、RAM）を選択
- デフォルトは「medium」
- 「Large」ワーカーには有料のEASプランが必要

## 環境変数
- ビルドプロファイルで設定可能
- アプリ設定とビルド時設定に使用

## 完全な設定例
```json
{
  "build": {
    "base": {
      "node": "12.13.0",
      "env": {
        "EXAMPLE_ENV": "example value"
      }
    },
    "development": {
      "extends": "base",
      "developmentClient": true
    },
    "production": {
      "extends": "base"
    }
  }
}
```
