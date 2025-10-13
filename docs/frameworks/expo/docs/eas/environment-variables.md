# EASにおける環境変数

## 主要な概念

### EASの環境
- 3つの環境をサポート：`development`、`preview`、`production`
- 異なるコンテキストに対する独立した環境変数セット
- 複数の環境に変数を割り当て可能

### プロジェクト全体の環境変数
- 単一のEASプロジェクトに固有
- Expoダッシュボードを通じて管理
- EASサーバージョブおよびアップデートで利用可能

### アカウント全体の環境変数
- EASアカウント内のすべてのプロジェクトで利用可能
- プロジェクト全体の変数と併用可能

### 可視性設定

| 可視性 | 説明 |
|------------|-------------|
| Plain text | Webサイト、CLI、ログで表示可能 |
| Sensitive | ログ内で難読化、表示の切り替えが可能 |
| Secret | EASサーバー外では読み取り不可 |

## 環境変数の作成と使用

### コード内での使用
- `EXPO_PUBLIC_`プレフィックスを持つ変数が`process.env`で利用可能
- アプリの動作を動的に設定可能

例：
```javascript
function Post() {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  async function onPress() {
    await fetch(apiUrl, { ... })
  }
}
```

### 環境変数の作成
- Webフォームまたは`eas env:create`コマンドを使用
- 名前、値、環境、可視性を指定

### ローカル開発用にプル
- `eas env:pull --environment development`を使用
- 環境変数を含む.envファイルを作成

### EAS Buildでの使用
- `eas.json`で`environment`を指定
- 異なるビルドプロファイルの環境を制御

### EAS Updateでの使用
- `eas update`で`--environment`フラグを使用
- 一貫した環境変数を保証

## 環境変数の管理

### EASダッシュボードの使用
- 変数の作成、読み取り、更新に最も簡単な方法
- プロジェクトまたはアカウントの環境変数ページに移動

### EAS CLIの使用
- コマンド：`eas env:create`、`eas env:update`、`eas env:list`、`eas env:delete`
- ローカル開発の同期には`eas env:pull`

## 推奨ワークフロー

1. 適切な可視性設定を使用
2. .envファイルを.gitignoreに追加
3. 環境ごとに異なる変数セットを使用
4. 機密情報には必ずSecret可視性を使用
