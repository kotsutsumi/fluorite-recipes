# Expo 規制コンプライアンス - 包括的ガイド

## 📋 概要

Expo アプリにおける規制コンプライアンスの実装は、ユーザーのプライバシーとデータ保護を確保し、法的要件を満たすために不可欠です。このガイドでは、GDPR、HIPAA、およびデータプライバシー保護の実装方法を包括的に解説します。

```typescript
interface RegulatoryComplianceSystem {
  dataPrivacy: {
    principles: DataProtectionPrinciples;
    consent: ConsentManagement;
    encryption: DataEncryption;
    userRights: UserRightsImplementation;
  };
  regulations: {
    gdpr: GDPRCompliance;
    hipaa: HIPAACompliance;
    ccpa: CCPACompliance;
  };
  implementation: {
    security: SecurityMeasures;
    audit: AuditLogging;
    breach: BreachNotification;
  };
}
```

## 🔐 データとプライバシー保護

### 基本原則

```typescript
interface DataProtectionPrinciples {
  dataMinimization: {
    principle: "最小限のデータ収集";
    implementation: "必要なデータのみを収集";
    validation: "収集目的の明確化";
  };
  transparency: {
    principle: "データ慣行の透明性";
    implementation: "明確なプライバシーポリシー";
    disclosure: "データ使用目的の説明";
  };
  userControl: {
    principle: "ユーザーによるデータ管理";
    implementation: "同意管理システム";
    rights: ["アクセス権", "訂正権", "削除権", "ポータビリティ権"];
  };
  security: {
    principle: "データセキュリティの確保";
    implementation: "暗号化とセキュアストレージ";
    measures: ["保存時暗号化", "転送時暗号化", "アクセス制御"];
  };
}
```

**詳細ドキュメント**: [`data-and-privacy-protection.md`](./regulatory-compliance/data-and-privacy-protection.md)

### 同意管理システム

```typescript
interface ConsentManagement {
  consentTypes: {
    essential: {
      required: true;
      description: "サービス提供に必須";
      userControl: false;
    };
    analytics: {
      required: false;
      description: "使用統計の収集";
      userControl: true;
    };
    personalization: {
      required: false;
      description: "体験のカスタマイズ";
      userControl: true;
    };
    marketing: {
      required: false;
      description: "マーケティング通信";
      userControl: true;
    };
  };

  storage: {
    location: "AsyncStorage または SecureStore";
    format: "JSON with timestamp and version";
    retention: "ユーザーによる変更まで保持";
  };

  implementation: {
    screen: "ConsentScreen component";
    validation: "初回起動時または設定変更時";
    tracking: "同意履歴の記録";
  };
}
```

**実装例**：

```typescript
// utils/consent.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ConsentPreferences {
  analytics: boolean;
  personalization: boolean;
  marketing: boolean;
  crashReporting: boolean;
  timestamp: string;
}

export const getConsent = async (): Promise<ConsentPreferences | null> => {
  try {
    const consentJson = await AsyncStorage.getItem('user_consent');
    return consentJson ? JSON.parse(consentJson) : null;
  } catch (error) {
    console.error('Failed to get consent:', error);
    return null;
  }
};

export const setConsent = async (consent: ConsentPreferences): Promise<void> => {
  try {
    await AsyncStorage.setItem('user_consent', JSON.stringify(consent));
  } catch (error) {
    console.error('Failed to save consent:', error);
  }
};

export const hasConsent = async (
  type: keyof Omit<ConsentPreferences, 'timestamp'>
): Promise<boolean> => {
  const consent = await getConsent();
  return consent ? consent[type] : false;
};
```

### データ暗号化

```typescript
interface DataEncryption {
  atRest: {
    method: "expo-secure-store";
    algorithm: "AES-256（プラットフォーム依存）";
    implementation: {
      ios: "Keychain Services";
      android: "EncryptedSharedPreferences";
    };
  };

  inTransit: {
    protocol: "HTTPS/TLS 1.2+";
    enforcement: "HTTPのみのリクエストをブロック";
    validation: "SSL証明書の検証";
  };

  usage: {
    sensitiveData: ["認証トークン", "個人識別情報", "医療情報"];
    storage: "SecureStore for sensitive, AsyncStorage for non-sensitive";
    transmission: "すべての通信でHTTPSを使用";
  };
}
```

