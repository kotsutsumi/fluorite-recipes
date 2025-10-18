# Supabase Edge Functions - はじめに

## 概要

Supabase CLIを使用して、最初のEdge Functionを作成、テスト、デプロイする方法を学びます。

* * *

始める前に、**Supabase CLIがインストールされている**ことを確認してください。インストール方法とトラブルシューティングについては、[CLIインストールガイド](/docs/guides/cli)を確認してください。

##### Supabaseダッシュボードを使用したい場合

Supabaseダッシュボードから直接、関数を作成およびデプロイできます。[ダッシュボードのクイックスタートガイド](/docs/guides/functions/quickstart-dashboard)を確認してください。

* * *

## ステップ1: プロジェクトの作成または設定

プロジェクトをまだ持っていない場合は、現在のディレクトリに新しいSupabaseプロジェクトを初期化します。

```bash
supabase init my-edge-functions-project
cd my-edge-functions-project
```

既存のプロジェクトがある場合は、プロジェクトディレクトリに移動します。Supabaseが設定されていない場合は、`supabase init`コマンドを実行してください。

```bash
cd your-existing-project
supabase init # Supabaseが初期化されていない場合
```

この手順後、`supabase`フォルダに`config.toml`と空の`functions`ディレクトリが作成されます。

* * *

## ステップ2: 最初の関数を作成

プロジェクト内で、基本的なテンプレートを使用して新しいEdge Functionを生成します：

```bash
supabase functions new hello-world
```

これにより、`supabase/functions/hello-world/index.ts`に新しい関数ファイルが作成されます。

* * *

## ステップ3: 関数をローカルでテスト

関数をデプロイする前に、ローカルでテストします：

```bash
supabase start
supabase functions serve hello-world
```

別のターミナルで、関数を呼び出します：

```bash
curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/hello-world' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"name":"Functions"}'
```

* * *

## ステップ4: 関数をデプロイ

準備ができたら、関数をSupabaseプロジェクトにデプロイします：

```bash
supabase functions deploy hello-world
```

これで、関数がSupabaseのグローバルエッジネットワークで利用可能になります。

* * *

## 次のステップ

- [開発環境](/docs/guides/functions/development-environment)を設定
- [シークレット](/docs/guides/functions/secrets)の管理方法を学習
- [依存関係](/docs/guides/functions/dependencies)の追加方法を確認
- [関数の設定](/docs/guides/functions/function-configuration)をカスタマイズ
