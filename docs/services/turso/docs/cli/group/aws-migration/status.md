# turso group aws-migration status - AWS移行ステータスの確認

AWS DynamoDBからTursoへのデータ移行の進行状況を確認します。

## 構文

```bash
turso group aws-migration status <group-name>
```

## パラメータ

### group-name
- **必須**: はい
- **説明**: 移行中のグループ名
- **形式**: 既存のグループ名

## 使用例

### 基本的な使用方法

```bash
# 移行ステータスを確認
turso group aws-migration status production

# 出力例:
# Migration Status: in_progress
# Progress: 45%
# Estimated time remaining: 2 hours
```

## 移行ステータス

- **pending**: 移行待機中
- **in_progress**: 移行実行中
- **completed**: 移行完了
- **failed**: 移行失敗
- **cancelled**: 移行キャンセル

## 関連コマンド

- `turso group aws-migration start <group-name>` - 移行の開始
- `turso group aws-migration cancel <group-name>` - 移行のキャンセル

## 参考リンク

- [AWS移行ガイド](../../help/aws-migration.md)
- [CLI リファレンス](../README.md)

## 注意

この機能の詳細については、Turso公式ドキュメントを参照してください。
