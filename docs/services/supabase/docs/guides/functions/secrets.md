# 環境変数 | Supabase ドキュメント

環境変数を使用して、環境間で機密データを安全に管理します。

---

## デフォルトのシークレット

Edge Functionsは、デフォルトで以下のシークレットにアクセスできます：

- `SUPABASE_URL`: SupabaseプロジェクトのAPIゲートウェイ
- `SUPABASE_ANON_KEY`: Supabase APIの`anon`キー。Row Level Securityが有効な場合、ブラウザで安全に使用できます
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase APIの`service_role`キー。Edge Functionsでは安全に使用できますが、ブラウザでは絶対に使用しないでください。このキーはRow Level Securityをバイパスします
- `SUPABASE_DB_URL`: PostgresデータベースのURL。データベースに直接接続するために使用できます

ホスト環境では、関数は以下の環境変数にアクセスできます：

- `SB_REGION`: 関数が呼び出されたリージョン
- `SB_EXECUTION_ID`: 関数インスタンス（[分離](/docs/guides/functions/architecture#4-execution-mechanics-fast-and-isolated)）のUUID
- `DENO_DEPLOYMENT_ID`: 関数コードのバージョン（`{project_ref}_{function_id}_{version}`）

---

## 環境変数へのアクセス

環境変数には、Denoの組み込みハンドラを使用し、アクセスしたい環境変数の名前を渡すことでアクセスできます。

```typescript
Deno.env.get('NAME_OF_SECRET')
```

例えば、関数内では：

```typescript
const supabaseUrl = Deno.env.get('SUPABASE_URL')
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')
```

---

## カスタムシークレットの設定

カスタムシークレット（APIキー、データベース認証情報など）を追加できます。

### Supabase CLIを使用

```bash
supabase secrets set SECRET_NAME=secret_value
```

複数のシークレットを一度に設定：

```bash
supabase secrets set API_KEY=abc123 DATABASE_PASSWORD=xyz789
```

### ダッシュボードを使用

1. Supabaseプロジェクトダッシュボードに移動
2. **Edge Functions** > **Settings**に移動
3. **Secrets**セクションで新しいシークレットを追加

---

## ローカル開発での環境変数

ローカル開発では、`.env`ファイルを使用して環境変数を管理できます。

プロジェクトルートに`.env.local`ファイルを作成：

```bash
API_KEY=your-api-key-here
DATABASE_PASSWORD=your-password-here
```

このファイルを`.gitignore`に追加して、バージョン管理にコミットされないようにしてください：

```bash
echo ".env.local" >> .gitignore
```

ローカルで関数を提供する際、Supabase CLIは自動的に`.env.local`ファイルを読み込みます：

```bash
supabase functions serve --env-file .env.local
```

---

## シークレットの一覧表示

設定されているシークレットの名前を表示：

```bash
supabase secrets list
```

注意: セキュリティ上の理由から、シークレットの値は表示されません。

---

## シークレットの削除

不要になったシークレットを削除：

```bash
supabase secrets unset SECRET_NAME
```

---

## ベストプラクティス

1. **機密データをコードにハードコードしない**: 常に環境変数を使用
2. **環境ごとに異なる値を使用**: 開発、ステージング、本番で異なるシークレットを使用
3. **定期的にローテーション**: セキュリティのため、APIキーとパスワードを定期的に更新
4. **最小権限の原則**: 必要な権限のみを持つシークレットを使用
5. **バージョン管理にシークレットをコミットしない**: `.env`ファイルを常に`.gitignore`に追加

---

## トラブルシューティング

### 環境変数が未定義

関数内で環境変数が`undefined`の場合：

1. シークレットが正しく設定されているか確認：`supabase secrets list`
2. 関数を再デプロイ：`supabase functions deploy function-name`
3. ローカル開発では、`.env.local`ファイルが正しく読み込まれているか確認

### ローカルと本番で異なる動作

- ローカル環境と本番環境で同じシークレット名を使用していることを確認
- `.env.local`ファイルと本番のシークレットが同期していることを確認

---

## 次のステップ

- [依存関係](/docs/guides/functions/dependencies)の管理方法を学習
- [関数の設定](/docs/guides/functions/function-configuration)をカスタマイズ
- [アーキテクチャ](/docs/guides/functions/architecture)を理解
