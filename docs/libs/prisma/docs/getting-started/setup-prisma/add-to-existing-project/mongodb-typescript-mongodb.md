# TypeScriptを使用して既存のMongoDBプロジェクトにPrisma ORMを追加する

## 前提条件
- Node.jsがインストールされていること
- レプリカセットデプロイメントを持つMongoDB 4.2+サーバーへのアクセス
- 推奨: 簡単なセットアップのためのMongoDB Atlas

## セットアップステップ

### 1. プロジェクトディレクトリに移動します

### 2. Prisma CLIを開発依存関係としてインストールします:
```bash
npm install prisma --save-dev
```

### 3. Prismaプロジェクトを初期化します:
```bash
npx prisma init --datasource-provider mongodb --output ../generated/prisma
```

## 初期化の主要なアクション
- `prisma`ディレクトリを作成します
- `schema.prisma`ファイルを生成します
- `.env`ファイルを作成します
- データソースプロバイダーをMongoDBに設定します

## 重要な注意事項
- Prismaはバックエンド/APIレイヤー用に設計されています
- トランザクションサポートにはレプリカセットが必要です
- デプロイメントにはMongoDB Atlasの使用を推奨します

このドキュメントは、MongoDBを使用した既存のTypeScriptプロジェクトにPrisma ORMを統合するためのステップバイステップのガイドを提供し、簡単なセットアップと設定に焦点を当てています。
