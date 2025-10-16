# Nileデータベースでドリズルを使用するチュートリアル

このチュートリアルでは、Drizzle ORMとNile Databaseを使用してマルチテナントアプリケーションを構築する方法を説明します。包括的な内訳は以下の通りです:

## 前提条件

始める前に、以下をインストールする必要があります:
- Drizzle ORM
- Drizzle Kit
- `dotenv`
- `node-postgres`
- `express`

## セットアップステップ

### 1. Nileにサインアップしてデータベースを作成
- データベース接続文字列を取得
- `.env`ファイルに接続文字列を追加

### 2. データベース設定
- `db.ts`を作成してデータベース接続を設定
- `AsyncLocalStorage`を使用してテナントコンテキストを管理
- テナント固有のクエリを実行する`tenantDB`関数を実装

### 3. スキーマ設定
- Drizzle KitでNileデータベースをイントロスペクト
- テナントとtodoテーブルを含むスキーマファイルを作成
- `drizzle-kit push`を使用してデータベースの変更を適用

## Webアプリケーションの実装

この例では、Expressを使用して以下のルートを持つマルチテナントWebアプリケーションを作成します:
- テナントの作成
- テナントの一覧表示
- todoの追加
- todoの更新
- todoの取得

### 主要なコードのハイライト

テナント対応ミドルウェア:
```typescript
app.use('/api/tenants/:tenantId/*', (req, res, next) => {
  const tenantId = req.params.tenantId;
  tenantContext.run(tenantId, next);
});
```

特定のテナントのtodoを作成:
```typescript
app.post("/api/tenants/:tenantId/todos", async (req, res) => {
  const { title, complete } = req.body;
  const tenantId = req.params.tenantId;

  const newTodo = await tenantDB(async (tx) => {
    return await tx
      .insert(todoSchema)
      .values({ tenantId, title, complete })
      .returning();
  });
});
```

## プロジェクト構造

```
📦 <project root>
 ├ 📂 src
 │   ├ 📂 db
 │   │  ├ db.ts         # データベース設定
 │   │  └ schema.ts     # スキーマ定義
 │   └ index.ts         # Expressアプリケーション
 ├ .env                  # 環境変数
 ├ drizzle.config.ts    # Drizzle設定
 └ package.json
```

## 主なポイント
- Nile Databaseはマルチテナンシーのネイティブサポートを提供
- `AsyncLocalStorage`でテナントコンテキストを管理
- Drizzle ORMで型安全なクエリを実行
- 各テナントのデータは自動的に分離
- スケーラブルなマルチテナントアーキテクチャ
