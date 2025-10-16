# Prisma Postgresのクエリ最適化

Prisma Optimizeツールキットを使用してPrisma Postgresがクエリパフォーマンスを最適化する方法を理解します。このセクションでは、セットアップ、推奨事項、クエリの記録、パフォーマンスメトリクス、およびガイド付き改善のためのPrisma AIの使用について説明します。

## このセクションの内容

### [セットアップ](https://www.prisma.io/docs/postgres/query-optimization/setup)
クエリ最適化の前提条件。

### [レコーディング](https://www.prisma.io/docs/postgres/query-optimization/recordings)
レコーディング機能は、開発者がクエリのセットをデバッグして個別のセッションに分離するのに役立ちます。この的を絞ったアプローチにより、異なるアプリケーションやテストラウンドからのクエリの混在を防ぎ、正確なパフォーマンス分析と最適化が可能になり、より明確な洞察とより効果的なデバッグにつながります。

### [推奨事項](https://www.prisma.io/docs/postgres/query-optimization/recommendations)
クエリパフォーマンスの推奨事項を提供します。

### [Prisma AI](https://www.prisma.io/docs/postgres/query-optimization/prisma-ai)
Prisma AIを使用すると、提供された推奨事項に関するフォローアップの質問をして、追加の明確化を得ることができます。

### [パフォーマンスメトリクス](https://www.prisma.io/docs/postgres/query-optimization/performance-metrics)
Optimizeレコーディングセッションは、クエリレイテンシに関する詳細な洞察を提供し、以下のような主要なメトリクスをキャプチャします:
- 平均実行時間
- 50パーセンタイル
- 99パーセンタイル
- 最大クエリ実行時間

このドキュメントは、Prismaの最適化ツールを使用してデータベースクエリパフォーマンスを理解および改善するための包括的なガイドを提供します。
