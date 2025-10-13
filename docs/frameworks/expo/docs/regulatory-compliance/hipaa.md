# HIPAAコンプライアンス

Expoアプリで医療データを扱う際のHIPAA（医療保険の携行性と責任に関する法律）コンプライアンスについて学びます。

## HIPAAとは

**HIPAA（Health Insurance Portability and Accountability Act）**: 米国の連邦法で、患者の医療情報のプライバシーとセキュリティを保護します。

**適用範囲**:
- 医療提供者（病院、クリニック、医師）
- 健康保険会社
- 医療情報処理センター
- ビジネスアソシエイト（医療機関の代理で保護対象健康情報を扱う事業者）

**施行日**: 1996年制定、2003年プライバシー規則施行、2005年セキュリティ規則施行

**違反時の罰則**:
- 民事罰: 違反1件あたり100ドル〜50,000ドル、年間最大150万ドル
- 刑事罰: 最大10年の懲役と250,000ドルの罰金

## 重要な注意事項

**Expoの位置付け**:
- Expoは医療データを収集・保存・処理しません
- ExpoアプリがHIPAAに準拠できるかどうかは、開発者の実装次第です
- Expo自体はHIPAA準拠を保証しません

**開発者の責任**:
医療アプリを開発する際は、HIPAA要件を満たすための適切なセキュリティ対策とプライバシー保護を実装する必要があります。

## 保護対象健康情報（PHI）

### PHIの定義

**Protected Health Information (PHI)**: 個人を特定できる健康情報。

**PHIの例**:
- 氏名、住所、生年月日
- 医療記録番号
- 診断情報、治療記録
- 処方箋情報
- 検査結果
- 健康保険番号
- 医療画像（X線、MRIなど）
- 遺伝情報

**非PHIの例**:
- 匿名化された統計データ
- 個人を特定できない集計データ
- 公開されている健康情報

### PHIの識別子

HIPAA Safe Harborルールでは、以下の18の識別子を削除することでデータを匿名化できます：

```typescript
// utils/phiIdentifiers.ts
export const PHI_IDENTIFIERS = [
  '氏名',
  '地理的区分（州より小さい単位）',
  '日付（生年月日、入院日、退院日、死亡日など）',
  '電話番号',
  'FAX番号',
  'メールアドレス',
  '社会保障番号',
  '医療記録番号',
  '健康保険番号',
  '口座番号',
  '証明書/ライセンス番号',
  '車両識別番号とナンバープレート',
  '医療機器の識別番号とシリアル番号',
  'Webサイト URL',
  'IPアドレス',
  '生体識別子（指紋、声紋など）',
  '顔写真と同等の画像',
  'その他の一意の識別番号、特性、コード',
] as const;

export function removePHIIdentifiers(data: any): any {
  const sanitized = { ...data };

  // PHI識別子を削除
  delete sanitized.name;
  delete sanitized.address;
  delete sanitized.birthDate;
  delete sanitized.phoneNumber;
  delete sanitized.email;
  delete sanitized.ssn;
  delete sanitized.medicalRecordNumber;
  delete sanitized.insuranceNumber;
  delete sanitized.ipAddress;

  // 日付を年のみに変換
  if (sanitized.admissionDate) {
    sanitized.admissionYear = new Date(sanitized.admissionDate).getFullYear();
    delete sanitized.admissionDate;
  }

  return sanitized;
}
```

## HIPAAの3つの主要規則

### 1. プライバシー規則（Privacy Rule）

**目的**: PHIの使用と開示を制限し、患者の権利を保護します。

**主要要件**:
- PHIの最小必要量のみを使用・開示
- 患者の同意取得
- プライバシー通知の提供
- 患者のアクセス権の保証

