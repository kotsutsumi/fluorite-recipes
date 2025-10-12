# 環境変数

EAS Hostingでの環境変数の使用方法を説明します。

## 環境変数の種類

EAS Hostingは2種類の環境変数をサポートしています：

### 1. クライアントサイド環境変数

**特徴：**
- `EXPO_PUBLIC_`プレフィックスが必須
- ビルド時に`npx expo export`実行時にインライン化
- 機密情報を含めることはできません

**使用例：**
```javascript
// アクセス方法
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
```

**設定例：**
```bash
EXPO_PUBLIC_API_URL=https://api.example.com
EXPO_PUBLIC_APP_NAME=MyApp
```

### 2. サーバーサイド環境変数

**特徴：**
- APIルート（`+api.ts`で終わるファイル）で使用
- APIキーなどの機密情報を含めることができます
- `eas deploy`実行時に安全にアップロード

**使用例：**
```typescript
// app/api/users+api.ts
export async function GET(request: Request) {
  const apiKey = process.env.SECRET_API_KEY;
  // API処理
}
```

## ローカル開発

### .envファイルの使用

プロジェクトルートに`.env`ファイルを作成：

```bash
# .env
EXPO_PUBLIC_API_URL=http://localhost:3000
SECRET_API_KEY=your-secret-key-here
```

### .envファイルの読み込み

Expoは自動的に`.env`ファイルを読み込みます。

## EASでの環境変数管理

### EAS CLIで設定

環境変数を取得：
```bash
eas env:pull
```

環境変数を設定：
```bash
eas env:create --name VARIABLE_NAME --value "value" --environment production
```

### Web UIで設定

1. [expo.dev](https://expo.dev)にアクセス
2. プロジェクトを選択
3. Settings → Environment Variablesに移動
4. 変数を追加

## デプロイワークフロー

### 推奨されるワークフロー

```bash
# 1. 環境変数をEASに保存
eas env:create --name SECRET_KEY --value "prod-key" --environment production

# 2. ローカルに環境変数を取得
eas env:pull

# 3. フロントエンドをエクスポート
npx expo export --platform web

# 4. 指定された環境でデプロイ
eas deploy --environment production
```

## 重要な特性

### デプロイメントごとの環境変数

> 環境変数はデプロイメントごとに設定され、デプロイメントは不変です。

これは以下を意味します：
- 各デプロイメントには独自の環境変数セットがあります
- デプロイ後に環境変数を変更するには、再デプロイが必要です
- 異なる環境（production、staging）で異なる値を使用できます

### クライアントサイド変数のインライン化

クライアントサイド変数（`EXPO_PUBLIC_`）は：
- JavaScriptバンドルに埋め込まれます
- ビルド時に値が固定されます
- ブラウザでソースを表示すると見ることができます

### サーバーサイド変数のセキュリティ

サーバーサイド変数は：
- サーバー上で安全に保管されます
- クライアントに送信されません
- APIキーやシークレットに適しています

## ベストプラクティス

### セキュリティ

1. **機密情報の保護**: APIキーやシークレットは`EXPO_PUBLIC_`プレフィックスを使用しない
2. **環境の分離**: 本番環境と開発環境で異なる値を使用
3. **アクセス制限**: 必要な人だけが環境変数にアクセスできるようにする

### 管理

1. **ドキュメント化**: 各環境変数の目的を文書化
2. **命名規則**: 一貫した命名規則を使用（例：`EXPO_PUBLIC_API_URL`）
3. **バージョン管理**: `.env.example`をGitにコミットして、必要な変数を示す

### .env.exampleファイル

```bash
# .env.example
EXPO_PUBLIC_API_URL=
EXPO_PUBLIC_APP_NAME=
SECRET_API_KEY=
DATABASE_URL=
```

## トラブルシューティング

### 変数が読み込まれない

1. プレフィックスを確認（クライアントサイド変数には`EXPO_PUBLIC_`が必要）
2. エクスポートと再デプロイを実行
3. ブラウザキャッシュをクリア

### 環境変数の更新

環境変数を更新した後：
```bash
npx expo export --platform web
eas deploy
```

## 次のステップ

- [カスタムドメインの設定](/frameworks/expo/docs/eas/hosting/custom-domain)
- [APIルートの実装](/frameworks/expo/docs/eas/hosting/api-routes)
- [デプロイワークフローの自動化](/frameworks/expo/docs/eas/hosting/workflows)
