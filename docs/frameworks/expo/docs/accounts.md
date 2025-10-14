# Expo Accounts - 包括的アカウント管理ガイド

## 📋 概要

Expo Accounts は、個人開発者からエンタープライズチームまで、あらゆる規模のプロジェクト管理をサポートする包括的なアカウントシステムです。セキュリティ、コラボレーション、アクセス制御を中心とした機能を提供しています。

```typescript
interface ExpoAccountsSystem {
  accountTypes: {
    personal: PersonalAccount;
    organization: OrganizationAccount;
  };
  security: {
    twoFactor: TwoFactorAuth;
    sso: SingleSignOn;
    programmaticAccess: AccessTokens;
  };
  monitoring: {
    auditLogs: AuditLogging;
  };
  collaboration: {
    roles: RoleBasedAccess;
    teams: TeamManagement;
  };
}
```

## 🏢 アカウントタイプ

### 個人アカウント

```typescript
interface PersonalAccount {
  purpose: "個人・ホビープロジェクト向け";
  features: {
    authentication: "独立した認証資格情報";
    projects: "個人プロジェクト管理";
    security: "二要素認証対応";
  };
  limitations: {
    collaboration: "限定的なチーム機能";
    sharing: "認証資格情報の共有不可";
  };
  creation: "サインアップ時に自動作成";
}
```

**主な用途**：

- 個人開発プロジェクト
- プロトタイプ開発
- 学習・実験目的

**詳細ドキュメント**: [`account-types.md`](./accounts/account-types.md)

### 組織アカウント

```typescript
interface OrganizationAccount {
  purpose: "チームコラボレーション・共有プロジェクト管理";
  roles: {
    Owner: "完全なアカウント制御";
    Admin: "設定・ユーザー管理";
    Developer: "プロジェクト・ビルド作成";
    Viewer: "読み取り専用アクセス";
  };
  features: {
    teamInvitation: "チームメンバー招待";
    roleManagement: "ロールベース権限割り当て";
    projectTransfer: "アカウント間プロジェクト転送";
    securitySettings: "高度なセキュリティ管理";
  };
  creation: {
    from: "個人アカウントダッシュボード";
    process: "Create Organization → 命名 → メンバー招待";
  };
}
```

**ロール権限マトリックス**：

| ロール    | アカウント管理 | プロジェクト作成 | ビルド実行 | 設定変更 | 読み取り |
| --------- | -------------- | ---------------- | ---------- | -------- | -------- |
| Owner     | ✅             | ✅               | ✅         | ✅       | ✅       |
| Admin     | 🔄             | ✅               | ✅         | ✅       | ✅       |
| Developer | ❌             | ✅               | ✅         | 🔄       | ✅       |
| Viewer    | ❌             | ❌               | ❌         | ❌       | ✅       |

## 🔐 セキュリティ機能

### 二要素認証（2FA）

```typescript
interface TwoFactorAuth {
  purpose: "ログイン時の追加セキュリティ層";
  methods: {
    authenticatorApp: {
      supported: [
        "LastPass Authenticator",
        "Authy",
        "1Password",
        "Google Authenticator",
        "Microsoft Authenticator",
      ];
      setup: "QRコードスキャン → 確認コード入力";
      standard: "TOTP（Time-based One-Time Password）";
    };
    sms: {
      status: "非推奨（既存のみ継続サポート）";
      newSetup: false;
    };
    recoveryCodes: {
      generation: "2FAセットアップ時に提供";
      usage: "各コード1回のみ有効";
      purpose: "認証アプリ・デバイス紛失時の回復";
      storage: "安全な場所への保存を強く推奨";
    };
  };
  configuration: {
    location: "個人アカウント設定";
    url: "https://expo.dev/settings#two-factor-auth";
    options: [
      "認証方法追加・削除",
      "デフォルト方法設定",
      "リカバリーコード再生成",
      "2FA無効化",
    ];
  };
  recovery: {
    methods: [
      "リカバリーコード使用",
      "複数デバイスでの2FA設定",
      "Expoサポート連絡（回復保証なし）",
    ];
  };
}
```

**セットアップガイド**：

