# Expo Billing - 包括的請求管理ガイド

## 📋 概要

Expo Billing は、Expo Application Services（EAS）のサブスクリプション、使用量ベースの請求、支払い管理を統合的に提供する包括的な請求システムです。個人開発者から大規模エンタープライズまで、柔軟なプラン選択と透明性の高い料金体系を実現しています。

```typescript
interface ExpoBillingSystem {
  plans: {
    free: FreeP
    starter: StarterPlan
    production: ProductionPlan
    enterprise: EnterprisePlan
  }
  pricing: {
    subscription: SubscriptionBased
    usage: UsageBasedPricing
    addons: AddonServices
  }
  management: {
    billing: BillingInformation
    payments: PaymentMethods
    invoices: InvoiceReceipts
  }
  monitoring: {
    usage: UsageTracking
    optimization: CostOptimization
  }
}
```

## 💳 サブスクリプションプラン

### 料金体系の基本構造

```typescript
interface BillingStructure {
  subscriptionModel: {
    frequency: "月次請求"
    pricing: "世界共通価格"
    cancellation: "いつでもキャンセル可能"
    annualContracts: "リクエストに応じて年次契約可能"
  }
  pricingComponents: {
    baseFee: "プラン基本料金"
    credits: "月次リセットクレジット"
    usageBased: "プラン許容量超過分"
  }
}
```

### 無料プラン

```typescript
interface FreePlan {
  pricing: {
    monthlyCost: "$0"
    commitment: "なし"
  }
  features: {
    builds: {
      priority: "低優先度"
      limitations: "制限付き"
      reset: "月次リセット"
    }
    updates: {
      access: "無料"
      limitations: "基本機能のみ"
    }
  }
  limitations: {
    buildQueue: "優先度最低"
    resources: "最小限のリソース"
    support: "コミュニティサポートのみ"
  }
  useCases: [
    "個人プロジェクト",
    "プロトタイプ開発",
    "学習・実験目的",
    "小規模ホビープロジェクト"
  ]
}
```

**適用シナリオ**：
- 🎯 個人開発者のプロトタイピング
- 📚 学習とExpo機能の探索
- 🧪 小規模な実験プロジェクト

**詳細ドキュメント**: [`plans.md`](./billing/plans.md)

### Starterプラン（$19/月）

```typescript
interface StarterPlan {
  pricing: {
    monthlyCost: "$19/月"
    annualOption: "リクエストに応じて利用可能"
  }
  credits: {
    buildCredits: "$45/月"
    rollover: false
    expiration: "月次リセット"
  }
  features: {
    builds: {
      priority: "優先ビルド"
      reliability: "本番グレードのサービス"
      unlimited: "クレジット内で無制限"
    }
    updates: {
      activeUsers: "3,000 月間アクティブユーザー"
      bandwidth: "基本帯域幅"
    }
    support: {
      level: "標準サポート"
      channels: ["フォーラム", "ドキュメント"]
    }
  }
  limitations: {
    buildCredits: "$45/月まで"
    overage: "使用量ベース課金"
  }
  useCases: [
    "プロフェッショナル開発者",
    "小規模スタートアップ",
    "MVPリリース",
    "定期的な本番ビルド"
  ]
}
```

**ビルドクレジット利用例**：

| プラットフォーム | ビルドタイプ | 単価 | 利用可能数 |
|-----------------|-------------|------|-----------|
| Android | medium | $1 | 45回 |
| iOS | large | $4 | 11回 |
| 混合利用 | - | - | クレジット配分 |

**詳細ドキュメント**: [`plans.md`](./billing/plans.md)

### Productionプラン

```typescript
interface ProductionPlan {
  target: "プロフェッショナル開発者・中小企業"
  pricing: {
    monthlyCost: "変動価格（利用規模に応じて）"
    customization: "カスタマイズ可能"
  }
  credits: {
    buildCredits: "高額月次クレジット"
    flexibility: "柔軟なクレジット配分"
  }
  features: {
    builds: {
      priority: "高優先度"
      concurrency: "並列ビルド対応"
      platforms: "全プラットフォーム"
    }
    updates: {
      activeUsers: "より多くのユニークユーザー"
      bandwidth: "高帯域幅"
      storage: "拡張ストレージ"
    }
    support: {
      level: "優先サポート"
      responseTime: "短縮されたレスポンス時間"
    }
  }
  scalability: {
    userGrowth: "スケール対応"
    resourceLimits: "拡張可能制限"
  }
  useCases: [
    "成長中のスタートアップ",
    "中小企業アプリ",
    "複数プロジェクト管理",
    "定期的な高頻度リリース"
  ]
}
```

**スケーリングパターン**：
```typescript
interface ProductionScaling {
  smallTeam: {
    builds: "月50-100ビルド"
    updates: "10,000-50,000 MAU"
    cost: "予測可能な月次コスト"
  }
  mediumTeam: {
    builds: "月100-500ビルド"
    updates: "50,000-200,000 MAU"
    optimization: "使用量最適化で効率化"
  }
}
```

