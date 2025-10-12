# GDPRコンプライアンス

ExpoアプリでEU一般データ保護規則（GDPR）に準拠する方法を学びます。

## GDPRとは

**GDPR（General Data Protection Regulation）**: 欧州連合（EU）および欧州経済領域（EEA）内の個人データの保護とプライバシーを規定する包括的なデータ保護法。

**適用範囲**:
- EU/EEA内のユーザーに商品やサービスを提供する組織
- EU/EEA内のユーザーの行動を監視する組織
- EU/EEA内に拠点を持つ組織

**施行日**: 2018年5月25日

**違反時の罰則**: 最大2,000万ユーロまたは全世界年間売上高の4%のいずれか高い方

## GDPRの主要原則

### 1. 適法性、公正性、透明性

**原則**: 個人データの処理は、適法、公正、かつ透明な方法で行われなければならない。

**Expoアプリでの実装**:
```typescript
// components/PrivacyNotice.tsx
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

export function PrivacyNotice() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>プライバシー通知</Text>

      <Text style={styles.section}>当社のデータ収集方法</Text>
      <Text style={styles.content}>
        • 収集するデータの種類（メールアドレス、使用状況データなど）{'\n'}
        • データの使用目的{'\n'}
        • データの保存期間{'\n'}
        • データの共有先
      </Text>

      <Text style={styles.section}>法的根拠</Text>
      <Text style={styles.content}>
        • 同意（Consent）{'\n'}
        • 契約の履行（Contract Performance）{'\n'}
        • 法的義務（Legal Obligation）{'\n'}
        • 正当な利益（Legitimate Interest）
      </Text>

      <Text style={styles.section}>あなたの権利</Text>
      <Text style={styles.content}>
        • アクセス権（Right to Access）{'\n'}
        • 訂正権（Right to Rectification）{'\n'}
        • 削除権（Right to Erasure）{'\n'}
        • データポータビリティ権（Right to Data Portability）{'\n'}
        • 処理の制限権（Right to Restrict Processing）{'\n'}
        • 異議申立権（Right to Object）
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  section: { fontSize: 18, fontWeight: '600', marginTop: 16, marginBottom: 8 },
  content: { fontSize: 14, lineHeight: 22, color: '#666' },
});
```

### 2. 目的の制限

**原則**: 個人データは、特定、明示的、正当な目的のためにのみ収集される。

**Expoアプリでの実装**:
```typescript
// utils/dataPurpose.ts
export enum DataPurpose {
  ACCOUNT_MANAGEMENT = 'account_management',
  SERVICE_IMPROVEMENT = 'service_improvement',
  MARKETING = 'marketing',
  ANALYTICS = 'analytics',
  LEGAL_COMPLIANCE = 'legal_compliance',
}

interface DataCollectionConfig {
  purpose: DataPurpose[];
  retention: number; // days
  description: string;
}

export const dataCollectionPolicy: Record<string, DataCollectionConfig> = {
  email: {
    purpose: [DataPurpose.ACCOUNT_MANAGEMENT, DataPurpose.MARKETING],
    retention: 365,
    description: 'アカウント管理とマーケティング通信に使用',
  },
  usageData: {
    purpose: [DataPurpose.SERVICE_IMPROVEMENT, DataPurpose.ANALYTICS],
    retention: 90,
    description: 'サービス改善とアプリ分析に使用',
  },
  crashReports: {
    purpose: [DataPurpose.SERVICE_IMPROVEMENT],
    retention: 30,
    description: 'アプリの安定性向上に使用',
  },
};
```

### 3. データ最小化

**原則**: 処理目的に必要な範囲内で、適切、関連性があり、必要最小限のデータのみを収集する。

