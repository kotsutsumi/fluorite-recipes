# Turso - 認証クイックスタート

Tursoでの認証機能について説明します。

## 概要

TursoはJWTトークンベースの認証をサポートしています。トークンを作成する方法は2つあります：

1. Turso CLIのデータベース/グループトークン
2. JWKSを使用した認証プロバイダーのトークン

## 主な特徴

- 現在、ClerkとAuth0をOIDCプロバイダーとしてサポート
- テーブルレベルおよびアクションレベルでのきめ細かい権限設定が可能

## 認証設定手順

### 1. 認証プロバイダーの設定

Turso CLIを使用してJWTテンプレートを生成します。

#### 権限の設定

さまざまなユーザーロールに対して権限を設定できます。利用可能な権限：

- `data_read` - データの読み取り
- `data_update` - データの更新
- `data_add` - データの追加
- `data_delete` - データの削除
- `schema_update` - スキーマの更新
- `schema_add` - スキーマの追加
- `schema_delete` - スキーマの削除

### 2. JWKSエンドポイントの追加

JWKSエンドポイントはCLIまたはTurso Dashboardから追加できます。

#### CLIでの追加例

```bash
turso org jwks save clerk <jwks-url>
```

### 3. アプリケーションでトークンを使用

データベースクライアントを作成する際にJWTトークンを渡します。

```javascript
import { createClient } from '@tursodatabase/database';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: jwtToken, // 認証プロバイダーから取得したJWTトークン
});
```

## JWKSエンドポイント管理

### エンドポイントのリスト表示

```bash
turso org jwks list
```

### エンドポイントの削除

```bash
turso org jwks remove <name>
```

## 権限の詳細

### テーブルレベルの権限

特定のテーブルに対してアクセス制御を設定できます。

### アクションレベルの権限

各テーブルに対して、以下のアクションを個別に制御できます：

- 読み取り（Read）
- 更新（Update）
- 追加（Add）
- 削除（Delete）

## 重要な注意事項

- 特定の権限が設定されていない場合、トークンはデフォルトですべてのデータベースにアクセスできます
- 本番環境では必要最小限の権限を設定することを推奨します

## ユースケース例

### フィンテックアプリケーション

ユーザーは自分のトランザクションのみを読み取り可能にし、管理者のみがすべてのデータにアクセスできるようにします。

### マルチテナントアプリケーション

各テナントは自分のデータのみにアクセスでき、他のテナントのデータは見えないようにします。

### コンテンツ管理システム

編集者は記事の作成と更新が可能、レビュアーは読み取りのみ、管理者はすべての操作が可能にします。

## 関連リンク

- [Turso公式サイト](https://turso.tech/)
- [Turso GitHub](https://github.com/tursodatabase/turso)
- [Turso Documentation](https://docs.turso.tech/)
- [Clerk Documentation](https://clerk.com/docs)
- [Auth0 Documentation](https://auth0.com/docs)