**詳細ドキュメント**: [`plans.md`](./billing/plans.md)

### Enterpriseプラン

```typescript
interface EnterprisePlan {
  target: "大規模組織・エンタープライズ"
  pricing: {
    model: "カスタム見積もり"
    negotiation: "柔軟な契約条件"
    commitment: "年次契約推奨"
  }
  credits: {
    buildCredits: "最高額の月次クレジット"
    customAllocation: "カスタムクレジット配分"
  }
  features: {
    builds: {
      priority: "最優先"
      dedicated: "専用ビルドリソース"
      unlimited: "実質無制限"
    }
    updates: {
      activeUsers: "最大ユーザー数"
      bandwidth: "専用帯域幅"
      storage: "エンタープライズストレージ"
    }
    support: {
      level: "エンタープライズサポート"
      sla: "サービスレベル契約"
      accountManager: "専任アカウントマネージャー"
      channels: ["専用サポートチャネル", "優先対応"]
    }
    security: {
      sso: "シングルサインオン"
      auditLogs: "監査ログ"
      compliance: "コンプライアンス対応"
    }
  }
  addons: {
    enterpriseSupport: {
      description: "プロフェッショナル長期サポート"
      features: [
        "直接コミュニケーションチャネル",
        "サービスレベル契約（SLA）",
        "専任アカウントマネージャー",
        "カスタムトレーニング"
      ]
    }
  }
  useCases: [
    "大規模エンタープライズアプリ",
    "複数チーム・部門",
    "コンプライアンス要件",
    "専用サポート必要"
  ]
}
```

**エンタープライズ機能比較**：

| 機能カテゴリ | Production | Enterprise |
|-------------|-----------|-----------|
| ビルド優先度 | 高 | 最優先 |
| 専用リソース | ❌ | ✅ |
| SLA保証 | ❌ | ✅ |
| 監査ログ | ❌ | ✅ |
| SSO | ❌ | ✅ |
| 専任サポート | ❌ | ✅ |

**詳細ドキュメント**: [`plans.md`](./billing/plans.md)

## 💰 使用量ベースの価格設定

### 概要と仕組み

```typescript
interface UsageBasedPricing {
  philosophy: "柔軟な使用、厳格な制限なし"
  application: "プラン許容量超過時"
  billing: {
    frequency: "月次請求"
    calculation: "実使用量ベース"
    transparency: "リアルタイム使用状況表示"
  }

  services: {
    easBuild: UsageBasedBuild
    easUpdate: UsageBasedUpdate
  }
}
```

### EAS Build 使用量ベース請求

```typescript
interface UsageBasedBuild {
  pricingModel: "個別ビルド定額料金"

  pricing: {
    android: {
      small: "$0.5/ビルド"
      medium: "$1/ビルド"
      large: "$2/ビルド"
    }
    ios: {
      medium: "$2/ビルド"
      large: "$4/ビルド"
      xlarge: "$8/ビルド"
    }
  }

  credits: {
    application: "月次クレジットでビルドコスト相殺"
    priority: "クレジット優先消費"
    rollover: false
  }

  exemptions: {
    canceledBuilds: "作業開始前キャンセルは無課金"
    failedBuilds: "システム障害時の失敗ビルドは無課金"
  }

  calculation: {
    formula: "総ビルドコスト - 月次クレジット = 請求額"
    example: {
      androidBuilds: "15 × $1 = $15"
      iosBuilds: "10 × $4 = $40"
      totalCost: "$55"
      monthlyCredit: "-$45"
      finalBill: "$10"
    }
  }
}
```

**ビルドコスト計算例**：

```typescript
interface BuildCostExample {
  scenario1: {
    description: "Starter プラン（$45 クレジット）"
    usage: {
      androidMedium: { count: 15, unitPrice: 1, total: 15 }
      iosLarge: { count: 10, unitPrice: 4, total: 40 }
    }
    calculation: {
      totalBuildCost: "$55"
      monthlyCredit: "-$45"
      overageBill: "$10"
    }
  }

  scenario2: {
    description: "クレジット内使用"
    usage: {
      androidMedium: { count: 20, unitPrice: 1, total: 20 }
      iosLarge: { count: 5, unitPrice: 4, total: 20 }
    }
    calculation: {
      totalBuildCost: "$40"
      monthlyCredit: "-$45"
      overageBill: "$0"
    }
  }
}
```

**詳細ドキュメント**: [`usage-based-pricing.md`](./billing/usage-based-pricing.md)

### EAS Update 使用量ベース請求

