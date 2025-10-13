# Firebaseを使用する

ExpoアプリでFirebaseを統合し、認証、Firestore、ストレージを実装する方法を学びます。

## 概要

FirebaseはGoogleが提供する包括的なアプリ開発プラットフォームで、以下を提供します：

**主な機能**：
- **Authentication**: Email、OAuth、電話番号認証
- **Firestore**: NoSQLクラウドデータベース
- **Realtime Database**: リアルタイム同期データベース
- **Storage**: ファイルストレージ
- **Cloud Messaging**: プッシュ通知
- **Analytics**: アプリ分析（React Native Firebaseのみ）
- **Crashlytics**: クラッシュレポート（React Native Firebaseのみ）

## Firebase統合の2つの方法

### 1. Firebase JS SDK

**使用する場合**：
- Expo Goで開発したい
- Firebaseを素早く開始したい
- ユニバーサルアプリ（Android、iOS、Web）を作成したい

**サポートされるサービス**：
- Authentication ✅
- Firestore ✅
- Realtime Database ✅
- Storage ✅
- Cloud Functions ✅

**サポートされないサービス**：
- Analytics ❌
- Dynamic Links ❌
- Crashlytics ❌

### 2. React Native Firebase

**使用する場合**：
- JS SDKでサポートされないサービスが必要
- ネイティブSDK機能が必要
- Firebase Analyticsが必要
- 既存のReact Native Firebaseプロジェクトから移行

**追加サポート**：
- Analytics ✅
- Dynamic Links ✅
- Crashlytics ✅
- その他すべてのFirebaseサービス ✅

## Firebase JS SDKのセットアップ

### ステップ1: Firebaseプロジェクトの作成

