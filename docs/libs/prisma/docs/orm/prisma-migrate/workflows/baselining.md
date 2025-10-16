# データベースのベースライン化

ベースライン化は、以下のようなデータベースのマイグレーション履歴を初期化するプロセスです：

- ✔ Prisma Migrate を使用する前から存在していた
- ✔ 維持する必要があるデータを含んでいる（本番環境など）、つまりデータベースをリセットできない

## ベースライン化が必要な理由

既存のプロジェクトに Prisma Migrate を追加する場合、初期マイグレーションには Prisma Migrate を使用する前のデータベースの状態を再作成するために必要なすべての SQL が含まれます。

### 主要な考慮事項

- ベースライン化は既存のデータベースのマイグレーションを管理するのに役立ちます
- テーブルやフィールドが既に存在する場合のマイグレーションエラーを防ぎます
- データベースをリセットせずに本番データベースを維持するのに有用です

## データベースをベースライン化する：ステップバイステップ

### ステップ1: 既存の `prisma/migrations` フォルダを削除またはアーカイブ

既存のマイグレーションファイルがある場合は、バックアップを取るか削除します：

```bash
# バックアップ（推奨）
mv prisma/migrations prisma/migrations_backup

# または削除
rm -rf prisma/migrations
```

### ステップ2: 新しいマイグレーションディレクトリを作成

```bash
mkdir -p prisma/migrations/0_init
```

マイグレーション名には `0_` プレフィックスを使用して、これが初期マイグレーションであることを示します。

### ステップ3: マイグレーションスクリプトを生成

```bash
npx prisma migrate diff \
  --from-empty \
  --to-schema-datamodel prisma/schema.prisma \
  --script > prisma/migrations/0_init/migration.sql
```

このコマンドは：
- 空のデータベースから開始（`--from-empty`）
- 現在のスキーマへの差分を作成（`--to-schema-datamodel`）
- SQL スクリプトとして出力（`--script`）

### ステップ4: マイグレーションを解決（適用済みとしてマーク）

```bash
npx prisma migrate resolve --applied 0_init
```

これにより、Prisma Migrate は `0_init` マイグレーションが既にデータベースに適用されていると認識します。

## 詳細な例

### シナリオ: 既存の本番データベースをベースライン化

**前提条件：**
- 本番データベースが既に稼働中
- Prisma スキーマがデータベースの現在の状態を反映している
- データをリセットできない

**完全なワークフロー：**

**ステップ1: 現在のスキーマがデータベースと一致していることを確認**

```bash
# データベースをイントロスペクトしてスキーマを更新
npx prisma db pull
```

**ステップ2: 既存のマイグレーションをバックアップ（存在する場合）**

```bash
mv prisma/migrations prisma/migrations_backup_$(date +%Y%m%d)
```

**ステップ3: 新しいマイグレーションディレクトリを作成**

```bash
mkdir -p prisma/migrations/0_init
```

**ステップ4: ベースラインマイグレーションを生成**

```bash
npx prisma migrate diff \
  --from-empty \
  --to-schema-datamodel prisma/schema.prisma \
  --script > prisma/migrations/0_init/migration.sql
```

**ステップ5: 生成されたマイグレーションを確認**

```bash
cat prisma/migrations/0_init/migration.sql
```

内容が現在のデータベース構造と一致していることを確認します。

**ステップ6: マイグレーションを適用済みとしてマーク**

```bash
npx prisma migrate resolve --applied 0_init
```

**ステップ7: 状態を確認**

```bash
npx prisma migrate status
```

出力例：
```
Database schema is up to date!
```

**ステップ8: バージョン管理にコミット**

```bash
git add prisma/migrations
git commit -m "Add baseline migration for existing database"
git push
```

## 新しい環境への展開

ベースライン化されたマイグレーションを使用して新しい環境をセットアップする場合：

```bash
# マイグレーションを適用
npx prisma migrate deploy
```

`prisma migrate deploy` は：
- `0_init` マイグレーションを実行してデータベース構造を作成
- 以降の新しいマイグレーションを適用