**Expoアプリでの実装**:
```typescript
// screens/PrivacyNoticeScreen.tsx
import React from 'react';
import { View, Text, ScrollView, Button, StyleSheet } from 'react-native';

export function HIPAAPrivacyNoticeScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>プライバシー実施規則の通知</Text>

      <Text style={styles.section}>本通知では、あなたの医療情報がどのように使用・開示されるか、
およびこの情報へのアクセス方法について説明します。</Text>

      <Text style={styles.heading}>私たちがあなたの健康情報を使用・開示する方法</Text>

      <Text style={styles.subheading}>治療目的</Text>
      <Text style={styles.content}>
        医療提供者間で情報を共有し、適切な治療を提供します。
      </Text>

      <Text style={styles.subheading}>支払い目的</Text>
      <Text style={styles.content}>
        保険請求の処理と支払いの確認に使用します。
      </Text>

      <Text style={styles.subheading}>医療業務</Text>
      <Text style={styles.content}>
        医療の質の向上、スタッフの教育、業務改善に使用します。
      </Text>

      <Text style={styles.heading}>あなたの権利</Text>
      <Text style={styles.content}>
        • 健康情報へのアクセス{'\n'}
        • 健康情報の訂正{'\n'}
        • 開示の会計報告{'\n'}
        • 代替通信の要求{'\n'}
        • 使用・開示の制限要求{'\n'}
        • プライバシー通知のコピー{'\n'}
        • 苦情を申し立てる権利
      </Text>

      <Button title="同意する" onPress={() => console.log('Privacy notice accepted')} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  section: { fontSize: 14, marginBottom: 16, lineHeight: 20 },
  heading: { fontSize: 18, fontWeight: '600', marginTop: 16, marginBottom: 8 },
  subheading: { fontSize: 16, fontWeight: '600', marginTop: 12, marginBottom: 4 },
  content: { fontSize: 14, lineHeight: 20, marginBottom: 8 },
});
```

### 2. セキュリティ規則（Security Rule）

**目的**: 電子PHI（ePHI）を保護するための技術的・物理的・管理的セーフガードを要求します。

**3つのセーフガード**:

#### 管理的セーフガード（Administrative Safeguards）

```typescript
// utils/administrativeSafeguards.ts
interface SecurityPolicy {
  riskAssessment: boolean;
  securityOfficer: string;
  workforceTraining: boolean;
  incidentResponse: boolean;
  contingencyPlan: boolean;
}

export const securityPolicy: SecurityPolicy = {
  riskAssessment: true, // リスク評価の実施
  securityOfficer: 'security@example.com', // セキュリティ責任者の指名
  workforceTraining: true, // スタッフへのHIPAAトレーニング
  incidentResponse: true, // インシデント対応計画
  contingencyPlan: true, // 緊急時対応計画
};

// アクセスログの記録
interface AccessLog {
  userId: string;
  action: 'read' | 'write' | 'delete' | 'export';
  phiType: string;
  timestamp: string;
  ipAddress: string;
}

export async function logPHIAccess(log: Omit<AccessLog, 'timestamp'>): Promise<void> {
  const accessLog: AccessLog = {
    ...log,
    timestamp: new Date().toISOString(),
  };

  // セキュアなログサーバーに送信
  await api.logAccess(accessLog);
}
```

#### 物理的セーフガード（Physical Safeguards）

```typescript
// utils/physicalSafeguards.ts

// デバイスのセキュリティチェック
export async function checkDeviceSecurity(): Promise<{
  isSecure: boolean;
  issues: string[];
}> {
  const issues: string[] = [];

  // デバイスがルート化/ジェイルブレイクされていないか確認
  const isJailbroken = await checkJailbreak();
  if (isJailbroken) {
    issues.push('デバイスがルート化/ジェイルブレイクされています');
  }

  // 画面ロックが有効か確認
  const hasScreenLock = await checkScreenLock();
  if (!hasScreenLock) {
    issues.push('画面ロックが設定されていません');
  }

  // 暗号化が有効か確認
  const isEncrypted = await checkDeviceEncryption();
  if (!isEncrypted) {
    issues.push('デバイスの暗号化が有効になっていません');
  }

  return {
    isSecure: issues.length === 0,
    issues,
  };
}

// 自動ログアウト
export function setupAutoLogout(timeoutMinutes: number = 15): void {
  let timeoutId: NodeJS.Timeout;

  const resetTimeout = () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      // ユーザーをログアウト
      logout();
      Alert.alert('セッションタイムアウト', 'セキュリティのため自動的にログアウトしました');
    }, timeoutMinutes * 60 * 1000);
  };

  // ユーザーのアクティビティを監視
  resetTimeout();
  // アクティビティがあればタイマーをリセット
  // （実際の実装では、タッチイベントなどを監視）
}
```

#### 技術的セーフガード（Technical Safeguards）

