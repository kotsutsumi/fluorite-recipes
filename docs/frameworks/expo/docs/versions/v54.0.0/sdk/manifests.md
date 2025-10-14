# Manifests

Expoマニフェストの型定義を提供するライブラリです。

## 概要

`expo-manifests` は、Expoアプリケーションのマニフェストに関する型定義を提供するライブラリです。アプリのビルド時に生成される埋め込みマニフェストや、Expo Updatesで使用されるマニフェストの構造を定義します。

## インストール

```bash
npx expo install expo-manifests
```

## 使用方法

```javascript
import * as Manifests from 'expo-manifests';
```

## 型定義

### EmbeddedManifest

ビルドプロセス中に生成される埋め込みマニフェストです。

```typescript
type EmbeddedManifest = {
  assets: AssetMetadata[];  // アセット情報の配列
  commitTime: string;       // コミット時刻
  id: string;              // マニフェストID
}
```

**プロパティ:**
- `assets`: アプリケーションに含まれるアセットのメタデータ
- `commitTime`: マニフェストが作成された時刻
- `id`: マニフェストの一意識別子

### ExpoUpdatesManifest

Expo Updatesで使用されるマニフェストです。

```typescript
type ExpoUpdatesManifest = {
  assets: AssetMetadata[];     // アセット情報の配列
  createdAt: string;          // 作成日時
  runtimeVersion: string;     // ランタイムバージョン
  id: string;                 // マニフェストID
  launchAsset: AssetMetadata; // 起動アセット
  metadata?: object;          // 追加のメタデータ（オプション）
}
```

**プロパティ:**
- `assets`: 更新に含まれるアセットのメタデータ
- `createdAt`: マニフェストが作成された日時
- `runtimeVersion`: 互換性のあるランタイムバージョン
- `id`: マニフェストの一意識別子
- `launchAsset`: アプリ起動時に使用されるメインアセット
- `metadata`: 追加のカスタムメタデータ（オプション）

### AssetMetadata

アセットのメタデータを表す型です。

```typescript
type AssetMetadata = {
  url: string;              // アセットのURL
  key: string;              // アセットのキー
  contentType: string;      // コンテンツタイプ（例: "image/png"）
  fileExtension: string;    // ファイル拡張子
  hash: string;             // アセットのハッシュ値
  storageKey?: string;      // ストレージキー（オプション）
}
```

### ClientScopingConfig

クライアント側のデータスコープ設定です。

```typescript
type ClientScopingConfig = {
  scopeKey?: string;  // スコープキー（オプション）
}
```

**プロパティ:**
- `scopeKey`: クライアント側のデータをスコープするためのオプションキー

### EASConfig

EAS（Expo Application Services）の設定です。

```typescript
type EASConfig = {
  projectId?: string;  // EASプロジェクトID（オプション）
}
```

**プロパティ:**
- `projectId`: EASプロジェクトの一意識別子（オプション）

## 実用例

### マニフェスト情報の取得

```javascript
import Constants from 'expo-constants';
import * as Manifests from 'expo-manifests';

function getManifestInfo() {
  const manifest = Constants.manifest2;

  if (manifest) {
    console.log('ランタイムバージョン:', manifest.runtimeVersion);
    console.log('マニフェストID:', manifest.id);
    console.log('アセット数:', manifest.assets?.length);
  }
}
```

### EAS設定の確認

```javascript
import Constants from 'expo-constants';

function checkEASConfig() {
  const easConfig = Constants.manifest2?.extra?.eas;

  if (easConfig?.projectId) {
    console.log('EASプロジェクトID:', easConfig.projectId);
  }
}
```

### アセット情報の処理

```javascript
import Constants from 'expo-constants';

function processAssets() {
  const manifest = Constants.manifest2;

  if (manifest?.assets) {
    manifest.assets.forEach(asset => {
      console.log('アセット:', asset.key);
      console.log('タイプ:', asset.contentType);
      console.log('URL:', asset.url);
    });
  }
}
```

## Expo Updatesとの連携

`expo-manifests` は Expo Updates と密接に連携します：

```javascript
import * as Updates from 'expo-updates';
import Constants from 'expo-constants';

async function checkForUpdates() {
  try {
    const update = await Updates.checkForUpdateAsync();

    if (update.isAvailable) {
      await Updates.fetchUpdateAsync();
      // 新しいマニフェストが利用可能
      await Updates.reloadAsync();
    }
  } catch (error) {
    console.error('更新チェックエラー:', error);
  }
}
```

## プラットフォーム固有の考慮事項

### Android

- マニフェスト情報はビルド時に埋め込まれます
- Expo Updatesを使用する場合、動的に更新されます

### iOS

- マニフェスト情報はアプリバンドルに含まれます
- Expo Updatesを使用する場合、OTA更新が可能です

### tvOS

- 基本的なマニフェスト機能をサポート
- プラットフォーム固有の制限がある場合があります

## ベストプラクティス

1. **型安全性**: TypeScriptで型定義を活用して安全にマニフェストデータを扱う
2. **バージョン管理**: `runtimeVersion` を適切に管理して互換性を確保
3. **エラーハンドリング**: マニフェスト情報が利用できない場合の処理を実装
4. **更新戦略**: Expo Updatesと組み合わせて効果的な更新戦略を実装

## 関連ライブラリ

- `expo-updates`: OTA更新機能
- `expo-constants`: アプリ定数とマニフェスト情報へのアクセス

## サポートプラットフォーム

- Android
- iOS
- tvOS

## バンドルバージョン

~1.0.8