```typescript
interface UsageBasedUpdate {
  pricingModel: "2つのメトリクス"

  metrics: {
    monthlyActiveUsers: {
      description: "更新を受け取ったユニークユーザー"
      pricing: "$0.005/ユーザー"
      calculation: "月間アクティブユーザー数 × $0.005"
    }
    globalEdgeBandwidth: {
      description: "グローバルエッジネットワーク帯域幅"
      pricing: "$0.10/GiB"
      calculation: "総帯域幅(GiB) × $0.10"
    }
  }

  planInclusions: {
    free: {
      mau: "制限付き"
      bandwidth: "最小限"
    }
    starter: {
      mau: "3,000 MAU"
      bandwidth: "基本帯域幅"
    }
    production: {
      mau: "より多くのMAU"
      bandwidth: "高帯域幅"
    }
    enterprise: {
      mau: "最大MAU"
      bandwidth: "専用帯域幅"
    }
  }

  calculation: {
    example: {
      updatedUsers: "7,000 × $0.005 = $35"
      bandwidth: "603.13 GiB × $0.10 = $60.31"
      totalCost: "$95.31"
    }
  }
}
```

**Update コスト計算例**：

| メトリクス | 単価 | 使用量 | 合計 |
|-----------|------|--------|------|
| 月間アクティブユーザー | $0.005/ユーザー | 7,000 | $35.00 |
| グローバルエッジ帯域幅 | $0.10/GiB | 603.13 GiB | $60.31 |
| **合計（USD）** | | | **$95.31** |

