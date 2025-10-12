# データとプライバシー保護

Expoアプリでデータとプライバシー保護を実装し、ユーザーのプライバシーを尊重する方法を学びます。

## 概要

データとプライバシー保護は、ユーザーの信頼を構築し、法規制に準拠するために不可欠です。

**主な原則**：
- 最小限のデータ収集
- 透明性
- ユーザーコントロール
- データセキュリティ
- 法規制への準拠

## Expoのプライバシー原則

### 1. 最小限のデータ収集

**Expoの方針**:
> "私たちの焦点は、大量のデータを収集することではありません"

**ベストプラクティス**:
- 必要なデータのみを収集
- データ収集の目的を明確化
- 不要なデータは収集しない

**実装例**:
```typescript
// ✅ 推奨: 必要最小限のデータのみ収集
interface UserProfile {
  id: string;
  name: string;
  email: string;
}

// ❌ 非推奨: 過剰なデータ収集
interface UserProfileBad {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  birthDate: string;
  socialSecurityNumber: string;  // 不必要
  creditCardNumber: string;       // 不必要
}
```

### 2. 透明性

**Expoの方針**:
- データ慣行についての明確なドキュメント
- 技術的プライバシーポリシーと平易な言葉での説明の両方を提供

**ベストプラクティス**:
- ユーザーにデータ収集を通知
- データ使用目的を説明
- プライバシーポリシーを提供

**実装例**:
```typescript
// ユーザーの同意を取得
const requestDataCollection = async () => {
  const consent = await Alert.alert(
    'データ収集について',
    'アプリの改善のために使用統計を収集してもよろしいですか？詳細はプライバシーポリシーをご覧ください。',
    [
      { text: 'プライバシーポリシーを見る', onPress: () => openPrivacyPolicy() },
      { text: '拒否', style: 'cancel' },
      { text: '同意', onPress: () => enableDataCollection() },
    ]
  );
};
```

### 3. 準拠フレームワーク

**Expoの準拠**:
- GDPR準拠
- CCPA準拠
- Data Privacy Framework準拠

## プライバシー保護の実装

### ユーザー同意管理

#### 同意の取得

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

export const hasConsent = async (type: keyof Omit<ConsentPreferences, 'timestamp'>): Promise<boolean> => {
  const consent = await getConsent();
  return consent ? consent[type] : false;
};
```

#### 同意画面の実装

```typescript
// screens/ConsentScreen.tsx
import { useState } from 'react';
import { View, Text, Switch, Button } from 'react-native';

