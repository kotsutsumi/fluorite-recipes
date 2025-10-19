# Vercel WAF

Vercel WAFは、[すべてのプラン](/docs/plans)で利用可能です。

[メンバー](/docs/rbac/access-roles#member-role)、[ビューアー](/docs/rbac/access-roles#viewer-role)、[開発者](/docs/rbac/access-roles#developer-role)、[管理者](/docs/rbac/access-roles#project-administrators)の役割を持つユーザーがこの機能にアクセスできます。

Vercel WAF（[Firewall](/docs/vercel-firewall)の一部）は、ログ、ブロック、チャレンジを通じてサイトへのインターネットトラフィックを[モニタリング](/docs/vercel-firewall/firewall-observability#traffic-monitoring)および[制御](/docs/vercel-firewall/firewall-observability#traffic-monitoring)するセキュリティコントロールを提供します。ファイアウォールの設定を変更すると、300ms以内にグローバルに有効になり、以前の設定に[即座にロールバック](#instant-rollback)できます。

## トラフィック制御

以下の方法でウェブサイトへのインターネットトラフィックを制御できます：

### IPブロック
[IPブロックの設定](/docs/security/vercel-waf/ip-blocking)方法を学びます。特定のIPアドレスまたはIP範囲からのトラフィックをブロックできます。

### カスタムルール
プロジェクトの[カスタムルールの設定](/docs/security/vercel-waf/custom-rules)方法を学びます。独自の条件とアクションを定義して、トラフィックを細かく制御できます。

### 管理ルールセット
プロジェクトの[管理ルールセットの有効化](/docs/security/vercel-waf/managed-rulesets)方法を学びます（Enterpriseプラン）。事前定義されたセキュリティルールを簡単に適用できます。

### レートリミット
[レートリミット](/docs/security/vercel-waf/rate-limiting)を設定して、特定のソースからのリクエスト数を制限します。

## 即時ロールバック

ファイアウォールの設定変更は即座にグローバルに反映されますが、問題が発生した場合は以前の設定にすぐにロールバックできます：

1. プロジェクトのFirewallタブを開く
2. 「Configuration History」を表示
3. 以前の設定を選択
4. 「Restore」をクリック

ロールバックも300ms以内にグローバルに適用されます。

## ファイアウォールの観測性

WAFは包括的な観測性機能を提供します：

- リアルタイムトラフィック監視
- ブロックされたリクエストの詳細
- ルールマッチング統計
- トラフィックパターン分析
- セキュリティイベントログ

詳細は[Firewall Observability](/docs/vercel-firewall/firewall-observability)を参照してください。

## ベストプラクティス

1. **段階的な導入**: 新しいルールは最初に「Log」アクションで作成し、影響を確認してから「Deny」や「Challenge」に変更
2. **定期的な監視**: ファイアウォールログを定期的に確認し、異常なパターンを検出
3. **テスト**: 本番環境に適用する前に、プレビュー環境でルールをテスト
4. **ドキュメント化**: カスタムルールの目的と条件を明確にドキュメント化

## 使用量と料金

WAFの基本機能はすべてのプランで利用可能ですが、一部の高度な機能はEnterpriseプランでのみ利用可能です：

- カスタムルール：すべてのプラン
- レートリミット：すべてのプラン
- IPブロック：すべてのプラン
- 管理ルールセット：Enterpriseプラン
- 永続的アクション：ProおよびEnterpriseプラン

詳細は[Usage and Pricing](/docs/security/vercel-waf/usage-and-pricing)を参照してください。
