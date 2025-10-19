# turso org destroy - 組織の削除

所有する組織を完全に削除します。この操作は取り消すことができません。

## 構文

```bash
turso org destroy <organization-slug>
```

## パラメータ

### organization-slug
- **必須**: はい
- **説明**: 削除する組織のスラッグ
- **形式**: 既存の組織識別子

## 制限事項

- **個人アカウント**: 削除できません
- **アクティブな組織**: 現在選択中の組織は削除できません
- **プロジェクト**: 既存のプロジェクト（グループ、データベース）を先に削除する必要があります

## 使用例

### 基本的な使用方法

```bash
# 組織を削除
turso org destroy old-organization

# 出力例:
# Warning: This will permanently delete organization "old-organization" and all its resources.
# Are you sure? (y/N): y
# Organization "old-organization" has been deleted.
```

### 削除前の準備

```bash
# 1. 別の組織に切り替え
turso org switch personal

# 2. 削除対象の組織の内容を確認
turso org switch target-org
turso group list
turso db list

# 3. すべてのデータベースを削除
turso db list | tail -n +2 | awk '{print $1}' | xargs -I {} turso db destroy {} --yes

# 4. すべてのグループを削除
turso group list | tail -n +2 | awk '{print $1}' | xargs -I {} turso group destroy {} --yes

# 5. 個人アカウントに戻って組織を削除
turso org switch personal
turso org destroy target-org
```

## エラーハンドリング

### プロジェクトが存在する

```bash
# エラー例
$ turso org destroy my-org
Error: cannot delete organization with existing projects

# 解決策: すべてのリソースを削除
turso org switch my-org
turso db list | tail -n +2 | awk '{print $1}' | xargs -I {} turso db destroy {} --yes
turso group list | tail -n +2 | awk '{print $1}' | xargs -I {} turso group destroy {} --yes
turso org switch personal
turso org destroy my-org
```

### 個人アカウントの削除

```bash
# エラー例
$ turso org destroy personal
Error: cannot delete personal account

# 個人アカウントは削除できません
```

### アクティブな組織

```bash
# エラー例
$ turso org destroy current-org
Error: cannot delete active organization

# 解決策: 別の組織に切り替え
turso org switch personal
turso org destroy current-org
```

## 削除のチェックリスト

```bash
#!/bin/bash
# pre-destroy-checklist.sh

ORG=$1

echo "=== Pre-Destruction Checklist for $ORG ==="

# 組織に切り替え
turso org switch $ORG

# リソースの確認
echo "Groups: $(turso group list | tail -n +2 | wc -l)"
echo "Databases: $(turso db list | tail -n +2 | wc -l)"
echo "Members: $(turso org members list | tail -n +2 | wc -l)"

echo ""
echo "All resources must be deleted before destroying the organization."
```

## 関連コマンド

- `turso org create <name>` - 組織の作成
- `turso org list` - 組織一覧の表示
- `turso group destroy <name>` - グループの削除
- `turso db destroy <name>` - データベースの削除

## 参考リンク

- [組織管理](../../features/organizations.md)
- [CLI リファレンス](../README.md)
