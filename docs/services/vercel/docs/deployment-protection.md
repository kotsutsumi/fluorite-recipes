# Vercel デプロイメント保護

## 概要

Vercelのデプロイメント保護は、プレビューおよび本番URLのセキュリティを強化する機能です。プロジェクトレベルで設定可能で、デプロイメントへのアクセスを詳細に制御できます。

## 主な保護機能

### 1. Vercelの認証

- **対象プラン**: すべてのプランで利用可能
- **機能**: Vercelアカウントを持つユーザーのみがデプロイメントにアクセス可能
- **詳細**: [Vercel認証](/docs/deployment-protection/methods-to-protect-deployments/vercel-authentication)

### 2. パスワード保護

- **対象プラン**: エンタープライズプランまたは有料アドオン
- **機能**: 正しいパスワードを持つユーザーのみアクセス可能
- **詳細**: [パスワード保護](/docs/deployment-protection/methods-to-protect-deployments/password-protection)

### 3. 信頼できるIP

- **対象プラン**: エンタープライズプランのみ
- **機能**: 特定のIPアドレスからのみアクセスを許可
- **詳細**: [信頼できるIP](/docs/deployment-protection/methods-to-protect-deployments/trusted-ips)

## デプロイメント保護の設定方法

### ダッシュボードから設定

1. Vercelダッシュボードからプロジェクトを選択
2. 「設定」タブに移動
3. 「デプロイメント保護」タブを選択
4. 保護方法を選択し、設定を保存

### APIから設定

REST APIを使用してプログラマティックに設定できます：

```bash
curl -X PATCH "https://api.vercel.com/v9/projects/PROJECT_ID" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "ssoProtection": {
      "deploymentType": "all"
    }
  }'
```

## デプロイメント保護の環境オプション

### 標準保護

- **対象プラン**: すべてのプランで利用可能
- **保護範囲**: 本番カスタムドメイン以外のすべてのドメイン
- **用途**: プレビューデプロイメントの基本的な保護

**保護対象：**
- プレビューデプロイメントURL（`*.vercel.app`）
- プロダクションデプロイメントURL（`*.vercel.app`）

**保護対象外：**
- 本番カスタムドメイン（`example.com`）

### すべてのデプロイメント

- **対象プラン**: Proおよびエンタープライズプラン
- **保護範囲**: すべてのURL（カスタムドメイン含む）
- **用途**: 完全なアクセス制御が必要な場合

**保護対象：**
- プレビューデプロイメントURL
- プロダクションデプロイメントURL
- 本番カスタムドメイン

### 本番デプロイメントのみ

- **対象プラン**: エンタープライズプランのみ
- **保護範囲**: 本番URLのみ（信頼できるIPで保護）
- **用途**: プレビューは公開、本番のみ保護したい場合

**保護対象：**
- プロダクションデプロイメントURL
- 本番カスタムドメイン

**保護対象外：**
- プレビューデプロイメントURL

## デプロイメント保護のバイパス方法

特定の状況で保護をバイパスする方法があります：

### 1. 共有可能リンク

- すべてのプランで利用可能
- 特定のデプロイメントに外部ユーザーがアクセス可能
- [詳細](/docs/deployment-protection/methods-to-bypass-deployment-protection/sharable-links)

### 2. 自動化のための保護バイパス

- E2Eテスト用のシークレットを生成
- [詳細](/docs/deployment-protection/methods-to-bypass-deployment-protection/protection-bypass-automation)

### 3. デプロイメント保護の例外

- 特定のプレビュードメインを公開アクセス可能に
- エンタープライズプランまたはアドオンが必要
- [詳細](/docs/deployment-protection/methods-to-bypass-deployment-protection/deployment-protection-exceptions)

### 4. OPTIONSホワイトリスト

- CORSプリフライトリクエスト用
- [詳細](/docs/deployment-protection/methods-to-bypass-deployment-protection/options-allowlist)

## 高度なデプロイメント保護

### エンタープライズ機能

エンタープライズプランでは、以下の高度な機能が利用可能：

- **複数の保護方法の組み合わせ**: Vercel認証、パスワード保護、信頼できるIPを同時に使用
- **カスタム保護ルール**: 特定のパスやドメインに異なる保護レベルを設定
- **詳細なアクセス制御**: プロジェクトごと、環境ごとの細かい設定

### 有料アドオン

Proプランでも、Advanced Deployment Protectionアドオンを購入することで、以下の機能が利用可能：

- パスワード保護
- デプロイメント保護の例外
- 詳細なアクセス制御

## ベストプラクティス

### セキュリティ

1. **プレビューデプロイメントの保護**: 常にプレビューデプロイメントを保護し、未承認のアクセスを防ぐ
2. **強力なパスワード**: パスワード保護を使用する場合、強力で一意のパスワードを設定
3. **IP制限の活用**: 可能であれば、信頼できるIPでアクセスを制限
4. **定期的な確認**: 保護設定を定期的に確認し、不要なバイパスを削除

### 開発ワークフロー

1. **共有可能リンクの活用**: 外部ステークホルダーとのレビューには共有可能リンクを使用
2. **自動化バイパス**: E2Eテストには専用のバイパスシークレットを使用
3. **環境別設定**: プレビューと本番で異なる保護レベルを設定

### チーム管理

1. **アクセスレビュー**: 定期的にチームメンバーのアクセス権限を確認
2. **役割ベースのアクセス**: 適切な役割を各メンバーに割り当て
3. **監査ログの確認**: デプロイメント保護の変更を追跡

## トラブルシューティング

### よくある問題

#### 問題1: 本番サイトにアクセスできない

**原因**: 「すべてのデプロイメント」保護が有効

**解決策**:
1. 設定を「標準保護」に変更
2. または、カスタムドメインを保護例外に追加

#### 問題2: E2Eテストが失敗する

**原因**: デプロイメント保護によりテストがブロックされる

**解決策**:
1. 自動化バイパスシークレットを生成
2. テストツールにシークレットを設定

#### 問題3: 外部レビュアーがアクセスできない

**原因**: Vercel認証が有効で、外部ユーザーがVercelアカウントを持っていない

**解決策**:
1. 共有可能リンクを生成して共有
2. または、パスワード保護に切り替え

## 使用例

### 例1: プレビュー環境の保護

```json
{
  "ssoProtection": {
    "deploymentType": "preview"
  }
}
```

### 例2: すべてのデプロイメントをパスワードで保護

```json
{
  "passwordProtection": {
    "deploymentType": "all",
    "password": "strong-password-here"
  }
}
```

### 例3: 本番環境を特定IPのみに制限

```json
{
  "trustedIps": {
    "deploymentType": "prod_deployment_urls_and_all_previews",
    "addresses": [
      {
        "value": "203.0.113.0/24",
        "note": "Office network"
      }
    ]
  }
}
```

## 関連リソース

- [デプロイメント保護の方法](/docs/deployment-protection/methods-to-protect-deployments)
- [デプロイメント保護のバイパス方法](/docs/deployment-protection/methods-to-bypass-deployment-protection)
- [セキュリティベストプラクティス](/docs/security)
- [アクセス制御](/docs/rbac)