**実装例**：

```typescript
// utils/secureStorage.ts
import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';

export const secureStorage = {
  async setItem(key: string, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error('Failed to save encrypted data:', error);
      throw error;
    }
  },

  async getItem(key: string): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error('Failed to retrieve encrypted data:', error);
      return null;
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error('Failed to delete encrypted data:', error);
      throw error;
    }
  },
};

// 通信の暗号化
export async function secureFetch(url: string, options: RequestInit = {}) {
  const secureUrl = url.replace('http://', 'https://');

  const response = await fetch(secureUrl, {
    ...options,
    headers: {
      ...options.headers,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}
```

### ユーザー権利の実装

```typescript
interface UserRights {
  accessRight: {
    description: "自分のデータへのアクセス";
    implementation: "データエクスポート機能";
    format: ["JSON", "CSV", "XML"];
    timeline: "30日以内に提供";
  };

  rectificationRight: {
    description: "データの訂正";
    implementation: "プロフィール編集画面";
    validation: "即座に反映";
  };

  erasureRight: {
    description: "データの削除（忘れられる権利）";
    implementation: "アカウント削除機能";
    scope: ["ローカルデータ", "サーバーデータ", "サードパーティデータ"];
    timeline: "30日以内に完全削除";
  };

  portabilityRight: {
    description: "機械可読形式でのデータ受取";
    implementation: "構造化データエクスポート";
    format: "JSON（主）、CSV、XML";
  };

  restrictionRight: {
    description: "データ処理の制限";
    implementation: "処理制限フラグ管理";
    validation: "制限前の処理チェック";
  };

  objectionRight: {
    description: "データ処理への異議申立";
    implementation: "異議申立画面";
    scope: ["マーケティング", "プロファイリング", "調査"];
  };
}
```

**実装例**：

```typescript
// utils/dataManagement.ts
export async function deleteUserData(userId: string): Promise<void> {
  try {
    // ローカルデータを削除
    await AsyncStorage.clear();
    await SecureStore.deleteItemAsync('user_data');

    // サーバー側のデータを削除
    await fetch(`https://api.example.com/users/${userId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    // サードパーティサービスのデータを削除
    await deleteAnalyticsData(userId);
    await deleteCrashReportingData(userId);

    console.log('User data deleted successfully');
  } catch (error) {
    console.error('Failed to delete user data:', error);
    throw error;
  }
}

