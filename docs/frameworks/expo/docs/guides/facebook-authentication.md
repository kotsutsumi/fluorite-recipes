# Facebook認証

ExpoアプリでFacebook認証を実装する方法を学びます。

## 概要

Facebook認証を使用すると、ユーザーがFacebookアカウントでアプリにサインインできます。

**重要な制限事項**：
- Expo Goアプリでは使用不可
- カスタムネイティブコードが必要
- Android向けにGoogle Play Storeへの公開が必要

## 前提条件

### 必須要件

1. **開発ビルド**: カスタムネイティブコードが必要
2. **Google Play Store**: Android向けに公開されたアプリが必要
3. **Facebookアプリ**: Facebook Developers Consoleでのアプリ作成
4. **証明書**: SHA-1証明書フィンガープリント（Android）

## セットアップ

### ステップ1: ライブラリのインストール

```bash
npx expo install react-native-fbsdk-next
```

**設定プラグインの追加**：
```json
{
  "expo": {
    "plugins": [
      [
        "react-native-fbsdk-next",
        {
          "appID": "YOUR_FACEBOOK_APP_ID",
          "clientToken": "YOUR_FACEBOOK_CLIENT_TOKEN",
          "displayName": "Your App Name",
          "scheme": "fb{YOUR_APP_ID}",
          "advertiserIDCollectionEnabled": false,
          "autoLogAppEventsEnabled": false,
          "isAutoInitEnabled": true
        }
      ]
    ]
  }
}
```

### ステップ2: Facebookプロジェクトの設定

#### Facebook Developers Consoleでの設定

1. **Facebook Developers Console**にアクセス
2. 新しいアプリを作成、または既存のアプリを選択
3. **設定 > 基本**でアプリIDとクライアントトークンを取得

### ステップ3: Android向けの設定

#### 3.1 Google Play Storeへのアップロード

**重要**: Facebookプロジェクトがアプリを認識するには、Google Play StoreのURLが必要です。

```bash
# EAS Buildでアプリをビルド
npx eas build --platform android --profile production

# EAS Submitでアップロード
npx eas submit --platform android
```

#### 3.2 キーハッシュの取得

**SHA-1証明書フィンガープリントをBase64に変換**：

```bash
# SHA-1フィンガープリントを取得
keytool -list -v -keystore your-keystore.jks -alias your-alias

# 出力例
# SHA1: 1A:2B:3C:4D:5E:6F:7A:8B:9C:0D:1E:2F:3A:4B:5C:6D:7E:8F:9A:0B
```

**Base64への変換方法**：

```bash
# SHA-1をコロンなしの形式で準備
# 1A2B3C4D5E6F7A8B9C0D1E2F3A4B5C6D7E8F9A0B

# Pythonで変換
python3 << EOF
import base64
import binascii

sha1_hex = "1A2B3C4D5E6F7A8B9C0D1E2F3A4B5C6D7E8F9A0B"
sha1_bytes = binascii.unhexlify(sha1_hex)
key_hash = base64.b64encode(sha1_bytes).decode()
print(key_hash)
EOF
```

**または、オンラインツールを使用**：
- SHA-1からBase64への変換ツール
- HexからBase64への変換

#### 3.3 Facebookプロジェクトへの設定追加

Facebookプロジェクト設定で：

1. **プラットフォームの追加** → Android
2. 以下を提供：
   - **Google Play Package Name**: `com.yourcompany.yourapp`（app.jsonから）
   - **Class Name**: `MainActivity`（デフォルト）
   - **Key Hashes**: Base64変換されたSHA-1証明書

**app.json の例**：
```json
{
  "expo": {
    "android": {
      "package": "com.yourcompany.yourapp"
    }
  }
}
```

### ステップ4: iOS向けの設定

#### 4.1 Facebookプロジェクトへの設定追加

Facebookプロジェクト設定で：

1. **プラットフォームの追加** → iOS
2. 以下を提供：
   - **Bundle ID**: `com.yourcompany.yourapp`（app.jsonから）

**app.json の例**：
```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.yourcompany.yourapp"
    }
  }
}
```

#### 4.2 URLスキームの設定

**app.json**にURLスキームを追加：
```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.yourcompany.yourapp",
      "infoPlist": {
        "CFBundleURLTypes": [
          {
            "CFBundleURLSchemes": ["fb{YOUR_FACEBOOK_APP_ID}"]
          }
        ],
        "LSApplicationQueriesSchemes": ["fbapi", "fb-messenger-share-api"]
      }
    }
  }
}
```

