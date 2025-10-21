# PCI DSS iframe 統合

## iframeを使用する利点

[`iframe`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe)を使用して支払いを処理する場合、エンドユーザーと支払いプロバイダー間の安全な経路を作成します。

Vercelの[共同責任モデル](/docs/security/shared-responsibility)に従い、この方法は以下を可能にします：

- データ分離：`iframe`に入力された支払いカード情報はVercelの環境から分離され、Vercelの管理インフラストラクチャを通過しません
- 直接データ送信：`iframe`に入力された情報は直接支払いプロセッサに送信されるため、Vercelはエンドユーザーの支払いカードデータを処理、保存、またはアクセスしません
- PCI DSS範囲の縮小：分離と直接データ送信により、PCI DSS準拠の範囲が縮小され、コンプライアンス作業が簡素化され、セキュリティが強化されます

## 支払い処理のためのiframeの統合

1. 以下を提供する[支払いプロバイダー](https://www.pcisecuritystandards.org/glossary/payment-processor/)を選択します：
   - エンドツーエンドの暗号化
   - データトークン化
   - 組み込みの不正検出
   - 3DS認証プロトコル
   - 最新のPCI DSS要件への準拠

2. アプリケーションの支払いページにプロバイダーの`iframe`を埋め込みます

支払いプロセッサの`iframe`の例：

```typescript
const PaymentProcessorIframe = (): JSX.Element => {
  return (
    <iframe
      src="https://secure.payment-provider.com/checkout"
      title="Secure Payment"
      width="100%"
      height="600"
      frameBorder="0"
      allow="payment"
    />
  );
};
```

この実装により、支払いカード情報がVercelのインフラストラクチャを通過することなく、エンドユーザーから直接支払いプロバイダーに送信されます。