## 重要な注意事項

> **注意**: このガイドは **MongoDB には適用されません**。MongoDB の場合は、`migrate dev` の代わりに `db push` を使用します。

### MongoDB での代替手法

```bash
# MongoDB ではこれを使用
npx prisma db push
```

## `prisma migrate deploy` の動作

ベースライン化後に `prisma migrate deploy` を実行すると：

- 'applied' としてマークされたマイグレーションをスキップ
- ベースラインマイグレーション後の新しいマイグレーションを適用

### 例

```
prisma/migrations/
├── 0_init/                     # スキップ（既に適用済み）
│   └── migration.sql
├── 20230101120000_add_posts/  # 適用
│   └── migration.sql
└── 20230102140000_add_users/  # 適用
    └── migration.sql
```

## 推奨事項

### マイグレーション名

- タイムスタンプまたは `0_` プレフィックスを使用
- マイグレーション名が辞書順になるように確保
- 説明的な名前を使用（例：`0_init`、`0_baseline`）

### ベースライン化すべきデータベース

以下のデータベースのみをベースライン化：
- リセットできないデータベース
- 本番データを含むデータベース
- 既存の構造を持つデータベース

### 開発データベースの場合

開発データベースの場合は、ベースライン化の代わりに：

```bash
# データベースをリセット（開発環境のみ）
npx prisma migrate reset

# 新しいマイグレーションを作成
npx prisma migrate dev --name init
```

## 複数環境でのベースライン化

### シナリオ: 本番環境とステージング環境

**本番環境：**

```bash
# ベースラインマイグレーションを生成
npx prisma migrate diff \
  --from-empty \
  --to-schema-datamodel prisma/schema.prisma \
  --script > prisma/migrations/0_init/migration.sql

# 適用済みとしてマーク
npx prisma migrate resolve --applied 0_init
```

**ステージング環境：**

```bash
# 本番と同じベースラインマイグレーションを使用
npx prisma migrate resolve --applied 0_init
```

**新しい開発環境：**

```bash
# ベースラインマイグレーションを含むすべてのマイグレーションを適用
npx prisma migrate deploy
```

## トラブルシューティング

### エラー: "Migration already applied"

既にマイグレーションが適用されている場合：

```bash
# 状態を確認
npx prisma migrate status

# 必要に応じてスキップ
```

### エラー: "Database schema is not in sync"

スキーマとデータベースが一致しない場合：

```bash
# データベースをイントロスペクト
npx prisma db pull

# 新しいベースラインを生成
npx prisma migrate diff \
  --from-empty \
  --to-schema-datamodel prisma/schema.prisma \
  --script > prisma/migrations/0_init/migration.sql
```

### ベースラインマイグレーションの再生成

間違ったベースラインを生成した場合：

```bash
# マイグレーションフォルダを削除
rm -rf prisma/migrations/0_init

# 新しいディレクトリを作成
mkdir -p prisma/migrations/0_init

# 正しいベースラインを生成
npx prisma migrate diff \
  --from-empty \
  --to-schema-datamodel prisma/schema.prisma \
  --script > prisma/migrations/0_init/migration.sql

# 再度マーク
npx prisma migrate resolve --applied 0_init
```

## ベストプラクティス

1. **バックアップを取る**: ベースライン化前に必ずデータベースをバックアップ
2. **スキーマを確認**: Prisma スキーマがデータベースと完全に一致していることを確認
3. **テスト環境で試す**: 本番前にステージング環境でテスト
4. **ドキュメント化**: ベースライン化のプロセスと理由を文書化
5. **チームと共有**: チームメンバーに新しいマイグレーション戦略を通知

## まとめ

ベースライン化は、以下の場合に不可欠です：

- 既存のプロジェクトに Prisma Migrate を導入
- リセットできない本番データベース
- 既存のデータベース構造の維持

適切にベースライン化することで、既存のデータを失うことなく、Prisma Migrate の利点を活用できます。