1. [Firebase Console](https://console.firebase.google.com/)にアクセス
2. 新しいプロジェクトを作成
3. Webアプリを登録して設定情報を取得

### ステップ2: Firebase SDKのインストール

```bash
npx expo install firebase
```

**重要**: Expo SDK 53+では、Firebase `^12.0.0`のみがサポートされています。

### ステップ3: Firebaseの初期化

```typescript
// lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase設定
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Firebaseを初期化
const app = initializeApp(firebaseConfig);

// サービスを初期化
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
```

**.env.local**:
```bash
EXPO_PUBLIC_FIREBASE_API_KEY=your-api-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
EXPO_PUBLIC_FIREBASE_APP_ID=your-app-id
```

## Firebase JS SDK: 認証

### Email/Password認証

```typescript
// app/auth/signup.tsx
import { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log('User created:', userCredential.user.uid);
      Alert.alert('Success', 'Account created!');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />
      <Button title="Sign Up" onPress={handleSignUp} />
    </View>
  );
}
```

### サインイン

```typescript
// app/auth/signin.tsx
import { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'expo-router';

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log('Signed in:', userCredential.user.uid);
      router.replace('/(app)');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />
      <Button title="Sign In" onPress={handleSignIn} />
    </View>
  );
}
```

### 認証状態の監視

```typescript
// hooks/useAuth.ts
import { useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { user, loading };
}
```

## Firebase JS SDK: Firestore

### ドキュメントの読み取り

```typescript
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// 単一ドキュメントを取得
const getUser = async (userId: string) => {
  const userDoc = await getDoc(doc(db, 'users', userId));

  if (userDoc.exists()) {
    return { id: userDoc.id, ...userDoc.data() };
  }

  return null;
};

// コレクション全体を取得
const getAllUsers = async () => {
  const usersCollection = collection(db, 'users');
  const usersSnapshot = await getDocs(usersCollection);
  const usersList = usersSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return usersList;
};

// クエリでフィルタリング
const getActiveUsers = async () => {
  const usersCollection = collection(db, 'users');
  const q = query(usersCollection, where('status', '==', 'active'));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};
```

### ドキュメントの書き込み

```typescript
import { doc, setDoc, addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// 特定のIDでドキュメントを作成
const createUser = async (userId: string, userData: any) => {
  await setDoc(doc(db, 'users', userId), userData);
};

// 自動生成IDでドキュメントを追加
const addPost = async (postData: any) => {
  const docRef = await addDoc(collection(db, 'posts'), postData);
  return docRef.id;
};
```

### ドキュメントの更新

```typescript
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const updateUser = async (userId: string, updates: any) => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, updates);
};
```

### ドキュメントの削除

```typescript
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const deleteUser = async (userId: string) => {
  await deleteDoc(doc(db, 'users', userId));
};
```

### リアルタイムリスナー

```typescript
import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function useRealtimePosts() {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, 'posts'),
      where('published', '==', true)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(postsData);
    });

    return unsubscribe;
  }, []);

  return posts;
}
```

## Firebase JS SDK: Storage

### ファイルのアップロード

```typescript
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import * as ImagePicker from 'expo-image-picker';

const uploadImage = async (userId: string) => {
  // 画像を選択
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 0.8,
  });

  if (result.canceled) {
    return null;
  }

  const imageUri = result.assets[0].uri;

  // URIからBlobを作成
  const response = await fetch(imageUri);
  const blob = await response.blob();

  // Storageにアップロード
  const storageRef = ref(storage, `users/${userId}/avatar.jpg`);
  await uploadBytes(storageRef, blob);

  // ダウンロードURLを取得
  const downloadURL = await getDownloadURL(storageRef);
  return downloadURL;
};
```

### ファイルのダウンロード

```typescript
import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';

const getImageUrl = async (path: string) => {
  const storageRef = ref(storage, path);
  const url = await getDownloadURL(storageRef);
  return url;
};
```

### ファイルの削除

```typescript
import { ref, deleteObject } from 'firebase/storage';
import { storage } from '@/lib/firebase';

const deleteImage = async (path: string) => {
  const storageRef = ref(storage, path);
  await deleteObject(storageRef);
};
```

## React Native Firebaseのセットアップ

### ステップ1: 開発クライアントのインストール

```bash
npx expo install expo-dev-client
```

### ステップ2: React Native Firebaseのインストール

```bash
npx expo install @react-native-firebase/app @react-native-firebase/auth @react-native-firebase/firestore
```

### ステップ3: 設定ファイルの追加

#### Android設定

1. Firebase Consoleから`google-services.json`をダウンロード
2. `android/app/google-services.json`に配置

**app.json**:
```json
{
  "expo": {
    "plugins": [
      "@react-native-firebase/app"
    ],
    "android": {
      "googleServicesFile": "./google-services.json"
    }
  }
}
```

#### iOS設定

1. Firebase Consoleから`GoogleService-Info.plist`をダウンロード
2. `ios/GoogleService-Info.plist`に配置

**app.json**:
```json
{
  "expo": {
    "plugins": [
      "@react-native-firebase/app"
    ],
    "ios": {
      "googleServicesFile": "./GoogleService-Info.plist"
    }
  }
}
```

### ステップ4: 開発ビルドの作成

```bash
# iOS
npx expo run:ios

# Android
npx expo run:android

# または、EAS Build
npx eas build --profile development --platform ios
npx eas build --profile development --platform android
```

## React Native Firebase: 使用例

### 認証

```typescript
import auth from '@react-native-firebase/auth';

// Email/Passwordでサインアップ
const signUp = async (email: string, password: string) => {
  try {
    const userCredential = await auth().createUserWithEmailAndPassword(
      email,
      password
    );
    console.log('User created:', userCredential.user.uid);
  } catch (error) {
    console.error('Error:', error);
  }
};

// サインイン
const signIn = async (email: string, password: string) => {
  try {
    await auth().signInWithEmailAndPassword(email, password);
  } catch (error) {
    console.error('Error:', error);
  }
};

// 認証状態の監視
auth().onAuthStateChanged((user) => {
  if (user) {
    console.log('User signed in:', user.uid);
  } else {
    console.log('User signed out');
  }
});
```

### Firestore

```typescript
import firestore from '@react-native-firebase/firestore';

// ドキュメントを追加
const addUser = async (userId: string, userData: any) => {
  await firestore().collection('users').doc(userId).set(userData);
};

// ドキュメントを取得
const getUser = async (userId: string) => {
  const userDoc = await firestore().collection('users').doc(userId).get();
  return userDoc.data();
};

// リアルタイムリスナー
firestore()
  .collection('posts')
  .where('published', '==', true)
  .onSnapshot((snapshot) => {
    snapshot.forEach((doc) => {
      console.log(doc.id, doc.data());
    });
  });
```

### Analytics

```typescript
import analytics from '@react-native-firebase/analytics';

// イベントをログ
await analytics().logEvent('button_clicked', {
  button_name: 'signup',
  screen: 'home',
});

// 画面表示をログ
await analytics().logScreenView({
  screen_name: 'HomeScreen',
  screen_class: 'HomeScreen',
});

// ユーザープロパティを設定
await analytics().setUserProperty('user_type', 'premium');
```

## ベストプラクティス

### 1. 環境変数の使用

```typescript
// Firebase設定を環境変数から読み込み
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};
```

### 2. エラーハンドリング

```typescript
const safeFirebaseOperation = async <T>(
  operation: () => Promise<T>
): Promise<T | null> => {
  try {
    return await operation();
  } catch (error: any) {
    if (error.code === 'auth/user-not-found') {
      console.log('User not found');
    } else if (error.code === 'auth/wrong-password') {
      console.log('Wrong password');
    } else {
      console.error('Firebase error:', error);
    }
    return null;
  }
};
```

### 3. セキュリティルール

**Firestore Rules**:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    match /posts/{postId} {
      allow read: if resource.data.published == true;
      allow write: if request.auth != null && request.auth.uid == resource.data.authorId;
    }
  }
}
```

**Storage Rules**:
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## まとめ

Firebaseは、以下の統合オプションを提供します：

### Firebase JS SDK
- **利点**: Expo Goで動作、素早いセットアップ、ユニバーサルアプリ対応
- **制限**: Analytics、Dynamic Links、Crashlyticsはサポートされない

### React Native Firebase
- **利点**: すべてのFirebaseサービスにアクセス、ネイティブSDK機能
- **制限**: 開発ビルドが必要、Expo Goでは動作しない

### 主なサービス
- **Authentication**: Email、OAuth、電話番号
- **Firestore**: NoSQLデータベース、リアルタイム同期
- **Storage**: ファイルストレージと管理
- **Analytics**: アプリ分析（React Native Firebaseのみ）

### ベストプラクティス
- 環境変数でAPIキーを管理
- 適切なエラーハンドリング
- セキュリティルールの設定
- プロジェクト要件に応じたSDKの選択

これらのパターンを活用して、Expoアプリに強力なFirebase機能を統合できます。