**使用量見積もりツール**: [Expo価格計算ツール](https://expo.dev/pricing#update)

**詳細ドキュメント**: [`usage-based-pricing.md`](./billing/usage-based-pricing.md)

## 🔧 請求管理

### 請求情報の管理

```typescript
interface BillingManagement {
  access: {
    roles: ["Owner", "Admin"]
    url: "https://expo.dev/settings/billing"
  }

  billingInformation: {
    updateable: [
      "会社名・個人名",
      "請求先メールアドレス",
      "請求先住所",
      "Tax ID"
    ]
    platform: "Stripe ポータル経由"
  }

  paymentMethods: {
    supported: [
      "クレジットカード",
      "デビットカード",
      "その他Stripe対応決済方法"
    ]
    management: [
      "支払い方法追加",
      "既存方法更新",
      "支払い方法削除",
      "デフォルト設定変更"
    ]
  }

  taxId: {
    purpose: "税金コンプライアンス"
    types: [
      "VAT番号（EU）",
      "GST番号（オーストラリア）",
      "その他国際Tax ID"
    ]
    application: "請求書に自動適用"
  }
}
```

**請求情報更新手順**：

```typescript
interface BillingUpdateFlow {
  step1: {
    action: "請求ページにアクセス"
    url: "https://expo.dev/settings/billing"
    requirement: "Owner/Admin ロール"
  }

  step2: {
    action: "「Manage billing information」クリック"
    redirect: "Stripe カスタマーポータル"
  }

  step3: {
    action: "情報更新"
    fields: [
      "名前・会社名",
      "メールアドレス",
      "住所",
      "Tax ID"
    ]
  }

  step4: {
    action: "変更保存"
    effect: "次回請求書から反映"
  }
}
```

**詳細ドキュメント**: [`manage.md`](./billing/manage.md)

### プラン管理

```typescript
interface PlanManagement {
  viewing: {
    location: "請求ダッシュボード"
    information: [
      "現在のプラン名",
      "月次料金",
      "次回請求日",
      "含まれるクレジット",
      "使用状況概要"
    ]
  }

  upgrading: {
    process: [
      "「Change Plan」または「See Plans」クリック",
      "希望するプランを選択",
      "支払い詳細を入力",
      "チェックアウト完了"
    ]
    effectivity: "即座に有効"
    prorating: "日割り計算適用"
  }

  downgrading: {
    availability: ["Production", "Enterprise", "Legacy"]
    effectivity: "現在の請求期間後"
    process: [
      "「Change Plan」クリック",
      "Starterプラン選択",
      "ダウングレード確認"
    ]
    consideration: [
      "現在期間の料金は返金なし",
      "機能制限の確認",
      "使用量超過時の追加課金"
    ]
  }

  canceling: {
    starterPlan: {
      effectivity: "即時キャンセル"
      billing: "現在期間の使用量課金"
    }
    productionEnterprise: {
      effectivity: "現在の請求期間後"
      access: "期間終了まで継続利用可能"
    }
    process: [
      "請求ページにアクセス",
      "「Cancel all subscriptions」クリック",
      "キャンセル理由入力",
      "確認"
    ]
  }
}
```

**プラン変更フロー図**：

```typescript
interface PlanChangeFlow {
  upgrade: {
    trigger: "即座に有効化"
    billing: "日割り計算で次回請求に反映"
    access: "即座に新機能利用可能"
  }

  downgrade: {
    trigger: "次回請求期間から有効"
    billing: "現在期間は現行プラン料金"
    access: "期間終了まで現行プラン機能利用可能"
  }

  cancel: {
    starter: {
      trigger: "即時"
      billing: "現在期間使用量課金"
      access: "無料プランにフォールバック"
    }
    production: {
      trigger: "期間終了時"
      billing: "現在期間は通常請求"
      access: "期間終了まで利用可能"
    }
  }
}
```

**詳細ドキュメント**: [`manage.md`](./billing/manage.md)

### 支払い方法の管理

```typescript
interface PaymentMethodManagement {
  adding: {
    steps: [
      "請求情報にアクセス",
      "「Add payment method」クリック",
      "カード情報入力",
      "保存"
    ]
    verification: "小額の一時的な認証課金"
  }

  updating: {
    methods: [
      "既存の支払い方法更新",
      "新しい方法追加後、古い方法削除",
      "デフォルト支払い方法変更"
    ]
  }

  security: {
    encryption: "Stripe PCI DSS準拠"
    storage: "トークン化された情報のみ保存"
    expoAccess: "Expoは完全なカード情報にアクセス不可"
  }
}
```

**詳細ドキュメント**: [`manage.md`](./billing/manage.md)

## 📄 請求書と領収書

### 請求書へのアクセス

```typescript
interface InvoiceAccess {
  access: {
    roles: ["Owner", "Admin"]
    url: "https://expo.dev/settings/receipts"
    restriction: "他のロールはアクセス不可"
  }

  viewing: {
    interface: "請求履歴一覧"
    information: [
      "請求期間",
      "請求額",
      "支払いステータス",
      "請求書番号"
    ]
  }

  downloading: {
    process: [
      "特定の請求期間の日付をクリック",
      "Stripeダッシュボードにリダイレクト",
      "「Download invoice」クリック",
      "PDFダウンロード"
    ]
    format: "PDF形式"
  }
}
```

### 請求書のタイプと内容

```typescript
interface InvoiceTypes {
  subscriptionInvoice: {
    description: "月次プランサブスクリプション料金"
    contents: [
      "プラン名と料金",
      "含まれるクレジット",
      "請求期間",
      "会社情報",
      "Tax ID（設定済みの場合）"
    ]
    example: {
      item: "Starter Plan"
      amount: "$19.00"
      credits: "$45 Build Credits"
      period: "2024/01/01 - 2024/01/31"
    }
  }

  overageInvoice: {
    description: "使用量超過分の追加料金"
    contents: [
      "超過ビルド詳細",
      "超過Update使用量",
      "単価と数量",
      "合計超過料金"
    ]
    example: {
      builds: "15 Android builds × $1 = $15"
      updates: "4,000 MAU × $0.005 = $20"
      totalOverage: "$35"
    }
  }

  starterUsageInvoice: {
    description: "Starterプラン使用状況詳細"
    contents: [
      "ビルドサービス使用状況",
      "Update使用状況",
      "クレジット消費詳細",
      "超過分（あれば）"
    ]
  }
}
```

**請求書サンプル構造**：

```typescript
interface InvoiceStructure {
  header: {
    invoiceNumber: "INV-2024-001"
    billingPeriod: "2024/01/01 - 2024/01/31"
    issueDate: "2024/02/01"
    dueDate: "2024/02/01"
  }

  billTo: {
    name: "会社名/個人名"
    address: "請求先住所"
    taxId: "Tax ID（設定済みの場合）"
  }

  lineItems: [
    {
      description: "Starter Plan Subscription"
      quantity: 1
      unitPrice: "$19.00"
      total: "$19.00"
    },
    {
      description: "Build Credits"
      quantity: 1
      unitPrice: "$45.00"
      total: "$0.00 (included)"
    },
    {
      description: "Overage - Android Builds"
      quantity: 10
      unitPrice: "$1.00"
      total: "$10.00"
    }
  ]

  summary: {
    subtotal: "$29.00"
    tax: "$0.00"
    total: "$29.00"
  }
}
```

**詳細ドキュメント**: [`invoices-and-receipts.md`](./billing/invoices-and-receipts.md)

### 領収書のダウンロード

```typescript
interface ReceiptDownload {
  difference: {
    invoice: "支払い前の請求明細"
    receipt: "支払い完了後の領収書"
  }

  downloadProcess: [
    "領収書ページにアクセス",
    "請求期間をクリック",
    "Stripeポータルで「Download receipt」選択",
    "PDF保存"
  ]

  contents: {
    paymentConfirmation: "支払い完了確認",
    paymentMethod: "使用した支払い方法",
    transactionId: "取引ID",
    timestamp: "支払い日時"
  }
}
```

**詳細ドキュメント**: [`invoices-and-receipts.md`](./billing/invoices-and-receipts.md)

### 返金リクエスト

```typescript
interface RefundRequest {
  process: {
    steps: [
      "領収書の横の3点メニューをクリック",
      "「Request Refund」を選択",
      "返金理由を入力",
      "リクエストを送信"
    ]
    reviewTime: "5〜10営業日"
    decision: "請求チームによる手動レビュー"
  }

  eligibility: {
    validReasons: [
      "誤請求",
      "サービス利用不可",
      "重複課金",
      "間違ったアカウントでの購読"
    ]
    invalidReasons: [
      "プラン変更希望",
      "単なる使いすぎ",
      "期待と異なる機能"
    ]
  }

  outcome: {
    approved: "元の支払い方法に返金",
    denied: "理由と共に通知",
    partial: "部分返金の可能性"
  }
}
```

**詳細ドキュメント**: [`invoices-and-receipts.md`](./billing/invoices-and-receipts.md)

## 📊 使用状況の監視と最適化

### 使用状況の監視

```typescript
interface UsageMonitoring {
  dashboard: {
    location: "https://expo.dev/settings/billing"
    sections: {
      easBuild: {
        metrics: [
          "今月のビルド数",
          "使用クレジット",
          "残りクレジット",
          "超過見積もり"
        ]
        breakdown: [
          "プラットフォーム別",
          "ビルドタイプ別",
          "日次/週次トレンド"
        ]
      }
      easUpdate: {
        metrics: [
          "月間アクティブユーザー",
          "帯域幅使用量",
          "プラン許容量",
          "超過見積もり"
        ]
        breakdown: [
          "チャネル別",
          "アプリ別",
          "日次/週次トレンド"
        ]
      }
    }
  }

  alerts: {
    thresholds: [
      "75% 使用時に警告",
      "90% 使用時に注意喚起",
      "100% 超過時に通知"
    ]
    notification: [
      "ダッシュボード表示",
      "メール通知（オプション）"
    ]
  }

  reporting: {
    frequency: "リアルタイム更新"
    history: "過去12ヶ月分の履歴"
    export: "CSV エクスポート（Enterprise）"
  }
}
```

**使用状況確認手順**：

```typescript
interface UsageCheckFlow {
  step1: "請求ダッシュボードにアクセス"
  step2: "「Usage Overview」セクション確認"
  step3: "EAS Build と EAS Update のメトリクス確認"
  step4: "トレンドグラフで使用パターン分析"
  step5: "超過見積もりで月末コスト予測"
}
```

**詳細ドキュメント**: [`usage-based-pricing.md`](./billing/usage-based-pricing.md)

### 使用量最適化戦略

#### EAS Build 最適化

```typescript
interface BuildOptimization {
  strategies: {
    useEASUpdate: {
      description: "JavaScriptの変更にはEAS Updateを使用"
      benefit: "ビルド不要で即座に配信"
      costSaving: "ビルドコスト削減"
      implementation: [
        "eas update --channel production",
        "ネイティブ変更時のみビルド"
      ]
    }

    developmentBuilds: {
      description: "開発ビルドを使用して反復開発"
      benefit: "ローカル開発の高速化"
      costSaving: "頻繁なビルド不要"
      implementation: [
        "npx expo run:ios --device",
        "npx expo run:android --device"
      ]
    }

    automateStrategically: {
      description: "ネイティブコード変更時のみビルド自動化"
      benefit: "不要なビルドを回避"
      costSaving: "CI/CDコスト最適化"
      implementation: [
        "条件付きCI/CDトリガー",
        "ネイティブファイル変更検出"
      ]
    }

    buildCaching: {
      description: "ビルドキャッシュの活用"
      benefit: "ビルド時間短縮"
      costSaving: "より低いビルドタイプ選択可能"
      implementation: [
        "eas.json でキャッシュ設定",
        "依存関係の賢い管理"
      ]
    }
  }
}
```

**ビルド最適化実装例**：

```typescript
// eas.json の最適化設定
interface EASBuildOptimization {
  build: {
    production: {
      cache: {
        enabled: true
        paths: ["node_modules", ".expo"]
      }
      distribution: "store"
      autoIncrement: true
    }
    preview: {
      distribution: "internal"
      android: {
        buildType: "apk"  // より安価なビルドタイプ
      }
    }
  }
}

// CI/CD での条件付きビルド
interface ConditionalBuild {
  trigger: "ネイティブファイル変更検出時のみ"
  nativeFiles: [
    "android/**",
    "ios/**",
    "app.json",
    "package.json"
  ]
  script: `
    if git diff --name-only HEAD~1 | grep -qE '(android/|ios/|app.json|package.json)'; then
      eas build --platform all
    else
      echo "No native changes, skipping build"
      eas update --channel production
    fi
  `
}
```

**詳細ドキュメント**: [`usage-based-pricing.md`](./billing/usage-based-pricing.md)

#### EAS Update 最適化

```typescript
interface UpdateOptimization {
  strategies: {
    excludeUnchangedAssets: {
      description: "変更されていないアセットを除外"
      benefit: "帯域幅使用量削減"
      costSaving: "Update 配信コスト削減"
      implementation: [
        "自動差分検出",
        "アセット最適化"
      ]
    }

    assetVerification: {
      description: "アセット整合性の確認"
      benefit: "不要なアセット配信防止"
      costSaving: "帯域幅の無駄削減"
      command: "npx expo-updates assets:verify <dir>"
    }

    compressionOptimization: {
      description: "アセット圧縮最適化"
      benefit: "ファイルサイズ削減"
      costSaving: "帯域幅コスト削減"
      techniques: [
        "画像最適化",
        "コード圧縮",
        "不要ファイル除外"
      ]
    }

    channelStrategy: {
      description: "Update チャネル戦略"
      benefit: "ターゲット配信"
      costSaving: "不要な配信回避"
      implementation: [
        "環境別チャネル分離",
        "段階的ロールアウト"
      ]
    }
  }
}
```

**Update 最適化実装例**：

```bash
# アセット検証
npx expo-updates assets:verify ./dist

# 最適化された Update 配信
eas update \
  --channel production \
  --message "Optimized update with asset verification"

# チャネル戦略
eas update --channel staging  # ステージング環境
eas update --channel production  # 本番環境
eas update --channel beta  # ベータテスター
```

**詳細ドキュメント**: [`usage-based-pricing.md`](./billing/usage-based-pricing.md)

## 🎯 実装パターンとベストプラクティス

### コスト管理戦略

```typescript
interface CostManagementStrategy {
  budgetPlanning: {
    assessment: [
      "月間ビルド頻度の見積もり",
      "月間アクティブユーザー予測",
      "帯域幅使用量の推定"
    ]
    allocation: [
      "基本プラン料金の確保",
      "超過分バッファの設定",
      "成長余地の考慮"
    ]
  }

  monitoring: {
    frequency: "週次使用状況レビュー"
    checkpoints: [
      "クレジット消費率",
      "超過トレンド",
      "最適化機会"
    ]
    actions: [
      "閾値到達時の最適化実施",
      "不要な使用の削減",
      "プラン変更の検討"
    ]
  }

  optimization: {
    continuous: [
      "定期的な使用パターン分析",
      "ベストプラクティス適用",
      "技術的負債の削減"
    ]
    reactive: [
      "超過発生時の即座対応",
      "コスト急増の原因調査",
      "緊急最適化措置"
    ]
  }
}
```

### プラン選択ガイドライン

```typescript
interface PlanSelectionGuide {
  personalDeveloper: {
    profile: "個人開発者、ホビープロジェクト"
    recommendation: "Free → Starter（必要時）"
    criteria: [
      "月数回のビルド",
      "小規模ユーザーベース",
      "予算制約"
    ]
    cost: "$0 - $19/月"
  }

  startup: {
    profile: "スタートアップ、MVP開発"
    recommendation: "Starter → Production（成長時）"
    criteria: [
      "週次の定期ビルド",
      "成長中のユーザーベース",
      "予測可能なコスト"
    ]
    cost: "$19 - カスタム/月"
  }

  smallMediumBusiness: {
    profile: "中小企業、複数プロジェクト"
    recommendation: "Production"
    criteria: [
      "頻繁なビルド",
      "数万〜数十万MAU",
      "優先サポート必要"
    ]
    cost: "カスタム見積もり"
  }

  enterprise: {
    profile: "大規模組織、複数チーム"
    recommendation: "Enterprise"
    criteria: [
      "高頻度ビルド",
      "大規模ユーザーベース",
      "SLA・コンプライアンス要件"
    ]
    cost: "カスタム契約"
  }
}
```

**プラン選択フロー図**：

```typescript
interface PlanSelectionFlow {
  step1: "月間ビルド数を見積もる"
  step2: "月間アクティブユーザー数を予測"
  step3: "サポート要件を評価"
  step4: "予算制約を確認"
  decision: {
    builds_lt_45: "Free or Starter"
    builds_45_500: "Starter or Production"
    builds_gt_500: "Production or Enterprise"
    mau_lt_3000: "Free or Starter"
    mau_3000_50000: "Starter or Production"
    mau_gt_50000: "Production or Enterprise"
    sla_required: "Enterprise only"
  }
}
```

### チーム開発の請求管理

```typescript
interface TeamBillingManagement {
  roleBasedAccess: {
    owner: {
      permissions: ["請求情報閲覧", "プラン変更", "支払い方法管理"]
      responsibility: "最終的な請求責任"
    }
    admin: {
      permissions: ["請求情報閲覧", "使用状況監視"]
      responsibility: "使用量最適化"
    }
    developer: {
      permissions: ["使用状況閲覧（制限付き）"]
      responsibility: "効率的なビルド・Update利用"
    }
  }

  costAllocation: {
    projectBased: {
      method: "プロジェクト別コスト追跡"
      implementation: "タグ・ラベル活用"
      reporting: "プロジェクト別使用量レポート"
    }
    teamBased: {
      method: "チーム別コスト配分"
      implementation: "組織アカウント分離"
      reporting: "チーム別請求レポート"
    }
  }

  budgetControl: {
    preventive: [
      "使用量アラート設定",
      "開発者教育",
      "ベストプラクティス共有"
    ]
    reactive: [
      "超過発生時の通知",
      "原因調査と対策",
      "プロセス改善"
    ]
  }
}
```

### CI/CD統合での請求最適化

```typescript
interface CICDBillingOptimization {
  conditionalBuilds: {
    nativeChanges: {
      trigger: "ネイティブコード変更のみ"
      detection: [
        "android/**",
        "ios/**",
        "app.json",
        "package.json (native deps)"
      ]
      action: "EAS Build 実行"
    }
    jsChanges: {
      trigger: "JavaScript・アセット変更のみ"
      detection: [
        "src/**",
        "assets/**",
        "app.json (non-native)"
      ]
      action: "EAS Update 実行"
    }
  }

  branchStrategy: {
    main: {
      trigger: "マージ時のみビルド"
      frequency: "週1-2回"
      buildType: "production"
    }
    develop: {
      trigger: "重要な変更時のみ"
      frequency: "週3-5回"
      buildType: "preview"
    }
    feature: {
      trigger: "手動のみ"
      frequency: "必要時"
      buildType: "development"
    }
  }

  caching: {
    nodeModules: {
      enabled: true
      invalidation: "package.json 変更時"
    }
    buildCache: {
      enabled: true
      retention: "7日間"
    }
  }
}
```

**CI/CD 最適化実装例**：

```yaml
# GitHub Actions での条件付きビルド
name: Conditional Build/Update
on:
  push:
    branches: [main, develop]

jobs:
  check-changes:
    runs-on: ubuntu-latest
    outputs:
      native: ${{ steps.filter.outputs.native }}
    steps:
      - uses: actions/checkout@v3
      - uses: dorny/paths-filter@v2
        id: filter
        with:
          filters: |
            native:
              - 'android/**'
              - 'ios/**'
              - 'app.json'
              - 'package.json'

  build:
    needs: check-changes
    if: needs.check-changes.outputs.native == 'true'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: expo/expo-github-action@v7
        with:
          expo-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
      - run: eas build --platform all --non-interactive

  update:
    needs: check-changes
    if: needs.check-changes.outputs.native == 'false'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: expo/expo-github-action@v7
        with:
          expo-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
      - run: eas update --channel production
```

## ❓ よくある質問（FAQ）

### プラン関連

```typescript
interface PlanFAQ {
  q1: {
    question: "プランを更新するにはどうすればよいですか？"
    answer: {
      requirements: "Owner または Admin ロール権限"
      upgrade: "manage.md#upgrade-to-a-new-plan を参照"
      downgrade: "manage.md#downgrade-a-plan を参照"
    }
    reference: "/billing/manage#upgrade-to-a-new-plan"
  }

  q2: {
    question: "プランをキャンセルするにはどうすればよいですか？"
    answer: {
      starterPlan: "即時キャンセル、現在期間使用量課金"
      productionEnterprise: "請求期間終了後にキャンセル"
      process: "「Cancel all subscriptions」オプション使用"
    }
    reference: "/billing/manage#cancel-a-plan"
  }

  q3: {
    question: "間違ったアカウントから購読した場合はどうすればよいですか？"
    answer: {
      steps: [
        "正しいアカウントに切り替え",
        "正しいプランに購読",
        "間違ったアカウントから返金リクエスト"
      ]
    }
  }

  q4: {
    question: "無料プランで追加のビルドのみが必要な場合"
    answer: {
      recommendation: "Starter プラン（$19/月）にアップグレード"
      benefits: "$45のビルドクレジット + 3,000 MAU"
      flexibility: "要件満たした後、無料プランにダウングレード可能"
    }
  }

  q5: {
    question: "無料プランのクレジットを転送できますか？"
    answer: "いいえ、無料プランのクレジットは他のプランに転送不可"
  }
}
```

### 請求関連

```typescript
interface BillingFAQ {
  q1: {
    question: "請求サイクルはどうなっていますか？"
    answer: {
      frequency: "月次請求"
      billingDate: "サブスクリプション開始日に基づく"
      prorating: "プラン変更時に日割り計算"
    }
  }

  q2: {
    question: "使用量超過はいつ請求されますか？"
    answer: {
      billing: "月末に計算"
      invoice: "翌月の請求に含まれる"
      preview: "ダッシュボードでリアルタイム見積もり"
    }
  }

  q3: {
    question: "支払いに失敗した場合はどうなりますか？"
    answer: {
      retry: "自動的に数回再試行"
      notification: "失敗時にメール通知"
      suspension: "継続的な失敗でサービス停止"
      resolution: "支払い方法更新で即座に復旧"
    }
  }

  q4: {
    question: "Tax ID を請求書に追加できますか？"
    answer: {
      method: "請求情報から Tax ID 追加"
      application: "次回請求書から自動適用"
      types: "VAT, GST など国際 Tax ID 対応"
    }
  }

  q5: {
    question: "領収書はどこでダウンロードできますか？"
    answer: {
      location: "expo.dev/settings/receipts"
      access: "Owner/Admin のみ"
      format: "PDF 形式"
    }
  }
}
```

### 使用量最適化関連

```typescript
interface OptimizationFAQ {
  q1: {
    question: "ビルドコストを削減するにはどうすればよいですか？"
    answer: {
      strategies: [
        "JavaScriptの変更には EAS Update を使用",
        "開発ビルドで反復開発",
        "ネイティブ変更時のみ自動ビルド",
        "ビルドキャッシュの活用"
      ]
    }
    reference: "/billing/usage-based-pricing#optimize-usage"
  }

  q2: {
    question: "Update の帯域幅使用量を削減するには？"
    answer: {
      techniques: [
        "変更されていないアセットを除外",
        "アセット圧縮最適化",
        "不要なファイルを除外",
        "段階的ロールアウト"
      ]
      verification: "npx expo-updates assets:verify <dir>"
    }
  }

  q3: {
    question: "使用量をどのように監視できますか？"
    answer: {
      dashboard: "expo.dev/settings/billing の Usage Overview"
      metrics: [
        "ビルド数とクレジット消費",
        "月間アクティブユーザー",
        "帯域幅使用量",
        "超過見積もり"
      ]
      alerts: "75%, 90%, 100% で自動通知"
    }
  }
}
```

**詳細ドキュメント**: [`faq.md`](./billing/faq.md)

## 🔗 関連リソース

### 内部リンク

- [`overview.md`](./billing/overview.md) - 請求システム概要
- [`plans.md`](./billing/plans.md) - サブスクリプションプラン詳細
- [`usage-based-pricing.md`](./billing/usage-based-pricing.md) - 使用量ベース価格設定
- [`manage.md`](./billing/manage.md) - プランと請求管理
- [`invoices-and-receipts.md`](./billing/invoices-and-receipts.md) - 請求書と領収書
- [`faq.md`](./billing/faq.md) - よくある質問

### 外部リンク

- [Expo Pricing](https://expo.dev/pricing) - 公式価格ページ
- [Billing Dashboard](https://expo.dev/settings/billing) - 請求ダッシュボード
- [Receipts](https://expo.dev/settings/receipts) - 領収書ページ
- [Price Calculator](https://expo.dev/pricing#update) - Update 価格計算ツール

### 関連ドキュメント

- **[Accounts](./accounts.md)** - アカウント管理とアクセス制御
- **[EAS Build](../build/)** - ビルドサービスと使用量
- **[EAS Update](../update/)** - Update サービスと使用量
- **[Workflow](../workflow/)** - 開発ワークフローと請求統合

## 📋 まとめ

Expo Billing は、透明性が高く柔軟な請求システムを提供します：

```typescript
interface ExpoBillingSummary {
  strengths: [
    "柔軟なプラン選択（Free → Enterprise）",
    "使用量ベースの透明な価格設定",
    "リアルタイム使用状況監視",
    "包括的な請求管理機能",
    "最適化のための詳細な分析"
  ]

  pricingModel: {
    subscription: "予測可能な月次料金"
    usageBased: "使用した分だけ支払い"
    credits: "月次クレジットで柔軟性確保"
  }

  costControl: [
    "使用状況のリアルタイム監視",
    "閾値アラートで超過防止",
    "最適化ベストプラクティス提供",
    "詳細な請求書と領収書"
  ]

  optimization: {
    builds: [
      "EAS Update 活用",
      "開発ビルド使用",
      "条件付き自動化",
      "キャッシュ戦略"
    ]
    updates: [
      "差分配信",
      "アセット最適化",
      "チャネル戦略",
      "圧縮最適化"
    ]
  }

  useCases: [
    "個人開発プロジェクト",
    "スタートアップMVP",
    "中小企業アプリ",
    "エンタープライズシステム"
  ]

  nextSteps: [
    "プロジェクト要件の評価",
    "適切なプランの選択",
    "使用量監視体制の構築",
    "最適化戦略の実装",
    "定期的なコストレビュー"
  ]
}
```

### 推奨実装パス

```typescript
interface RecommendedPath {
  phase1_assessment: {
    duration: "1週間"
    activities: [
      "現在の開発ワークフロー分析",
      "月間ビルド・Update 頻度見積もり",
      "ユーザー成長予測",
      "予算制約の確認"
    ]
  }

  phase2_planSelection: {
    duration: "即座"
    activities: [
      "要件に基づくプラン選択",
      "初期プラン購読",
      "請求情報設定",
      "支払い方法登録"
    ]
  }

  phase3_monitoring: {
    duration: "継続的"
    activities: [
      "使用状況の週次レビュー",
      "最適化機会の特定",
      "アラート閾値の設定",
      "チーム教育"
    ]
  }

  phase4_optimization: {
    duration: "継続的"
    activities: [
      "ベストプラクティス適用",
      "CI/CD 統合最適化",
      "コスト効率の改善",
      "定期的なプランレビュー"
    ]
  }
}
```

このガイドを参考に、プロジェクトの規模と予算に応じた最適な請求設定と使用量管理を実装してください。