// データエクスポート
export async function exportUserData(userId: string): Promise<any> {
  try {
    const localData = {
      preferences: await AsyncStorage.getItem('preferences'),
      settings: await AsyncStorage.getItem('settings'),
    };

    const response = await fetch(`https://api.example.com/users/${userId}/export`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    const serverData = await response.json();

    return {
      ...localData,
      ...serverData,
      exportedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Failed to export user data:', error);
    throw error;
  }
}
```

## 🇪🇺 GDPR コンプライアンス

### GDPR 概要

```typescript
interface GDPRCompliance {
  scope: {
    applicability: "EU/EEA内のユーザーにサービスを提供する組織";
    enforcement: "2018年5月25日";
    penalties: {
      tier1: "最大1,000万ユーロまたは全世界年間売上高の2%";
      tier2: "最大2,000万ユーロまたは全世界年間売上高の4%";
    };
  };

  principles: {
    lawfulness: "適法性、公正性、透明性";
    purposeLimitation: "目的の制限";
    dataMinimization: "データ最小化";
    accuracy: "正確性";
    storageLimitation: "保存期間の制限";
    integrity: "完全性と機密性";
    accountability: "説明責任";
  };

  userRights: {
    access: "アクセス権";
    rectification: "訂正権";
    erasure: "削除権（忘れられる権利）";
    portability: "データポータビリティ権";
    restriction: "処理の制限権";
    objection: "異議申立権";
  };

  obligations: {
    consent: "明示的な同意の取得";
    privacy: "プライバシー通知の提供";
    dpo: "データ保護責任者の任命（必要な場合）";
    dpia: "データ保護影響評価の実施";
    breach: "データ侵害の72時間以内の報告";
  };
}
```

**詳細ドキュメント**: [`gdpr.md`](./regulatory-compliance/gdpr.md)

### GDPR 主要原則の実装

```typescript
interface GDPRImplementation {
  // 1. 適法性、公正性、透明性
  transparency: {
    privacyNotice: {
      content: [
        "データ管理者の情報",
        "収集するデータの種類",
        "データの使用目的",
        "法的根拠",
        "データの保存期間",
        "データの共有先",
        "ユーザーの権利",
      ];
      location: "アプリ内プライバシーポリシー画面";
      format: "明確で理解しやすい言語";
    };
  };

  // 2. 目的の制限
  purposeLimitation: {
    dataCollectionPolicy: {
      email: ["アカウント管理", "マーケティング"];
      usageData: ["サービス改善", "アナリティクス"];
      crashReports: ["サービス改善"];
    };
    validation: "収集前に目的を明確化";
    documentation: "処理活動の記録（ROPA）";
  };

  // 3. データ最小化
  dataMinimization: {
    profile: {
      required: ["id", "email", "createdAt"];
      optional: ["name", "preferences"];
      excluded: ["ssn", "creditCard", "sensitiveInfo"];
    };
    analytics: {
      userId: "匿名化されたID";
      personalInfo: "収集しない";
    };
  };

  // 4. 保存期間の制限
  retention: {
    userAccounts: "アカウント削除まで";
    analytics: "90日間";
    crashReports: "30日間";
    auditLogs: "1.5年間";
    implementation: "自動削除スクリプト";
  };

  // 5. 完全性と機密性
  security: {
    encryption: {
      atRest: "SecureStore（AES-256）";
      inTransit: "HTTPS/TLS 1.2+";
    };
    accessControl: "ロールベースアクセス制御";
    audit: "すべてのアクセスをログ記録";
  };
}
```

### 同意管理の実装

```typescript
interface GDPRConsent {
  requirements: {
    explicit: "明示的な同意が必要";
    informed: "明確な情報提供";
    specific: "目的ごとの個別同意";
    withdrawable: "いつでも撤回可能";
    documented: "同意の記録を保持";
  };

  implementation: {
    granularity: {
      essential: "サービス提供に必須（同意不要）";
      analytics: "個別の同意オプション";
      marketing: "個別の同意オプション";
      thirdParty: "個別の同意オプション";
    };

    interface: {
      presentation: "明確なオプトイン";
      defaultState: "すべて無効（必須除く）";
      controls: "個別のトグルスイッチ";
      information: "各オプションの説明";
    };

    storage: {
      data: {
        consent: "同意状態";
        timestamp: "同意日時";
        version: "プライバシーポリシーバージョン";
      };
      location: "AsyncStorage";
      backup: "サーバー側にもバックアップ";
    };
  };
}
```

**実装例**：

```typescript
// screens/ConsentScreen.tsx
import React, { useState } from 'react';
import { View, Text, Switch, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ConsentOptions {
  essential: boolean; // 常にtrue
  analytics: boolean;
  personalization: boolean;
  marketing: boolean;
  thirdParty: boolean;
}

export function ConsentScreen({ onComplete }: { onComplete: () => void }) {
  const [consent, setConsent] = useState<ConsentOptions>({
    essential: true,
    analytics: false,
    personalization: false,
    marketing: false,
    thirdParty: false,
  });

  const saveConsent = async () => {
    const consentRecord = {
      ...consent,
      timestamp: new Date().toISOString(),
      version: '1.0',
    };

    await AsyncStorage.setItem('user_consent', JSON.stringify(consentRecord));
    await api.recordConsent(consentRecord);

    onComplete();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>プライバシー設定</Text>

      {/* 必須のCookie */}
      <View style={styles.consentItem}>
        <View style={styles.consentHeader}>
          <Text style={styles.consentTitle}>必須のCookie</Text>
          <Switch value={consent.essential} disabled={true} />
        </View>
        <Text style={styles.consentDescription}>
          サービス提供に必要不可欠なデータです。
        </Text>
      </View>

      {/* アナリティクス */}
      <View style={styles.consentItem}>
        <View style={styles.consentHeader}>
          <Text style={styles.consentTitle}>アナリティクス</Text>
          <Switch
            value={consent.analytics}
            onValueChange={(value) => setConsent({ ...consent, analytics: value })}
          />
        </View>
        <Text style={styles.consentDescription}>
          アプリの使用状況を分析し、サービス改善に役立てます。
        </Text>
      </View>

      {/* マーケティング */}
      <View style={styles.consentItem}>
        <View style={styles.consentHeader}>
          <Text style={styles.consentTitle}>マーケティング</Text>
          <Switch
            value={consent.marketing}
            onValueChange={(value) => setConsent({ ...consent, marketing: value })}
          />
        </View>
        <Text style={styles.consentDescription}>
          関連する商品やサービスをご案内します。
        </Text>
      </View>

      <Button title="保存して続ける" onPress={saveConsent} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  consentItem: { marginBottom: 24, padding: 16, backgroundColor: '#f5f5f5', borderRadius: 8 },
  consentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  consentTitle: { fontSize: 16, fontWeight: '600' },
  consentDescription: { fontSize: 14, color: '#666' },
});
```

### データ侵害通知

```typescript
interface GDPRBreach {
  timeline: {
    discovery: "侵害の検出";
    assessment: "影響範囲の評価（24時間以内）";
    notification: "監督機関への報告（72時間以内）";
    userNotification: "影響を受ける個人への通知（速やかに）";
  };

  requirements: {
    supervisoryAuthority: {
      deadline: "72時間以内";
      content: [
        "侵害の性質",
        "影響を受ける個人の数",
        "データの種類",
        "侵害の影響",
        "対策措置",
        "連絡先",
      ];
    };

    individuals: {
      condition: "高リスクの場合";
      method: "メール、アプリ通知、または公開通知";
      content: [
        "侵害の説明",
        "影響を受けるデータ",
        "推奨される対策",
        "連絡先",
      ];
    };
  };

  implementation: {
    detection: "自動監視システム";
    assessment: "影響評価プロトコル";
    notification: "通知テンプレートと手順";
    logging: "インシデントログの記録";
  };
}
```

## 🏥 HIPAA コンプライアンス

### HIPAA 概要

```typescript
interface HIPAACompliance {
  scope: {
    applicability: "米国の医療提供者、保険会社、ビジネスアソシエイト";
    enforcement: "1996年制定、2003年プライバシー規則、2005年セキュリティ規則";
    penalties: {
      civil: "$100〜$50,000/件、年間最大$1,500,000";
      criminal: "最大10年の懲役と$250,000の罰金";
    };
  };

  protectedHealthInformation: {
    definition: "個人を特定できる健康情報";
    examples: [
      "氏名、住所、生年月日",
      "医療記録番号",
      "診断情報、治療記録",
      "処方箋情報",
      "検査結果",
      "健康保険番号",
      "医療画像",
      "遺伝情報",
    ];
    identifiers: "18の識別子";
  };

  rules: {
    privacy: "PHIの使用と開示を制限";
    security: "ePHIを保護するためのセーフガード";
    breach: "データ侵害の通知義務";
  };

  expoPosition: {
    dataHandling: "Expoは医療データを収集・保存・処理しない";
    responsibility: "開発者がHIPAA準拠を実装する責任";
    disclaimer: "Expo自体はHIPAA準拠を保証しない";
  };
}
```

**詳細ドキュメント**: [`hipaa.md`](./regulatory-compliance/hipaa.md)

### HIPAA セキュリティ規則

```typescript
interface HIPAASecurityRule {
  // 管理的セーフガード
  administrative: {
    riskAssessment: {
      frequency: "定期的（少なくとも年1回）";
      scope: "すべてのePHI処理活動";
      documentation: "リスク評価レポート";
    };

    securityOfficer: {
      role: "セキュリティ責任者の指名";
      responsibilities: [
        "セキュリティポリシーの策定",
        "リスク評価の実施",
        "インシデント対応",
      ];
    };

    workforceTraining: {
      frequency: "年次および新規採用時";
      topics: ["HIPAA基礎", "PHI取扱い", "セキュリティ手順"];
      documentation: "トレーニング記録";
    };

    accessControl: {
      principle: "最小権限の原則";
      implementation: "ロールベースアクセス制御";
      review: "定期的な権限レビュー";
    };
  };

  // 物理的セーフガード
  physical: {
    deviceSecurity: {
      requirements: [
        "デバイス暗号化",
        "画面ロック",
        "ルート化/ジェイルブレイク検出",
      ];
      validation: "アプリ起動時のセキュリティチェック";
    };

    autoLogout: {
      timeout: "15分間の非アクティブ後";
      implementation: "セッションタイムアウト管理";
      notification: "ログアウト前の警告";
    };
  };

  // 技術的セーフガード
  technical: {
    accessControl: {
      authentication: {
        password: {
          minLength: 12;
          complexity: "大文字、小文字、数字、特殊文字";
          expiration: "90日ごとに変更";
        };
        mfa: "二要素認証または生体認証";
      };
      authorization: "ロールベースアクセス制御";
    };

    auditControls: {
      logging: "すべてのPHIアクセスを記録";
      retention: "最低6年間";
      monitoring: "異常なアクティビティの検出";
    };

    integrity: {
      validation: "データの改ざん防止";
      checksums: "データ整合性の検証";
    };

    transmission: {
      encryption: "HTTPS/TLS 1.2+";
      enforcement: "HTTPを使用しない";
      validation: "SSL証明書の検証";
    };
  };
}
```

### PHI の暗号化実装

```typescript
interface PHIEncryption {
  atRest: {
    method: "expo-secure-store";
    algorithm: "AES-256";
    implementation: {
      ios: "Keychain Services";
      android: "EncryptedSharedPreferences";
    };
  };

  inTransit: {
    protocol: "HTTPS/TLS 1.2+";
    enforcement: "HTTPのみのリクエストをブロック";
    validation: "証明書ピンニング（本番環境）";
  };
}
```

**実装例**：

```typescript
// utils/hipaaEncryption.ts
import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';

// PHIの暗号化保存
export async function storePHISecurely(key: string, phi: any): Promise<void> {
  const phiString = JSON.stringify(phi);
  await SecureStore.setItemAsync(key, phiString);
}

export async function retrievePHISecurely(key: string): Promise<any | null> {
  const phiString = await SecureStore.getItemAsync(key);
  return phiString ? JSON.parse(phiString) : null;
}

// HTTPS通信の強制
export async function securePHITransmission(url: string, phi: any): Promise<Response> {
  if (!url.startsWith('https://')) {
    throw new Error('HIPAA準拠のため、HTTPSを使用する必要があります');
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Encryption': 'AES-256',
    },
    body: JSON.stringify(phi),
  });

  return response;
}
```

### 監査ログの実装

```typescript
interface HIPAAAuditLog {
  requirements: {
    scope: "すべてのPHIアクセスを記録";
    retention: "最低6年間";
    immutability: "ログは変更不可";
    accessibility: "権限のある担当者がアクセス可能";
  };

  logStructure: {
    timestamp: "アクション日時";
    userId: "アクション実行者";
    userRole: "ユーザーのロール";
    action: "実行されたアクション";
    resource: "対象リソース";
    phiType: "PHIの種類";
    accessResult: "成功/失敗";
    failureReason: "失敗理由（該当する場合）";
    ipAddress: "アクセス元IPアドレス";
    deviceId: "デバイス識別子";
  };
}
```

**実装例**：

```typescript
// utils/hipaaAuditLog.ts
interface HIPAAAuditLog {
  timestamp: string;
  userId: string;
  userRole: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'export' | 'print';
  resource: string;
  phiType: string;
  accessResult: 'success' | 'failure';
  failureReason?: string;
  ipAddress: string;
  deviceId: string;
}

export async function logHIPAAActivity(
  log: Omit<HIPAAAuditLog, 'timestamp' | 'ipAddress' | 'deviceId'>
): Promise<void> {
  const auditLog: HIPAAAuditLog = {
    ...log,
    timestamp: new Date().toISOString(),
    ipAddress: await getDeviceIPAddress(),
    deviceId: await getDeviceId(),
  };

  // セキュアなログサーバーに送信
  await api.logAudit(auditLog);

  // ローカルにもバックアップ（最大7日間）
  await storeLocalAuditLog(auditLog);
}

// 使用例
export async function accessPatientRecord(userId: string, patientId: string): Promise<void> {
  try {
    const record = await api.getPatientRecord(patientId);

    await logHIPAAActivity({
      userId,
      userRole: 'physician',
      action: 'read',
      resource: `patient_record_${patientId}`,
      phiType: 'medical_record',
      accessResult: 'success',
    });
  } catch (error) {
    await logHIPAAActivity({
      userId,
      userRole: 'physician',
      action: 'read',
      resource: `patient_record_${patientId}`,
      phiType: 'medical_record',
      accessResult: 'failure',
      failureReason: error.message,
    });
  }
}
```

### ビジネスアソシエイト契約（BAA）

```typescript
interface BusinessAssociateAgreement {
  definition: "医療機関とPHIを扱う第三者の間で締結される契約";

  requirements: {
    when: [
      "クラウドストレージプロバイダー使用時",
      "アナリティクスプロバイダー使用時",
      "決済処理業者使用時",
      "ITサポート業者使用時",
    ];

    providers: {
      aws: { hasBaa: true; service: "クラウドストレージ" };
      azure: { hasBaa: true; service: "クラウドストレージ" };
      googleCloud: { hasBaa: true; service: "クラウドストレージ" };
      twilio: { hasBaa: true; service: "SMS通知" };
    };
  };

  obligations: {
    vendor: [
      "PHIの適切な保護",
      "セキュリティ違反の報告",
      "サブコントラクターとのBAA締結",
      "データ返還または破棄",
    ];

    covered: [
      "BAA締結の確認",
      "定期的なレビュー",
      "ベンダーの監督",
    ];
  };
}
```

## 🎯 実装パターンとベストプラクティス

### セキュリティ実装チェックリスト

```typescript
interface SecurityChecklist {
  gdpr: {
    privacy: [
      "✅ プライバシーポリシーの作成と公開",
      "✅ ユーザー同意管理システムの実装",
      "✅ データアクセス権の実装",
      "✅ データ削除権の実装",
      "✅ データポータビリティ機能の実装",
    ];

    security: [
      "✅ データ暗号化（保存時・転送時）",
      "✅ データ侵害通知プロトコルの確立",
      "✅ 処理活動の記録（ROPA）の作成",
      "✅ データ保護影響評価（DPIA）の実施",
    ];

    technical: [
      "✅ データ保存期間ポリシーの実装",
      "✅ サードパーティベンダーとのDPA締結",
      "✅ 従業員へのGDPRトレーニング",
    ];
  };

  hipaa: {
    privacy: [
      "✅ プライバシー通知の作成と配布",
      "✅ 患者の同意取得プロセスの実装",
      "✅ 患者のアクセス権の実装",
      "✅ PHIの最小必要量の原則の適用",
    ];

    administrative: [
      "✅ リスク評価の実施",
      "✅ セキュリティ責任者の指名",
      "✅ スタッフへのHIPAAトレーニング",
      "✅ インシデント対応計画の策定",
    ];

    physical: [
      "✅ デバイスセキュリティの確保",
      "✅ 自動ログアウトの実装",
      "✅ デバイス紛失時のリモートワイプ",
    ];

    technical: [
      "✅ 強力な認証の実装（MFAまたは生体認証）",
      "✅ データの暗号化（保存時・転送時）",
      "✅ 監査ログの実装",
      "✅ HTTPSの強制使用",
      "✅ セッション管理とタイムアウト",
    ];

    breach: [
      "✅ 違反検出メカニズムの実装",
      "✅ 違反通知プロセスの確立",
    ];

    baa: [
      "✅ すべてのビジネスアソシエイトとBAA締結",
      "✅ BAA契約の定期的な見直し",
    ];
  };
}
```

### 認証システムの実装

```typescript
interface AuthenticationSystem {
  passwordPolicy: {
    minLength: 12;
    complexity: {
      uppercase: true;
      lowercase: true;
      numbers: true;
      specialChars: true;
    };
    expiration: 90; // days
    history: 5; // 過去5つのパスワードを記憶
  };

  multiFactor: {
    methods: ["authenticator_app", "biometric"];
    requirement: "すべてのユーザーに必須";
    fallback: "リカバリーコード";
  };

  session: {
    timeout: 15; // minutes
    renewal: "アクティビティごと";
    storage: "SecureStore";
  };

  biometric: {
    supported: ["fingerprint", "faceId", "touchId"];
    fallback: "パスワード認証";
    security: "デバイスのセキュアエンクレーブ使用";
  };
}
```

**実装例**：

```typescript
// utils/authentication.ts
import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';
import * as Crypto from 'expo-crypto';

// パスワード検証
export function validatePassword(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 12) {
    errors.push('パスワードは12文字以上である必要があります');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('大文字を少なくとも1文字含める必要があります');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('小文字を少なくとも1文字含める必要があります');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('数字を少なくとも1文字含める必要があります');
  }
  if (!/[!@#$%^&*]/.test(password)) {
    errors.push('特殊文字を少なくとも1文字含める必要があります');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// 生体認証
export async function authenticateWithBiometrics(): Promise<boolean> {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  if (!hasHardware) return false;

  const isEnrolled = await LocalAuthentication.isEnrolledAsync();
  if (!isEnrolled) return false;

  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: '生体認証でログイン',
    fallbackLabel: 'パスワードを使用',
    disableDeviceFallback: false,
  });

  return result.success;
}

// セッション管理
export async function createSecureSession(userId: string): Promise<string> {
  const sessionToken = generateSecureToken();
  const sessionExpiry = Date.now() + 15 * 60 * 1000; // 15分

  await SecureStore.setItemAsync('sessionToken', sessionToken);
  await SecureStore.setItemAsync('sessionExpiry', sessionExpiry.toString());
  await SecureStore.setItemAsync('userId', userId);

  return sessionToken;
}

export async function validateSession(): Promise<boolean> {
  const sessionExpiry = await SecureStore.getItemAsync('sessionExpiry');
  if (!sessionExpiry) return false;

  return Date.now() < parseInt(sessionExpiry, 10);
}
```

### データ侵害対応プロトコル

```typescript
interface BreachResponse {
  detection: {
    monitoring: "自動監視システム";
    alerts: "異常なアクティビティの検出";
    validation: "インシデントの確認";
  };

  assessment: {
    timeline: "24時間以内";
    scope: [
      "影響を受けるデータの種類",
      "影響を受ける個人の数",
      "侵害の原因",
      "潜在的な影響",
    ];
    documentation: "インシデントレポート";
  };

  notification: {
    supervisory: {
      deadline: "72時間以内（GDPR）";
      method: "正式な報告書";
    };

    individuals: {
      deadline: "速やかに（高リスクの場合）";
      method: ["メール", "アプリ通知", "公開通知"];
      content: [
        "侵害の説明",
        "影響を受けるデータ",
        "推奨される対策",
        "連絡先",
      ];
    };

    hhs: {
      deadline: "60日以内";
      condition: "500人以上の場合は即座、500人未満は年次報告";
    };
  };

  mitigation: {
    immediate: [
      "侵害源の遮断",
      "脆弱性の修正",
      "パスワードのリセット",
      "アクセスログの確認",
    ];

    longTerm: [
      "セキュリティ監査",
      "システム強化",
      "スタッフトレーニング",
      "ポリシー更新",
    ];
  };
}
```

**実装例**：

```typescript
// utils/breachResponse.ts
interface BreachIncident {
  incidentId: string;
  discoveryDate: string;
  breachDate: string;
  affectedIndividuals: number;
  dataTypes: string[];
  breachDescription: string;
  mitigationActions: string[];
  notificationStatus: 'pending' | 'individuals_notified' | 'authority_reported' | 'complete';
}

export async function reportBreach(
  breach: Omit<BreachIncident, 'incidentId' | 'notificationStatus'>
): Promise<void> {
  const incident: BreachIncident = {
    ...breach,
    incidentId: generateIncidentId(),
    notificationStatus: 'pending',
  };

  // 1. 影響を受ける個人に通知
  await notifyAffectedIndividuals(incident);
  incident.notificationStatus = 'individuals_notified';

  // 2. 監督機関に報告（GDPR: 72時間以内）
  await reportToSupervisoryAuthority(incident);

  // 3. HHSに報告（HIPAA: 500人以上は60日以内）
  if (incident.affectedIndividuals >= 500) {
    await reportToHHS(incident);
  }

  incident.notificationStatus = 'authority_reported';

  // 4. インシデントログに記録
  await logBreachIncident(incident);

  incident.notificationStatus = 'complete';
}

async function notifyAffectedIndividuals(breach: BreachIncident): Promise<void> {
  const notification = `
    重要なお知らせ

    ${new Date(breach.discoveryDate).toLocaleDateString()}、セキュリティインシデントが発生し、
    あなたのデータが影響を受けた可能性があります。

    影響を受けたデータの種類:
    ${breach.dataTypes.map((type) => `• ${type}`).join('\n')}

    実施した対策:
    ${breach.mitigationActions.map((action) => `• ${action}`).join('\n')}

    推奨される対策:
    • パスワードを変更してください
    • 不正なアクティビティを監視してください
    • ご不明な点がございましたら、サポートまでご連絡ください
  `;

  await sendNotificationToUsers(breach.affectedIndividuals, notification);
}
```

## 🔗 関連リソース

### 内部リンク

- [data-and-privacy-protection.md](./regulatory-compliance/data-and-privacy-protection.md) - データとプライバシー保護詳細
- [gdpr.md](./regulatory-compliance/gdpr.md) - GDPR コンプライアンス詳細
- [hipaa.md](./regulatory-compliance/hipaa.md) - HIPAA コンプライアンス詳細

### 外部リンク

#### GDPR リソース

- [GDPR 公式規則](https://gdpr-info.eu/) - GDPR 全文テキスト
- [欧州委員会データ保護](https://ec.europa.eu/info/law/law-topic/data-protection_en) - 公式ガイダンス

#### HIPAA リソース

- [HHS HIPAA 公式サイト](https://www.hhs.gov/hipaa) - 米国保健福祉省
- [HIPAA Security Rule](https://www.hhs.gov/hipaa/for-professionals/security) - セキュリティ規則詳細

#### Expo リソース

- [Expo Privacy](https://expo.dev/privacy) - Expo のプライバシーポリシー
- [Expo Privacy Explained](https://expo.dev/privacy-explained) - プライバシーの詳細説明
- [Expo Security](https://docs.expo.dev/guides/security/) - セキュリティガイド

### 関連ドキュメント

- **[Accounts](./accounts.md)** - アカウント管理とセキュリティ
- **[EAS Build](../build/)** - ビルドセキュリティ設定
- **[Environment Variables](../environment-variables/)** - 機密情報の管理

## 📋 まとめ

Expo アプリにおける規制コンプライアンスは、ユーザーの信頼とデータ保護を確保するための重要な要素です：

```typescript
interface ComplianceSummary {
  foundations: {
    dataPrivacy: {
      principles: ["最小化", "透明性", "ユーザー制御", "セキュリティ"];
      implementation: ["同意管理", "暗号化", "ユーザー権利"];
    };

    gdpr: {
      scope: "EU/EEA ユーザー向けサービス";
      requirements: ["7つの原則", "ユーザー権利", "データ侵害通知"];
      penalties: "最大2,000万ユーロまたは売上高の4%";
    };

    hipaa: {
      scope: "米国の医療データ";
      requirements: ["3つの規則", "セーフガード", "BAA"];
      penalties: "民事罰最大$1,500,000、刑事罰最大10年";
      expoDisclaimer: "開発者の責任で実装";
    };
  };

  implementation: {
    security: [
      "強力な認証（パスワード、MFA、生体認証）",
      "データ暗号化（保存時・転送時）",
      "セキュアストレージ（SecureStore）",
      "HTTPS通信の強制",
    ];

    privacy: [
      "明確な同意管理システム",
      "ユーザー権利の実装（アクセス、削除、ポータビリティ）",
      "透明性の高いプライバシーポリシー",
      "データ最小化の原則",
    ];

    monitoring: [
      "包括的な監査ログ",
      "セキュリティ監視",
      "インシデント対応プロトコル",
      "定期的なセキュリティ評価",
    ];
  };

  bestPractices: [
    "プライバシー・バイ・デザインの原則を採用",
    "開発ビルドを使用（Expo Goは不十分）",
    "定期的なコンプライアンス監査",
    "法的専門家への相談",
    "継続的なスタッフトレーニング",
    "ビジネスアソシエイト契約の締結",
    "データ保護影響評価の実施",
  ];

  warnings: [
    "⚠️ 完全なコンプライアンスには専門家のレビューが不可欠",
    "⚠️ Expo Goは医療アプリには不十分（開発ビルド必須）",
    "⚠️ 規制は継続的に更新されるため、最新情報を確認",
    "⚠️ 法的助言ではありません - 専門家に相談してください",
  ];
}
```

このガイドを参考に、アプリの要件と対象地域に応じた適切なコンプライアンス対策を実装してください。
