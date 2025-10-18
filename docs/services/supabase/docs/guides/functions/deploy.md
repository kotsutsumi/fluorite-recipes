# 本番環境へのデプロイ

## 概要

Edge FunctionsをリモートのSupabaseプロジェクトにデプロイします。開始する前に、Supabase CLIがインストールされていることを確認してください。

## デプロイ手順

### ステップ1: 認証

Supabase CLIにログインします:

```bash
supabase login
```

### ステップ2: プロジェクトの接続

プロジェクトIDを取得します:

```bash
supabase projects list
```

ローカルプロジェクトをリモートプロジェクトにリンクします:

```bash
supabase link --project-ref your-project-id
```

### ステップ3: Functionsのデプロイ

`functions`フォルダ内のすべての関数をデプロイします:

```bash
supabase functions deploy
```

特定の関数をデプロイします:

```bash
supabase functions deploy hello-world
```

#### パブリック関数のデプロイ

JWT検証なしで関数をデプロイする場合（Webhookなど）:

```bash
supabase functions deploy hello-world --no-verify-jwt
```

> **警告**: このフラグを使用する際は注意してください。有効なJWTなしで誰でもEdge Functionを呼び出せるようになります。

### ステップ4: デプロイの確認

関数は以下のURLでグローバルに配信されます:

```
https://[YOUR_PROJECT_ID].supabase.co/functions/v1/hello-world
```

### ステップ5: 関数のテスト

API設定からプロジェクトの`ANON_KEY`を使用して呼び出します。

## CI/CDデプロイ

以下を介した自動デプロイをサポートしています:

- GitHub Actions
- GitLab CI
- Bitbucket Pipelines

### 関数の設定

`config.toml`で個別の関数を設定し、環境全体で一貫した設定を確保します。
