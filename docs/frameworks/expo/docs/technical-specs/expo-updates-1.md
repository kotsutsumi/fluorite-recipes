# Expo Updates プロトコル v1 - 技術仕様

## 概要

**プロトコルバージョン**: 1
**目的**: 複数のプラットフォームにわたってExpoアプリにアップデートを配信
**対象者**: Expo Application Servicesと、独自のアップデートサーバーを管理する組織

このドキュメントは、Expo Updatesプロトコルv1の技術仕様を定義します。このプロトコルは、React Nativeアプリケーションに対して、over-the-airでのアップデート配信を標準化された方法で提供します。

## クライアント要件

Expo Updatesプロトコルv1に準拠するクライアントは、以下の要件を満たす必要があります。

### 1. アップデートの読み込み

- ローカルデータベースから最新のアップデートを読み込む必要があります
- アプリの起動時に適切なアップデートを選択して実行します

### 2. HTTPリクエスト

特定のヘッダーを含むGETリクエストを作成する必要があります：

#### 必須リクエストヘッダー

```
expo-protocol-version: 1
expo-platform: ios | android
expo-runtime-version: <runtime-version>
```

- `expo-protocol-version`: 使用するプロトコルのバージョン（この仕様では`1`）
- `expo-platform`: ターゲットプラットフォーム（`ios`または`android`）
- `expo-runtime-version`: アプリのランタイムバージョン文字列

### 3. レスポンス処理

クライアントは以下のレスポンスタイプを処理する必要があります：

- JSON/Expo+JSON レスポンス
- Multipart/mixed レスポンス

## レスポンスタイプ

### JSON/Expo+JSON レスポンス

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "createdAt": "2023-01-15T10:30:00.000Z",
  "runtimeVersion": "1.0.0",
  "launchAsset": {
    "url": "https://example.com/assets/bundle.js",
    "contentType": "application/javascript"
  },
  "assets": [
    {
      "url": "https://example.com/assets/image.png",
      "contentType": "image/png"
    }
  ],
  "metadata": {},
  "extra": {}
}
```

### Multipart/mixed レスポンス

複数のアセットを含むレスポンスの場合、`multipart/mixed`形式が使用されます。

## マニフェスト構造

### 必須フィールド

- **id** (UUID): アップデートの一意識別子
- **createdAt** (ISO 8601 timestamp): アップデートの作成日時
- **runtimeVersion** (string): 互換性のあるランタイムバージョン
- **launchAsset** (object): アプリの起動に使用されるメインバンドル

### launchAsset オブジェクト

```json
{
  "url": "https://example.com/assets/bundle.js",
  "contentType": "application/javascript",
  "hash": "sha256-...",
  "fileExtension": ".js"
}
```

### 追加フィールド

- **assets** (array): アプリで使用される追加アセット
- **metadata** (object): カスタムメタデータ
- **extra** (object): 追加の設定情報

## アセット構造

各アセットオブジェクトには以下が含まれます：

```json
{
  "url": "https://example.com/assets/resource.png",
  "contentType": "image/png",
  "hash": "sha256-...",
  "fileExtension": ".png"
}
```

### アセット圧縮

- Gzip圧縮をサポート
- Brotli圧縮をサポート
- 圧縮形式はContent-Encodingヘッダーで指定

## コード署名

### オプション機能

マニフェストとディレクティブの署名検証をサポート：

- 証明書チェーンの検証
- 署名の検証
- セキュリティポリシーの適用

### 署名構造

```json
{
  "signature": "...",
  "certificateChain": ["...", "..."]
}
```

## ディレクティブ

ディレクティブは、クライアントに特定のアクションを指示するために使用されます：

### ロールバックディレクティブ

特定のバージョンにロールバックするようクライアントに指示します。

### NoUpdateAvailableディレクティブ

利用可能なアップデートがないことをクライアントに通知します。

## HTTPプロトコルガイドライン

この仕様は、HTTP RFC 7231ガイドラインに従います：

- GETリクエストを使用したアップデートの取得
- 適切なステータスコードの使用（200、304、404など）
- キャッシング戦略のサポート

## アップデートフィルタリング

サーバーは、以下の基準に基づいてアップデートをフィルタリングできます：

- プラットフォーム（iOS/Android）
- ランタイムバージョン
- チャンネル
- カスタム条件

## 拡張性

この仕様は拡張可能な設計になっています：

- カスタムメタデータフィールド
- 追加のディレクティブタイプ
- プラットフォーム固有の機能

## セキュリティ考慮事項

### HTTPS必須

本番環境では、すべての通信にHTTPSを使用する必要があります。

### 署名検証

コード署名を実装することで、アップデートの整合性と信頼性を保証できます。

### アセットの整合性

各アセットのハッシュを検証して、改ざんを防止します。

## パフォーマンス最適化

### キャッシング

- ETags のサポート
- Last-Modified ヘッダーの使用
- 条件付きリクエスト（If-None-Match）

### 差分アップデート

将来のバージョンでは、差分アップデートをサポートする可能性があります。

## エラーハンドリング

### クライアント側のエラー

- ネットワークエラーの処理
- 無効なマニフェストの処理
- アセット読み込みエラーの処理

### サーバー側のエラー

- 適切なHTTPステータスコードの返却
- エラーメッセージの提供

## 互換性

### バージョニング

プロトコルバージョンは、`expo-protocol-version`ヘッダーで指定されます。

### 後方互換性

新しいプロトコルバージョンは、可能な限り後方互換性を維持する必要があります。

## まとめ

Expo Updates プロトコル v1 は、React Nativeアプリケーションに対して、標準化された柔軟なアップデート配信メカニズムを提供します。この仕様に従うことで、開発者は独自のアップデートサーバーを実装し、Expo Application Servicesとの互換性を維持できます。

## 関連リソース

- [Expo Updates ドキュメント](https://docs.expo.dev/versions/latest/sdk/updates/)
- [EAS Update](https://docs.expo.dev/eas-update/introduction/)
- [HTTP RFC 7231](https://tools.ietf.org/html/rfc7231)
