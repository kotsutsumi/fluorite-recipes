# 開発環境 | Supabase Docs

Edge Functionsのローカル開発環境を設定します。

* * *

開始する前に、Supabase CLIがインストールされていることを確認してください。インストール方法とトラブルシューティングについては、[CLI インストールガイド](/docs/guides/cli)を確認してください。

* * *

## ステップ1: Deno CLIのインストール

Supabase CLIは、標準のDeno CLIを使用してローカルで関数を提供しません。代わりに、開発環境と本番環境を一貫に保つため、独自のEdge Runtimeを使用します。

[Denoガイド](https://deno.com/manual@v1.32.5/getting_started/setup_your_environment)に従って、お気に入りのエディター/IDEで開発環境を設定できます。

Denoを個別にインストールするメリットは、エディターの自動補完、型チェック、テストを改善するDeno LSPを使用できることです。`deno fmt`、`deno lint`、`deno test`などのDeno組み込みツールも使用できます。

インストール後、ターミナルでDenoが利用可能になります。`deno --version`で確認してください。

* * *

## ステップ2: エディターの設定

適切なTypeScriptサポート、自動補完、エラー検出のためにエディター環境を設定します。

### VSCode/Cursor (推奨)

1. VSCodeマーケットプレイスから**Denoエクステンション**をインストール

2. **オプション1: 自動生成（最も簡単）**
   `supabase init`を実行する際、「Generate VS Code settings for Deno? [y/N]」というプロンプトが表示されます。`y`と答えると、`.vscode/settings.json`ファイルが自動的に作成されます。

3. **オプション2: 手動設定**
   プロジェクトルートに`.vscode/settings.json`ファイルを作成します：

```json
{
  "deno.enable": true,
  "deno.enablePaths": ["supabase/functions"],
  "deno.unstable": true,
  "deno.importMap": "./supabase/functions/import_map.json"
}
```

これにより、VSCodeはDenoを使用してTypeScriptファイルをチェックし、適切な型推論とインテリセンスを提供します。

### その他のエディター

他のエディターについては、[Deno公式ドキュメント](https://deno.com/manual@v1.32.5/getting_started/setup_your_environment)を参照してください。

* * *

## ステップ3: ローカル開発サーバーの起動

Edge Functionsをローカルで開発およびテストするには、Supabaseローカル開発スタックを起動します：

```bash
supabase start
```

次に、関数を提供します：

```bash
supabase functions serve
```

特定の関数のみを提供する場合：

```bash
supabase functions serve function-name
```

これにより、`http://localhost:54321/functions/v1/function-name`で関数にアクセスできます。

* * *

## ステップ4: 関数のテスト

関数が実行されたら、`curl`やPostmanなどのツールを使用してテストできます：

```bash
curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/hello-world' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"name":"Functions"}'
```

* * *

## ステップ5: デバッグ

Edge Functionsは、標準的な`console.log()`ステートメントを使用してデバッグできます。ログは、`supabase functions serve`を実行しているターミナルに表示されます。

より高度なデバッグには、Deno Inspectorを使用できます：

```bash
supabase functions serve --inspect-mode
```

これにより、Chrome DevToolsまたは他のデバッガーを関数に接続できます。

* * *

## 次のステップ

- [アーキテクチャ](/docs/guides/functions/architecture)を理解
- [シークレット](/docs/guides/functions/secrets)の管理方法を学習
- [依存関係](/docs/guides/functions/dependencies)の追加方法を確認