**Expoアプリでの実装**:
```typescript
// utils/dataMinimization.ts
interface UserProfile {
  id: string;
  email: string;
  createdAt: string;
}

interface AnalyticsEvent {
  eventName: string;
  timestamp: string;
  anonymousUserId: string; // 実際のユーザーIDではなく匿名ID
  // 個人を特定できる情報は含まない
}

// ❌ 悪い例：不要なデータを収集
interface BadUserProfile {
  id: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  dateOfBirth: string;
  address: string;
  socialSecurityNumber: string; // 絶対に収集してはいけない
}

// ✅ 良い例：必要最小限のデータ
export async function createUserAccount(email: string): Promise<UserProfile> {
  return {
    id: generateUserId(),
    email,
    createdAt: new Date().toISOString(),
  };
}

// アナリティクスには匿名データのみ送信
export async function trackEvent(eventName: string): Promise<void> {
  const event: AnalyticsEvent = {
    eventName,
    timestamp: new Date().toISOString(),
    anonymousUserId: await getAnonymousUserId(),
  };
  await sendAnalytics(event);
}
```

### 4. 正確性

**原則**: 個人データは正確で、必要に応じて最新の状態に保たれなければならない。

**Expoアプリでの実装**:
```typescript
// screens/ProfileEditScreen.tsx
import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';

export function ProfileEditScreen() {
  const [email, setEmail] = useState('user@example.com');
  const [isUpdating, setIsUpdating] = useState(false);

  const updateProfile = async () => {
    setIsUpdating(true);
    try {
      await api.updateUserProfile({ email });
      Alert.alert('成功', 'プロフィールが更新されました');
    } catch (error) {
      Alert.alert('エラー', 'プロフィールの更新に失敗しました');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="メールアドレス"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Button
        title="プロフィールを更新"
        onPress={updateProfile}
        disabled={isUpdating}
      />
    </View>
  );
}
```

### 5. 保存期間の制限

**原則**: 個人データは、処理目的に必要な期間のみ保存される。

**Expoアプリでの実装**:
```typescript
// utils/dataRetention.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

interface DataRetentionPolicy {
  key: string;
  retentionDays: number;
  createdAt: string;
}

export async function storeDataWithRetention(
  key: string,
  value: string,
  retentionDays: number
): Promise<void> {
  const policy: DataRetentionPolicy = {
    key,
    retentionDays,
    createdAt: new Date().toISOString(),
  };

  await AsyncStorage.setItem(key, value);
  await AsyncStorage.setItem(`${key}_policy`, JSON.stringify(policy));
}

export async function cleanupExpiredData(): Promise<void> {
  const keys = await AsyncStorage.getAllKeys();
  const policyKeys = keys.filter((key) => key.endsWith('_policy'));

  for (const policyKey of policyKeys) {
    const policyJson = await AsyncStorage.getItem(policyKey);
    if (!policyJson) continue;

    const policy: DataRetentionPolicy = JSON.parse(policyJson);
    const createdDate = new Date(policy.createdAt);
    const expiryDate = new Date(createdDate.getTime() + policy.retentionDays * 24 * 60 * 60 * 1000);

    if (new Date() > expiryDate) {
      await AsyncStorage.removeItem(policy.key);
      await AsyncStorage.removeItem(policyKey);
      console.log(`Deleted expired data: ${policy.key}`);
    }
  }
}

// アプリ起動時にクリーンアップを実行
export function setupDataRetention(): void {
  cleanupExpiredData();
  // 毎日クリーンアップを実行
  setInterval(cleanupExpiredData, 24 * 60 * 60 * 1000);
}
```

### 6. 完全性と機密性

**原則**: 個人データは、適切な技術的・組織的措置によって保護される。

**Expoアプリでの実装**:
```typescript
// utils/secureDataHandling.ts
import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';

// 機密データの安全な保存
export async function storeSecureData(key: string, value: string): Promise<void> {
  await SecureStore.setItemAsync(key, value);
}

export async function getSecureData(key: string): Promise<string | null> {
  return await SecureStore.getItemAsync(key);
}

// データの暗号化
export async function encryptData(data: string): Promise<string> {
  const hash = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    data
  );
  return hash;
}

// 通信の暗号化（HTTPSの使用）
export async function secureFetch(url: string, options: RequestInit): Promise<Response> {
  if (!url.startsWith('https://')) {
    throw new Error('すべてのリクエストはHTTPSを使用する必要があります');
  }
  return fetch(url, options);
}
```

### 7. 説明責任

