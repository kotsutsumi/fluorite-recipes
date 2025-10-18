# Prisma Postgresの概要

## Prisma Postgresの概要
- データベースの作成とスケーリングのためのマネージドPostgreSQLデータベースサービス
- スキーママイグレーション、クエリ、コネクションプーリング、ローカルデータベースワークフローをサポート

## 主要な機能

### 1. 使用状況メトリクス
次のような主要なメトリクスを追跡します:
- 推定請求額
- 使用された合計ストレージ
- 合計データベース数
- 累積操作数

### 2. 課金モデル
次に基づく使用量ベースの価格設定:
- 操作数
- ストレージ（GiB単位）

「操作は、作成、読み取り、更新、または削除を実行するたびにカウントされます」

予測可能なコスト構造を提供します。

### 3. 支出制限
- 費用を制御するための制限を設定します
- 制限の75%でアラートを発行します
- 制限の100%でデータベースが一時停止します
- Proプラン以上で利用可能です

### 4. Prisma Accelerate統合
- Prisma Accelerateとバンドルされています
- `@prisma/extension-accelerate`パッケージが必要です
- AccelerateでPrismaClientを拡張する必要があります

## 技術的詳細
- PostgreSQLバージョン: v17
- ユニカーネルを使用してベアメタルサーバーにデプロイ
- 効率性と安全性のための独自のアーキテクチャ

## Accelerateのコード例
```javascript
import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'
const prisma = new PrismaClient().$extends(withAccelerate())
```
