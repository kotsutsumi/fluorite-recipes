# turso org create - 組織の作成

新しい組織を作成し、チームでTursoリソースを管理できるようにします。

## 構文

```bash
turso org create <name>
```

## パラメータ

### name
- **必須**: はい
- **説明**: 作成する組織の名前
- **形式**: 英数字とハイフン（3-63文字）
- **制約**: ユニークである必要があります

## 前提条件

組織を作成するには、以下が必要です：

1. **支払い方法の登録**: クレジットカード情報を追加
2. **Scalerプランへの登録**: 無料プランでは組織を作成できません

```bash
# プランのアップグレード
turso plan upgrade
```

## 使用例

### 基本的な使用方法

```bash
# 会社の組織を作成
turso org create my-company

# 出力例:
# Organization "my-company" created successfully.
# Switched to organization "my-company"
```

### チーム用の組織作成

```bash
# 開発チーム用
turso org create development-team

# プロジェクトチーム用
turso org create project-alpha-team

# クライアント用
turso org create client-acme-corp
```

## 組織作成後の設定

### 1. メンバーの追加

```bash
# 組織を作成
turso org create my-team

# メンバーを追加
turso org members add alice --admin
turso org members add bob
turso org members invite carol@example.com
```

### 2. グループとデータベースの作成

```bash
# 本番環境用グループ
turso group create production --location nrt

# ステージング環境用グループ
turso group create staging --location nrt

# データベースの作成
turso db create api --group production
turso db create web --group production
```

### 3. 課金情報の確認

```bash
# 課金ポータルを開く
turso org billing

# 現在のプランを確認
turso plan show
```

## ベストプラクティス

### 1. 明確な命名規則

```bash
# 会社名を使用
turso org create acme-corporation

# プロジェクト名を使用
turso org create project-phoenix

# チーム名を使用
turso org create backend-team

# クライアント名を使用
turso org create client-megacorp
```

### 2. 組織作成のワークフロー

```bash
#!/bin/bash
# setup-organization.sh

ORG_NAME=$1

if [ -z "$ORG_NAME" ]; then
  echo "Usage: $0 <organization-name>"
  exit 1
fi

echo "=== Setting up organization: $ORG_NAME ==="

# 1. 組織を作成
echo "Creating organization..."
turso org create $ORG_NAME

# 2. グループを作成
echo "Creating groups..."
turso group create production --location nrt
turso group create staging --location nrt
turso group create development --location nrt

# 3. 初期データベースを作成
echo "Creating databases..."
turso db create main-db --group production

echo "✓ Organization setup completed!"
echo ""
echo "Next steps:"
echo "1. Add team members: turso org members add <username>"
echo "2. Configure billing: turso org billing"
echo "3. Create application databases as needed"
```

### 3. 環境分離

```bash
# 環境ごとに別の組織を作成
turso org create company-development
turso org create company-staging
turso org create company-production

# または、1つの組織で複数のグループを使用
turso org create company
turso org switch company
turso group create dev
turso group create staging
turso group create prod
```

### 4. プロジェクトの分離

```bash
# クライアントごとに組織を分離
turso org create client-a
turso org create client-b
turso org create client-c

# 各クライアントの組織を設定
for org in client-a client-b client-c; do
  turso org switch $org
  turso group create production
  turso db create app-db --group production
done
```

## エラーハンドリング

### 支払い方法が未登録

```bash
# エラー例
$ turso org create my-team
Error: payment method required to create organization

# 解決策: 支払い方法を追加
turso org billing  # 課金ポータルでクレジットカードを追加
turso org create my-team
```

### Scalerプランが未登録

```bash
# エラー例
$ turso org create my-team
Error: Scaler plan or higher required to create organizations

# 解決策: プランをアップグレード
turso plan upgrade
turso org create my-team
```

### 組織名の重複

```bash
# エラー例
$ turso org create existing-org
Error: organization "existing-org" already exists

# 解決策: 別の名前を使用
turso org create existing-org-2
turso org create new-unique-name
```

### 無効な組織名

```bash
# エラー例
$ turso org create "My Organization"  # スペースを含む
Error: invalid organization name

$ turso org create ab  # 短すぎる
Error: organization name must be at least 3 characters

# 解決策: 有効な形式を使用
turso org create my-organization
turso org create acme-corp-2024
```

## 組織のタイプ

