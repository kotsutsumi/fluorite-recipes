# リクエストプロキシ

## 概要

EAS Updateはリクエストプロキシをサポートし、EAS Updateサーバーへのリクエストを独自のサーバー経由でプロキシできます。

## 用途

- カスタムヘッダーの追加
- リクエストのログ記録
- 追加のセキュリティ実装
- リクエストIPの匿名化

## リクエストプロキシの有効化

### 1. 2つのプロキシサーバーの作成

#### アップデートアセットリクエストプロキシ

- `assets.eascdn.net`へリクエストを転送
- すべてのURL内容をパススルー
- `expo-`または`eas-`で始まるヘッダーをパススルー

#### アップデートマニフェストリクエストプロキシ

- `u.expo.dev`へリクエストを転送
- すべてのURL内容をパススルー
- `expo-`または`eas-`で始まるヘッダーをパススルー

### 2. eas.jsonの設定

```json
{
  "cli": {
    "updateAssetHostOverride": "updates-asset-proxy.example.com",
    "updateManifestHostOverride": "updates-manifest-proxy.example.com"
  }
}
```

### 3. 変更の適用

```bash
eas update:configure
```

### 4. アップデートの公開

```bash
eas update
```

### 5. 設定の検証

EAS Updateダッシュボードで以下を確認：
- `manifestHostOverride`
- アセットのオーバーライド

## 利点

- リクエストのロギングと監視
- 追加のセキュリティレイヤー
- カスタムヘッダーの追加
- IP匿名化