**原則**: データ管理者は、GDPRの原則を遵守していることを証明できなければならない。

**Expoアプリでの実装**:
```typescript
// utils/auditLog.ts
interface AuditLogEntry {
  timestamp: string;
  action: string;
  userId: string;
  dataType: string;
  purpose: string;
  legalBasis: string;
}

export async function logDataProcessing(entry: Omit<AuditLogEntry, 'timestamp'>): Promise<void> {
  const auditEntry: AuditLogEntry = {
    ...entry,
    timestamp: new Date().toISOString(),
  };

  // 監査ログをサーバーに送信
  await fetch('https://api.example.com/audit-log', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(auditEntry),
  });
}

// 使用例
export async function collectUserEmail(userId: string, email: string): Promise<void> {
  await logDataProcessing({
    action: 'collect_email',
    userId,
    dataType: 'email',
    purpose: 'account_management',
    legalBasis: 'consent',
  });

  await storeUserEmail(userId, email);
}
```

## ユーザーの権利の実装

### 1. アクセス権（Right to Access）

ユーザーは、自分のデータのコピーを要求する権利があります。

```typescript
// api/userDataExport.ts
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export async function exportUserData(userId: string): Promise<void> {
  // すべてのユーザーデータを取得
  const userData = await api.getUserData(userId);
  const userActivity = await api.getUserActivity(userId);
  const userPreferences = await api.getUserPreferences(userId);

  const exportData = {
    personalData: userData,
    activityHistory: userActivity,
    preferences: userPreferences,
    exportDate: new Date().toISOString(),
    format: 'JSON',
  };

  // ファイルに書き込み
  const fileUri = `${FileSystem.documentDirectory}user_data_export.json`;
  await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(exportData, null, 2));

  // ユーザーとファイルを共有
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(fileUri);
  }
}
```

### 2. 訂正権（Right to Rectification）

ユーザーは、不正確なデータの訂正を要求する権利があります。

```typescript
// screens/DataCorrectionScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

export function DataCorrectionScreen() {
  const [userData, setUserData] = useState({
    email: '',
    name: '',
    phone: '',
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const data = await api.getUserProfile();
    setUserData(data);
  };

  const updateUserData = async () => {
    try {
      await api.updateUserProfile(userData);
      Alert.alert('成功', 'データが更新されました');
    } catch (error) {
      Alert.alert('エラー', 'データの更新に失敗しました');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>データの訂正</Text>

      <Text style={styles.label}>メールアドレス</Text>
      <TextInput
        style={styles.input}
        value={userData.email}
        onChangeText={(email) => setUserData({ ...userData, email })}
        keyboardType="email-address"
      />

      <Text style={styles.label}>名前</Text>
      <TextInput
        style={styles.input}
        value={userData.name}
        onChangeText={(name) => setUserData({ ...userData, name })}
      />

      <Button title="更新" onPress={updateUserData} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  label: { fontSize: 16, marginTop: 12, marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 4 },
});
```

### 3. 削除権（Right to Erasure / Right to be Forgotten）

ユーザーは、自分のデータの削除を要求する権利があります。

```typescript
// api/accountDeletion.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

export async function deleteUserAccount(userId: string): Promise<void> {
  try {
    // 1. サーバー上のデータを削除
    await api.deleteUserAccount(userId);

    // 2. ローカルストレージのデータを削除
    await AsyncStorage.clear();

    // 3. セキュアストレージのデータを削除
    const secureKeys = ['authToken', 'refreshToken', 'userProfile'];
    for (const key of secureKeys) {
      await SecureStore.deleteItemAsync(key);
    }

    // 4. 削除の監査ログを記録
    await logDataProcessing({
      action: 'delete_account',
      userId,
      dataType: 'all_user_data',
      purpose: 'user_request',
      legalBasis: 'right_to_erasure',
    });

    console.log('User account deleted successfully');
  } catch (error) {
    console.error('Failed to delete user account:', error);
    throw error;
  }
}

// 削除確認UI
export function DeleteAccountButton() {
  const handleDeleteAccount = () => {
    Alert.alert(
      'アカウントの削除',
      'この操作は取り消せません。すべてのデータが完全に削除されます。本当に削除しますか？',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '削除',
          style: 'destructive',
          onPress: async () => {
            await deleteUserAccount(currentUserId);
            navigation.navigate('Welcome');
          },
        },
      ]
    );
  };

  return (
    <Button
      title="アカウントを削除"
      onPress={handleDeleteAccount}
      color="red"
    />
  );
}
```

