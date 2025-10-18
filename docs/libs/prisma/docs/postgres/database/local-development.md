# Prisma Postgresローカル開発

## 主要なポイント
- ローカルPrisma Postgresは、ローカルデータベースインスタンスを実行するための開発機能です
- Node.js 20以降が必要です
- 現在プレビュー/Early Accessステージです

## セットアッププロセス

### 1. ローカルサーバーの起動
```bash
npx prisma dev
```

### 2. マイグレーションの適用
```bash
npx prisma migrate dev
```

### 3. 接続設定
- データベースURLを`.env`ファイルに保存します
- 接続文字列の例:
```
DATABASE_URL="prisma+postgres://localhost:51213/?api_key=__API_KEY__"
```

## 高度な機能
- 特定のローカルインスタンスに名前を付ける: `npx prisma dev --name mydb1`
- インスタンスの停止: `npx prisma dev stop <glob>`
- インスタンスの削除: `npx prisma dev rm <glob>`

## 管理オプション
- データベース管理用のVS Code拡張機能
- Node.jsによるプログラム的な管理

## 既知の制限事項
- 一度に1つの接続のみ
- キャッシングはローカルでモックされます
- HTTPS接続なし
- 開発/テスト用に推奨され、セルフホスティングには推奨されません

このドキュメントは、開発者がアプリケーション開発中にローカルPrisma Postgresインスタンスをセットアップおよび管理するための包括的なガイドを提供します。
