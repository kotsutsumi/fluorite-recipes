# turso db list - データベース一覧表示

Turso CLIの`turso db list`コマンドは、現在のユーザーまたは組織のすべてのデータベースを一覧表示します。

## 📚 目次

- [基本構文](#基本構文)
- [オプション](#オプション)
- [使用例](#使用例)
- [出力形式](#出力形式)
- [関連コマンド](#関連コマンド)

## 基本構文

```bash
turso db list [オプション]
```

## オプション

### `--group <グループ名>`

指定したグループに属するデータベースのみを表示します。

```bash
turso db list --group my-group
```

## 使用例

### すべてのデータベースを表示

```bash
turso db list
```

このコマンドは、現在のユーザーまたは組織に属するすべてのデータベースを表示します。

**出力例:**

```
Name                Group           Location
my-database         default         nrt (Tokyo)
production-db       production      lax (Los Angeles)
dev-database        development     fra (Frankfurt)
```

### 特定のグループのデータベースのみ表示

```bash
turso db list --group production
```

`production`グループに属するデータベースのみを表示します。

**出力例:**

```
Name                Group           Location
production-db       production      lax (Los Angeles)
api-db              production      nrt (Tokyo)
```

## 出力形式

`turso db list`コマンドは、以下の情報をテーブル形式で表示します:

```typescript
interface DatabaseListOutput {
  name: string;           // データベース名
  group: string;          // 所属グループ名
  location: string;       // プライマリロケーション
}
```

### 表示される情報

| カラム | 説明 |
|--------|------|
| **Name** | データベースの名前 |
| **Group** | データベースが属するグループ |
| **Location** | データベースのプライマリロケーション（地域コード） |

## 出力の見方

### ロケーションコードについて

ロケーションは3文字のコードで表示されます:

- `nrt` - Tokyo (東京)
- `lax` - Los Angeles (ロサンゼルス)
- `fra` - Frankfurt (フランクフルト)
- `sin` - Singapore (シンガポール)
- など

完全なロケーション一覧は`turso db locations`コマンドで確認できます。

## 使用パターン

### データベースインベントリの確認

```bash
# すべてのデータベースを確認
turso db list

# 特定のグループのデータベース数を確認
turso db list --group production
```

### スクリプトでの使用

データベース一覧を取得して処理する場合:

```bash
#!/bin/bash

# データベース一覧を取得
databases=$(turso db list)

# 出力を処理
echo "$databases"
```

## ベストプラクティス

### 1. グループによる整理

複数のグループを使用している場合、グループごとにデータベースを確認することで管理が容易になります:

```bash
# 本番環境のデータベースを確認
turso db list --group production

# 開発環境のデータベースを確認
turso db list --group development

# ステージング環境のデータベースを確認
turso db list --group staging
```

### 2. 定期的なインベントリチェック

不要なデータベースを見つけるために定期的にリストを確認します:

```bash
# 月次レビュー用のリスト取得
turso db list > database-inventory-$(date +%Y%m%d).txt
```

### 3. グループフィルタリングの活用

大規模な組織では、グループフィルタリングを使用して関連するデータベースのみを表示:

```bash
# チーム専用のデータベースを表示
turso db list --group team-alpha

# プロジェクト専用のデータベースを表示
turso db list --group project-x
```

## トラブルシューティング

### データベースが表示されない

**原因:**
- 間違った組織にログインしている
- データベースが削除されている
- 権限がない

**解決方法:**

```bash
# 現在の組織を確認
turso org list

# 必要に応じて組織を切り替え
turso org switch <組織名>

# 再度リストを確認
turso db list
```

### グループが見つからない

**原因:**
- グループ名のスペルミス
- グループが削除されている

**解決方法:**

```bash
# グループ一覧を確認
turso group list

# 正しいグループ名で再実行
turso db list --group <正しいグループ名>
```

## CLI出力のカスタマイズ

### JSONフォーマットでの出力

将来的にJSON出力がサポートされる可能性があります:

```bash
# JSON形式での出力（将来のバージョン）
turso db list --format json
```

## パフォーマンス

`turso db list`コマンドは、以下の特徴があります:

- **高速**: APIからメタデータのみを取得
- **軽量**: データベースの内容にはアクセスしない
- **スケーラブル**: 数百のデータベースがあっても高速

## セキュリティ考慮事項

### アクセス制御

- データベース一覧の表示には適切な権限が必要
- 組織メンバーは組織内のすべてのデータベースを表示可能
- 個人アカウントは自分のデータベースのみ表示

### 機密情報

データベース名に機密情報を含めないことを推奨:

```bash
# 良い例
turso db list
# 出力: customer-data, analytics, cache

# 避けるべき例
# 出力: acme-corp-secrets, api-key-store
```

## 関連コマンド

- [`turso db create`](./db-create.md) - 新しいデータベースを作成
- [`turso db show`](./db-show.md) - データベースの詳細情報を表示
- [`turso db destroy`](./db-destroy.md) - データベースを削除
- [`turso group list`](./group-list.md) - グループ一覧を表示
- [`turso org list`](./org-list.md) - 組織一覧を表示

## 参考リンク

- [Turso CLI リファレンス](https://docs.turso.tech/cli)
- [データベース管理](https://docs.turso.tech/concepts/databases)
- [グループ管理](https://docs.turso.tech/concepts/groups)

---

**更新日**: 2025-10-19
**CLIバージョン**: 最新版に対応