### 4. データポータビリティ権（Right to Data Portability）

ユーザーは、自分のデータを機械可読形式で受け取る権利があります。

```typescript
// utils/dataPortability.ts
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

interface PortableUserData {
  personalInformation: {
    email: string;
    name: string;
    registrationDate: string;
  };
  activityHistory: Array<{
    action: string;
    timestamp: string;
    details: any;
  }>;
  preferences: {
    notifications: boolean;
    language: string;
    theme: string;
  };
  metadata: {
    exportDate: string;
    dataFormat: string;
    version: string;
  };
}

export async function exportDataInMachineReadableFormat(
  userId: string,
  format: 'json' | 'csv' | 'xml' = 'json'
): Promise<void> {
  const userData = await api.getUserData(userId);

  const portableData: PortableUserData = {
    personalInformation: userData.profile,
    activityHistory: userData.activity,
    preferences: userData.preferences,
    metadata: {
      exportDate: new Date().toISOString(),
      dataFormat: format.toUpperCase(),
      version: '1.0',
    },
  };

  let fileContent: string;
  let fileName: string;

  switch (format) {
    case 'json':
      fileContent = JSON.stringify(portableData, null, 2);
      fileName = 'user_data.json';
      break;
    case 'csv':
      fileContent = convertToCSV(portableData);
      fileName = 'user_data.csv';
      break;
    case 'xml':
      fileContent = convertToXML(portableData);
      fileName = 'user_data.xml';
      break;
  }

  const fileUri = `${FileSystem.documentDirectory}${fileName}`;
  await FileSystem.writeAsStringAsync(fileUri, fileContent);

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(fileUri);
  }
}
```

### 5. 処理の制限権（Right to Restrict Processing）

ユーザーは、特定の状況下でデータ処理の制限を要求する権利があります。

```typescript
// utils/processingRestriction.ts
interface ProcessingRestriction {
  userId: string;
  restrictedDataTypes: string[];
  reason: string;
  startDate: string;
  endDate?: string;
}

export async function restrictDataProcessing(
  userId: string,
  dataTypes: string[],
  reason: string
): Promise<void> {
  const restriction: ProcessingRestriction = {
    userId,
    restrictedDataTypes: dataTypes,
    reason,
    startDate: new Date().toISOString(),
  };

  await api.setProcessingRestriction(restriction);
  await AsyncStorage.setItem(`processing_restriction_${userId}`, JSON.stringify(restriction));
}

export async function isProcessingRestricted(
  userId: string,
  dataType: string
): Promise<boolean> {
  const restrictionJson = await AsyncStorage.getItem(`processing_restriction_${userId}`);
  if (!restrictionJson) return false;

  const restriction: ProcessingRestriction = JSON.parse(restrictionJson);
  return restriction.restrictedDataTypes.includes(dataType);
}

// 使用例
export async function sendMarketingEmail(userId: string): Promise<void> {
  const isRestricted = await isProcessingRestricted(userId, 'marketing');
  if (isRestricted) {
    console.log('マーケティングデータの処理が制限されています');
    return;
  }

  await api.sendEmail(userId, 'marketing_campaign');
}
```

### 6. 異議申立権（Right to Object）

ユーザーは、特定のデータ処理に異議を申し立てる権利があります。

