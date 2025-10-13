# EAS Metadataを使い始める

> EAS Metadataはプレビュー段階であり、破壊的な変更が加えられる可能性があります。

EAS Metadataを使用すると、コマンドラインからアプリストアのプレゼンスを自動化および維持できます。複数の異なるフォームを経由する代わりに、必要なすべてのアプリ情報を含む`store.config.json`ファイルを使用します。また、組み込みの検証により、アプリのリジェクトにつながる可能性のある一般的な落とし穴を見つけようとします。

## 前提条件

EAS Metadataは現在、Apple App Storeのみをサポートしています。

> VS Codeを使用していますか？[Expo Tools拡張機能](https://github.com/expo/vscode-expo#readme)をインストールして、store.config.jsonファイルで自動補完、提案、警告を取得してください。

## ストア設定を作成する

プロジェクトのルートディレクトリに`store.config.json`ファイルを作成することから始めましょう。このファイルには、アプリストアにアップロードしたいすべての情報が保持されます。

すでにストアにアプリがある場合は、次のコマンドを実行して情報をストア設定にプルできます：

```
eas metadata:pull
```

まだストアにアプリがない場合は、新しいストア設定ファイルを作成します：

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

> デフォルトでは、EAS Metadataはプロジェクトのルートにある`store.config.json`ファイルを使用します。

## ストア設定を更新する

`store.config.json`ファイルを編集し、アプリのニーズに合わせてカスタマイズします。利用可能なすべてのオプションは[ストア設定スキーマ](/eas/metadata/schema)で確認できます。

## 新しいアプリバージョンをアップロードする

`store.config.json`をアプリストアにプッシュする前に、アプリの新しいバージョンをビルドして送信する必要があります。
