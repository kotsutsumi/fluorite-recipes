# turso group aws-migration start - AWS移行の開始

AWS DynamoDBからTursoへのデータ移行を開始します。

## 構文

```bash
turso group aws-migration start <group-name> [flags]
```

## パラメータ

### group-name
- **必須**: はい
- **説明**: 移行先のグループ名
- **形式**: 既存のグループ名

## フラグ

詳細なフラグオプションについては、公式ドキュメントを参照してください。

## 使用例

### 基本的な使用方法

```bash
# AWS移行を開始
turso group aws-migration start production
```

## 前提条件

- AWSクレデンシャルの設定
- 移行元DynamoDBテーブルへのアクセス権限
- 移行先グループの作成

## 関連コマンド

- `turso group aws-migration status <group-name>` - 移行ステータスの確認
- `turso group aws-migration cancel <group-name>` - 移行のキャンセル
- `turso group create <group-name>` - グループの作成

## 参考リンク

- [AWS移行ガイド](../../help/aws-migration.md)
- [グループの概要](../../features/groups.md)
- [CLI リファレンス](../README.md)

## 注意

この機能の詳細については、Turso公式ドキュメントを参照してください。