```typescript
// utils/technicalSafeguards.ts
import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';

// 1. アクセス制御
export async function authenticateUser(username: string, password: string): Promise<boolean> {
  try {
    const hashedPassword = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      password
    );

    const response = await api.login(username, hashedPassword);
    if (response.success) {
      await SecureStore.setItemAsync('authToken', response.token);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Authentication failed:', error);
    return false;
  }
}

// 2. 監査制御（アクセスログ）
export async function auditPHIAccess(
  userId: string,
  action: string,
  phiId: string
): Promise<void> {
  await api.logAudit({
    userId,
    action,
    phiId,
    timestamp: new Date().toISOString(),
    ipAddress: await getDeviceIPAddress(),
  });
}

// 3. 完全性管理（データの改ざん防止）
export async function verifyDataIntegrity(data: any): Promise<boolean> {
  const dataString = JSON.stringify(data);
  const checksum = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    dataString
  );

  // サーバー側のチェックサムと比較
  const serverChecksum = await api.getDataChecksum(data.id);
  return checksum === serverChecksum;
}

// 4. 送信セキュリティ（暗号化通信）
export async function secureFetch(url: string, options: RequestInit): Promise<Response> {
  // HTTPSのみ許可
  if (!url.startsWith('https://')) {
    throw new Error('HIPAA準拠のため、HTTPSを使用する必要があります');
  }

  // 認証トークンを追加
  const token = await SecureStore.getItemAsync('authToken');
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  return fetch(url, { ...options, headers });
}
```

### 3. 違反通知規則（Breach Notification Rule）

**目的**: PHIの違反が発生した場合の通知義務を定めます。

**通知要件**:
- 影響を受ける個人への通知（60日以内）
- HHS（保健福祉省）への報告
- メディアへの通知（500人以上の場合）

**Expoアプリでの実装**:
```typescript
// utils/breachNotification.ts
interface BreachIncident {
  incidentId: string;
  discoveryDate: string;
  breachDate: string;
  affectedIndividuals: number;
  phiTypes: string[];
  breachDescription: string;
  mitigationActions: string[];
  notificationStatus: 'pending' | 'individuals_notified' | 'hhs_reported' | 'media_notified' | 'complete';
}

export async function reportBreach(
  breach: Omit<BreachIncident, 'incidentId' | 'notificationStatus'>
): Promise<void> {
  const incident: BreachIncident = {
    ...breach,
    incidentId: generateIncidentId(),
    notificationStatus: 'pending',
  };

  // 1. 影響を受ける個人に通知（60日以内）
  await notifyAffectedIndividuals(incident);
  incident.notificationStatus = 'individuals_notified';

  // 2. HHSに報告
  if (incident.affectedIndividuals >= 500) {
    // 500人以上の場合は60日以内に報告
    await reportToHHS(incident);
    incident.notificationStatus = 'hhs_reported';
  } else {
    // 500人未満の場合は年次報告
    await scheduleAnnualHHSReport(incident);
  }

  // 3. メディアに通知（500人以上の場合）
  if (incident.affectedIndividuals >= 500) {
    await notifyMedia(incident);
    incident.notificationStatus = 'media_notified';
  }

  incident.notificationStatus = 'complete';
  await logBreachIncident(incident);
}

async function notifyAffectedIndividuals(breach: BreachIncident): Promise<void> {
  const notification = `
    重要なお知らせ

    ${new Date(breach.discoveryDate).toLocaleDateString()}、当社のシステムでセキュリティインシデントが発生し、
    あなたの保護対象健康情報（PHI）が影響を受けた可能性があります。

    インシデントID: ${breach.incidentId}
    発生日: ${new Date(breach.breachDate).toLocaleDateString()}

    影響を受けた情報の種類:
    ${breach.phiTypes.map((type) => `• ${type}`).join('\n')}

    実施した対策:
    ${breach.mitigationActions.map((action) => `• ${action}`).join('\n')}

    あなたができること:
    • 医療記録を確認してください
    • 不正なアクティビティを監視してください
    • 信用監視サービスの利用を検討してください

    お問い合わせ:
    ご質問やご不明な点がございましたら、privacy@example.comまでご連絡ください。

    心からお詫び申し上げます。
  `;

  await sendNotificationToUsers(breach.affectedIndividuals, notification);
}
```