## 実装

### 基本的なログインフロー

```typescript
// app/login.tsx
import React, { useState } from 'react';
import { View, Button, Text } from 'react-native';
import { LoginManager, AccessToken, Profile } from 'react-native-fbsdk-next';

export default function LoginScreen() {
  const [user, setUser] = useState<any>(null);

  const handleFacebookLogin = async () => {
    try {
      // Facebookログインダイアログを表示
      const result = await LoginManager.logInWithPermissions([
        'public_profile',
        'email',
      ]);

      if (result.isCancelled) {
        console.log('Login cancelled');
        return;
      }

      // アクセストークンを取得
      const data = await AccessToken.getCurrentAccessToken();

      if (!data) {
        console.log('Failed to get access token');
        return;
      }

      // ユーザープロフィールを取得
      const currentProfile = await Profile.getCurrentProfile();

      if (currentProfile) {
        setUser({
          id: currentProfile.userID,
          name: currentProfile.name,
          email: currentProfile.email,
          picture: currentProfile.imageURL,
        });

        console.log('Login success!');
      }
    } catch (error) {
      console.error('Facebook login error:', error);
    }
  };

  const handleFacebookLogout = () => {
    LoginManager.logOut();
    setUser(null);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      {user ? (
        <>
          <Text>Welcome, {user.name}!</Text>
          <Text>Email: {user.email}</Text>
          <Button title="Logout" onPress={handleFacebookLogout} />
        </>
      ) : (
        <Button title="Login with Facebook" onPress={handleFacebookLogin} />
      )}
    </View>
  );
}
```

### 権限のリクエスト

```typescript
import { LoginManager } from 'react-native-fbsdk-next';

// 基本的な権限
const loginWithBasicPermissions = async () => {
  const result = await LoginManager.logInWithPermissions([
    'public_profile',
    'email',
  ]);
};

// 拡張権限
const loginWithExtendedPermissions = async () => {
  const result = await LoginManager.logInWithPermissions([
    'public_profile',
    'email',
    'user_friends',
    'user_birthday',
    'user_location',
  ]);
};
```

### Graph APIの使用

```typescript
import { GraphRequest, GraphRequestManager } from 'react-native-fbsdk-next';

const fetchUserData = () => {
  const infoRequest = new GraphRequest(
    '/me',
    {
      parameters: {
        fields: {
          string: 'id,name,email,picture.type(large)',
        },
      },
    },
    (error, result) => {
      if (error) {
        console.error('Error fetching data:', error);
      } else {
        console.log('User data:', result);
      }
    }
  );

  new GraphRequestManager().addRequest(infoRequest).start();
};

// または、fetch APIを使用
const fetchUserDataWithFetch = async (accessToken: string) => {
  const response = await fetch(
    `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`
  );
  const userData = await response.json();
  console.log('User data:', userData);
};
```

## 高度な実装

### トークンの管理

```typescript
import { AccessToken } from 'react-native-fbsdk-next';
import AsyncStorage from '@react-native-async-storage/async-storage';

// トークンの保存
const saveAccessToken = async () => {
  const data = await AccessToken.getCurrentAccessToken();
  if (data) {
    await AsyncStorage.setItem('fb_access_token', data.accessToken);
    await AsyncStorage.setItem('fb_user_id', data.userID);
  }
};

// トークンの読み込み
const loadAccessToken = async () => {
  const token = await AsyncStorage.getItem('fb_access_token');
  const userId = await AsyncStorage.getItem('fb_user_id');
  return { token, userId };
};

// トークンの削除
const clearAccessToken = async () => {
  await AsyncStorage.removeItem('fb_access_token');
  await AsyncStorage.removeItem('fb_user_id');
};
```

### セッション管理

```typescript
import { AccessToken, LoginManager } from 'react-native-fbsdk-next';
import { useEffect, useState } from 'react';

export function useFacebookAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    const data = await AccessToken.getCurrentAccessToken();

    if (data) {
      setIsLoggedIn(true);
      // ユーザー情報を取得
      fetchUserProfile();
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  };

  const fetchUserProfile = async () => {
    // Graph APIでユーザー情報を取得
    const data = await AccessToken.getCurrentAccessToken();
    if (data) {
      const response = await fetch(
        `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${data.accessToken}`
      );
      const userData = await response.json();
      setUser(userData);
    }
  };

  const login = async () => {
    try {
      const result = await LoginManager.logInWithPermissions([
        'public_profile',
        'email',
      ]);

      if (!result.isCancelled) {
        await checkLoginStatus();
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const logout = () => {
    LoginManager.logOut();
    setIsLoggedIn(false);
    setUser(null);
  };

  return { isLoggedIn, user, login, logout };
}
```