```typescript
// screens/DataProcessingObjectionScreen.tsx
import React, { useState } from 'react';
import { View, Text, Switch, Button, StyleSheet, Alert } from 'react-native';

export function DataProcessingObjectionScreen() {
  const [objections, setObjections] = useState({
    directMarketing: false,
    profiling: false,
    research: false,
  });

  const saveObjections = async () => {
    try {
      await api.updateDataProcessingObjections(objections);
      Alert.alert('成功', '設定が保存されました');
    } catch (error) {
      Alert.alert('エラー', '設定の保存に失敗しました');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>データ処理への異議申立</Text>

      <View style={styles.row}>
        <Text style={styles.label}>ダイレクトマーケティング</Text>
        <Switch
          value={objections.directMarketing}
          onValueChange={(value) => setObjections({ ...objections, directMarketing: value })}
        />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>プロファイリング</Text>
        <Switch
          value={objections.profiling}
          onValueChange={(value) => setObjections({ ...objections, profiling: value })}
        />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>調査・分析</Text>
        <Switch
          value={objections.research}
          onValueChange={(value) => setObjections({ ...objections, research: value })}
        />
      </View>

      <Button title="保存" onPress={saveObjections} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 12 },
  label: { fontSize: 16 },
});
```

## 同意管理システム

### 明示的な同意の取得

```typescript
// screens/ConsentScreen.tsx
import React, { useState } from 'react';
import { View, Text, ScrollView, Switch, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ConsentOptions {
  essential: boolean; // 常にtrue（サービス提供に必須）
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

    Alert.alert('成功', '設定が保存されました');
    onComplete();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>プライバシー設定</Text>
      <Text style={styles.description}>
        当社がお客様のデータをどのように使用するかについて、お客様の同意が必要です。
      </Text>

      <View style={styles.consentItem}>
        <View style={styles.consentHeader}>
          <Text style={styles.consentTitle}>必須のCookie</Text>
          <Switch value={consent.essential} disabled={true} />
        </View>
        <Text style={styles.consentDescription}>
          サービス提供に必要不可欠なデータです。無効にすることはできません。
        </Text>
      </View>

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

      <View style={styles.consentItem}>
        <View style={styles.consentHeader}>
          <Text style={styles.consentTitle}>パーソナライゼーション</Text>
          <Switch
            value={consent.personalization}
            onValueChange={(value) => setConsent({ ...consent, personalization: value })}
          />
        </View>
        <Text style={styles.consentDescription}>
          お客様の好みに合わせてコンテンツをカスタマイズします。
        </Text>
      </View>

      <View style={styles.consentItem}>
        <View style={styles.consentHeader}>
          <Text style={styles.consentTitle}>マーケティング</Text>
          <Switch
            value={consent.marketing}
            onValueChange={(value) => setConsent({ ...consent, marketing: value })}
          />
        </View>
        <Text style={styles.consentDescription}>
          お客様に関連する商品やサービスをご案内します。
        </Text>
      </View>

      <View style={styles.consentItem}>
        <View style={styles.consentHeader}>
          <Text style={styles.consentTitle}>サードパーティとの共有</Text>
          <Switch
            value={consent.thirdParty}
            onValueChange={(value) => setConsent({ ...consent, thirdParty: value })}
          />
        </View>
        <Text style={styles.consentDescription}>
          信頼できるパートナーとデータを共有し、サービスを向上させます。
        </Text>
      </View>

      <Button title="保存して続ける" onPress={saveConsent} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  description: { fontSize: 14, color: '#666', marginBottom: 24 },
  consentItem: { marginBottom: 24, padding: 16, backgroundColor: '#f5f5f5', borderRadius: 8 },
  consentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  consentTitle: { fontSize: 16, fontWeight: '600' },
  consentDescription: { fontSize: 14, color: '#666' },
});
```

## データ侵害通知

GDPRでは、データ侵害を72時間以内に監督機関に報告することが義務付けられています。

