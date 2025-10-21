# ネイティブモバイルのディープリンク

## 概要

多くの認証方法では、アプリへのリダイレクトが必要です。例えば：

- サインアップ確認メール、マジックリンクサインイン、パスワードリセットメールには、アプリにリダイレクトするリンクが含まれています
- OAuthサインインでは、アプリへの自動リダイレクトが発生します

ディープリンクを使用すると、このリダイレクトを特定のページを開くように設定できます。これは、例えばパスワードリセット用のフォームを表示したり、トークンハッシュを手動で交換したりする必要がある場合に必要です。

## ディープリンクの設定

### Expo React Native

1. アプリ設定でカスタムURLスキームを指定します：

```json
{
  "expo": {
    "scheme": "com.supabase"
  }
}
```

2. Supabase認証設定でリダイレクトURLを追加します

3. OAuthとリンクハンドラーを実装します

```javascript
import { useEffect } from 'react'
import { Linking } from 'react-native'
import { supabase } from './supabase'

function App() {
  useEffect(() => {
    // ディープリンクをリッスン
    const subscription = Linking.addEventListener('url', ({ url }) => {
      // URLを処理
      const { data } = supabase.auth.getSessionFromUrl({ url })
    })

    return () => subscription.remove()
  }, [])
}
```

### Flutter

`flutter_appauth`パッケージを使用してディープリンクを設定します：

```yaml
# pubspec.yaml
dependencies:
  flutter_appauth: ^latest_version
```

### Android

`AndroidManifest.xml`でインテントフィルターを設定します：

```xml
<activity android:name=".MainActivity">
  <intent-filter>
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data
      android:scheme="com.supabase"
      android:host="login-callback" />
  </intent-filter>
</activity>
```

### iOS

`Info.plist`でURLスキームを登録します：

```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>com.supabase</string>
    </array>
  </dict>
</array>
```

### Swift

```swift
import Supabase

// ディープリンクの処理
func application(
  _ app: UIApplication,
  open url: URL,
  options: [UIApplication.OpenURLOptionsKey : Any] = [:]
) -> Bool {
  supabase.auth.session(from: url)
  return true
}
```

### Kotlin

```kotlin
import io.supabase.gotrue.Auth

// ディープリンクの処理
override fun onCreate(savedInstanceState: Bundle?) {
  super.onCreate(savedInstanceState)

  intent?.data?.let { uri ->
    supabase.auth.parseSessionFromUri(uri)
  }
}
```

## ベストプラクティス

### 一意のURLスキームを使用する

- リバースドメイン表記を使用します（例：`com.yourcompany.yourapp`）
- 他のアプリとの競合を避けます

### セキュリティに関する考慮事項

- ディープリンクからのデータを検証します
- 機密情報をURLパラメータに含めないでください
- 適切なエラーハンドリングを実装します

### テスト

- 様々なシナリオでディープリンクをテストします：
  - アプリが閉じているとき
  - アプリがバックグラウンドにあるとき
  - アプリが既に開いているとき

## トラブルシューティング

### ディープリンクが機能しない

1. URLスキームが正しく登録されているか確認します
2. SupabaseダッシュボードでリダイレクトURLが設定されているか確認します
3. プラットフォーム固有の設定を確認します

### 複数のアプリケーションで同じURLスキームを使用する

- 各アプリケーションに一意のURLスキームを使用してください
- ユニバーサルリンク（iOS）またはアプリリンク（Android）の使用を検討してください
