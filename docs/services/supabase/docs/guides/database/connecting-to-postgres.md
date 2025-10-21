# データベースへの接続

## 概要

Supabaseは、さまざまな環境に対応した複数の方法でPostgresデータベースに接続する手段を提供しています。

## 接続方法

### フロントエンドアプリケーション

- Data API（RESTまたはGraphQL)を使用
- Supabaseクライアントライブラリを活用:
  - JavaScript
  - Flutter
  - Swift
  - Python
  - C#
  - Kotlin

### Postgresクライアント接続オプション

#### 1. 直接接続

- 永続的なサーバー（VM、長時間稼働するコンテナ）に最適
- デフォルトでIPv6を使用
- 接続文字列の形式:
  ```
  postgresql://postgres:[YOUR-PASSWORD]@db.example.supabase.co:5432/postgres
  ```

#### 2. 共有プーラーオプション

**a. Supavisor セッションモード**
- プロキシ経由で接続
- IPv4とIPv6の両方をサポート
- 接続文字列:
  ```
  postgres://postgres.example:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres
  ```

**b. Supavisor トランザクションモード**
- サーバーレス/エッジ関数に最適
- 一時的な接続を処理
- 接続文字列:
  ```
  postgres://postgres.example:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
  ```

### 専用プーラー

- 有料顧客向けに提供
- Postgresデータベースと同じ場所に配置
- IPv6サポートまたはIPv4アドオンが必要

## 主な考慮事項

- フロントエンドAPIでは行レベルセキュリティ（RLS）を使用
- インフラストラクチャに基づいて接続方法を選択
- 接続文字列はプロジェクトダッシュボードで利用可能

## クイックスタートガイド

- Prisma
- Drizzle
- Postgres.js
- pgAdmin
- PSQL
- DBeaver
- Metabase
- Beekeeper Studio

このドキュメントは、さまざまな環境とユースケースでSupabase Postgresデータベースに接続するための包括的なガイダンスを提供します。