```typescript
// utils/dataBreachProtocol.ts
interface DataBreachReport {
  incidentId: string;
  detectedAt: string;
  reportedAt: string;
  affectedUsers: number;
  dataTypes: string[];
  breachDescription: string;
  mitigationSteps: string[];
  status: 'detected' | 'reported' | 'mitigated' | 'resolved';
}

export async function reportDataBreach(
  breach: Omit<DataBreachReport, 'incidentId' | 'reportedAt'>
): Promise<void> {
  const report: DataBreachReport = {
    ...breach,
    incidentId: generateIncidentId(),
    reportedAt: new Date().toISOString(),
  };

  // 1. 監督機関に報告（72時間以内）
  await notifyDataProtectionAuthority(report);

  // 2. 影響を受けるユーザーに通知
  if (report.affectedUsers > 0) {
    await notifyAffectedUsers(report);
  }

  // 3. 内部ログに記録
  await logDataBreach(report);

  // 4. 緩和策を実施
  await implementMitigationSteps(report.mitigationSteps);
}

async function notifyAffectedUsers(breach: DataBreachReport): Promise<void> {
  const message = `
    データ侵害通知

    ${new Date(breach.detectedAt).toLocaleDateString()}に発生したセキュリティインシデントにより、
    お客様のデータが影響を受けた可能性があります。

    影響を受けたデータ: ${breach.dataTypes.join(', ')}

    対応状況: ${breach.status}

    実施済みの対策:
    ${breach.mitigationSteps.map((step) => `• ${step}`).join('\n')}

    お客様へのお願い:
    • パスワードを変更してください
    • 不審な活動がないか確認してください
    • ご不明な点がございましたら、サポートまでお問い合わせください
  `;

  await sendNotificationToUsers(breach.affectedUsers, message);
}
```

## プライバシー・バイ・デザイン

```typescript
// utils/privacyByDesign.ts

// 1. データ最小化：必要最小限のデータのみ収集
export interface MinimalUserProfile {
  id: string;
  email: string;
  createdAt: string;
  // 名前、住所、電話番号などは必要な場合のみ収集
}

// 2. デフォルトでプライバシー保護
export const defaultPrivacySettings = {
  shareDataWithThirdParty: false,
  allowPersonalizedAds: false,
  allowAnalytics: false,
  allowLocationTracking: false,
};

// 3. データの匿名化
export async function anonymizeBeforeSharing(data: any): Promise<any> {
  return {
    ...data,
    userId: await hashUserId(data.userId),
    email: undefined,
    name: undefined,
    phone: undefined,
  };
}

// 4. 暗号化の実装
export async function encryptSensitiveData(data: string): Promise<string> {
  return await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    data
  );
}

// 5. アクセス制御
export function checkDataAccess(userId: string, dataOwnerId: string): boolean {
  // ユーザーは自分のデータにのみアクセス可能
  return userId === dataOwnerId;
}
```

## ベストプラクティス

### 1. プライバシーポリシーの明確化

```typescript
// screens/PrivacyPolicyScreen.tsx
export function PrivacyPolicyScreen() {
  return (
    <ScrollView style={{ padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>プライバシーポリシー</Text>

      <Text style={{ fontSize: 18, fontWeight: '600', marginTop: 16 }}>1. データ管理者</Text>
      <Text>会社名: Example Inc.{'\n'}住所: Tokyo, Japan{'\n'}連絡先: privacy@example.com</Text>

      <Text style={{ fontSize: 18, fontWeight: '600', marginTop: 16 }}>2. 収集するデータ</Text>
      <Text>• メールアドレス{'\n'}• 使用状況データ{'\n'}• デバイス情報</Text>

      <Text style={{ fontSize: 18, fontWeight: '600', marginTop: 16 }}>3. データの使用目的</Text>
      <Text>• アカウント管理{'\n'}• サービス改善{'\n'}• カスタマーサポート</Text>

      <Text style={{ fontSize: 18, fontWeight: '600', marginTop: 16 }}>4. データの保存期間</Text>
      <Text>• アカウントデータ: アカウント削除まで{'\n'}• 使用状況データ: 90日間</Text>

      <Text style={{ fontSize: 18, fontWeight: '600', marginTop: 16 }}>5. あなたの権利</Text>
      <Text>
        • アクセス権{'\n'}
        • 訂正権{'\n'}
        • 削除権{'\n'}
        • データポータビリティ権{'\n'}
        • 処理の制限権{'\n'}
        • 異議申立権
      </Text>
    </ScrollView>
  );
}
```

### 2. データ保護影響評価（DPIA）

高リスクな処理活動には、DPIAを実施します。

