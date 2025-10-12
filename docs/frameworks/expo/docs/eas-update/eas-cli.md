# EAS CLIでのブランチとチャネルの管理

## 概要

EAS Updateは、ブランチをチャネルにリンクすることで、異なるビルドに異なるアップデートを配信できます。

## アップデートの検査

### チャネル

```bash
# チャネル一覧
eas channel:list

# 特定のチャネルを表示
eas channel:view [channel-name]
```

### ブランチ

```bash
# ブランチ一覧
eas branch:list

# ブランチの詳細を表示
eas branch:view [branch-name]
```

## アップデートの作成と管理

### 新しいアップデートの公開

```bash
# ブランチを指定して公開
eas update --branch [branch-name] --message "..."

# Gitブランチとコミットを使用して自動公開
eas update --auto
```

### ブランチの削除

```bash
eas branch:delete [branch-name]
```

### ブランチの名前変更

```bash
eas branch:rename --from [old-name] --to [new-name]
```

### 以前のアップデートの再公開

```bash
eas update:republish --group [update-group-id]
```

## 重要な概念

- **チャネル**: ビルド時に指定し、ネイティブコードに存在
- **ブランチ**: アップデートの順序付けリスト
- これにより、異なるビルドとチャネル間でアップデートを柔軟に管理できる
