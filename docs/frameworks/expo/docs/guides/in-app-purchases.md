# アプリ内課金を実装する

Expoアプリでアプリ内課金を実装し、デジタル商品やサブスクリプションを販売する方法を学びます。

## 概要

アプリ内課金（In-App Purchases, IAP）を使用すると、アプリ内でデジタル商品やサービスを販売できます。

**主な用途**：
- 消耗品（ゲーム内通貨、アイテム）
- 非消耗品（プレミアム機能、広告削除）
- サブスクリプション（月額/年額プラン）
- 自動更新サブスクリプション

**重要な制限**：
- アプリ内課金ライブラリはカスタムネイティブコードが必要
- Expo Goでは動作しません ❌
- Development buildまたはProduction buildが必要 ✅

## 利用可能なライブラリ

### 1. react-native-purchases（RevenueCat）

**特徴**：
- オープンソースフレームワーク
- Google Play BillingとStoreKit APIをラップ
- RevenueCatサービスとの統合
- 商品管理と分析機能
- クロスプラットフォーム対応

**利点**：
- 簡単なサブスクリプション管理
- 収益分析とダッシュボード
- レシート検証の自動化
- A/Bテストと価格実験
- 無料プランあり（月額$2,500まで）

**公式ドキュメント**: [RevenueCat Documentation](https://docs.revenuecat.com/)

### 2. expo-iap

**特徴**：
- React Nativeライブラリ
- Google Play BillingとStoreKit APIの直接統合
- 開発ビルドで動作

**利点**：
- サードパーティサービス不要
- 完全なコントロール
- 追加コストなし

**制限**：
- レシート検証を自分で実装
- 分析機能なし
- より多くのボイラープレートコード

## セットアップ

### ステップ1: ライブラリのインストール

#### RevenueCatを使用する場合

```bash
npx expo install react-native-purchases
```

#### expo-iapを使用する場合

```bash
npx expo install expo-iap
```

### ステップ2: Config Pluginの追加

**app.json**:
```json
{
  "expo": {
    "plugins": [
      [
        "react-native-purchases",
        {
          "apiKey": "YOUR_REVENUECAT_API_KEY"
        }
      ]
    ]
  }
}
```

### ステップ3: 開発ビルドの作成

```bash
# ネイティブコードを生成
npx expo prebuild

# iOS
npx expo run:ios

# Android
npx expo run:android
```

## App Store Connectの設定（iOS）

### ステップ1: アプリIDの作成

1. [Apple Developer](https://developer.apple.com/)にログイン
2. **Certificates, Identifiers & Profiles** → **Identifiers**
3. 新しいApp IDを作成
4. **In-App Purchase**機能を有効化

### ステップ2: アプリ内課金商品の作成

1. [App Store Connect](https://appstoreconnect.apple.com/)にログイン
2. **My Apps** → アプリを選択
3. **Features** → **In-App Purchases**
4. 新しい商品を追加

**商品タイプ**：
- **Consumable**: 消耗品（ゲーム内通貨、アイテム）
- **Non-Consumable**: 非消耗品（プレミアム機能、広告削除）
- **Auto-Renewable Subscription**: 自動更新サブスクリプション
- **Non-Renewing Subscription**: 非更新サブスクリプション

### ステップ3: 商品情報の入力

```
Product ID: premium_monthly
Reference Name: Premium Monthly Subscription
Price: $9.99
Description: アプリのすべてのプレミアム機能にアクセス
```

### ステップ4: サンドボックステスター作成

1. **App Store Connect** → **Users and Access**
2. **Sandbox Testers**タブ
3. 新しいテスターアカウントを作成

## Google Play Consoleの設定（Android）

### ステップ1: アプリの作成

1. [Google Play Console](https://play.google.com/console/)にログイン
2. 新しいアプリを作成
3. アプリの基本情報を入力

### ステップ2: アプリ内商品の作成

1. **Monetization setup** → **In-app products**
2. **Create product**をクリック

**商品タイプ**：
- **Managed products**: 管理型商品（消耗品、非消耗品）
- **Subscriptions**: サブスクリプション

### ステップ3: 商品情報の入力

```
Product ID: premium_monthly
Name: Premium Monthly Subscription
Description: アプリのすべてのプレミアム機能にアクセス
Price: ¥1,200
```

### ステップ4: テストアカウントの追加

1. **Setup** → **License testing**
2. テスター用Googleアカウントを追加

## RevenueCatの実装

### ステップ1: RevenueCatアカウントの作成

1. [RevenueCat](https://www.revenuecat.com/)にサインアップ
2. 新しいプロジェクトを作成
3. **API Key**を取得

### ステップ2: プラットフォームの設定

**iOS設定**：
1. **App Store Connect**のShared Secretを追加
2. Bundle IDを設定

**Android設定**：
1. **Google Play Console**のサービスアカウントJSONをアップロード
2. Package nameを設定

### ステップ3: 商品の設定

1. **Products** → **Entitlements**で権限を作成
2. **Products**で商品を追加（Product IDはApp Store ConnectとGoogle Play Consoleと一致）
3. 商品を権限に紐付け

### ステップ4: 初期化

```typescript
// app/_layout.tsx
import { useEffect } from 'react';
import Purchases from 'react-native-purchases';
import { Platform } from 'react-native';

const REVENUECAT_API_KEY = Platform.select({
  ios: 'appl_XXXXXXXXXX',
  android: 'goog_XXXXXXXXXX',
});

export default function RootLayout() {
  useEffect(() => {
    if (REVENUECAT_API_KEY) {
      Purchases.configure({ apiKey: REVENUECAT_API_KEY });
    }
  }, []);

  return (
    // レイアウトコンポーネント
  );
}
```

### ステップ5: 商品の取得

```typescript
// screens/SubscriptionScreen.tsx
import { useEffect, useState } from 'react';
import Purchases, { PurchasesOffering } from 'react-native-purchases';

export default function SubscriptionScreen() {
  const [offerings, setOfferings] = useState<PurchasesOffering | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOfferings();
  }, []);

  const fetchOfferings = async () => {
    try {
      const offerings = await Purchases.getOfferings();
      setOfferings(offerings.current);
    } catch (error) {
      console.error('Failed to fetch offerings:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <View>
      {offerings?.availablePackages.map((pkg) => (
        <View key={pkg.identifier}>
          <Text>{pkg.product.title}</Text>
          <Text>{pkg.product.description}</Text>
          <Text>{pkg.product.priceString}</Text>
          <Button title="購入" onPress={() => purchasePackage(pkg)} />
        </View>
      ))}
    </View>
  );
}
```

### ステップ6: 購入処理

```typescript
import Purchases, { PurchasesPackage } from 'react-native-purchases';
import { Alert } from 'react-native';

const purchasePackage = async (pkg: PurchasesPackage) => {
  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);

    // 権限を確認
    if (customerInfo.entitlements.active['premium'] !== undefined) {
      Alert.alert('成功', 'プレミアム機能が有効になりました！');
    }
  } catch (error: any) {
    if (error.userCancelled) {
      Alert.alert('キャンセル', '購入がキャンセルされました');
    } else {
      Alert.alert('エラー', '購入に失敗しました');
      console.error('Purchase error:', error);
    }
  }
};
```

### ステップ7: 権限の確認

```typescript
// hooks/useSubscription.ts
import { useEffect, useState } from 'react';
import Purchases, { CustomerInfo } from 'react-native-purchases';

export function useSubscription() {
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkSubscriptionStatus();

    // リスナーを設定
    Purchases.addCustomerInfoUpdateListener((customerInfo) => {
      updateSubscriptionStatus(customerInfo);
    });
  }, []);

  const checkSubscriptionStatus = async () => {
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      updateSubscriptionStatus(customerInfo);
    } catch (error) {
      console.error('Failed to check subscription:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSubscriptionStatus = (customerInfo: CustomerInfo) => {
    const premiumEntitlement = customerInfo.entitlements.active['premium'];
    setIsPremium(premiumEntitlement !== undefined);
  };

  return { isPremium, isLoading };
}

// 使用例
export default function HomeScreen() {
  const { isPremium, isLoading } = useSubscription();

  if (isLoading) {
    return <ActivityIndicator />;
  }

  return (
    <View>
      {isPremium ? (
        <PremiumContent />
      ) : (
        <View>
          <Text>プレミアムにアップグレード</Text>
          <Button
            title="サブスクリプションを購入"
            onPress={() => navigation.navigate('Subscription')}
          />
        </View>
      )}
    </View>
  );
}
```

### ステップ8: 購入の復元

```typescript
const restorePurchases = async () => {
  try {
    const customerInfo = await Purchases.restorePurchases();

    if (customerInfo.entitlements.active['premium'] !== undefined) {
      Alert.alert('成功', '購入が復元されました！');
    } else {
      Alert.alert('情報', '復元する購入が見つかりませんでした');
    }
  } catch (error) {
    Alert.alert('エラー', '購入の復元に失敗しました');
    console.error('Restore error:', error);
  }
};

// 使用例
<Button title="購入を復元" onPress={restorePurchases} />
```

## expo-iapの実装

### 初期化

```typescript
// app/_layout.tsx
import { useEffect } from 'react';
import * as InAppPurchases from 'expo-iap';

export default function RootLayout() {
  useEffect(() => {
    connectToStore();

    return () => {
      InAppPurchases.disconnectAsync();
    };
  }, []);

  const connectToStore = async () => {
    try {
      await InAppPurchases.connectAsync();
      console.log('Connected to store');
    } catch (error) {
      console.error('Failed to connect to store:', error);
    }
  };

  return (
    // レイアウトコンポーネント
  );
}
```

### 商品の取得

```typescript
import * as InAppPurchases from 'expo-iap';

const PRODUCT_IDS = ['premium_monthly', 'premium_yearly', 'remove_ads'];

const fetchProducts = async () => {
  try {
    const products = await InAppPurchases.getProductsAsync(PRODUCT_IDS);
    console.log('Products:', products);
    return products;
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return [];
  }
};
```

### 購入処理

```typescript
import * as InAppPurchases from 'expo-iap';

const purchaseProduct = async (productId: string) => {
  try {
    await InAppPurchases.purchaseItemAsync(productId);
    Alert.alert('成功', '購入が完了しました！');

    // バックエンドでレシート検証を実行
    await verifyPurchase(productId);
  } catch (error: any) {
    if (error.code === 'E_USER_CANCELLED') {
      Alert.alert('キャンセル', '購入がキャンセルされました');
    } else {
      Alert.alert('エラー', '購入に失敗しました');
      console.error('Purchase error:', error);
    }
  }
};
```

## レシート検証

### バックエンドでの検証（推奨）

```typescript
// utils/api.ts
export async function verifyPurchase(productId: string, receipt: string) {
  const response = await fetch('https://api.example.com/verify-purchase', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      productId,
      receipt,
    }),
  });

  if (!response.ok) {
    throw new Error('Receipt verification failed');
  }

  return response.json();
}
```

**バックエンド実装例（Node.js）**：
```javascript
// server.js
const express = require('express');
const axios = require('axios');

app.post('/verify-purchase', async (req, res) => {
  const { productId, receipt } = req.body;

  try {
    // iOSの場合
    if (receipt.includes('ios')) {
      const response = await axios.post(
        'https://buy.itunes.apple.com/verifyReceipt',
        {
          'receipt-data': receipt,
          password: process.env.APP_STORE_SHARED_SECRET,
        }
      );

      if (response.data.status === 0) {
        // 有効な購入
        res.json({ valid: true });
      } else {
        res.json({ valid: false });
      }
    }

    // Androidの場合
    if (receipt.includes('android')) {
      // Google Play Developer APIを使用して検証
      // 実装は省略
    }
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ error: 'Verification failed' });
  }
});
```

## テスト

### iOSサンドボックステスト

1. **Settings** → **App Store** → サインアウト
2. アプリで購入を試みる
3. サンドボックステスターアカウントでサインイン
4. 購入を完了（実際の課金は発生しません）

### Androidテスト

1. Google Play Consoleでテストアカウントを設定
2. テスターとしてアプリにアクセス
3. Internal Testingトラックでアプリをインストール
4. 購入をテスト（実際の課金は発生しません）

## ベストプラクティス

### 1. レシート検証をバックエンドで実行

```typescript
// ✅ 推奨: バックエンドで検証
const purchaseProduct = async (productId: string) => {
  try {
    const result = await InAppPurchases.purchaseItemAsync(productId);

    // バックエンドに送信して検証
    await verifyPurchaseOnBackend(result);

    // 検証成功後にコンテンツを提供
    unlockPremiumFeatures();
  } catch (error) {
    console.error('Purchase failed:', error);
  }
};

// ❌ 非推奨: クライアント側のみで検証
const purchaseProductBad = async (productId: string) => {
  await InAppPurchases.purchaseItemAsync(productId);
  unlockPremiumFeatures(); // セキュリティリスク
};
```

### 2. 購入状態の永続化

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

const savePurchaseState = async (isPremium: boolean) => {
  try {
    await AsyncStorage.setItem('isPremium', JSON.stringify(isPremium));
  } catch (error) {
    console.error('Failed to save purchase state:', error);
  }
};

const loadPurchaseState = async (): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem('isPremium');
    return value ? JSON.parse(value) : false;
  } catch (error) {
    console.error('Failed to load purchase state:', error);
    return false;
  }
};
```

### 3. エラーハンドリング

```typescript
const purchaseProduct = async (productId: string) => {
  try {
    await InAppPurchases.purchaseItemAsync(productId);
  } catch (error: any) {
    // ユーザーキャンセル
    if (error.code === 'E_USER_CANCELLED') {
      return;
    }

    // ネットワークエラー
    if (error.code === 'E_NETWORK_ERROR') {
      Alert.alert('エラー', 'ネットワーク接続を確認してください');
      return;
    }

    // その他のエラー
    Alert.alert('エラー', '購入に失敗しました。後でもう一度お試しください');
    console.error('Purchase error:', error);
  }
};
```

### 4. 購入復元機能の提供

```typescript
// 設定画面に購入復元ボタンを配置
export default function SettingsScreen() {
  const restorePurchases = async () => {
    try {
      const customerInfo = await Purchases.restorePurchases();

      if (Object.keys(customerInfo.entitlements.active).length > 0) {
        Alert.alert('成功', '購入が復元されました');
      } else {
        Alert.alert('情報', '復元する購入が見つかりませんでした');
      }
    } catch (error) {
      Alert.alert('エラー', '購入の復元に失敗しました');
    }
  };

  return (
    <View>
      <Button title="購入を復元" onPress={restorePurchases} />
    </View>
  );
}
```

## トラブルシューティング

### 問題1: 商品が取得できない

**原因**: Product IDが正しくない、または商品が承認されていない

**解決策**：
- App Store ConnectとGoogle Play Consoleで商品が承認されているか確認
- Product IDが正確に一致しているか確認
- サンドボックステスターでログインしているか確認（iOS）

### 問題2: 購入が完了しない

**原因**: ネットワークエラーまたはストア接続の問題

**解決策**：
```typescript
// ストア接続を確認
const checkConnection = async () => {
  try {
    await InAppPurchases.connectAsync();
    console.log('Store connection successful');
  } catch (error) {
    console.error('Store connection failed:', error);
  }
};
```

### 問題3: Expo Goで動作しない

**原因**: アプリ内課金はネイティブコードが必要

**解決策**：
```bash
# 開発ビルドを作成
npx expo prebuild
npx expo run:ios
npx expo run:android
```

## まとめ

Expoでのアプリ内課金実装は、以下の機能を提供します：

### 利用可能なライブラリ
- **RevenueCat**: 簡単なサブスクリプション管理、分析、レシート検証
- **expo-iap**: 直接統合、完全なコントロール、追加コストなし

### セットアップステップ
1. ライブラリのインストールとConfig Plugin設定
2. 開発ビルドの作成
3. App Store ConnectとGoogle Play Consoleで商品設定
4. 初期化と商品取得の実装
5. 購入処理とレシート検証の実装

### ベストプラクティス
- レシート検証をバックエンドで実行
- 購入状態の永続化
- 適切なエラーハンドリング
- 購入復元機能の提供
- サンドボックス環境でのテスト

### 重要な注意点
- Expo Goでは動作しない（Development build必須）
- レシート検証は必ずバックエンドで実行
- 購入復元機能を必ず提供（Appleの要件）
- テストは必ずサンドボックス環境で実施

これらのパターンを活用して、安全で信頼性の高いアプリ内課金システムを構築できます。
