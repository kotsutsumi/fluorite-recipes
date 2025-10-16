# MongoDBを使用した既存のTypeScriptプロジェクトでPrisma Clientをインストールする

## Prisma Clientをインストールするための主要なステップ

### 1. Prisma Clientパッケージのインストール
```bash
npm install @prisma/client
```

## 重要な注意事項
- インストールコマンドは自動的に`prisma generate`を実行します
- `prisma generate`は、スキーマに基づいてカスタマイズされたPrisma Clientを作成します
- スキーマを変更した場合は、手動で`prisma generate`を実行する必要があります

このドキュメントは、MongoDBを使用したTypeScriptプロジェクトにPrisma Clientを統合するための簡単なガイドを提供し、インストールと生成プロセスに焦点を当てています。このページは、Prismaの「はじめに」ドキュメントの一部であり、特にMongoDBを使用するTypeScript開発者を対象としています。

このページには、インストールと生成プロセスを示すスクリーンショットなどの視覚的な補助が含まれており、セットアッププロセスの前後のステップへのナビゲーションリンクが提供されています。