```typescript
// utils/dpia.ts
interface DataProtectionImpactAssessment {
  processingActivity: string;
  necessityAndProportionality: string;
  risksToRights: string[];
  riskLevel: 'low' | 'medium' | 'high';
  mitigationMeasures: string[];
  consultationRequired: boolean;
}

export function conductDPIA(
  activity: string,
  dataTypes: string[],
  processingPurpose: string
): DataProtectionImpactAssessment {
  // リスク評価ロジック
  const risks = assessRisks(dataTypes, processingPurpose);

  return {
    processingActivity: activity,
    necessityAndProportionality: assessNecessity(processingPurpose),
    risksToRights: risks,
    riskLevel: calculateRiskLevel(risks),
    mitigationMeasures: proposeMitigationMeasures(risks),
    consultationRequired: shouldConsultAuthority(risks),
  };
}
```

### 3. 国際データ転送

EU外にデータを転送する場合は、適切な保護措置が必要です。

```typescript
// utils/internationalTransfer.ts
interface DataTransferMechanism {
  mechanism: 'adequacy_decision' | 'standard_contractual_clauses' | 'binding_corporate_rules' | 'consent';
  destination: string;
  safeguards: string[];
}

export async function transferDataInternationally(
  data: any,
  destination: string
): Promise<void> {
  // 適切な転送メカニズムを確認
  const mechanism = getTransferMechanism(destination);

  if (!mechanism) {
    throw new Error(`データ転送先 ${destination} に対する適切な保護措置がありません`);
  }

  // 転送の記録
  await logInternationalTransfer({
    destination,
    mechanism: mechanism.mechanism,
    timestamp: new Date().toISOString(),
  });

  // データ転送
  await api.transferData(data, destination);
}

function getTransferMechanism(destination: string): DataTransferMechanism | null {
  // 十分性認定のある国
  const adequacyDecisions = ['Japan', 'Switzerland', 'UK', 'Israel'];

  if (adequacyDecisions.includes(destination)) {
    return {
      mechanism: 'adequacy_decision',
      destination,
      safeguards: ['European Commission adequacy decision'],
    };
  }

  // 標準契約条項（SCC）
  return {
    mechanism: 'standard_contractual_clauses',
    destination,
    safeguards: ['EU Standard Contractual Clauses'],
  };
}
```

### 4. データ保護責任者（DPO）の任命

大規模な処理を行う場合、DPOの任命が必要です。

```typescript
// config/dpo.ts
export const dataProtectionOfficer = {
  name: 'Jane Doe',
  email: 'dpo@example.com',
  phone: '+81-3-1234-5678',
  responsibilities: [
    'GDPR遵守の監視',
    'データ保護影響評価の実施',
    '従業員の教育',
    '監督機関との連絡',
  ],
};

// DPOへの連絡機能
export async function contactDPO(subject: string, message: string): Promise<void> {
  await sendEmail({
    to: dataProtectionOfficer.email,
    subject: `DPO Contact: ${subject}`,
    body: message,
  });
}
```

## GDPRコンプライアンスチェックリスト

```typescript
// utils/complianceChecklist.ts
interface ComplianceChecklistItem {
  item: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
}

export const gdprComplianceChecklist: ComplianceChecklistItem[] = [
  { item: 'プライバシーポリシーの作成と公開', completed: false, priority: 'high' },
  { item: 'ユーザー同意管理システムの実装', completed: false, priority: 'high' },
  { item: 'データアクセス権の実装', completed: false, priority: 'high' },
  { item: 'データ削除権の実装', completed: false, priority: 'high' },
  { item: 'データポータビリティ機能の実装', completed: false, priority: 'high' },
  { item: 'データ暗号化の実装（保存時・転送時）', completed: false, priority: 'high' },
  { item: 'データ侵害通知プロトコルの確立', completed: false, priority: 'high' },
  { item: '処理活動の記録（ROPA）の作成', completed: false, priority: 'medium' },
  { item: 'データ保護影響評価（DPIA）の実施', completed: false, priority: 'medium' },
  { item: 'サードパーティベンダーとのDPA締結', completed: false, priority: 'medium' },
  { item: 'データ保存期間ポリシーの実装', completed: false, priority: 'medium' },
  { item: '従業員へのGDPRトレーニング', completed: false, priority: 'low' },
  { item: 'DPOの任命（必要な場合）', completed: false, priority: 'low' },
];
```