1. [個人アカウント設定](https://expo.dev/settings#two-factor-auth) にアクセス
2. 認証アプリでQRコードをスキャン
3. 確認コードを入力して有効化
4. リカバリーコードを安全な場所に保存

**詳細ドキュメント**: [`two-factor.md`](./accounts/two-factor.md)

### シングルサインオン（SSO）

```typescript
interface SingleSignOn {
  availability: "Production・Enterpriseプラン";
  purpose: "IDプロバイダー経由のユーザー管理";
  supportedProviders: [
    "Okta",
    "OneLogin",
    "Microsoft Entra ID",
    "Google Workspace",
  ];
  standard: "OpenID Connect Discovery 1.0";

  setup: {
    requirements: "組織アカウントOwnerロール";
    location: "Settings > Organization settings";
    configuration: {
      clientId: string;
      clientSecret: string;
      idpSubdomainOrTenantId: string;
    };
    constraints: "最低1人の非SSOユーザーOwnerが必要";
  };

  signInMethods: {
    website: {
      url: "expo.dev/sso-login";
      process: "組織名入力 → IDプロバイダー認証 → ユーザー名選択";
    };
    cli: {
      expo: "npx expo login --sso";
      eas: "eas login --sso";
    };
    expoGo: "Continue with SSO → Webサインイン手順";
  };

  userLimitations: [
    "SSO組織のみ所属可能",
    "追加組織作成不可",
    "SSO組織離脱不可",
    "Expoフォーラムログイン不可",
    "個人EASサブスクライブ不可",
  ];
}
```

**SSO実装パターン**：

```bash
# CLI経由のSSO認証
npx expo login --sso
# → 組織名入力 → ブラウザで認証 → CLI認証完了

eas login --sso
# → EAS CLI でのSSO認証
```

**詳細ドキュメント**: [`sso.md`](./accounts/sso.md)

### プログラマティックアクセス

```typescript
interface ProgrammaticAccess {
  purpose: "ユーザー名・パスワード代替の安全なアクセス";

  personalAccessTokens: {
    creation: "アクセストークンダッシュボード";
    url: "https://expo.dev/settings/access-tokens";
    scope: "アカウント代理でのアクション実行";
    applicability: ["個人アカウント", "組織アカウント"];
  };

  robotUsers: {
    purpose: "制限された権限での特定アクション実行";
    characteristics: {
      directSignIn: false;
      authenticationMethod: "アクセストークンのみ";
      roleAssignment: "制限されたロール";
    };
  };

  usage: {
    authentication: "環境変数 EXPO_TOKEN";
    examples: {
      build: "EXPO_TOKEN=my_token eas build";
      publish: "EXPO_TOKEN=my_token expo publish";
    };
    useCases: [
      "CI/CD パイプライン",
      "安全なアクセス更新",
      "制限プロジェクトアクセス提供",
    ];
  };

  management: {
    revocation: {
      method: "アクセストークンページでの削除";
      url: "https://expo.dev/settings/access-tokens";
      advantage: "パスワード変更不要";
    };
  };

  bestPractices: [
    "アクセストークンをパスワード同様に扱う",
    "誤って漏洩した場合は即座に取り消し",
    "統合には直接資格情報でなくトークンを使用",
  ];
}
```

**実装例**：

```bash
# 環境変数での認証
export EXPO_TOKEN="your_access_token_here"
eas build --platform ios

# または一時的な使用
EXPO_TOKEN="token" eas build --platform android
```

**詳細ドキュメント**: [`programmatic-access.md`](./accounts/programmatic-access.md)

## 📊 監査とモニタリング

### 監査ログ

```typescript
interface AuditLogs {
  availability: "Enterpriseプランのみ";
  purpose: "Expo Application Services内のアクション記録";

  characteristics: {
    immutability: "変更・削除不可";
    retention: "1.5年間保存";
    deletion: "アカウント削除後90日で削除";
    access: "アカウント/組織設定";
  };

  useCases: {
    permissionMonitoring: {
      purpose: "ユーザー招待・権限変更追跡";
      benefit: "不正アクセス・アカウント侵害検出";
    };
    accessHistory: {
      purpose: "チーム・デバイスアクセス履歴記録";
      benefit: "時系列変更追跡";
    };
  };

  trackedEntities: [
    "アカウント",
    "プロジェクト",
    "ユーザー権限",
    "アプリ資格情報",
    "ワークフロー",
    "その他システムリソース",
  ];

  logStructure: {
    actor: "アクション実行者";
    entityType: "対象エンティティタイプ";
    actionType: "実行されたアクションタイプ";
    message: "アクション詳細メッセージ";
    createdAt: "作成日時";
  };

  export: {
    availability: "Enterpriseプランのみ";
    maxPeriod: "最大30日間";
    method: "Expo Webサイト";
    programmaticApi: false;
  };
}
```

**監査ログ活用シナリオ**：

1. **セキュリティインシデント調査**

   ```typescript
   // セキュリティ侵害疑いの調査
   interface SecurityInvestigation {
     timeline: "過去30日間のアクセスログ";
     focus: ["権限変更", "プロジェクト作成", "資格情報アクセス"];
     correlation: "異常パターンの特定";
   }
   ```

2. **コンプライアンス監査**
   ```typescript
   interface ComplianceAudit {
     requirements: "企業ガバナンス要件";
     evidence: "1.5年間の完全なアクション履歴";
     immutability: "改ざん不可能な証跡";
   }
   ```

**詳細ドキュメント**: [`audit-logs.md`](./accounts/audit-logs.md)

## 🎯 実装パターンとベストプラクティス

### チーム開発の組織構成

```typescript
interface TeamOrganizationPattern {
  smallTeam: {
    size: "2-5人"
    structure: {
      owners: 1
      admins: 1
      developers: "残りメンバー"
    }
    security: ["2FA必須", "個人アクセストークン"]
  }

  mediumTeam: {
    size: "6-20人"
    structure: {
      owners: 1
      admins: 2-3
      developers: "開発者"
      viewers: "ステークホルダー"
    }
    security: ["2FA必須", "ロボットユーザー", "定期トークンローテーション"]
  }

  enterpriseTeam: {
    size: "20+人"
    structure: {
      owners: 1-2
      admins: "部門ごと"
      developers: "プロジェクトチーム"
      viewers: "マネジメント・監査"
    }
    security: ["SSO必須", "監査ログ", "Enterprise機能"]
  }
}
```

### CI/CD統合パターン

```typescript
interface CICDIntegrationPattern {
  githubActions: {
    secrets: {
      EXPO_TOKEN: "Personal Access Token";
    };
    workflow: `
      - name: Setup Expo
        uses: expo/expo-github-action@v7
        with:
          expo-version: latest
          token: \${{ secrets.EXPO_TOKEN }}
      
      - name: Build
        run: eas build --platform all --non-interactive
    `;
  };

  gitlab: {
    variables: {
      EXPO_TOKEN: "Project-level CI/CD variable";
    };
    pipeline: `
      build:
        script:
          - export EXPO_TOKEN=$EXPO_TOKEN
          - eas build --platform all
    `;
  };

  security: {
    tokenManagement: [
      "専用ロボットユーザーの作成",
      "最小権限の原則",
      "定期的なトークンローテーション",
      "ログ監視",
    ];
  };
}
```

### セキュリティ設定チェックリスト

```typescript
interface SecurityChecklist {
  personal: [
    "✅ 二要素認証有効化",
    "✅ リカバリーコード安全保存",
    "✅ 強固なパスワード設定",
    "✅ アクセストークン適切管理",
  ];

  organization: [
    "✅ 全メンバーの2FA必須化",
    "✅ 適切なロール割り当て",
    "✅ 定期的な権限レビュー",
    "✅ 退職者アクセス即座削除",
    "✅ SSO設定（Enterprise）",
    "✅ 監査ログ定期確認（Enterprise）",
  ];

  development: [
    "✅ 本番用ロボットユーザー",
    "✅ CI/CD専用トークン",
    "✅ 開発環境分離",
    "✅ アクセスログ監視",
  ];
}
```

## 🔗 関連リソース

### 内部リンク

- [account-types.md](./accounts/account-types.md) - アカウントタイプ詳細
- [two-factor.md](./accounts/two-factor.md) - 二要素認証設定
- [sso.md](./accounts/sso.md) - シングルサインオン実装
- [programmatic-access.md](./accounts/programmatic-access.md) - プログラマティックアクセス
- [audit-logs.md](./accounts/audit-logs.md) - 監査ログ（Enterprise）

### 外部リンク

- [Expo Account Settings](https://expo.dev/settings) - アカウント設定ダッシュボード
- [Access Tokens](https://expo.dev/settings/access-tokens) - アクセストークン管理
- [Organization Settings](https://expo.dev/settings/organizations) - 組織設定
- [SSO Login](https://expo.dev/sso-login) - SSO専用ログイン

### 関連ドキュメント

- **[EAS Build](../build/)** - ビルド設定とアクセス制御
- **[EAS Submit](../submit/)** - アプリストア提出と権限
- **[Workflow](../workflow/)** - 開発ワークフローとアカウント統合

## 📋 まとめ

Expo Accounts は、個人開発から大規模エンタープライズまで対応する柔軟なアカウント管理システムです：

```typescript
interface ExpoAccountsSummary {
  strengths: [
    "柔軟なアカウントタイプ（個人・組織）",
    "包括的なセキュリティ機能（2FA・SSO）",
    "プログラマティックアクセス対応",
    "Enterprise監査ログ",
    "詳細なロールベースアクセス制御",
  ];

  useCases: [
    "個人プロジェクト開発",
    "チームコラボレーション",
    "CI/CD自動化",
    "エンタープライズガバナンス",
    "セキュリティ監査対応",
  ];

  nextSteps: [
    "適切なアカウントタイプの選択",
    "セキュリティ機能の段階的実装",
    "チーム権限の適切な設計",
    "監査・モニタリング体制構築",
  ];
}
```

このガイドを参考に、プロジェクトの規模と要件に応じた最適なアカウント設定を実装してください。
