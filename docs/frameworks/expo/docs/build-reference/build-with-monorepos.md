# モノレポでEAS Buildをセットアップする

モノレポでEAS Buildをセットアップするには、次の主要なガイドラインに従ってください：

* すべてのEAS CLIコマンドをアプリディレクトリのルートから実行します
* EAS Build関連ファイル（eas.json、credentials.json）をアプリディレクトリのルートに配置します
* モノレポ内のマネージドプロジェクトについては、「モノレポでの作業」ガイドを参照してください
* 追加のセットアップが必要な場合は、package.jsonに`postinstall`スクリプトを追加します

## postinstallスクリプトの例

```json
{
  "scripts": {
    "postinstall": "cd ../.. && yarn build"
  }
}
```

## 追加の推奨事項

- 複数のアプリがEAS Buildを使用する場合、各アプリディレクトリには独自の設定ファイルが必要です
- 適切な依存関係とワークスペース管理を確保してください

## ディレクトリ構造の例

```
monorepo/
├── packages/
│   ├── shared/
│   └── ui-components/
├── apps/
│   ├── mobile-app/
│   │   ├── eas.json
│   │   ├── app.json
│   │   └── package.json
│   └── web-app/
│       └── package.json
└── package.json
```

## 作業ディレクトリ

すべてのEAS CLIコマンドは、アプリのルートディレクトリから実行する必要があります：

```bash
# 正しい方法
cd apps/mobile-app
eas build

# 間違った方法
cd monorepo
eas build --path apps/mobile-app  # このオプションは存在しません
```

## ワークスペースの設定

モノレポでパッケージマネージャーのワークスペース機能を使用している場合：

- pnpmの場合：`pnpm-workspace.yaml`を設定
- Yarnの場合：ルートpackage.jsonで`workspaces`を設定
- npmの場合：ルートpackage.jsonで`workspaces`を設定

## ビルドの実行

モノレポ内でビルドを実行するには：

```bash
cd apps/mobile-app
eas build --platform android
```

このドキュメントは、モノレポ環境でEAS Buildを統合するための直接的なアプローチを提供し、ディレクトリ構造と設定に焦点を当てています。
