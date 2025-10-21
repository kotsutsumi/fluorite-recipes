# パスワード保護

## 概要

Vercelのパスワード保護は、デプロイメントへのアクセスをパスワードで制限するセキュリティ機能です。

### 対象プラン

- [エンタープライズプラン](/docs/plans/enterprise)
- [Pro プランのAdvanced Deployment Protection](/docs/security/deployment-protection#advanced-deployment-protection)アドオン

### 必要な権限

以下のいずれかの役割が必要：
- オーナー
- メンバー
- 管理者

## セキュリティ考慮事項

### 主な特徴

| 考慮事項 | 説明 |
|----------|------|
| 環境設定 | プレビュー、本番など異なる環境で有効化可能 |
| 互換性 | Vercel認証と信頼できるIPと同時使用可能 |
| バイパス方法 | 共有リンクと自動化によるバイパスが可能 |
| パスワード持続性 | デプロイメントごとに1回のパスワード入力（Cookieに保存） |
| パスワード変更 | パスワード変更時に再入力が必要 |

### セキュリティレベル

パスワード保護は、以下の保護方法と組み合わせて使用できます：

- **Vercel認証**: Vercelアカウント + パスワード
- **信頼できるIP**: 特定IPアドレス + パスワード
- **両方**: 最高レベルのセキュリティ

## パスワード保護の管理方法

### ダッシュボードから管理

#### パスワード保護の有効化

1. Vercelダッシュボードからプロジェクトを選択
2. 「設定」タブに移動
3. 「デプロイメント保護」セクションを選択
4. 「パスワード保護」トグルを有効化
5. 保護する環境を選択：
   - **プレビューのみ**: プレビューデプロイメントのみ保護
   - **すべてのデプロイメント**: プレビューと本番の両方を保護
   - **本番デプロイメントのみ**: 本番デプロイメントのみ保護
6. 強力なパスワードを設定
7. 「保存」をクリック

#### パスワードの変更

1. デプロイメント保護設定に移動
2. 「パスワード保護」セクションで「変更」をクリック
3. 新しいパスワードを入力
4. 「保存」をクリック

**注意**: パスワードを変更すると、すべてのユーザーは次回アクセス時に新しいパスワードを入力する必要があります。

#### パスワード保護の無効化

1. デプロイメント保護設定に移動
2. 「パスワード保護」トグルを無効化
3. 「保存」をクリック

### APIによる管理

#### パスワード保護の設定

```bash
curl -X PATCH "https://api.vercel.com/v9/projects/PROJECT_ID" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "passwordProtection": {
      "deploymentType": "prod_deployment_urls_and_all_previews",
      "password": "your-strong-password"
    }
  }'
```

#### 環境タイプのオプション

- `preview`: プレビューデプロイメントのみ
- `prod_deployment_urls_and_all_previews`: すべてのデプロイメント
- `all`: すべてのデプロイメント（カスタムドメイン含む）

#### パスワード保護の削除

```bash
curl -X PATCH "https://api.vercel.com/v9/projects/PROJECT_ID" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "passwordProtection": null
  }'
```

### Terraformによる管理

Vercel Terraform プロバイダを使用してパスワード保護を設定できます：

```hcl
resource "vercel_project" "example" {
  name = "example-project"

  password_protection = {
    deployment_type = "prod_deployment_urls_and_all_previews"
    password        = var.deployment_password
  }
}

variable "deployment_password" {
  type      = string
  sensitive = true
}
```

## パスワードの要件

### 推奨されるパスワード

強力なパスワードを使用することを強く推奨します：

- **最小長**: 12文字以上
- **大文字と小文字**: 両方を含む
- **数字**: 1つ以上の数字を含む
- **特殊文字**: 記号を含む

### パスワードの例

```
# 良い例（強力なパスワード）
Tr0ub4dor&3!X9pQ
9#mK$2nP@vL8wQ!r

# 悪い例（弱いパスワード）
password123
myproject
```

### パスワード生成ツール

以下のツールを使用して強力なパスワードを生成できます：

```bash
# macOS/Linux
openssl rand -base64 24

# Node.js
node -e "console.log(require('crypto').randomBytes(24).toString('base64'))"

# Python
python3 -c "import secrets; print(secrets.token_urlsafe(24))"
```

## ユーザーエクスペリエンス

### パスワード入力フロー

1. ユーザーが保護されたデプロイメントにアクセス
2. パスワード入力フォームが表示される
3. パスワードを入力して「Submit」をクリック
4. 正しいパスワードの場合、デプロイメントにアクセス可能
5. Cookieが設定され、同じデプロイメントへの再アクセス時にパスワード不要

### Cookieの持続性

パスワード保護のCookieは以下の特性を持ちます：

- **スコープ**: デプロイメントURLごとに設定
- **有効期限**: ブラウザセッションが終了するまで有効
- **セキュリティ**: HTTPSのみ、SameSite属性付き

## 環境別の設定例

### 例1: プレビューデプロイメントのみ保護

```json
{
  "passwordProtection": {
    "deploymentType": "preview",
    "password": "preview-password-2024"
  }
}
```

**用途**: 本番環境は公開、プレビューは保護

### 例2: すべてのデプロイメントを保護

```json
{
  "passwordProtection": {
    "deploymentType": "all",
    "password": "all-deployments-password"
  }
}
```

**用途**: カスタムドメインを含むすべてのデプロイメントを保護

### 例3: 本番デプロイメントのみ保護

```json
{
  "passwordProtection": {
    "deploymentType": "prod_deployment_urls_and_all_previews",
    "password": "production-password"
  }
}
```

**用途**: 本番デプロイメントのみ保護、プレビューは公開（非推奨）

## 複数の保護方法との組み合わせ

### パスワード保護 + Vercel認証

```json
{
  "passwordProtection": {
    "deploymentType": "all",
    "password": "strong-password"
  },
  "ssoProtection": {
    "deploymentType": "all"
  }
}
```

**効果**: Vercelアカウントでログインし、かつパスワードを入力したユーザーのみアクセス可能

### パスワード保護 + 信頼できるIP

```json
{
  "passwordProtection": {
    "deploymentType": "all",
    "password": "strong-password"
  },
  "trustedIps": {
    "deploymentType": "all",
    "addresses": [
      {
        "value": "203.0.113.0/24",
        "note": "Office network"
      }
    ]
  }
}
```

**効果**: オフィスネットワークからアクセスし、かつパスワードを入力したユーザーのみアクセス可能

## パスワードの共有方法

### セキュアな共有

パスワードは、以下の方法で安全に共有することを推奨します：

1. **パスワードマネージャー**: 1Password、LastPassなど
2. **暗号化されたメッセージング**: Signal、WhatsAppなど
3. **一時的なシークレット共有**: [onetimesecret.com](https://onetimesecret.com/)など

### 避けるべき方法

以下の方法でパスワードを共有しないでください：

- ❌ プレーンテキストのメール
- ❌ Slackなどの公開チャンネル
- ❌ GitHubのイシューやPR
- ❌ ドキュメントに直接記載

## トラブルシューティング

### 問題1: パスワードが機能しない

**確認事項**:
- [ ] パスワードが正しく入力されているか
- [ ] Caps Lockがオフか
- [ ] パスワードが最近変更されていないか

**解決策**:
1. パスワードをコピー&ペーストで入力
2. パスワードをリセットして再設定

### 問題2: パスワード入力後もアクセスできない

**確認事項**:
- [ ] Cookieが有効か
- [ ] ブラウザが最新版か
- [ ] 他の保護方法も有効になっていないか

**解決策**:
1. ブラウザのCookieを有効化
2. キャッシュとCookieをクリア
3. 他の保護方法（Vercel認証、信頼できるIP）を確認

### 問題3: パスワードを忘れた

**解決策**:
1. プロジェクトの管理者に連絡
2. 管理者がパスワードをリセット
3. 新しいパスワードを共有

## ベストプラクティス

### 1. パスワードのローテーション

定期的にパスワードを変更します：

- **推奨頻度**: 90日ごと
- **変更時**: プロジェクトメンバーに通知
- **記録**: パスワード変更履歴を保管

### 2. パスワードの複雑さ

プロジェクトの機密性に応じてパスワードの複雑さを調整：

- **公開デモ**: 中程度の複雑さ
- **クライアントレビュー**: 高い複雑さ
- **機密プロジェクト**: 最高レベルの複雑さ + 他の保護方法と組み合わせ

### 3. アクセスの監視

パスワード保護されたデプロイメントへのアクセスを監視：

- アクティビティログを定期的に確認
- 異常なアクセスパターンを検出
- 必要に応じてパスワードをリセット

### 4. 環境別のパスワード

可能であれば、環境ごとに異なるパスワードを使用：

```
プレビュー: preview-password-2024-Q1
本番: production-password-2024-Q1
```

## セキュリティのヒント

### パスワード管理

- パスワードマネージャーを使用
- パスワードを文書化しない
- 定期的にパスワードを変更
- 強力で一意のパスワードを使用

### アクセス制御

- 必要最小限の人にのみパスワードを共有
- プロジェクト終了後、パスワードを変更
- 元チームメンバーが知っているパスワードは変更

### 監査

- パスワード変更をアクティビティログで追跡
- 定期的にパスワード保護設定を確認
- 不要になったパスワード保護は無効化

## 関連リソース

- [デプロイメント保護](/docs/deployment-protection)
- [デプロイメント保護の方法](/docs/deployment-protection/methods-to-protect-deployments)
- [Vercel認証](/docs/deployment-protection/methods-to-protect-deployments/vercel-authentication)
- [信頼できるIP](/docs/deployment-protection/methods-to-protect-deployments/trusted-ips)
- [セキュリティベストプラクティス](/docs/security)
