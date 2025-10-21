# Vercel Firewall

Vercelファイアウォールは、アプリケーションを幅広い脅威から保護するための堅牢な多層セキュリティシステムです。すべての受信リクエストは、以下のファイアウォール層を通過します：

- [プラットフォーム全体のファイアウォール](#プラットフォーム全体のファイアウォール)：[DDoS緩和](/docs/security/ddos-mitigation)により、DDoSやTCPフラッドなどの大規模攻撃から保護し、すべての顧客に無料で提供されます。
- [Web Application Firewall (WAF)](#vercel-waf)：ニーズに合わせてカスタマイズ可能なセキュリティ層で、Webトラフィックの[観測性](#観測性)を提供します。

## 概念

以下の基本を理解します：

- [Vercelが各リクエストを保護する方法](/docs/security/firewall-concepts#how-vercel-secures-requests)
- [DDoS](/docs/security/firewall-concepts#understanding-ddos)を緩和する必要性
- ファイアウォールが[最初にどのルールを適用するか](#ルール実行順序)
- ファイアウォールが[JA3とJA4 TLS指紋](/docs/security/firewall-concepts#ja3-and-ja4-tls-fingerprints)を使用して悪意のあるトラフィックを識別・制限する方法

## ルール実行順序

プラットフォーム全体のファイアウォールの自動ルールとWAFのカスタムルールは、以下の実行順序で連携します：

1. [DDoS緩和ルール](/docs/security/ddos-mitigation)
2. [攻撃チャレンジモード](/docs/attack-challenge-mode)
3. [システムバイパスルール](/docs/security/vercel-waf/system-bypass-rules)
4. [IPブロッキング](/docs/security/vercel-waf/ip-blocking)
5. [カスタムルール](/docs/security/vercel-waf/custom-rules)
6. [レートリミット](/docs/security/vercel-waf/rate-limiting)
7. [マネージドルールセット](/docs/security/vercel-waf/managed-rulesets)

## プラットフォーム全体のファイアウォール

すべてのVercelプロジェクトに自動的に適用される保護層：

- **DDoS緩和**：大規模な分散型サービス拒否攻撃を自動的に検出してブロック
- **TCPフラッド保護**：ネットワークレベルの攻撃から保護
- **アプリケーション層保護**：一般的なWeb攻撃パターンを識別

## Vercel WAF

Web Application Firewall（WAF）は、Enterprise プランで利用可能な高度なセキュリティ機能です：

- カスタムルールの作成
- レートリミットの設定
- IPベースのアクセス制御
- マネージドルールセットの活用
- リアルタイムの脅威分析

詳細は[Vercel WAF](/docs/vercel-firewall/vercel-waf)ドキュメントを参照してください。

## 観測性

ファイアウォールは、すべてのトラフィックに関する詳細な分析を提供します：

- リクエストログ
- ブロックされたトラフィックの統計
- セキュリティイベントのタイムライン
- 脅威の分類と分析

これらの情報は、Vercelダッシュボードのファイアウォールタブから確認できます。
