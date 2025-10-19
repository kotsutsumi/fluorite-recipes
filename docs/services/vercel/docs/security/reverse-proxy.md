# リバースプロキシサーバーとVercel

Vercelは、以下の理由により、Vercelプロジェクトの前にリバースプロキシサーバーを配置することを推奨していません：

- Vercelの CDN がトラフィックの可視性を失い、不審なアクティビティの特定が困難になります。
- 実際のエンドユーザーの IP アドレスを正確に識別できません。
- リバースプロキシが悪意のある攻撃を受けた場合、そのトラフィックが Vercel プロジェクトに転送され、使用量が急増する可能性があります。
- リバースプロキシが侵害された場合、Vercelのファイアウォールはキャッシュを自動的に削除できません。

## リバースプロキシサーバーの使用

組織のレガシーウェブアプリケーションがリバースプロキシで保護されており、Vercelプロジェクトも同様のプロキシを使用する必要がある場合があります。

### 前提条件

- TLS設定：`http://<DOMAIN>/.well-known/acme-challenge/*` でHTTP→HTTPS リダイレクションを無効化
- キャッシュ制御：`https://<DOMAIN>/.well-known/vercel/*` パスをキャッシュしない
- プラン要件：
  - Hobby/Pro：Verified Proxy Lite のみ
  - Enterprise：Lite + Advanced（セルフホスト/地理位置情報保持）

### 自動 vs 手動有効化

以下のプロバイダーは、すべてのプランで自動的に Verified Proxy が有効になります。その他のプロバイダーまたはセルフホストプロキシの場合は、手動で有効化する必要があります：

- Cloudflare
- Akamai
- Fastly

### 設定手順

1. リバースプロキシの設定で前提条件を満たす
2. 必要に応じてVercelダッシュボードから手動で有効化
3. 設定が正しく動作していることを確認

## 推奨される代替手段

リバースプロキシの代わりに、以下のVercelネイティブソリューションの使用を検討してください：

- [Vercel Firewall](/docs/vercel-firewall)
- [DDoS Mitigation](/docs/security/ddos-mitigation)
- [Web Application Firewall (WAF)](/docs/security/vercel-waf)
- [IP Blocking](/docs/security/vercel-waf/ip-blocking)