### 単一組織（推奨: 小規模チーム）

```bash
# 1つの組織ですべてを管理
turso org create my-company

# グループで環境を分離
turso group create production
turso group create staging
turso group create development
```

### 複数組織（推奨: 大規模・複雑な構成）

```bash
# 環境ごとに組織を分離
turso org create company-prod
turso org create company-staging
turso org create company-dev

# または、ビジネスユニットごと
turso org create bu-ecommerce
turso org create bu-analytics
turso org create bu-mobile
```

## 組織作成後のチェックリスト

```bash
#!/bin/bash
# post-creation-checklist.sh

ORG_NAME=$1

echo "=== Post-Creation Checklist for $ORG_NAME ==="

# 組織に切り替え
turso org switch $ORG_NAME

# 1. 組織の確認
echo "✓ Organization created: $ORG_NAME"

# 2. プランの確認
echo ""
echo "Plan:"
turso plan show

# 3. 初期グループの作成状況
echo ""
echo "Groups:"
GROUP_COUNT=$(turso group list | tail -n +2 | wc -l)
echo "  Count: $GROUP_COUNT"
turso group list

# 4. メンバーの確認
echo ""
echo "Members:"
turso org members list

# 5. 次のステップ
echo ""
echo "Next steps:"
echo "  [ ] Add team members"
echo "  [ ] Create production group"
echo "  [ ] Set up billing alerts"
echo "  [ ] Create first database"
```

## 自動化の例

### CI/CDでの組織セットアップ

```yaml
# .github/workflows/setup-org.yml
name: Setup Turso Organization

on:
  workflow_dispatch:
    inputs:
      org_name:
        description: 'Organization name'
        required: true
      environment:
        description: 'Environment type'
        required: true
        type: choice
        options:
          - production
          - staging
          - development

jobs:
  setup:
    runs-on: ubuntu-latest
    steps:
      - name: Install Turso CLI
        run: curl -sSfL https://get.tur.so/install.sh | bash

      - name: Authenticate
        run: turso auth login --token ${{ secrets.TURSO_TOKEN }}

      - name: Create organization
        run: turso org create ${{ inputs.org_name }}

      - name: Create groups
        run: |
          turso group create ${{ inputs.environment }} --location nrt

      - name: Create initial database
        run: |
          turso db create main --group ${{ inputs.environment }}
```

### Terraformでの管理（疑似コード）

```bash
#!/bin/bash
# terraform-like-setup.sh

# 設定ファイルから読み込み
source org-config.sh

# 組織を作成
create_org() {
  local name=$1
  echo "Creating organization: $name"
  turso org create $name
}

# グループを作成
create_groups() {
  local org=$1
  shift
  local groups=("$@")

  turso org switch $org

  for group in "${groups[@]}"; do
    echo "Creating group: $group"
    turso group create $group --location nrt
  done
}

# メインの実行
create_org "my-company"
create_groups "my-company" "production" "staging" "development"
```

## コスト管理

### 組織作成に関するコスト

- **組織自体**: 無料（追加料金なし）
- **必須プラン**: Scaler以上（月額 $29〜）
- **データベース**: 使用量に応じて課金

```bash
# 現在のプランとコストを確認
turso plan show

# 課金ポータルで詳細を確認
turso org billing
```

## セキュリティのベストプラクティス

### 1. 最小権限の原則

```bash
# 組織を作成（オーナーとして）
turso org create secure-org

# メンバーは通常権限で追加
turso org members add developer1
turso org members add developer2

# 管理者は必要最小限に
turso org members add lead-dev --admin
```

### 2. 組織の分離

```bash
# 本番と開発を完全に分離
turso org create company-production
turso org create company-development

# クライアントごとに完全分離
turso org create client-alpha
turso org create client-beta
```

## 関連コマンド

- `turso org list` - 組織一覧の表示
- `turso org switch <org-name>` - 組織の切り替え
- `turso org members add <username>` - メンバーの追加
- `turso org billing` - 課金ポータルを開く
- `turso org destroy <org-name>` - 組織の削除
- `turso plan upgrade` - プランのアップグレード

## 参考リンク

- [組織管理の概要](../../features/organizations.md)
- [プランと価格](../../help/pricing.md)
- [チーム協業](../../help/team-collaboration.md)
- [課金管理](../../help/billing.md)
- [CLI リファレンス](../README.md)
