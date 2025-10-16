# スキーマのプロトタイピング

## `db push` の概要

Prisma CLI は、スキーマのプロトタイピング用に `db push` コマンドを提供しています。このコマンドには以下の特徴があります：

1. Prisma スキーマとデータベーススキーマを同期する
2. データベースをイントロスペクトし、必要な変更を実行する
3. Prisma Client などのジェネレーターを自動的にトリガーする
4. デフォルトで破壊的な変更を防止する

> **注意**：
> - マイグレーションとは相互作用しません
> - PlanetScale ワークフローに推奨されます

## `db push` または Prisma Migrate の選択

### `db push` を使用する場合

**適している用途**：
- 迅速なローカルスキーマのプロトタイピング
- 望ましい最終状態への到達
- 変更履歴のトラッキングよりもスピードを優先する場合

**推奨されない場合**：
- 環境間でスキーマ変更を複製する必要がある
- スキーマ変更の細かい制御が必要
- スキーマ変更履歴を追跡したい

## プロトタイピングワークフロー

### ワークフローの例

1. 初期スキーマを作成する
2. `npx prisma db push` を使用して同期する
3. サンプルデータを作成する
4. スキーマを反復的に進化させる
5. データ損失の可能性があるシナリオを処理する
6. スキーマが安定したらマイグレーション履歴を初期化する

### コード例

```prisma
model User {
  id       Int      @id @default(autoincrement())
  name     String
  jobTitle String
  posts    Post[]
  profile  Profile?
}

model Profile {
  id       Int    @id @default(autoincrement())
  biograpy String
  userId   Int    @unique
  user     User   @relation(fields: [userId], references: [id])
}
```

### ステップ1: 初期スキーマを作成する

上記のスキーマを作成した後、以下を実行します：

```bash
npx prisma db push
```

このコマンドは：
- データベースに `User` と `Profile` テーブルを作成します
- Prisma Client を生成します

### ステップ2: サンプルデータを作成する

```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.create({
    data: {
      name: 'Alice',
      jobTitle: 'Engineer',
      profile: {
        create: {
          biograpy: 'I love coding!',
        },
      },
    },
  })

  console.log(user)
}

main()
```

### ステップ3: スキーマを反復的に進化させる

たとえば、`Profile` モデルの `biograpy` フィールドのタイプミスを修正する場合：

```prisma
model Profile {
  id        Int    @id @default(autoincrement())
  biography String  // タイプミスを修正: biograpy -> biography
  userId    Int    @unique
  user      User   @relation(fields: [userId], references: [id])
}
```

再度 `db push` を実行：

```bash
npx prisma db push
```

Prisma はカラムを削除して再作成しようとしますが、データが失われる可能性があるため警告が表示されます：

```
⚠️  There might be data loss when applying the changes:
  • The column `biograpy` on the `Profile` table would be dropped and recreated.

? Do you want to continue? (y/N)
```

### ステップ4: データ損失を回避する

データを保持する場合は、マイグレーションをカスタマイズするか、手動で SQL を実行します：

```sql
ALTER TABLE "Profile" RENAME COLUMN "biograpy" TO "biography";
```

または、`prisma migrate dev --create-only` を使用してマイグレーションファイルを作成し、編集してから適用します。

## `db push` と Prisma Migrate の併用

プロトタイピング段階では `db push` を使用し、スキーマが安定したら Prisma Migrate に切り替えることができます：

### ステップ1: マイグレーション履歴を初期化する

```bash
npx prisma migrate dev --name init
```

これにより、現在のスキーマを反映する初期マイグレーションが作成されます。

### ステップ2: 今後の変更には Migrate を使用する

スキーマが安定した後は、`prisma migrate dev` を使用して変更を追跡します：

```bash
npx prisma migrate dev --name add_user_email
```

## 主要な考慮事項

### メリット

- **高速な反復**: マイグレーションファイルを管理する必要がない
- **シンプル**: 1つのコマンドでスキーマを同期
- **柔軟性**: 早期のスキーマ設計に柔軟性を提供

### デメリット

- **履歴なし**: スキーマ変更の履歴が保存されない
- **環境間の同期が困難**: 本番環境への適用が難しい
- **データ損失のリスク**: 破壊的な変更が簡単に発生する可能性がある

## ベストプラクティス

1. **開発初期に使用**: 機能やスキーマの実験段階で使用
2. **本番環境では使用しない**: 本番環境では Prisma Migrate を使用
3. **データバックアップ**: 重要なデータがある場合は事前にバックアップ
4. **チーム開発では注意**: チームメンバー間でのスキーマ同期が難しい
5. **安定したら Migrate に移行**: スキーマが安定したらマイグレーション履歴を作成

## PlanetScale での使用

PlanetScale のようなデータベースプロバイダーでは、`db push` が推奨されるワークフローです：

```bash
# PlanetScale での使用例
DATABASE_URL="mysql://..." npx prisma db push
```

PlanetScale は独自のマイグレーションシステムを持っているため、Prisma Migrate は使用しません。

## トラブルシューティング

### 警告: データが失われる可能性があります

このメッセージが表示された場合：

1. 変更内容を確認する
2. データをバックアップする
3. 必要に応じて手動で SQL を実行する
4. `--accept-data-loss` フラグを使用する（データ損失を許容する場合）

```bash
npx prisma db push --accept-data-loss
```

### データベースが同期していない

スキーマとデータベースが大きく異なる場合、`db push` は失敗する可能性があります。その場合：

1. データベースをリセットする（開発環境のみ）
2. 手動で SQL を実行して状態を修正する
3. Prisma Migrate を使用する

## まとめ

`db push` は、以下の場合に最適なツールです：

- スキーマのプロトタイピングと実験
- 迅速な開発サイクル
- PlanetScale などのデータベースプラットフォーム

一方、本番環境やチーム開発では、Prisma Migrate を使用してスキーマ変更を適切に管理することを推奨します。