## ビジネスアソシエイト契約（BAA）

### BAAとは

**Business Associate Agreement (BAA)**: 医療機関とビジネスアソシエイト（PHIを扱う第三者）の間で締結される契約。

**必要な場合**:
- クラウドストレージプロバイダー（AWS、Google Cloud、Azureなど）
- アナリティクスプロバイダー
- 決済処理業者
- IT サポート業者

### BAA要件チェックリスト

```typescript
// utils/baaCompliance.ts
interface BusinessAssociate {
  name: string;
  service: string;
  hasBaa: boolean;
  baaSignedDate?: string;
  baaExpiryDate?: string;
  phiAccessLevel: 'full' | 'limited' | 'none';
}

export const businessAssociates: BusinessAssociate[] = [
  {
    name: 'AWS',
    service: 'クラウドストレージ',
    hasBaa: true,
    baaSignedDate: '2024-01-01',
    baaExpiryDate: '2025-01-01',
    phiAccessLevel: 'full',
  },
  {
    name: 'Twilio',
    service: 'SMS通知',
    hasBaa: true,
    baaSignedDate: '2024-01-01',
    baaExpiryDate: '2025-01-01',
    phiAccessLevel: 'limited',
  },
  // 他のビジネスアソシエイトを追加
];

export function verifyBaaCompliance(): {
  compliant: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  for (const ba of businessAssociates) {
    if (ba.phiAccessLevel !== 'none' && !ba.hasBaa) {
      issues.push(`${ba.name}とのBAA契約が必要です`);
    }

    if (ba.baaExpiryDate && new Date(ba.baaExpiryDate) < new Date()) {
      issues.push(`${ba.name}のBAA契約が期限切れです`);
    }
  }

  return {
    compliant: issues.length === 0,
    issues,
  };
}
```

## ExpoアプリでのHIPAA準拠実装

### 1. 認証と認可

```typescript
// utils/hipaaAuth.ts
import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';

// 強力なパスワードポリシー
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
  if (!hasHardware) {
    return false;
  }

  const isEnrolled = await LocalAuthentication.isEnrolledAsync();
  if (!isEnrolled) {
    return false;
  }

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

### 2. データ暗号化

```typescript
// utils/hipaaEncryption.ts
import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';

// AES-256暗号化（保存時の暗号化）
export async function encryptPHI(phi: string): Promise<string> {
  // Expo Cryptoを使用した暗号化
  const encrypted = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    phi
  );
  return encrypted;
}

// SecureStoreでPHIを保存
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

  // TLS 1.2以上を確保（Expo/React Nativeはデフォルトでサポート）
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

### 3. 監査ログ

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

  // セキュアなログサーバーに送信（改ざん防止）
  await api.logAudit(auditLog);

  // ローカルにもバックアップ（最大7日間）
  await storeLocalAuditLog(auditLog);
}

