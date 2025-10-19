# レガシーメトリクス

## 帯域幅

帯域幅は、デプロイメントが送信または受信したデータの量です。このチャートには、[プレビュー](/docs/deployments/environments#preview-environment-pre-production)と[本番](/docs/deployments/environments#production-environment)の両方のデプロイメントのトラフィックが含まれます。

[ブロックまたは一時停止](https://vercel.com/guides/why-is-my-account-deployment-blocked#pausing-process)されたデプロイメントの帯域幅使用量は課金されません。

プロジェクトの総トラフィックは、送信および受信帯域幅の合計です。

* 送信: 送信帯域幅は、デプロイメントがユーザーに送信したデータ量を測定します。[ISR](/docs/incremental-static-regeneration)で使用されるデータと、[CDN](/docs/cdn)および[Vercelファンクション](/docs/functions)からの応答は送信帯域幅としてカウントされます
* 受信: 受信帯域幅は、ユーザーからデプロイメントが受信したデータ量を測定します

受信帯域幅の例としては、ブラウザによってリクエストされたページビューがあります。[CDN](/docs/cdn)および[Vercelファンクション](/docs/functions)に送信されるすべてのリクエストは、受信帯域幅として収集されます。

通常、Webサイトプロジェクトでは、受信帯域幅は送信帯域幅よりもはるかに小さくなります。

## リクエスト

リクエストは、デプロイメントに対して行われたリクエストの数です。

## ビルド実行時間

ビルド実行時間は、プロジェクトのビルドに費やされた合計時間です。

## サーバーレス関数実行時間

サーバーレス関数実行時間は、すべてのサーバーレス関数の総実行時間です。

## Edge Middleware実行時間

Edge Middleware実行時間は、すべてのEdge Middlewareの総実行時間です。
