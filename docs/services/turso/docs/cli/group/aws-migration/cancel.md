# turso group aws-migration cancel - AWS移行のキャンセル

進行中のAWS DynamoDBからTursoへのデータ移行をキャンセルします。

## 構文

```bash
turso group aws-migration cancel <group-name> [flags]
```

## パラメータ

### group-name
- **必須**: はい
- **説明**: 移行をキャンセルするグループ名
- **形式**: 既存のグループ名

## フラグ

### -y, --yes
- **説明**: 確認プロンプトをスキップ
- **用途**: 自動化スクリプトでの使用

## 使用例

### 基本的な使用方法

```bash
# 移行をキャンセル
turso group aws-migration cancel production

# 確認なしでキャンセル
turso group aws-migration cancel production --yes
```

## 注意事項

- キャンセルした移行は復元できません
- 部分的に移行されたデータは保持される場合があります
- キャンセル後、新しい移行を開始できます

## 関連コマンド

- `turso group aws-migration start <group-name>` - 移行の開始
- `turso group aws-migration status <group-name>` - 移行ステータスの確認

## 参考リンク

- [AWS移行ガイド](../../help/aws-migration.md)
- [CLI リファレンス](../README.md)

## 注意

この機能の詳細については、Turso公式ドキュメントを参照してください。
