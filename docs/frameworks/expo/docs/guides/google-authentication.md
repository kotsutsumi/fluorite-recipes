# Google認証

ExpoアプリでGoogle認証を実装する方法を学びます。

## 概要

Google認証を使用すると、ユーザーがGoogleアカウントでアプリにサインインできます。

**重要な制限事項**：
- Expo Goアプリでは使用不可
- カスタムネイティブコードが必要
- プラットフォーム別の設定が必要

## 前提条件

### 必須要件

1. **開発ビルド**: カスタムネイティブコードが必要
2. **Googleプロジェクト**: Google Cloud ConsoleまたはFirebaseでのプロジェクト作成
3. **証明書**: SHA-1証明書フィンガープリント（Android）

## セットアップ

### ステップ1: ライブラリのインストール

```bash
npx expo install @react-native-google-signin/google-signin
```

### ステップ2: 設定プラグインの追加

**app.json**:
```json
{
  "expo": {
    "plugins": [
      [
        "@react-native-google-signin/google-signin",
        {
          "iosUrlScheme": "com.googleusercontent.apps.YOUR_IOS_CLIENT_ID"
        }
      ]
    ]
  }
}
```

## 設定方法1: Firebaseを使用

### ステップ1: Firebase設定ファイルの取得

#### Android向け

