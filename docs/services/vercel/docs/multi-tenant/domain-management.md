# マルチテナント - ドメイン管理

## ワイルドカードドメインの使用

マルチテナントアプリケーションで `*.acme.com` のようなサブドメインを提供するには、以下の手順を実行します：

1. Vercelのネームサーバー（`ns1.vercel-dns.com` と `ns2.vercel-dns.com`）にドメインを指定
2. Vercelプロジェクト設定でアペックスドメイン（例：`acme.com`）を追加
3. ワイルドカードドメイン `.acme.com` を追加

これにより、`tenant1.acme.com` や `docs.tenant1.acme.com` などのサブドメインが自動的に解決され、個別のSSL証明書が発行されます。

## カスタムドメインの提供

テナントに独自のドメインを持ち込む選択肢を提供するには、以下の処理が必要です：

1. テナントのドメインをVercelプロジェクトにプロビジョニングおよび割り当て
2. ドメインの所有権を確認
3. SSL証明書を自動生成

## プログラムによるドメイン追加の例

```javascript
import { VercelCore as Vercel } from '@vercel/sdk/core.js';
import { projectsAddProjectDomain } from '@vercel/sdk/funcs/projectsAddProjectDomain.js';

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN,
});

await projectsAddProjectDomain(vercel, {
  idOrName: 'my-multi-tenant-app',
  teamId: 'team_1234',
  requestBody: {
    name: 'customacmesite.com',
  },
});
```

## ドメイン検証

カスタムドメインを追加した後、所有権を確認する必要があります：

- DNSレコードの設定
- ドメインプロバイダーでの設定変更
- 自動検証プロセス

## SSL証明書の自動発行

Vercelは以下を自動的に処理します：

- SSL証明書の生成
- 証明書の更新
- セキュアな接続の確保

## ベストプラクティス

- ワイルドカードドメインにはVercelのネームサーバーを使用
- ドメイン追加は非同期処理として扱う
- エラーハンドリングを適切に実装
- レート制限を考慮した実装

## 関連リソース

- [マルチテナントの制限](/docs/multi-tenant/limits)
- [ドメインの概要](/docs/domains)
- [Vercel SDK ドキュメント](/docs/sdk)
