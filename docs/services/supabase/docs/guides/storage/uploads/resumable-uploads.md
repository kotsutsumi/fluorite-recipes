# レジューム可能なアップロード

Supabase Storageにファイルをアップロードする方法を学びます。

## 推奨されるユースケース

レジューム可能なアップロード方式は、以下の場合に推奨されます:
- 6MBを超える可能性のある大きなファイルをアップロードする場合
- ネットワークの安定性が懸念される場合
- アップロードの進行状況イベントを取得したい場合

## プロトコルと実装

Supabase Storageは、レジューム可能なアップロードを可能にするために[TUSプロトコル](https://tus.io/)を実装しています。TUSは「The Upload Server」の略で、レジューム可能なアップロードをサポートするためのオープンプロトコルです。このプロトコルにより、中断が発生した場合にアップロードプロセスを中断した場所から再開できます。

この方法は次を使用して実装できます:
- [`tus-js-client`](https://github.com/tus/tus-js-client)ライブラリ
- [Uppy](https://uppy.io/docs/tus/)ライブラリ

### パフォーマンスのヒント

> 大きなファイルをアップロードする際の最適なパフォーマンスを得るには、常に直接ストレージホスト名を使用する必要があります。

`https://project-id.supabase.co`の代わりに、`https://project-id.storage.supabase.co`を使用します

## コード例

ドキュメントでは、複数の言語のコード例を提供しています:
- JavaScript（`tus-js-client`を使用）
- React（`@uppy/tus`を使用）
- Kotlin
- Python（`tus-py-client`を使用）

## アップロードURLの特性

- 各アップロードに一意のURLを作成
- `PATCH`メソッドを使用してチャンクをアップロード
- アップロードURLは最大24時間有効

## 同時実行の処理

- 同じアップロードURLに同時にアップロードできるのは1つのクライアントのみ
- データの破損を防止
- 競合を処理するための`x-upsert`ヘッダーを提供

## ファイルの上書き

- デフォルトの動作では`400 Asset Already Exists`エラーが返されます
- `x-upsert`ヘッダーを`true`に設定してファイルを上書きできます
- CDNの伝播遅延を避けるため、新しいパスへのアップロードを推奨

## フレームワーク統合

Uppyは以下との統合をサポートしています:
- React
- Svelte
- Vue
- Angular

## 追加リソース

- [GitHubの完全なUppyの例](https://github.com/supabase/supabase/tree/master/examples/storage)
