# 高度な設定

Vercel Functionsの高度な設定のために、`vercel.json`ファイルを作成してランタイムやその他のカスタマイズを使用できます。詳細については、[関数の設定](/docs/functions/configuring-functions)および[vercel.jsonによるプロジェクト設定](/docs/project-configuration)のドキュメントを参照してください。

## `/api`ディレクトリへのユーティリティファイルの追加

Vercelでは、関数に変換することなく、`/api`フォルダに追加のコードファイルを配置できます。以下の場合、ファイルは無視されます:

- アンダースコア(`_`)で始まる
- ドット(`.`)で始まる
- `.d.ts`で終わる

## Vercel Functionsのバンドル

Vercelは、ルートを単一のVercel Functionにバンドルすることでリソースを最適化します。現在、これはNext.jsでのみ有効です。

`vercel.json`の`functions`プロパティを使用してバンドルを制御できます。Next.jsの設定例:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "functions": {
    "app/api/hello/route.ts": {
      "memory": 3009,
      "maxDuration": 60
    },
    "app/api/another/route.ts": {
      "memory": 1024,
      "maxDuration": 30
    }
  }
}
```

この例では、`app/api/hello/route.ts`と`app/api/another/route.ts`は、それぞれ固有の設定により、個別にバンドルされます。

**注意**: 関数呼び出しの結果を非同期で処理する必要がある場合は、キューイング、プーリング、または[ストリーミング](/docs/functions/streaming-functions)のアプローチを検討してください。
