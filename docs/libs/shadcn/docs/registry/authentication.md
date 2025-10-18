# 認証

## 概要

このガイドは、コンポーネントレジストリを認証し、プライベートおよびパーソナライズされたコンポーネントを保護する方法について説明します。

認証により、以下のユースケースが可能になります：

- プライベートコンポーネントの保護
- チーム固有のリソース管理
- アクセス制御
- 利用状況の分析
- ライセンス管理

## 一般的な認証パターン

### トークンベースの認証

最も一般的なアプローチは、ベアラートークンまたはAPIキーを使用します：

```json
{
  "registries": {
    "@private": {
      "url": "https://registry.company.com/{name}.json",
      "headers": {
        "Authorization": "Bearer ${REGISTRY_TOKEN}"
      }
    }
  }
}
```

### APIキー認証

一部のレジストリはヘッダーにAPIキーを使用します：

```json
{
  "registries": {
    "@company": {
      "url": "https://api.company.com/registry/{name}.json",
      "headers": {
        "X-API-Key": "${API_KEY}",
        "X-Workspace-Id": "${WORKSPACE_ID}"
      }
    }
  }
}
```

### クエリパラメータ認証

簡単な設定では、クエリパラメータを使用できます：

```json
{
  "registries": {
    "@internal": {
      "url": "https://registry.company.com/{name}.json",
      "params": {
        "token": "${ACCESS_TOKEN}"
      }
    }
  }
}
```

## セキュリティのベストプラクティス

- 環境変数を使用してトークンを管理
- HTTPSを使用してすべての通信を暗号化
- トークンを定期的にローテーション
- トークンを直接コミットしない
- 最小権限の原則を適用