// 監査ログの検索
export async function searchAuditLogs(criteria: {
  userId?: string;
  startDate: Date;
  endDate: Date;
  action?: string;
}): Promise<HIPAAAuditLog[]> {
  return await api.searchAuditLogs(criteria);
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

### 4. 患者のアクセス権

```typescript
// screens/PatientPortalScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export function PatientPortalScreen({ patientId }: { patientId: string }) {
  const [medicalRecords, setMedicalRecords] = useState([]);

  useEffect(() => {
    loadMedicalRecords();
  }, []);

  const loadMedicalRecords = async () => {
    const records = await api.getPatientRecords(patientId);
    setMedicalRecords(records);
  };

  // 患者による医療記録へのアクセス
  const viewRecord = async (recordId: string) => {
    const record = await api.getRecordDetails(recordId);
    navigation.navigate('RecordDetails', { record });

    // アクセスをログ
    await logHIPAAActivity({
      userId: patientId,
      userRole: 'patient',
      action: 'read',
      resource: `medical_record_${recordId}`,
      phiType: 'medical_record',
      accessResult: 'success',
    });
  };

  // 医療記録のエクスポート
  const exportRecords = async () => {
    try {
      const records = await api.getAllPatientRecords(patientId);
      const exportData = JSON.stringify(records, null, 2);

      const fileUri = `${FileSystem.documentDirectory}medical_records.json`;
      await FileSystem.writeAsStringAsync(fileUri, exportData);

      await Sharing.shareAsync(fileUri);

      // エクスポートをログ
      await logHIPAAActivity({
        userId: patientId,
        userRole: 'patient',
        action: 'export',
        resource: 'all_medical_records',
        phiType: 'medical_record',
        accessResult: 'success',
      });

      Alert.alert('成功', '医療記録がエクスポートされました');
    } catch (error) {
      Alert.alert('エラー', 'エクスポートに失敗しました');
    }
  };

  // 医療記録の修正要求
  const requestCorrection = async (recordId: string) => {
    navigation.navigate('RequestCorrection', { recordId });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>あなたの医療記録</Text>

      <FlatList
        data={medicalRecords}
        renderItem={({ item }) => (
          <View style={styles.recordItem}>
            <Text style={styles.recordTitle}>{item.title}</Text>
            <Text style={styles.recordDate}>{new Date(item.date).toLocaleDateString()}</Text>
            <Button title="詳細を表示" onPress={() => viewRecord(item.id)} />
            <Button title="修正を要求" onPress={() => requestCorrection(item.id)} />
          </View>
        )}
        keyExtractor={(item) => item.id}
      />

      <Button title="すべての記録をエクスポート" onPress={exportRecords} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  recordItem: { padding: 16, backgroundColor: '#f5f5f5', marginBottom: 12, borderRadius: 8 },
  recordTitle: { fontSize: 16, fontWeight: '600' },
  recordDate: { fontSize: 14, color: '#666', marginVertical: 8 },
});
```

## HIPAAコンプライアンスチェックリスト

```typescript
// utils/hipaaChecklist.ts
interface HIPAAChecklistItem {
  category: string;
  item: string;
  completed: boolean;
  priority: 'critical' | 'high' | 'medium';
}

export const hipaaComplianceChecklist: HIPAAChecklistItem[] = [
  // プライバシー規則
  { category: 'プライバシー', item: 'プライバシー通知の作成と配布', completed: false, priority: 'critical' },
  { category: 'プライバシー', item: '患者の同意取得プロセスの実装', completed: false, priority: 'critical' },
  { category: 'プライバシー', item: '患者のアクセス権の実装', completed: false, priority: 'critical' },
  { category: 'プライバシー', item: 'PHIの最小必要量の原則の適用', completed: false, priority: 'high' },

  // セキュリティ規則 - 管理的
  { category: 'セキュリティ - 管理', item: 'リスク評価の実施', completed: false, priority: 'critical' },
  { category: 'セキュリティ - 管理', item: 'セキュリティ責任者の指名', completed: false, priority: 'critical' },
  { category: 'セキュリティ - 管理', item: 'スタッフへのHIPAAトレーニング', completed: false, priority: 'high' },
  { category: 'セキュリティ - 管理', item: 'インシデント対応計画の策定', completed: false, priority: 'high' },

  // セキュリティ規則 - 物理的
  { category: 'セキュリティ - 物理', item: 'デバイスセキュリティの確保', completed: false, priority: 'critical' },
  { category: 'セキュリティ - 物理', item: '自動ログアウトの実装', completed: false, priority: 'high' },
  { category: 'セキュリティ - 物理', item: 'デバイス紛失時のリモートワイプ', completed: false, priority: 'high' },

  // セキュリティ規則 - 技術的
  { category: 'セキュリティ - 技術', item: '強力な認証の実装（MFAまたは生体認証）', completed: false, priority: 'critical' },
  { category: 'セキュリティ - 技術', item: 'データの暗号化（保存時・転送時）', completed: false, priority: 'critical' },
  { category: 'セキュリティ - 技術', item: '監査ログの実装', completed: false, priority: 'critical' },
  { category: 'セキュリティ - 技術', item: 'HTTPSの強制使用', completed: false, priority: 'critical' },
  { category: 'セキュリティ - 技術', item: 'セッション管理とタイムアウト', completed: false, priority: 'high' },

  // 違反通知規則
  { category: '違反通知', item: '違反検出メカニズムの実装', completed: false, priority: 'critical' },
  { category: '違反通知', item: '違反通知プロセスの確立', completed: false, priority: 'critical' },

  // ビジネスアソシエイト契約
  { category: 'BAA', item: 'すべてのビジネスアソシエイトとBAA締結', completed: false, priority: 'critical' },
  { category: 'BAA', item: 'BAA契約の定期的な見直し', completed: false, priority: 'medium' },
];

export function getComplianceStatus(): {
  total: number;
  completed: number;
  percentage: number;
  criticalPending: number;
} {
  const total = hipaaComplianceChecklist.length;
  const completed = hipaaComplianceChecklist.filter((item) => item.completed).length;
  const criticalPending = hipaaComplianceChecklist.filter(
    (item) => item.priority === 'critical' && !item.completed
  ).length;

  return {
    total,
    completed,
    percentage: Math.round((completed / total) * 100),
    criticalPending,
  };
}
```

## トラブルシューティング

### 問題1: セキュアストレージが機能しない

**症状**: `expo-secure-store` でデータを保存できない

**解決策**:
```bash
# パッケージを再インストール
npm install expo-secure-store

# 開発ビルドが必要
npx expo prebuild
npx expo run:ios
npx expo run:android
```

**注意**: Expo Goでは SecureStore の機能が制限されます。医療アプリには開発ビルドが必須です。

### 問題2: HTTPS接続が失敗する

**症状**: HTTPSリクエストがタイムアウトまたは失敗する

**解決策**:
```typescript
// app.jsonでネットワークセキュリティを設定（Android）
{
  "expo": {
    "android": {
      "usesCleartextTraffic": false,  // HTTPを無効化
      "networkSecurityConfig": "./network_security_config.xml"
    }
  }
}
```

```xml
<!-- android/app/src/main/res/xml/network_security_config.xml -->
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
  <base-config cleartextTrafficPermitted="false">
    <trust-anchors>
      <certificates src="system" />
    </trust-anchors>
  </base-config>
</network-security-config>
```

### 問題3: 監査ログが膨大になる

**症状**: 監査ログのストレージが急速に増加する

**解決策**:
```typescript
// ログのローテーション戦略
export async function rotateAuditLogs(): Promise<void> {
  const retention = 7 * 24 * 60 * 60 * 1000; // 7日間
  const logs = await getLocalAuditLogs();

  const outdatedLogs = logs.filter(
    (log) => Date.now() - new Date(log.timestamp).getTime() > retention
  );

  // 古いログをサーバーにアーカイブ
  await api.archiveAuditLogs(outdatedLogs);

  // ローカルから削除
  await deleteLocalAuditLogs(outdatedLogs.map((log) => log.id));
}
```

## 参考リンク

- **HHS HIPAA公式サイト**: [https://www.hhs.gov/hipaa](https://www.hhs.gov/hipaa)
- **HIPAA Security Rule**: [https://www.hhs.gov/hipaa/for-professionals/security](https://www.hhs.gov/hipaa/for-professionals/security)
- **Expo Security**: [https://docs.expo.dev/guides/security/](https://docs.expo.dev/guides/security/)

## まとめ

ExpoアプリでHIPAAに準拠するには、包括的なセキュリティとプライバシー対策が必要です：

### 主要要件
- **プライバシー規則**: PHIの最小使用、患者の同意、プライバシー通知
- **セキュリティ規則**: 管理的・物理的・技術的セーフガード
- **違反通知規則**: 60日以内の通知義務

### 技術的実装
- 強力な認証（パスワードポリシー、MFA、生体認証）
- データ暗号化（保存時・転送時、AES-256、HTTPS）
- 包括的な監査ログ（すべてのPHIアクセスを記録）
- セキュアなセッション管理（自動ログアウト、タイムアウト）

### ベストプラクティス
- 開発ビルドを使用（Expo Goは不十分）
- ビジネスアソシエイト契約（BAA）の締結
- 定期的なリスク評価とセキュリティ監査
- スタッフへのHIPAAトレーニング
- インシデント対応計画の策定

### 重要な注意事項
Expoは医療データを収集・処理しないため、HIPAA準拠の責任は開発者にあります。医療アプリを開発する際は、法的専門家やHIPAAコンプライアンス専門家に相談することを強くお勧めします。

これらの要件とベストプラクティスに従うことで、ExpoアプリをHIPAA準拠に近づけることができますが、完全なコンプライアンスには専門家のレビューと継続的な監視が不可欠です。
