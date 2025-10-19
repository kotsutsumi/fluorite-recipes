# Turso Platform API - イントロダクション

Turso Platform APIは、組織のリソース（メンバー、グループ、データベース、APIトークン）をプログラム的に管理するための包括的なインターフェースを提供します。

## 概要

Turso Platform APIを使用することで、SQLiteデータベースの作成と管理を完全に自動化できます。これは、ユーザーごとまたはプラットフォーム全体でデータベースソリューションを提供したい場合に特に有用です。

### 主な機能

- **データベース管理**: プログラム的にSQLiteデータベースを作成、構成、削除
- **組織管理**: 組織のメンバー、設定、サブスクリプションを管理
- **グループ管理**: データベースグループとそのレプリカを管理
- **トークン管理**: APIトークンとデータベースアクセストークンを作成・管理
- **監査ログ**: 組織内のすべてのAPIアクティビティを追跡

## ベースURL

```
https://api.turso.tech
```

すべてのAPIエンドポイントはこのベースURLを使用します。

## APIの用途

### プラットフォーム統合

Turso APIは、以下のようなユースケースに最適です：

- **SaaSプラットフォーム**: ユーザーごとに専用のデータベースを自動プロビジョニング
- **マルチテナントアプリケーション**: テナントごとに分離されたデータベースインスタンスを管理
- **開発者ツール**: データベースインフラストラクチャの自動化とCI/CD統合
- **エンタープライズソリューション**: 大規模なデータベースフリートの管理

### データベースアーキテクチャ

柔軟なデータベースアーキテクチャを構築できます：

```typescript
// ユーザーごとのデータベースを作成する例
interface DatabaseArchitecture {
  strategy: "per-user" | "per-tenant" | "shared";
  replication: {
    enabled: boolean;
    locations: string[];
  };
  scaling: {
    autoScale: boolean;
    maxInstances: number;
  };
}
```

## 始め方

Turso APIを使い始めるには、以下の手順に従ってください：

### 1. APIクイックスタートガイドを確認

最初のステップとして、[APIクイックスタートガイド](./02-quickstart.md)を参照することをお勧めします。このガイドでは以下を学べます：

- Turso CLIのインストール
- 認証トークンの取得
- 最初のAPIコールの実行
- データベースの作成

### 2. 認証を設定

APIを使用するには、認証トークンが必要です。詳細は[認証ガイド](./03-authentication.md)を参照してください。

### 3. APIリファレンスを探索

各APIエンドポイントの詳細なドキュメントを確認：

- [Database APIs](./05-databases-list.md) - データベースの作成と管理
- [Group APIs](./17-groups-list.md) - グループとレプリケーション管理
- [Organization APIs](./31-organizations-list.md) - 組織設定とメンバー管理

## API構造

### リソース階層

```typescript
interface TursoAPIHierarchy {
  organization: {
    id: string;
    slug: string;
    resources: {
      databases: Database[];
      groups: Group[];
      members: Member[];
      apiTokens: APIToken[];
    };
  };
  database: {
    id: string;
    name: string;
    group: string;
    instances: Instance[];
    tokens: DatabaseToken[];
  };
  group: {
    name: string;
    locations: string[];
    databases: Database[];
  };
}
```

### APIバージョン

現在のAPIバージョン: **v1**

すべてのエンドポイントは `/v1/` プレフィックスを使用します：

```
https://api.turso.tech/v1/organizations
https://api.turso.tech/v1/databases
https://api.turso.tech/v1/groups
```

## 重要な概念

### 組織 (Organization)

組織は、すべてのTursoリソースの最上位コンテナです。各APIリクエストは組織のコンテキスト内で実行されます。

### データベースグループ (Database Group)

グループは、複数のロケーションにまたがるデータベースのレプリケーションを管理します。同じグループ内のデータベースは、設定された場所に自動的にレプリケートされます。

### ロケーション (Location)

Tursoは世界中の複数のロケーションでデータベースをホストします。適切なロケーションを選択することで、エンドユーザーに最も近い場所にデータを配置できます。

## 制限事項と考慮事項

### レート制限

APIリクエストにはレート制限が適用される場合があります。詳細はレスポンスヘッダーを確認してください。

### プランによる制限

利用可能な機能やリソースは、サブスクリプションプランによって異なります：

- データベース数
- レプリケーションロケーション数
- APIトークン数
- ストレージ容量

詳細は[組織プランAPI](./35-organizations-plans.md)を参照してください。

## サポートとリソース

### 追加ドキュメント

- [レスポンスコード](./04-response-codes.md) - HTTPステータスコードとエラーハンドリング
- [ロケーションAPI](./29-locations-list.md) - 利用可能なロケーションの一覧
- [監査ログAPI](./40-audit-logs-list.md) - APIアクティビティの追跡

### コミュニティ

- GitHub: Tursoの公式リポジトリ
- Discord: コミュニティサポート
- ドキュメント: 包括的なガイドとチュートリアル

## 次のステップ

1. [APIクイックスタート](./02-quickstart.md)で最初のAPIコールを実行
2. [認証](./03-authentication.md)でセキュリティのベストプラクティスを学習
3. [Database API](./05-databases-list.md)でデータベース管理を開始

---

**参考リンク**:
- [Turso公式ドキュメント](https://docs.turso.tech/)
- [API Quickstart](./02-quickstart.md)
- [Authentication](./03-authentication.md)