1. [Firebase Console](https://console.firebase.google.com/)でプロジェクトを開く
2. **プロジェクト設定** → **Androidアプリを追加**
3. パッケージ名を入力（app.jsonの`android.package`）
4. `google-services.json`をダウンロード

**app.json**に設定を追加：
```json
{
  "expo": {
    "android": {
      "package": "com.yourcompany.yourapp",
      "googleServicesFile": "./google-services.json"
    }
  }
}
```

#### iOS向け

1. Firebase ConsoleでiOSアプリを追加
2. バンドルIDを入力（app.jsonの`ios.bundleIdentifier`）
3. `GoogleService-Info.plist`をダウンロード

**app.json**に設定を追加：
```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.yourcompany.yourapp",
      "googleServicesFile": "./GoogleService-Info.plist"
    }
  }
}
```

### ステップ2: SHA-1証明書フィンガープリントの取得

**開発用証明書**:
```bash
# デバッグキーストアのSHA-1を取得
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
```

**本番用証明書（EAS Build）**:
```bash
# EAS Buildの証明書情報を取得
eas credentials
```

**Firebase Consoleへの追加**：
1. **プロジェクト設定** → **Androidアプリ**
2. **SHA証明書フィンガープリント**を追加

### ステップ3: クライアントIDの取得

Firebase設定ファイルから：

**google-services.json**（Android）:
```json
{
  "client": [
    {
      "oauth_client": [
        {
          "client_id": "YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com",
          "client_type": 3
        }
      ]
    }
  ]
}
```

**GoogleService-Info.plist**（iOS）:
```xml
<key>CLIENT_ID</key>
<string>YOUR_IOS_CLIENT_ID.apps.googleusercontent.com</string>
```

## 設定方法2: Google Cloud Consoleを使用

### ステップ1: Google Cloud Console設定

1. [Google Cloud Console](https://console.cloud.google.com/)にアクセス
2. 新しいプロジェクトを作成
3. **APIとサービス** → **認証情報**
4. **OAuth 2.0クライアントIDを作成**

#### Android向けOAuth設定

**アプリケーションの種類**: Android

**必要な情報**：
- **パッケージ名**: `com.yourcompany.yourapp`
- **SHA-1証明書フィンガープリント**: 取得した証明書のSHA-1

#### iOS向けOAuth設定

**アプリケーションの種類**: iOS

**必要な情報**：
- **バンドルID**: `com.yourcompany.yourapp`

### ステップ2: Web クライアントIDの作成（オプション）

**アプリケーションの種類**: Webアプリケーション

これは、サーバー側での認証トークン検証に使用されます。

## 実装

### 基本的なセットアップ

```typescript
// lib/google-signin.ts
import { GoogleSignin } from '@react-native-google-signin/google-signin';

export function configureGoogleSignIn() {
  GoogleSignin.configure({
    // Webクライアント ID（Firebase使用時はgoogle-services.jsonから取得）
    webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',

    // iOS クライアント ID（オプション）
    iosClientId: 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com',

    // オフラインアクセスを有効化（更新トークンを取得）
    offlineAccess: true,

    // プロフィール画像を含める
    forceCodeForRefreshToken: true,
  });
}
```

### アプリ起動時の初期化

```typescript
// app/_layout.tsx
import { useEffect } from 'react';
import { configureGoogleSignIn } from '@/lib/google-signin';

export default function RootLayout() {
  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  return (
    // レイアウトコンポーネント
  );
}
```

### サインインフロー

```typescript
// app/login.tsx
import React, { useState } from 'react';
import { View, Button, Text, Image } from 'react-native';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';

export default function LoginScreen() {
  const [user, setUser] = useState<any>(null);

  const handleGoogleSignIn = async () => {
    try {
      // Google Playサービスが利用可能か確認
      await GoogleSignin.hasPlayServices();

      // サインインダイアログを表示
      const userInfo = await GoogleSignin.signIn();

      setUser(userInfo.user);
      console.log('User signed in:', userInfo.user);

      // IDトークンを取得（サーバー認証用）
      const tokens = await GoogleSignin.getTokens();
      console.log('ID Token:', tokens.idToken);
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User cancelled sign in');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Sign in is in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play services not available');
      } else {
        console.error('Error:', error);
      }
    }
  };

  const handleGoogleSignOut = async () => {
    try {
      await GoogleSignin.signOut();
      setUser(null);
      console.log('User signed out');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      {user ? (
        <>
          {user.photo && (
            <Image
              source={{ uri: user.photo }}
              style={{ width: 100, height: 100, borderRadius: 50, alignSelf: 'center' }}
            />
          )}
          <Text style={{ textAlign: 'center', marginVertical: 10 }}>
            Welcome, {user.name}!
          </Text>
          <Text style={{ textAlign: 'center', marginBottom: 20 }}>
            {user.email}
          </Text>
          <Button title="Sign Out" onPress={handleGoogleSignOut} />
        </>
      ) : (
        <Button title="Sign in with Google" onPress={handleGoogleSignIn} />
      )}
    </View>
  );
}
```

### セッション管理

```typescript
// hooks/useGoogleAuth.ts
import { useEffect, useState } from 'react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

export function useGoogleAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSignInStatus();
  }, []);

  const checkSignInStatus = async () => {
    try {
      const isSignedIn = await GoogleSignin.isSignedIn();

      if (isSignedIn) {
        const userInfo = await GoogleSignin.signInSilently();
        setUser(userInfo.user);
      }
    } catch (error) {
      console.error('Error checking sign-in status:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      setUser(userInfo.user);
      return userInfo;
    } catch (error) {
      console.error('Sign-in error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
      setUser(null);
    } catch (error) {
      console.error('Sign-out error:', error);
      throw error;
    }
  };

  const revokeAccess = async () => {
    try {
      await GoogleSignin.revokeAccess();
      setUser(null);
    } catch (error) {
      console.error('Revoke access error:', error);
      throw error;
    }
  };

  return { user, loading, signIn, signOut, revokeAccess };
}
```

## Firebaseとの統合

### Firebase Authenticationでの認証

```typescript
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

const signInWithGoogle = async () => {
  try {
    // Googleサインインを実行
    const { idToken } = await GoogleSignin.signIn();

    // Google認証情報を作成
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Firebaseでサインイン
    const userCredential = await auth().signInWithCredential(googleCredential);

    console.log('Signed in with Firebase:', userCredential.user.uid);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

## EAS Buildでの設定

### eas.json設定

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {}
  }
}
```

### 証明書の管理

```bash
# EAS Buildの証明書を確認
eas credentials

# SHA-1フィンガープリントを取得
# Android → Keystore → View → SHA-1 fingerprint
```

## Google Play Storeへの公開

### Android向け

1. **本番ビルドを作成**：
```bash
npx eas build --platform android --profile production
```

2. **Google Play Consoleにアップロード**：
```bash
npx eas submit --platform android
```

3. **本番証明書のSHA-1を追加**：
   - EAS Buildから本番証明書のSHA-1を取得
   - Firebase ConsoleまたはGoogle Cloud Consoleに追加

### iOS向け

1. **本番ビルドを作成**：
```bash
npx eas build --platform ios --profile production
```

2. **App Store Connectにアップロード**：
```bash
npx eas submit --platform ios
```

## トラブルシューティング

### 問題1: SHA-1エラー

**症状**: "Developer Error" または "API not enabled"

**原因**: SHA-1証明書フィンガープリントが正しく設定されていない

**解決策**：
```bash
# デバッグ証明書のSHA-1を確認
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey

# Firebase/Google Cloud ConsoleにSHA-1を追加
# 開発用と本番用の両方の証明書を追加
```

### 問題2: "DEVELOPER_ERROR"

**原因**: `webClientId`が正しくない

**解決策**：
- `google-services.json`から正しいクライアントIDを確認
- `client_type: 3`のclient_idを使用

### 問題3: iOSでサインインが動作しない

**原因**: URLスキームが正しく設定されていない

**解決策**：
```json
{
  "expo": {
    "plugins": [
      [
        "@react-native-google-signin/google-signin",
        {
          "iosUrlScheme": "com.googleusercontent.apps.YOUR_IOS_CLIENT_ID"
        }
      ]
    ]
  }
}
```

## ベストプラクティス

### 1. エラーハンドリング

```typescript
import { statusCodes } from '@react-native-google-signin/google-signin';

const handleSignIn = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    return userInfo;
  } catch (error: any) {
    switch (error.code) {
      case statusCodes.SIGN_IN_CANCELLED:
        console.log('User cancelled sign in');
        break;
      case statusCodes.IN_PROGRESS:
        console.log('Sign in already in progress');
        break;
      case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
        console.log('Play Services not available or outdated');
        break;
      default:
        console.error('Unknown error:', error);
    }
    throw error;
  }
};
```

### 2. トークンの管理

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

// トークンを保存
const saveTokens = async () => {
  const tokens = await GoogleSignin.getTokens();
  await AsyncStorage.setItem('google_id_token', tokens.idToken);
  await AsyncStorage.setItem('google_access_token', tokens.accessToken);
};

// トークンを読み込み
const loadTokens = async () => {
  const idToken = await AsyncStorage.getItem('google_id_token');
  const accessToken = await AsyncStorage.getItem('google_access_token');
  return { idToken, accessToken };
};

// トークンをクリア
const clearTokens = async () => {
  await AsyncStorage.removeItem('google_id_token');
  await AsyncStorage.removeItem('google_access_token');
};
```

### 3. サイレントサインイン

```typescript
const silentSignIn = async () => {
  try {
    const isSignedIn = await GoogleSignin.isSignedIn();

    if (isSignedIn) {
      // サイレントサインイン（UIなし）
      const userInfo = await GoogleSignin.signInSilently();
      return userInfo;
    }

    return null;
  } catch (error) {
    console.error('Silent sign-in error:', error);
    return null;
  }
};
```

## まとめ

Google認証の統合には、以下の要素が含まれます：

### セットアップ要件
- **開発ビルド**: カスタムネイティブコードが必要
- **SHA-1証明書**: Android向けに必要
- **クライアントID**: Firebase または Google Cloud Console から取得

### 設定方法
1. **Firebase**: `google-services.json`と`GoogleService-Info.plist`を使用
2. **Google Cloud Console**: 手動でOAuth 2.0クライアントIDを設定

### 実装ステップ
1. `@react-native-google-signin/google-signin`のインストール
2. プラットフォーム固有の設定
3. GoogleSigninの設定
4. サインインフローの実装

### ベストプラクティス
- 適切なエラーハンドリング
- トークンの安全な管理
- サイレントサインインの活用
- 開発用と本番用の両方の証明書を設定

これらの手順に従うことで、ExpoアプリにGoogle認証を安全に統合できます。
