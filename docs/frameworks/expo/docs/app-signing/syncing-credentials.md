# リモートソースとローカルソース間での認証情報の同期

EASサーバーでホストされている自動管理される認証情報を使用している場合、`eas credentials`コマンドを使用して、認証情報をローカルにプルしたり、ローカル認証情報をEASにアップロードしたりできます。

## 認証情報のダウンロード

自動管理される認証情報をダウンロードするには：
1. プロジェクトルートで`eas credentials`を実行する
2. プラットフォームを選択する
3. `"Credentials.json: Upload/Download credentials between EAS servers and your local json"`を選択する
4. `"Download credentials from EAS to credentials.json"`を選択する

Androidの場合、認証情報は即座に使用可能です。iOSの場合、以下の手順が必要です：
- 配布証明書をキーチェーンにインストールする
- Xcodeを開く
- 「Signing & Capabilities」に移動する
- プロビジョニングプロファイルをインポートして選択する

## 認証情報のアップロード

`credentials.json`からEASによって管理される認証情報をアップロードするには：
1. プロジェクトルートで`eas credentials`を実行する
2. プラットフォームを選択する
3. `"Credentials.json: Upload/Download credentials between EAS servers and your local json"`を選択する
4. `"Upload credentials from credentials.json to EAS"`を選択する

必要に応じて、追加のプラットフォームに対してプロセスを繰り返します。
