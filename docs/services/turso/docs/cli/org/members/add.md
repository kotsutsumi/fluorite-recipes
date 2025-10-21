# turso org members add - メンバーの追加

既存のTursoユーザーを現在アクティブな組織のメンバーとして追加します。

## 構文

```bash
turso org members add <username> [flags]
```

## パラメータ

### username
- **必須**: はい
- **説明**: 追加するTursoユーザーのユーザー名
- **形式**: 既存のTursoアカウントのユーザー名

## フラグ

### -a, --admin
- **説明**: 管理者権限でメンバーを追加
- **デフォルト**: 通常メンバー権限

## 権限レベル

### 通常メンバー
- グループとデータベースの表示
- データベースの作成・削除
- トークンの生成

### 管理者（Admin）
- すべての通常メンバー権限
- メンバーの追加・削除
- 組織設定の変更
- 課金情報の閲覧

### オーナー
- すべての管理者権限
- 組織の削除
- 支払い方法の管理
- プランの変更

## 使用例

### 基本的な使用方法

```bash
# 通常メンバーとして追加
turso org members add alice

# 管理者として追加
turso org members add bob --admin
```

### チームメンバーの一括追加

```bash
#!/bin/bash
# add-team-members.sh

MEMBERS=("alice" "bob" "charlie")
ADMINS=("david")

# 通常メンバーを追加
for member in "${MEMBERS[@]}"; do
  turso org members add $member
done

# 管理者を追加
for admin in "${ADMINS[@]}"; do
  turso org members add $admin --admin
done
```

## エラーハンドリング

### ユーザーが見つからない

```bash
# エラー例
$ turso org members add nonexistent
Error: user "nonexistent" not found

# 解決策: 正しいユーザー名を確認するか、inviteコマンドを使用
turso org members invite user@example.com
```

### 既にメンバー

```bash
# エラー例
$ turso org members add alice
Error: user "alice" is already a member

# 既にメンバーの場合は何もする必要なし
```

## 関連コマンド

- `turso org members invite <email>` - メールアドレスでメンバーを招待
- `turso org members list` - メンバー一覧の表示
- `turso org members remove <username>` - メンバーの削除

## 参考リンク

- [組織管理](../../features/organizations.md)
- [アクセス制御](../../features/access-control.md)
- [CLI リファレンス](../README.md)
