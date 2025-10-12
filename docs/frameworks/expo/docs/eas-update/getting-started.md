# EAS Updateの始め方

EAS Updateを使用すると、完全なアプリストアアップデートを必要とせずに、重要なバグ修正と改善を直接ユーザーにプッシュできます。

## 前提条件

- Expoユーザーアカウント
- React Nativeプロジェクト
- Expo CLIを使用するプロジェクト
- `registerRootComponent`を使用

## セットアップ手順

### 1. EAS CLIのインストール

```bash
npm install --global eas-cli
```

### 2. Expoアカウントにログイン

```bash
eas login
```

### 3. プロジェクトの設定

```bash
eas update:configure
```

このコマンドは：
- プロジェクトに`expo-updates`をインストール
- 必要な設定を`app.json`に追加
- ネイティブプロジェクトファイルを更新

### 4. アップデートチャネルの設定

`eas.json`でアップデートチャネルを設定：

```json
{
  "build": {
    "preview": {
      "channel": "preview"
    },
    "production": {
      "channel": "production"
    }
  }
}
```

またはネイティブプロジェクトファイルで直接設定。

### 5. ビルドの作成

AndroidまたはiOS用のビルドを作成：

```bash
eas build --platform android --profile preview
```

```bash
eas build --platform ios --profile preview
```

### 6. ローカル変更の実施

プロジェクトに変更を加えます（例：テキストやスタイルの変更）。

### 7. アップデートの公開

```bash
eas update --channel preview --message "バグ修正"
```

または特定のブランチに：

```bash
eas update --branch preview --message "新機能"
```

### 8. アップデートのテスト

開発ビルドまたはプレビュービルドでアップデートをテスト：

1. アプリを開く
2. アプリを閉じる
3. アプリを再度開く
4. 変更が適用される

## チャネルとブランチ

### チャネル

- ビルド時に指定
- ビルドがアップデートを受信する場所を決定
- 例：`production`、`preview`、`development`

### ブランチ

- アップデート公開時に指定
- アップデートのストリーム
- チャネルにリンク可能

## 自動公開

`--auto`フラグで自動的にブランチ名とコミットメッセージを使用：

```bash
eas update --auto
```

これは以下を使用：
- 現在のGitブランチ名
- 最新のGitコミットメッセージ

## アップデートの確認

### EASダッシュボード

1. [expo.dev](https://expo.dev)にアクセス
2. プロジェクトを選択
3. Updatesセクションを表示
4. 公開されたアップデートを確認

### CLIでの確認

```bash
# ブランチの一覧表示
eas branch:list

# チャネルの一覧表示
eas channel:list

# アップデートの詳細表示
eas update:view
```

## よくある使用ケース

### 1. バグ修正

```bash
# バグを修正
# コミット
eas update --channel production --message "修正: クラッシュ問題"
```

### 2. A/Bテスト

```bash
# バージョンAを公開
eas update --channel production --branch version-a

# バージョンBを公開
eas update --channel production --branch version-b
```

### 3. 段階的ロールアウト

```bash
# 10%のユーザーにロールアウト
eas update --channel production --rollout-percentage 10
```

## トラブルシューティング

### アップデートが表示されない

1. チャネル設定を確認
2. ランタイムバージョンが一致するか確認
3. アプリを完全に再起動
4. ネットワーク接続を確認

### ランタイムバージョンの不一致

```bash
# app.jsonでランタイムバージョンを確認
{
  "expo": {
    "runtimeVersion": "1.0.0"
  }
}
```

## ベストプラクティス

1. **ステージング環境でテスト**: 本番環境に公開する前にテスト
2. **意味のあるメッセージ**: 変更内容を明確に記述
3. **段階的ロールアウト**: 大きな変更は少数のユーザーから開始
4. **監視**: ダッシュボードで採用率とエラーを監視
5. **ロールバック計画**: 問題が発生した場合の対応を準備

## 次のステップ

- [アップデートのプレビュー](/frameworks/expo/docs/eas-update/preview)
- [デプロイメント戦略](/frameworks/expo/docs/eas-update/deployment)
- [GitHub Actionsとの統合](/frameworks/expo/docs/eas-update/github-actions)
- [動作原理の理解](/frameworks/expo/docs/eas-update/how-it-works)