export default function ConsentScreen() {
  const [consent, setConsent] = useState({
    analytics: false,
    personalization: false,
    marketing: false,
    crashReporting: false,
  });

  const handleSave = async () => {
    await setConsent({
      ...consent,
      timestamp: new Date().toISOString(),
    });

    // 同意設定に基づいてサービスを初期化
    if (consent.analytics) {
      initializeAnalytics();
    }
    if (consent.crashReporting) {
      initializeCrashReporting();
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>
        プライバシー設定
      </Text>

      <View style={{ marginBottom: 15 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text>使用統計の収集</Text>
          <Switch
            value={consent.analytics}
            onValueChange={(value) => setConsent({ ...consent, analytics: value })}
          />
        </View>
        <Text style={{ color: '#666', fontSize: 12 }}>
          アプリの改善のために匿名化された使用データを収集します
        </Text>
      </View>

      <View style={{ marginBottom: 15 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text>パーソナライゼーション</Text>
          <Switch
            value={consent.personalization}
            onValueChange={(value) => setConsent({ ...consent, personalization: value })}
          />
        </View>
        <Text style={{ color: '#666', fontSize: 12 }}>
          体験をカスタマイズするためにデータを使用します
        </Text>
      </View>

      <View style={{ marginBottom: 15 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text>マーケティング</Text>
          <Switch
            value={consent.marketing}
            onValueChange={(value) => setConsent({ ...consent, marketing: value })}
          />
        </View>
        <Text style={{ color: '#666', fontSize: 12 }}>
          関連するオファーやニュースを受け取ります
        </Text>
      </View>

      <View style={{ marginBottom: 15 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text>クラッシュレポート</Text>
          <Switch
            value={consent.crashReporting}
            onValueChange={(value) => setConsent({ ...consent, crashReporting: value })}
          />
        </View>
        <Text style={{ color: '#666', fontSize: 12 }}>
          アプリの安定性向上のためクラッシュ情報を送信します
        </Text>
      </View>

      <Button title="保存" onPress={handleSave} />
    </View>
  );
}
```

### データの暗号化

#### ローカルストレージの暗号化

```typescript
// utils/secureStorage.ts
import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';

export const secureStorage = {
  // データを暗号化して保存
  async setItem(key: string, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error('Failed to save encrypted data:', error);
      throw error;
    }
  },

  // データを復号化して取得
  async getItem(key: string): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error('Failed to retrieve encrypted data:', error);
      return null;
    }
  },

  // データを削除
  async removeItem(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error('Failed to delete encrypted data:', error);
      throw error;
    }
  },
};

// 使用例
const saveUserData = async (userData: any) => {
  const encryptedData = JSON.stringify(userData);
  await secureStorage.setItem('user_data', encryptedData);
};
```

#### 通信の暗号化

```typescript
// utils/api.ts
export async function secureFetch(url: string, options: RequestInit = {}) {
  // HTTPSを強制
  const secureUrl = url.replace('http://', 'https://');

  const response = await fetch(secureUrl, {
    ...options,
    headers: {
      ...options.headers,
      'Content-Type': 'application/json',
      // SSL Pinningを実装（本番環境）
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}
```

### 匿名化とデータ最小化

```typescript
// utils/anonymize.ts
import * as Crypto from 'expo-crypto';

// ユーザーIDをハッシュ化
export async function anonymizeUserId(userId: string): Promise<string> {
  const hash = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    userId
  );
  return hash;
}

// 個人識別情報を削除
export function removePersonalInfo(data: any): any {
  const sanitized = { ...data };

  // 削除するフィールド
  const sensitiveFields = ['email', 'phoneNumber', 'address', 'name', 'ssn', 'creditCard'];

  sensitiveFields.forEach((field) => {
    if (field in sanitized) {
      delete sanitized[field];
    }
  });

  return sanitized;
}

// 使用例
const sendAnalytics = async (userData: any) => {
  const anonymousId = await anonymizeUserId(userData.id);
  const sanitizedData = removePersonalInfo(userData);

  // 匿名化されたデータのみ送信
  await analytics.track('user_action', {
    userId: anonymousId,
    ...sanitizedData,
  });
};
```

### データ削除とユーザー権利

#### データ削除の実装

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
```

#### データエクスポート（ポータビリティ）

```typescript
// utils/dataExport.ts
export async function exportUserData(userId: string): Promise<any> {
  try {
    // ローカルデータを収集
    const localData = {
      preferences: await AsyncStorage.getItem('preferences'),
      settings: await AsyncStorage.getItem('settings'),
    };

    // サーバーからデータを取得
    const response = await fetch(`https://api.example.com/users/${userId}/export`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    const serverData = await response.json();

    // すべてのデータを結合
    const allData = {
      ...localData,
      ...serverData,
      exportedAt: new Date().toISOString(),
    };

    return allData;
  } catch (error) {
    console.error('Failed to export user data:', error);
    throw error;
  }
}

// データをファイルとしてダウンロード
export async function downloadUserData(userId: string): Promise<void> {
  const data = await exportUserData(userId);
  const jsonString = JSON.stringify(data, null, 2);

  // ファイルとして保存
  const fileUri = FileSystem.documentDirectory + 'my_data.json';
  await FileSystem.writeAsStringAsync(fileUri, jsonString);

  // 共有
  await Sharing.shareAsync(fileUri);
}
```

## サードパーティ統合

### プライバシー重視のサービス選択

```typescript
// ✅ 推奨: プライバシー重視のサービス
import * as Analytics from 'expo-firebase-analytics'; // 匿名化オプション付き

// 匿名化を有効化
Analytics.setAnalyticsCollectionEnabled(true);
Analytics.setUserId(null); // ユーザーIDを設定しない

// ❌ 非推奨: 過度な追跡
// サードパーティトラッカーを多数埋め込む
```

### サードパーティSDKの設定

```typescript
// app/_layout.tsx
import { useEffect } from 'react';

export default function RootLayout() {
  useEffect(() => {
    const initializeServices = async () => {
      // ユーザーの同意を確認
      const consent = await getConsent();

      if (consent?.analytics) {
        // 分析サービスを初期化
        initializeAnalytics();
      }

      if (consent?.crashReporting) {
        // クラッシュレポートを初期化
        initializeSentry();
      }

      // マーケティングサービスは同意がある場合のみ
      if (consent?.marketing) {
        initializeMarketing();
      }
    };

    initializeServices();
  }, []);

  return (
    // アプリコンテンツ
  );
}
```

## プライバシーポリシー

### プライバシーポリシーの表示

```typescript
// screens/PrivacyPolicyScreen.tsx
import { WebView } from 'react-native-webview';

export default function PrivacyPolicyScreen() {
  return (
    <WebView
      source={{ uri: 'https://yourapp.com/privacy-policy' }}
      style={{ flex: 1 }}
    />
  );
}

// または、アプリ内にHTMLを埋め込む
const privacyPolicyHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; }
    h1 { color: #333; }
    p { line-height: 1.6; }
  </style>
</head>
<body>
  <h1>プライバシーポリシー</h1>
  <p>最終更新日: 2024年1月1日</p>
  <h2>1. データ収集</h2>
  <p>当アプリは以下のデータを収集します...</p>
  <!-- 詳細な内容 -->
</body>
</html>
`;

export default function PrivacyPolicyScreen() {
  return (
    <WebView
      source={{ html: privacyPolicyHTML }}
      style={{ flex: 1 }}
    />
  );
}
```

## ベストプラクティス

### 1. デフォルトでプライバシー保護

```typescript
// ✅ 推奨: デフォルトで最小限の権限
const defaultSettings = {
  analytics: false,  // ユーザーがオプトインするまで無効
  locationTracking: false,
  notifications: false,
};

// ❌ 非推奨: デフォルトですべて有効
const badSettings = {
  analytics: true,
  locationTracking: true,
  notifications: true,
};
```

### 2. 定期的なプライバシーレビュー

```typescript
// プライバシー設定の定期的な確認を促す
const checkPrivacyReviewDate = async () => {
  const lastReview = await AsyncStorage.getItem('last_privacy_review');
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  if (!lastReview || new Date(lastReview) < sixMonthsAgo) {
    Alert.alert(
      'プライバシー設定の確認',
      'プライバシー設定を確認してください',
      [
        { text: '後で', style: 'cancel' },
        { text: '確認', onPress: () => navigation.navigate('PrivacySettings') },
      ]
    );
  }
};
```

### 3. 透明性の維持

```typescript
// データ収集について通知
const notifyDataCollection = () => {
  Alert.alert(
    'データ収集について',
    'このアクションによりデータが収集されます。詳細はプライバシーポリシーをご覧ください。',
    [
      { text: 'プライバシーポリシー', onPress: openPrivacyPolicy },
      { text: 'OK' },
    ]
  );
};
```

## Expoのプライバシーリソース

**公式リソース**:
- [Expo Privacy Policy](https://expo.dev/privacy)
- [Privacy Explained Page](https://expo.dev/privacy-explained)

**追加ガイド**:
- [GDPR Compliance](./gdpr.md)
- [HIPAA Compliance](./hipaa.md)

## まとめ

データとプライバシー保護は、以下の原則に基づいて実装します：

### 主要な原則
- **最小限のデータ収集**: 必要なデータのみを収集
- **透明性**: データ慣行を明確に説明
- **ユーザーコントロール**: ユーザーが自分のデータを管理
- **データセキュリティ**: 暗号化とセキュアな保存
- **法規制への準拠**: GDPR、CCPA、その他の規制に準拠

### 実装の要点
- ユーザー同意管理システムの実装
- データの暗号化（保存時、転送時）
- 匿名化とデータ最小化
- データ削除とエクスポート機能
- サードパーティ統合の慎重な管理

### Expoの準拠フレームワーク
- GDPR（EU一般データ保護規則）
- CCPA（カリフォルニア州消費者プライバシー法）
- Data Privacy Framework

### ベストプラクティス
- デフォルトでプライバシー保護
- 定期的なプライバシーレビュー
- 透明性の維持
- 明確なプライバシーポリシー

これらの原則とベストプラクティスを活用して、ユーザーのプライバシーを尊重し、法規制に準拠したアプリを構築できます。