## EAS Secretsの使用

**app.jsonから機密情報を分離**：

```bash
# EAS Secretsに保存
eas secret:create --scope project --name FACEBOOK_APP_ID --value "YOUR_APP_ID"
eas secret:create --scope project --name FACEBOOK_CLIENT_TOKEN --value "YOUR_TOKEN"
```

**eas.json**での使用：
```json
{
  "build": {
    "production": {
      "env": {
        "FACEBOOK_APP_ID": "@FACEBOOK_APP_ID",
        "FACEBOOK_CLIENT_TOKEN": "@FACEBOOK_CLIENT_TOKEN"
      }
    }
  }
}
```

**app.config.js**で動的に設定：
```javascript
export default {
  expo: {
    plugins: [
      [
        'react-native-fbsdk-next',
        {
          appID: process.env.FACEBOOK_APP_ID,
          clientToken: process.env.FACEBOOK_CLIENT_TOKEN,
          displayName: 'Your App Name',
        },
      ],
    ],
  },
};
```

## トラブルシューティング

### 問題1: ログインが動作しない

**原因**: 設定の不一致

**解決策**：
- Package name（Android）/ Bundle ID（iOS）がFacebook設定と一致することを確認
- Key hashesが正しく設定されていることを確認
- アプリがGoogle Play Storeで承認されていることを確認

### 問題2: Key hash生成エラー

**原因**: SHA-1からBase64への変換が不正確

**解決策**：
```python
# 正確な変換スクリプト
import base64
import binascii

sha1_hex = "YOUR_SHA1_WITHOUT_COLONS"
sha1_bytes = binascii.unhexlify(sha1_hex)
key_hash = base64.b64encode(sha1_bytes).decode()
print(f"Key Hash: {key_hash}")
```

### 問題3: Google Play Storeが認識されない

**原因**: アプリがまだ承認されていない

**解決策**：
- アプリが完全にアップロードされ、承認されるまで待つ
- Google Play ConsoleでアプリのURLを確認
- Facebook設定にGoogle Play Store URLを追加

## ベストプラクティス

### 1. エラーハンドリング

```typescript
const handleFacebookLogin = async () => {
  try {
    const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

    if (result.isCancelled) {
      // ユーザーがキャンセル
      console.log('User cancelled login');
      return;
    }

    // 成功処理
  } catch (error: any) {
    if (error.code === 'EUNSPECIFIED') {
      console.error('Facebook SDK not initialized');
    } else {
      console.error('Login error:', error.message);
    }
  }
};
```

### 2. 権限管理

```typescript
// 必要な権限のみをリクエスト
const permissions = ['public_profile', 'email'];

// 追加権限が必要な場合は別途リクエスト
const requestAdditionalPermissions = async () => {
  const result = await LoginManager.logInWithPermissions([
    'user_friends',
    'user_birthday',
  ]);
};
```

### 3. セキュリティ

```typescript
// アクセストークンの検証
const validateToken = async (token: string) => {
  const response = await fetch(
    `https://graph.facebook.com/debug_token?input_token=${token}&access_token=${APP_TOKEN}`
  );
  const data = await response.json();
  return data.data.is_valid;
};
```

## まとめ

Facebook認証の統合には、以下の要素が含まれます：

### セットアップ要件
- **開発ビルド**: カスタムネイティブコードが必要
- **Google Play Store**: Android向けに公開が必要
- **証明書設定**: SHA-1フィンガープリントをBase64に変換

### 実装ステップ
1. `react-native-fbsdk-next`のインストール
2. Facebookプロジェクトの設定
3. プラットフォーム固有の設定
4. ログインフローの実装

### ベストプラクティス
- 適切なエラーハンドリング
- 最小限の権限リクエスト
- トークンの安全な管理
- EAS Secretsで機密情報を保護

これらの手順に従うことで、ExpoアプリにFacebook認証を安全に統合できます。
