# turso org members invite - メンバーの招待

Tursoアカウントを持っていないユーザーをメールアドレスで招待します。

## 構文

```bash
turso org members invite <email> [flags]
```

## パラメータ

### email
- **必須**: はい
- **説明**: 招待するユーザーのメールアドレス
- **形式**: 有効なメールアドレス

## フラグ

### -a, --admin
- **説明**: 管理者権限で招待
- **デフォルト**: 通常メンバー権限

## 招待のフロー

1. **招待の送信**: コマンドを実行すると招待メールが送信されます
2. **メール受信**: ユーザーが招待メールを受け取ります
3. **アカウント作成**: ユーザーがTursoアカウントを作成します
4. **招待の承認**: ユーザーが招待を承認します
5. **メンバー追加**: 組織のメンバーとして追加されます

## 使用例

### 基本的な使用方法

```bash
# 通常メンバーとして招待
turso org members invite alice@example.com

# 管理者として招待
turso org members invite bob@example.com --admin
```

### チームの一括招待

```bash
#!/bin/bash
# invite-team.sh

MEMBERS=(
  "developer1@company.com"
  "developer2@company.com"
  "designer@company.com"
)

ADMINS=(
  "lead@company.com"
  "manager@company.com"
)

# 通常メンバーを招待
for email in "${MEMBERS[@]}"; do
  echo "Inviting $email..."
  turso org members invite $email
done

# 管理者を招待
for email in "${ADMINS[@]}"; do
  echo "Inviting $email as admin..."
  turso org members invite $email --admin
done

echo "All invitations sent!"
```

## 招待の管理

### 保留中の招待を確認

招待を送信したが、まだ承認されていない招待を確認する方法（将来実装される可能性）：

```bash
# 招待ステータスの確認（疑似コード）
# turso org members invites list
```

### 招待の取り消し

招待を取り消す方法（`revoke`コマンド）：

```bash
# 招待を取り消し
turso org members revoke alice@example.com
```

## エラーハンドリング

### 無効なメールアドレス

```bash
# エラー例
$ turso org members invite invalid-email
Error: invalid email address

# 解決策: 正しいメールアドレス形式を使用
turso org members invite user@example.com
```

### 既に招待済み

```bash
# エラー例
$ turso org members invite alice@example.com
Error: invitation already sent to this email

# 既に招待済みの場合は、ユーザーの承認を待つ
```

## add vs invite の違い

### add コマンド
- **対象**: 既存のTursoユーザー
- **要件**: ユーザー名が必要
- **即座に**: すぐにメンバーとして追加

### invite コマンド
- **対象**: Tursoアカウントを持っていないユーザー
- **要件**: メールアドレスが必要
- **承認待ち**: ユーザーの承認が必要

## 関連コマンド

- `turso org members add <username>` - 既存ユーザーを追加
- `turso org members list` - メンバー一覧の表示
- `turso org members revoke <email>` - 招待の取り消し
- `turso org members remove <username>` - メンバーの削除

## 参考リンク

- [組織管理](../../features/organizations.md)
- [チーム協業](../../help/team-collaboration.md)
- [CLI リファレンス](../README.md)