## トラブルシューティング

### 問題1: 同意が正しく記録されない

**症状**: ユーザーの同意設定が保存されない

**解決策**:
```typescript
// デバッグ用のログを追加
export async function saveConsent(consent: ConsentOptions): Promise<void> {
  console.log('Saving consent:', consent);

  try {
    await AsyncStorage.setItem('user_consent', JSON.stringify(consent));
    console.log('Consent saved successfully');

    // サーバーにもバックアップ
    await api.saveConsent(consent);
    console.log('Consent backed up to server');
  } catch (error) {
    console.error('Failed to save consent:', error);
    throw error;
  }
}
```

### 問題2: データエクスポートが大きすぎる

**症状**: ユーザーデータのエクスポートファイルが大きすぎて共有できない

**解決策**:
```typescript
// データを圧縮してエクスポート
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export async function exportCompressedUserData(userId: string): Promise<void> {
  const userData = await api.getUserData(userId);

  // JSON文字列を生成
  const jsonString = JSON.stringify(userData);

  // Base64エンコード（圧縮の代わり）
  const base64Data = btoa(jsonString);

  // ファイルに保存
  const fileUri = `${FileSystem.documentDirectory}user_data.txt`;
  await FileSystem.writeAsStringAsync(fileUri, base64Data);

  // サイズを確認
  const fileInfo = await FileSystem.getInfoAsync(fileUri);
  console.log('Export file size:', fileInfo.size, 'bytes');

  await Sharing.shareAsync(fileUri);
}
```

### 問題3: 国際データ転送の合法性

**症状**: EU外へのデータ転送が適切に保護されていない

**解決策**:
```typescript
// 転送前に保護措置を確認
export async function transferWithProtection(
  data: any,
  destination: string
): Promise<void> {
  // 転送メカニズムを確認
  const mechanism = getTransferMechanism(destination);

  if (!mechanism) {
    throw new Error(
      `${destination}への転送には、標準契約条項（SCC）またはユーザーの明示的な同意が必要です`
    );
  }

  // ユーザーに通知
  await notifyUserOfInternationalTransfer(destination, mechanism);

  // 転送を実行
  await api.transferData(data, destination);
}
```

## 参考リンク

- **公式GDPR規則**: [https://gdpr-info.eu/](https://gdpr-info.eu/)
- **欧州委員会**: [https://ec.europa.eu/info/law/law-topic/data-protection_en](https://ec.europa.eu/info/law/law-topic/data-protection_en)
- **Expo Privacy**: [https://docs.expo.dev/guides/privacy/](https://docs.expo.dev/guides/privacy/)

## まとめ

GDPRコンプライアンスは、Expoアプリ開発において重要な考慮事項です：

### 主要な要件
- **7つの原則**: 適法性、目的制限、データ最小化、正確性、保存期間制限、完全性と機密性、説明責任
- **ユーザーの権利**: アクセス権、訂正権、削除権、データポータビリティ権、処理制限権、異議申立権
- **同意管理**: 明示的で自由な同意、いつでも撤回可能
- **データ侵害通知**: 72時間以内に監督機関に報告

### 実装のベストプラクティス
- プライバシー・バイ・デザインの原則を採用
- データの暗号化（保存時・転送時）
- 定期的なデータ監査とクリーンアップ
- 明確で透明性の高いプライバシーポリシー
- ユーザー権利の実装（アクセス、削除、エクスポート）

### コンプライアンスの維持
- 処理活動の記録（ROPA）を維持
- データ保護影響評価（DPIA）を実施
- サードパーティベンダーとのデータ処理契約（DPA）
- 従業員へのGDPRトレーニング
- DPOの任命（必要な場合）

これらの要件とベストプラクティスに従うことで、ExpoアプリをGDPRに準拠させ、ユーザーのプライバシーを保護できます。
