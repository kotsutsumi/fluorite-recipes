# アップデートのデプロイ

## デプロイワークフロー

### チャネルとランタイムバージョン

- **チャネル**: 環境を示す（production/staging）
- **ランタイムバージョン**: 特定のアプリバージョンをターゲット

推奨設定:
```json
{
  "expo": {
    "runtimeVersion": {
      "policy": "appVersion"
    }
  }
}
```

## デプロイ手順

### 1. プロジェクトの設定

```bash
eas update:configure
```

### 2. プレビューのデプロイ

内部配信または開発ビルドを使用してプレビューをデプロイ。

### 3. ステージングへのデプロイ

```bash
eas update --channel staging
```

### 4. 本番環境へのデプロイ

```bash
eas update --channel production
```

## 設定例（eas.json）

```json
{
  "build": {
    "production": {
      "channel": "production"
    },
    "staging": {
      "channel": "staging"
    },
    "preview": {
      "channel": "preview",
      "distribution": "internal"
    }
  }
}
```

## 追加機能

### 段階的ロールアウト

```bash
eas update --channel production --rollout-percentage 10
```

### ロールバック

```bash
eas update:rollback
```

## ベストプラクティス

1. ステージング環境でテスト
2. 段階的にロールアウト
3. ダッシュボードで監視
4. 問題発生時はロールバック

詳細については各デプロイメントパターンのドキュメントを参照してください。
