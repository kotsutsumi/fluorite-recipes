# Flutter Auth UI

Flutter Auth UIは、ユーザーを認証するための事前構築されたウィジェットを含むFlutterパッケージです。スタイルなしで、ブランドと美学に合わせてカスタマイズできます。

## Flutter Auth UIを追加

パッケージ`supabase-auth-ui`の最新バージョンをpubspec.yamlに追加:

```dart
flutter pub add supabase_auth_ui
```

### Flutter Authパッケージを初期化

```dart
import 'package:flutter/material.dart';
import 'package:supabase_auth_ui/supabase_auth_ui.dart';

void main() async {
  await Supabase.initialize(
    url: dotenv.get('SUPABASE_URL'),
    anonKey: dotenv.get('SUPABASE_PUBLISHABLE_KEY'),
  );
  runApp(const MyApp());
}
```

### メール認証

`SupaEmailAuth`ウィジェットを使用して、メールとパスワードのサインインおよびサインアップフォームを作成します。パスワードを忘れた場合のフォームを表示するボタンも含まれています。

`metadataFields`を渡して、メタデータとしてSupabaseに渡すフォームに追加のフィールドを追加できます。

```dart
SupaEmailAuth(
  redirectTo: kIsWeb ? null : 'io.mydomain.myapp://callback',
  onSignInComplete: (response) {},
  onSignUpComplete: (response) {},
  metadataFields: [
    MetaDataField(
      prefixIcon: const Icon(Icons.person),
      label: 'Username',
      key: 'username',
      validator: (val) {
        if (val == null || val.isEmpty) {
          return 'Please enter something';
        }
        return null;
      },
    ),
  ],
)
```

### マジックリンク認証

`SupaMagicAuth`ウィジェットを使用して、マジックリンクサインインフォームを作成します。

```dart
SupaMagicAuth(
  redirectUrl: kIsWeb ? null : 'io.mydomain.myapp://callback',
  onSuccess: (Session response) {},
  onError: (error) {},
)
```
